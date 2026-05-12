import type { Express } from "express";
import { createServer, type Server } from "http";
import fs from "fs";
import path from "path";
import { storage } from "./storage";
import { setupLocalAuth } from "./adminAuth";
import { setupInspectorAuth } from "./inspectorAuth";
import { insertBlogPostSchema, insertContactSubmissionSchema, insertInspectorSchema, insertConversionLogSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import { z } from "zod";
import sgMail from "@sendgrid/mail";
import { db } from "./db";
import { blogPosts } from "@shared/schema";
import { notInArray } from "drizzle-orm";

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 100);
}

// Email sending via SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

async function sendEmail(to: string, subject: string, content: string) {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('SENDGRID_API_KEY is not set — email not sent');
    return false;
  }
  try {
    const from = (process.env.EMAIL_FROM || 'info@snagging.in');
    await sgMail.send({
      to,
      from,
      subject,
      text: content,
      html: content.replace(/\n/g, '<br>'),
    });
    console.log(`Email sent successfully to ${to} via SendGrid`);
    return true;
  } catch (error: any) {
    console.error(`SendGrid error sending to ${to}:`, error?.response?.body || error);
    return false;
  }
}

function logContactFallback(submission: { name: string; email: string; phone?: string | null; message: string }) {
  console.log(`Contact fallback stored for admin review:\nName: ${submission.name}\nEmail: ${submission.email}\nPhone: ${submission.phone || 'N/A'}\nMessage: ${submission.message}`);
}

// Admin authentication middleware
function isAdminAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated() && req.user?.claims?.sub === 'super-admin') {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // 410 Gone for all removed location pages — registered FIRST so it intercepts
  // before Vite's SPA catch-all. Tells Google to deindex permanently.
  const sendLocationGone = (_req: any, res: any) => {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(410).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="robots" content="noindex, nofollow">
  <title>410 Gone | UrbanGrid</title>
</head>
<body>
  <h1>410 Gone</h1>
  <p>This page has been permanently removed. Visit <a href="https://urbangrid.ae/services">our services</a> or the <a href="https://urbangrid.ae/">homepage</a>.</p>
</body>
</html>`);
  };
  app.get('/locations', sendLocationGone);
  app.get('/locations/*', sendLocationGone);

  // ONE-TIME MIGRATION: hard-delete all blog posts except the 6 canonical ones.
  // Remove this endpoint after running against production.
  app.post('/api/admin/migrate-delete-blogs', async (req, res) => {
    const secret = req.query.secret as string;
    if (secret !== 'ug-delete-2026-seo') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const keepSlugs = [
      'nfpa-72-fire-alarm-systems-property-snagging-uae',
      'nfpa-25-fire-protection-systems-property-snagging-uae',
      'nfpa-70-national-electrical-code-property-snagging-uae',
      'nfpa-101-life-safety-code-property-snagging-uae',
      'ashrae-standard-180-building-commissioning-property-snagging-uae',
      'case-study-palm-jumeirah-penthouse-inspection-mep-defects',
    ];
    try {
      const deleted = await db
        .delete(blogPosts)
        .where(notInArray(blogPosts.slug, keepSlugs))
        .returning({ id: blogPosts.id });
      const remaining = await db.select({ slug: blogPosts.slug }).from(blogPosts);
      return res.json({ deleted: deleted.length, remaining: remaining.length });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Auth middleware
  setupLocalAuth(app);
  setupInspectorAuth(app);

  // Note: Inspector auth user endpoint is handled in inspectorAuth.ts
  // This endpoint is overridden by setupInspectorAuth for dual authentication
  app.get('/api/auth/user-backup', async (req: any, res) => {
    try {
      // Check if user is authenticated via local admin auth
      if (req.isAuthenticated() && req.user?.claims?.sub === 'super-admin') {
        return res.json({
          id: 'super-admin',
          email: 'admin@urbangrid.ae',
          firstName: 'Arif',
          lastName: 'Admin',
          role: 'admin',
          profileImageUrl: null
        });
      }

      // Not authenticated
      res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Conversion tracking
  app.post('/api/track-conversion', async (req, res) => {
    try {
      const validatedData = insertConversionLogSchema.parse({
        ...req.body,
        ipAddress: req.ip || req.headers['x-forwarded-for'] || 'unknown',
      });
      const log = await storage.logConversion(validatedData);
      res.status(201).json(log);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error tracking conversion:", error);
      res.status(500).json({ message: "Failed to track conversion" });
    }
  });

  // Public blog routes
  app.get('/api/blog', async (req, res) => {
    try {
      const { page = '1', limit = '9', category, search } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      const posts = await storage.getBlogPosts({
        status: 'published',
        category: category as string,
        search: search as string,
        limit: limitNum,
        offset,
      });

      const total = await storage.getBlogPostsCount({
        status: 'published',
        category: category as string,
        search: search as string,
      });

      res.json({
        posts,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      });
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get('/api/blog/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);

      if (!post) {
        // 410 (not 404): these slugs previously existed, tell Google they're gone for good
        return res.status(410).json({ message: "Blog post permanently removed" });
      }

      if (post.status !== 'published') {
        return res.status(410).json({ message: "Blog post permanently removed" });
      }

      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Protected blog routes (admin only)
  app.get('/api/admin/blog', isAdminAuthenticated, async (req: any, res) => {
    try {

      const { page = '1', limit = '10', status, search } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      const posts = await storage.getBlogPosts({
        status: status as 'draft' | 'published',
        search: search as string,
        limit: limitNum,
        offset,
      });

      const total = await storage.getBlogPostsCount({
        status: status as 'draft' | 'published',
        search: search as string,
      });

      res.json({
        posts,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      });
    } catch (error) {
      console.error("Error fetching admin blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get('/api/admin/blog/:id', isAdminAuthenticated, async (req: any, res) => {
    try {

      const { id } = req.params;
      const post = await storage.getBlogPost(parseInt(id));
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.post('/api/admin/blog', isAdminAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const slug = validatedData.slug || generateSlug(validatedData.title);
      const post = await storage.createBlogPost({
        ...validatedData,
        slug,
      });
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating blog post:", error);
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  app.put('/api/admin/blog/:id', isAdminAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(parseInt(id), validatedData);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating blog post:", error);
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  app.delete('/api/admin/blog/:id', isAdminAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteBlogPost(parseInt(id));
      if (!deleted) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  app.post('/api/contact', async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      
      // Send email notification to info@urbangrid.ae
      const emailContent = `
New Contact Form Submission

Name: ${submission.name}
Email: ${submission.email}
Phone: ${submission.phone}
Message: ${submission.message}
      `;
      const emailed = await sendEmail('info@urbangrid.ae', 'New Contact Form Submission', emailContent);
      if (!emailed) {
        logContactFallback(submission);
      }
      
      res.status(201).json({ message: 'Contact submission received', submission });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating contact submission:", error);
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  // Consultation form endpoint
  app.post('/api/consultation', async (req, res) => {
    try {
      const { name, email, phone } = req.body;
      if (!name || !email || !phone) {
        return res.status(400).json({ message: "Name, email, and phone are required" });
      }

      // Save to storage
      const consultation = await storage.createContactSubmission({
        name,
        email,
        phone,
        message: 'Free consultation request',
      });

      // Send email notification
      const emailContent = `
New Free Consultation Request

Name: ${name}
Email: ${email}
Phone: ${phone}
      `;
      const emailed = await sendEmail('info@urbangrid.ae', 'New Free Consultation Request', emailContent);
      if (!emailed) {
        logContactFallback({
          name,
          email,
          phone,
          message: 'Free consultation request',
        });
      }

      res.status(201).json({ message: 'Consultation request received', consultation });
    } catch (error) {
      console.error("Error creating consultation request:", error);
      res.status(500).json({ message: "Failed to submit consultation form" });
    }
  });

  // Sample report gated download endpoint
  app.post('/api/sample-report-download', async (req, res) => {
    try {
      const { name, email, phone } = req.body;
      if (!name || !email || !phone) {
        return res.status(400).json({ message: "Name, email, and phone are required" });
      }

      await storage.createContactSubmission({
        name,
        email,
        phone,
        message: 'Sample report download request',
      });

      const emailContent = `
New Sample Report Download Request

Name: ${name}
Email: ${email}
Phone: ${phone}

This lead requested the sample inspection report.
      `;
      const emailed = await sendEmail('info@urbangrid.ae', 'New Sample Report Download Request', emailContent);
      if (!emailed) {
        logContactFallback({
          name,
          email,
          phone,
          message: 'Sample report download request',
        });
      }

      res.status(201).json({ message: 'Details received' });
    } catch (error) {
      console.error("Error processing sample report request:", error);
      res.status(500).json({ message: "Failed to process request" });
    }
  });

  // Quick contact form endpoint
  app.post('/api/quick-contact', async (req, res) => {
    try {
      const { name, email, phone } = req.body;
      if (!name || !email || !phone) {
        return res.status(400).json({ message: "Name, email, and phone are required" });
      }

      const quickContact = await storage.createContactSubmission({
        name,
        email,
        phone,
        message: 'Quick contact request',
      });

      // Send email notification
      const emailContent = `
New Quick Contact Request

Name: ${name}
Email: ${email}
Phone: ${phone}
      `;
      const emailed = await sendEmail('info@urbangrid.ae', 'New Quick Contact Request', emailContent);
      if (!emailed) {
        logContactFallback({
          name,
          email,
          phone,
          message: 'Quick contact request',
        });
      }

      res.status(201).json({ message: 'Quick contact request received', quickContact });
    } catch (error) {
      console.error("Error creating quick contact request:", error);
      res.status(500).json({ message: "Failed to submit quick contact form" });
    }
  });

  // Career application endpoint
  app.post('/api/career-application', async (req, res) => {
    try {
      const { fullName, email, phone, position, experience, coverLetter, hasResume, resumeFileName } = req.body;
      if (!fullName || !email || !phone || !position || !experience || !coverLetter) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const application = await storage.createContactSubmission({
        name: fullName,
        email,
        phone,
        message: `Career application for ${position}`,
      });

      // Send email notification
      const emailContent = `
New Career Application - ${position}

Full Name: ${fullName}
Email: ${email}
Phone: ${phone}
Position: ${position}
Experience: ${experience}
Has Resume: ${hasResume ? 'Yes' : 'No'}
Resume File: ${resumeFileName || 'N/A'}

Cover Letter:
${coverLetter}
      `;
      const emailed = await sendEmail('info@urbangrid.ae', `New Career Application - ${position}`, emailContent);
      if (!emailed) {
        logContactFallback({
          name: fullName,
          email,
          phone,
          message: `Career application for ${position}`,
        });
      }

      res.status(201).json({ message: 'Career application received', application });
    } catch (error) {
      console.error("Error creating career application:", error);
      res.status(500).json({ message: "Failed to submit career application" });
    }
  });

  // Inspector routes
  app.get('/api/inspectors', async (_req, res) => {
    try {
      const inspectors = await storage.getInspectors();
      res.json(inspectors);
    } catch (error) {
      console.error("Error fetching inspectors:", error);
      res.status(500).json({ message: "Failed to fetch inspectors" });
    }
  });

  app.get('/api/admin/inspectors', isAdminAuthenticated, async (req: any, res) => {
    try {
      const { page = '1', limit = '10', search } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      const inspectors = await storage.getInspectors({
        search: search as string,
        limit: limitNum,
        offset,
      });

      const total = await storage.getInspectorsCount({
        search: search as string,
      });

      res.json({
        inspectors,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      });
    } catch (error) {
      console.error("Error fetching inspectors:", error);
      res.status(500).json({ message: "Failed to fetch inspectors" });
    }
  });

  app.get('/api/admin/inspectors/:id', isAdminAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const inspector = await storage.getInspector(parseInt(id));
      if (!inspector) {
        return res.status(404).json({ message: "Inspector not found" });
      }
      res.json(inspector);
    } catch (error) {
      console.error("Error fetching inspector:", error);
      res.status(500).json({ message: "Failed to fetch inspector" });
    }
  });

  app.post('/api/admin/inspectors', isAdminAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertInspectorSchema.parse(req.body);
      const inspector = await storage.createInspector(validatedData);
      res.status(201).json(inspector);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating inspector:", error);
      res.status(500).json({ message: "Failed to create inspector" });
    }
  });

  app.put('/api/admin/inspectors/:id', isAdminAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertInspectorSchema.partial().parse(req.body);
      const inspector = await storage.updateInspector(parseInt(id), validatedData);
      if (!inspector) {
        return res.status(404).json({ message: "Inspector not found" });
      }
      res.json(inspector);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating inspector:", error);
      res.status(500).json({ message: "Failed to update inspector" });
    }
  });

  app.delete('/api/admin/inspectors/:id', isAdminAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteInspector(parseInt(id));
      if (!deleted) {
        return res.status(404).json({ message: "Inspector not found" });
      }
      res.json({ message: "Inspector deleted successfully" });
    } catch (error) {
      console.error("Error deleting inspector:", error);
      res.status(500).json({ message: "Failed to delete inspector" });
    }
  });

  // Sitemap
  app.get('/sitemap.xml', (_req, res) => {
    res.status(200).type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://urbangrid.ae/</loc></url>
  <url><loc>https://urbangrid.ae/about</loc></url>
  <url><loc>https://urbangrid.ae/services</loc></url>
  <url><loc>https://urbangrid.ae/contact</loc></url>
  <url><loc>https://urbangrid.ae/blog</loc></url>
  <url><loc>https://urbangrid.ae/broker-referrals</loc></url>
  <url><loc>https://urbangrid.ae/careers</loc></url>
  <url><loc>https://urbangrid.ae/privacy-policy</loc></url>
  <url><loc>https://urbangrid.ae/terms-of-service</loc></url>
</urlset>`);
  });

  // Redirects for old sitemap paths
  app.get('/sitemap_index.xml', (_req, res) => {
    res.redirect(301, '/sitemap.xml');
  });
  app.get('/sitemap-index.xml', (_req, res) => {
    res.redirect(301, '/sitemap.xml');
  });
  app.get('/sitemaps.xml', (_req, res) => {
    res.redirect(301, '/sitemap.xml');
  });
  app.get('/sitemap1.xml', (_req, res) => {
    res.redirect(301, '/sitemap.xml');
  });
  app.get('/post-sitemap.xml', (_req, res) => {
    res.redirect(301, '/sitemap.xml');
  });
  app.get('/page-sitemap.xml', (_req, res) => {
    res.redirect(301, '/sitemap.xml');
  });
  app.get('/category-sitemap.xml', (_req, res) => {
    res.redirect(301, '/sitemap.xml');
  });
  app.get('/news-sitemap.xml', (_req, res) => {
    res.redirect(301, '/sitemap.xml');
  });
  app.get('/video-sitemap.xml', (_req, res) => {
    res.redirect(301, '/sitemap.xml');
  });
  app.get('/image-sitemap.xml', (_req, res) => {
    res.redirect(301, '/sitemap.xml');
  });

  // Robots.txt
  app.get('/robots.txt', (_req, res) => {
    const robotsTxt = `User-agent: *\nAllow: /\nSitemap: https://urbangrid.ae/sitemap.xml\n`;
    res.setHeader('Content-Type', 'text/plain');
    res.send(robotsTxt);
  });

  // Shared helper: inject meta tags + H1 into index.html and serve it.
  // In development, skip injection and fall through to Vite's pipeline (which injects
  // the React HMR preamble via transformIndexHtml — bypassing it breaks React boot).
  const serveSPAWithMeta = (res: any, next: any, opts: {
    title: string; description: string; canonical: string; h1: string;
    image?: string; noindex?: boolean;
  }) => {
    // Dev: let Vite's catch-all handle the request so HMR preamble is correctly injected
    if (process.env.NODE_ENV !== 'production') return next();

    try {
      const htmlPath = path.resolve(import.meta.dirname, 'public', 'index.html');
      let html = fs.readFileSync(htmlPath, 'utf-8');
      const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const t = esc(opts.title);
      const d = esc(opts.description);
      const img = opts.image ? esc(opts.image) : 'https://urbangrid.ae/og-image.jpg';
      const robots = opts.noindex ? 'noindex, nofollow' : 'index, follow';
      const headTags = `
  <meta charset="UTF-8" />
  <title>${t}</title>
  <meta name="description" content="${d}">
  <meta name="robots" content="${robots}">
  <link rel="canonical" href="${opts.canonical}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${t}">
  <meta property="og:description" content="${d}">
  <meta property="og:url" content="${opts.canonical}">
  <meta property="og:image" content="${img}">
  <meta property="og:site_name" content="UrbanGrid Property Inspection">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${t}">
  <meta name="twitter:description" content="${d}">`;
      html = html.replace(/<meta charset="[^"]*"\s*\/?>/i, '');
      html = html.replace(/<title>[^<]*<\/title>\s*/i, '');
      html = html.replace('<head>', `<head>${headTags}`);
      const h1Tag = `<h1 style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">${esc(opts.h1)}</h1>`;
      html = html.replace('<body>', `<body>\n  ${h1Tag}`);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.send(html);
    } catch {
      return next();
    }
  };

  // Server-side rendered core pages for SEO (unique title, description, H1 per page)
  const corePages: Array<{ path: string; title: string; description: string; h1: string; noindex?: boolean }> = [
    { path: '/',                 title: 'UrbanGrid – Property Snagging & Inspection in Dubai & UAE',              h1: 'Property Snagging & Inspection Services in Dubai & UAE',           description: 'UrbanGrid: NFPA, ASHRAE & ASTM certified property snagging and inspection across Dubai, Abu Dhabi, Sharjah and the UAE. Same-day reports.', noindex: false },
    { path: '/about',            title: 'About UrbanGrid | Certified Property Inspection Experts UAE',            h1: 'About UrbanGrid Property Inspection',                               description: 'Learn about UrbanGrid, the UAE\'s trusted NFPA, ASHRAE and ASTM certified property inspection and snagging company serving Dubai, Abu Dhabi and Sharjah.' },
    { path: '/services',         title: 'Inspection Services | Snagging & RERA | UrbanGrid UAE',              h1: 'Property Inspection & Snagging Services in the UAE',                description: 'Explore UrbanGrid\'s full range of property inspection services: new build snagging, RERA compliance, technical due diligence, and more across the UAE.' },
    { path: '/blog',             title: 'Property Inspection Blog | NFPA & ASHRAE | UrbanGrid UAE',            h1: 'Property Inspection & Compliance Blog',                             description: 'Expert articles on property inspection, snagging, NFPA 72, NFPA 25, ASHRAE 180 standards, and building compliance in the UAE.' },
    { path: '/contact',          title: 'Contact UrbanGrid | Book a Property Inspection in UAE',                  h1: 'Contact UrbanGrid – Book an Inspection',                            description: 'Get in touch with UrbanGrid to schedule a property inspection or snagging service in Dubai, Abu Dhabi, Sharjah or anywhere across the UAE.' },
    { path: '/careers',          title: 'Careers at UrbanGrid | Property Inspection Jobs in UAE',                 h1: 'Careers at UrbanGrid Property Inspection',                          description: 'Join the UrbanGrid team. We\'re hiring certified property inspectors and support staff across Dubai and the UAE. View open positions.' },
    { path: '/broker-referrals', title: 'Broker Referral Program | Partner with UrbanGrid UAE',                  h1: 'Real Estate Broker Referral Program',                               description: 'Partner with UrbanGrid through our broker referral program. Earn rewards by connecting your clients with the UAE\'s leading property inspection service.' },
    { path: '/privacy-policy',   title: 'Privacy Policy | UrbanGrid Property Inspection UAE',                    h1: 'Privacy Policy',                                                    description: 'Read UrbanGrid\'s privacy policy to understand how we collect, use and protect your personal information in line with UAE data protection laws.', noindex: false },
    { path: '/terms-of-service', title: 'Terms of Service | UrbanGrid Property Inspection UAE',                  h1: 'Terms of Service',                                                  description: 'Review the terms and conditions governing the use of UrbanGrid\'s property inspection services and website in the United Arab Emirates.', noindex: false },
  ];

  for (const page of corePages) {
    app.get(page.path, (req, res, next) => {
      const canonical = `https://urbangrid.ae${page.path === '/' ? '' : page.path}` || 'https://urbangrid.ae';
      return serveSPAWithMeta(res, next, {
        title: page.title,
        description: page.description,
        canonical: page.path === '/' ? 'https://urbangrid.ae/' : `https://urbangrid.ae${page.path}`,
        h1: page.h1,
        noindex: page.noindex,
      });
    });
  }

  // Server-side rendered service detail pages for SEO
  // All data is static — no DB needed. Serves complete HTML with meta tags instantly.
  const serviceSSRData: Record<string, { title: string; description: string; image: string; category: string }> = {
    'new-build-snagging':            { title: 'New Build Snagging', description: 'Comprehensive inspection for newly completed properties covering finishes, MEP systems, and quality compliance with international standards.', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&h=600', category: 'property-snagging' },
    'snagging-company':              { title: 'Property Snagging Company', description: 'UrbanGrid offers professional property snagging services to identify defects and protect your investment before handover.', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&h=600', category: 'property-snagging' },
    'pre-purchase-inspection':       { title: 'Pre-Purchase Property Inspection', description: 'Detailed inspection services for buyers to assess property condition before purchase with expert reports and recommendations.', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&h=600', category: 'property-snagging' },
    'handover-inspection':            { title: 'Handover Inspection', description: 'Independent property handover inspections designed to uncover defects before you accept keys from the developer.', image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&h=600', category: 'property-snagging' },
    'warranty-inspection':            { title: 'Warranty Inspection', description: 'Comprehensive warranty-period inspections to identify latent defects and ensure post-handover peace of mind.', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&h=600', category: 'property-snagging' },
    'defect-listing':                 { title: 'Defect Listing', description: 'Detailed defect listings with photographic evidence and prioritized recommendations for repair and remediation.', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&h=600', category: 'property-snagging' },
    'rera-compliance-inspection':     { title: 'RERA Compliance Inspection', description: 'Inspection services aligned with RERA requirements to support compliance and quality assurance in Dubai and the UAE.', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&h=600', category: 'rera-services' },
    'snagging-report':                { title: 'Snagging Report', description: 'Clear, actionable snagging reports that summarize defects, categorize issues, and guide remediation efforts.', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&h=600', category: 'property-snagging' },
    'post-renovation-inspection':     { title: 'Post-Renovation Inspection', description: 'Thorough inspections after renovation works to verify quality, workmanship, and compliance with standards.', image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&h=600', category: 'technical-inspections' },
    'move-in-move-out-inspection':    { title: 'Move-In Move-Out Inspection', description: 'Condition assessments for tenants and landlords during move-in and move-out transitions to document property state.', image: 'https://images.unsplash.com/photo-1555636222-cae831e670b3?auto=format&fit=crop&w=1200&h=600', category: 'technical-inspections' },
    'mep-inspection':                 { title: 'MEP Inspection', description: 'Mechanical, electrical, and plumbing inspections to assess system performance, safety, and compliance.', image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&h=600', category: 'technical-inspections' },
    'electrical-inspection':          { title: 'Electrical Inspection', description: 'Professional electrical system inspections covering distribution boards, wiring, protection devices, and safety.', image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&w=1200&h=600', category: 'technical-inspections' },
    'plumbing-inspection':            { title: 'Plumbing Inspection', description: 'Comprehensive plumbing assessments covering supply, drainage, leaks, fixtures, and functional performance.', image: 'https://images.unsplash.com/photo-1504615755583-2916b52192d3?auto=format&fit=crop&w=1200&h=600', category: 'technical-inspections' },
    'hvac-inspection':                { title: 'HVAC Inspection', description: 'Detailed HVAC inspections to evaluate cooling performance, ventilation, controls, and maintenance condition.', image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&h=600', category: 'technical-inspections' },
    'fire-safety-inspection':         { title: 'Fire Safety Inspection', description: 'Fire safety inspections aligned with NFPA standards to evaluate alarms, suppression, exits, and life safety measures.', image: 'https://images.unsplash.com/photo-1516747773446-6e5c6c7d5c2e?auto=format&fit=crop&w=1200&h=600', category: 'technical-inspections' },
    'dlp-snagging':                   { title: 'DLP Snagging', description: 'Detailed DLP period inspections to identify defects that appear after handover and during the liability period.', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&h=600', category: 'property-snagging' },
    'thermal-imaging':                { title: 'Thermal Imaging Inspection', description: 'Infrared thermal inspections to detect hidden issues such as moisture intrusion, insulation gaps, and electrical hotspots.', image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&h=600', category: 'technical-inspections' },
    'acoustic-survey':                { title: 'Acoustic Survey', description: 'Noise and sound performance surveys to help identify issues with acoustic comfort and regulatory compliance.', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&h=600', category: 'technical-inspections' },
    'water-leak-detection':           { title: 'Water Leak Detection', description: 'Non-invasive leak detection inspections to locate hidden leaks before they cause expensive damage.', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&h=600', category: 'technical-inspections' },
    'structural-survey':              { title: 'Structural Survey', description: 'Detailed structural engineering assessment following ASTM E2018 standards, examining building integrity and load-bearing elements.', image: 'https://images.unsplash.com/photo-1581094613018-d1db5d0b5b30?auto=format&fit=crop&w=1200&h=600', category: 'technical-inspections' },
  };

  app.get('/services/:category/:slug', (req, res, next) => {
    const { category, slug } = req.params;
    const svc = serviceSSRData[slug];
    if (!svc || svc.category !== category) return next();
    const rawDesc = svc.description.length > 158 ? svc.description.slice(0, 155) + '...' : svc.description;
    return serveSPAWithMeta(res, next, {
      title: `${svc.title} | UrbanGrid UAE`,
      description: rawDesc,
      canonical: `https://urbangrid.ae/services/${category}/${slug}`,
      h1: svc.title,
      image: svc.image,
    });
  });

  // Server-side rendered blog pages for SEO
  app.get('/blog/:slug', async (req, res, next) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);
      
      if (!post) return next();

      if (post.status !== 'published') {
        // Archived/removed post: render 410 with noindex so Google deindexes it permanently.
        const canonical = `https://urbangrid.ae/blog/${slug}`;
        const title = `${post.title} | UrbanGrid`;
        const desc = post.excerpt || post.content?.slice(0, 155) || 'UrbanGrid blog post';
        res.setHeader('X-Robots-Tag', 'noindex, nofollow');
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.status(410).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="robots" content="noindex, nofollow">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="${canonical}">
</head>
<body>
  <h1>Blog post permanently removed</h1>
  <p>This article has been permanently removed.</p>
</body>
</html>`);
        return;
      }

      const canonical = `https://urbangrid.ae/blog/${slug}`;
      const title = `${post.title.length > 56 ? post.title.slice(0, 53) + '...' : post.title} | UrbanGrid`;
      const desc = (post.excerpt || post.content || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 158);
      const image = post.featuredImage || 'https://urbangrid.ae/og-image.jpg';
      const safeTitle = title.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const safeDesc = desc.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const safeImage = image.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const safeUrl = canonical.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const datePublished = post.createdAt ? new Date(post.createdAt).toISOString() : new Date().toISOString();
      const dateModified = post.updatedAt ? new Date(post.updatedAt).toISOString() : datePublished;
      const authorName = 'UrbanGrid Editorial Team';
      const jsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": safeDesc,
        "image": image,
        "url": canonical,
        "datePublished": datePublished,
        "dateModified": dateModified,
        "author": {
          "@type": "Person",
          "name": authorName,
          "url": "https://urbangrid.ae/about"
        },
        "publisher": {
          "@type": "Organization",
          "name": "UrbanGrid Property Inspection",
          "url": "https://urbangrid.ae",
          "logo": {
            "@type": "ImageObject",
            "url": "https://urbangrid.ae/favicon-192x192.png"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": canonical
        }
      });
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle}</title>
  <meta name="description" content="${safeDesc}">
  <link rel="canonical" href="${safeUrl}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeDesc}">
  <meta property="og:image" content="${safeImage}">
  <meta property="og:url" content="${safeUrl}">
  <meta property="og:site_name" content="UrbanGrid Property Inspection">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${safeTitle}">
  <meta name="twitter:description" content="${safeDesc}">
  <meta name="twitter:image" content="${safeImage}">
  <meta property="article:published_time" content="${datePublished}">
  <meta property="article:modified_time" content="${dateModified}">
  <meta property="article:author" content="${authorName.replace(/"/g, '&quot;')}">
  <script type="application/ld+json">${jsonLd}</script>
</head>
<body>
  <h1>${post.title.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</h1>
  <p>By <span itemprop="author">${authorName}</span> — <time datetime="${datePublished}">${new Date(datePublished).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time></p>
</body>
</html>`;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.send(html);
    } catch (error) {
      console.error("Error rendering blog page:", error);
      return next();
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
