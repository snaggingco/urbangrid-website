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
import nodemailer from "nodemailer";
import { generateSitemap, getSitemapUrls } from "./sitemap";
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

// Email sending function using Nodemailer with SMTP
async function sendEmail(to: string, subject: string, content: string) {
  try {
    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false // For development, set to true in production
      }
    });

    // Send email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: to,
      subject: subject,
      text: content,
      html: content.replace(/\n/g, '<br>'),
    });

    console.log(`Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    // Log the error but don't fail the form submission completely
    console.log(`Fallback: Logging email to ${to}: ${subject}\n${content}`);
    return false;
  }
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

      const validatedData = insertBlogPostSchema.parse({
        ...req.body,
        authorId: req.user.claims.sub,
        slug: generateSlug(req.body.title),
      });

      const post = await storage.createBlogPost(validatedData);
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
      const updateData = { ...req.body };

      if (req.body.title) {
        updateData.slug = generateSlug(req.body.title);
      }

      const post = await storage.updateBlogPost(parseInt(id), updateData);

      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      res.json(post);
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  app.delete('/api/admin/blog/:id', isAdminAuthenticated, async (req: any, res) => {
    try {

      const { id } = req.params;
      const success = await storage.deleteBlogPost(parseInt(id));

      if (!success) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Protected inspector routes (admin only)
  app.get('/api/admin/inspectors', isAdminAuthenticated, async (req: any, res) => {
    try {
      const { page = '1', limit = '10', isActive } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      const inspectors = await storage.getInspectors({
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        limit: limitNum,
        offset,
      });

      // Get total count for pagination
      const allInspectors = await storage.getInspectors({
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      });

      res.json({
        inspectors,
        total: allInspectors.length,
        page: pageNum,
        pages: Math.ceil(allInspectors.length / limitNum),
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

      // Remove password hash from response
      const { passwordHash, ...inspectorData } = inspector;
      res.json(inspectorData);
    } catch (error) {
      console.error("Error fetching inspector:", error);
      res.status(500).json({ message: "Failed to fetch inspector" });
    }
  });

  app.post('/api/admin/inspectors', isAdminAuthenticated, async (req: any, res) => {
    try {
      // Validate password requirements
      const passwordSchema = z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

      const { password, confirmPassword, ...inspectorData } = req.body;

      // Validate password
      passwordSchema.parse(password);

      // Check password confirmation
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }

      // Hash password
      const passwordHash = bcrypt.hashSync(password, 10);

      const validatedData = insertInspectorSchema.parse({
        ...inspectorData,
        passwordHash,
      });

      const inspector = await storage.createInspector(validatedData);

      // Remove password hash from response
      const { passwordHash: _, ...responseData } = inspector;
      res.status(201).json(responseData);
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
      const { password, confirmPassword, ...updateData } = req.body;

      // If password is being updated, validate it
      if (password) {
        const passwordSchema = z.string()
          .min(8, "Password must be at least 8 characters")
          .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
          .regex(/[a-z]/, "Password must contain at least one lowercase letter")
          .regex(/[0-9]/, "Password must contain at least one number")
          .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

        passwordSchema.parse(password);

        if (password !== confirmPassword) {
          return res.status(400).json({ message: "Passwords do not match" });
        }

        updateData.passwordHash = bcrypt.hashSync(password, 10);
      }

      const inspector = await storage.updateInspector(parseInt(id), updateData);

      if (!inspector) {
        return res.status(404).json({ message: "Inspector not found" });
      }

      // Remove password hash from response
      const { passwordHash: _, ...responseData } = inspector;
      res.json(responseData);
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
      const success = await storage.deleteInspector(parseInt(id));

      if (!success) {
        return res.status(404).json({ message: "Inspector not found" });
      }

      res.json({ message: "Inspector deleted successfully" });
    } catch (error) {
      console.error("Error deleting inspector:", error);
      res.status(500).json({ message: "Failed to delete inspector" });
    }
  });

  // Contact form submission
  app.post('/api/contact', async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);

      // Send email notification to info@urbangrid.ae
      const emailContent = `
        New contact form submission:

        Name: ${submission.name}
        Email: ${submission.email}
        Phone: ${submission.phone || 'Not provided'}
        Enquiry Type: ${submission.enquiryType || 'General Enquiry'}

        Message:
        ${submission.message}
      `;

      await sendEmail('info@snagging.me', 'New Contact Form Submission', emailContent);

      res.status(201).json({ message: "Thank you for your message. We'll get back to you soon!" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error handling contact submission:", error);
      res.status(500).json({ message: "Failed to send message. Please try again." });
    }
  });

  // Consultation form submission
  app.post('/api/consultation', async (req, res) => {
    try {
      const { name, email, phone } = req.body;

      if (!name || !email || !phone) {
        return res.status(400).json({ message: "Name, email, and phone are required" });
      }

      const submission = await storage.createContactSubmission({
        name,
        email,
        phone,
        enquiryType: 'Free Consultation',
        message: `Free consultation request from ${name}. Contact: ${phone}`,
      });

      // Send email notification
      const emailContent = `
        New free consultation request:

        Name: ${name}
        Email: ${email}
        Phone: ${phone}
      `;

      await sendEmail('info@snagging.me', 'New Free Consultation Request', emailContent);

      res.status(201).json({ message: "Thank you! We'll contact you soon for your free consultation." });
    } catch (error) {
      console.error("Error handling consultation request:", error);
      res.status(500).json({ message: "Failed to submit request. Please try again." });
    }
  });

  // Quick contact form endpoint (scroll-triggered popup)
  app.post('/api/quick-contact', async (req, res) => {
    try {
      const { name, email, phone } = req.body;

      if (!name || !email || !phone) {
        return res.status(400).json({ message: "Name, email, and phone are required" });
      }

      // Save to contact submissions table
      const submission = await storage.createContactSubmission({
        name,
        email,
        phone,
        message: 'Quick contact form submission (scroll-triggered)',
        enquiryType: 'Quick Contact Request'
      });

      // Send email notification
      const emailContent = `
New Quick Contact Form Submission:

Name: ${name}
Email: ${email}
Phone: ${phone}
Source: Scroll-triggered popup form
      `;

      await sendEmail('info@snagging.me', 'New Quick Contact Request', emailContent);

      res.status(201).json({ 
        message: "Quick contact request submitted successfully! We'll get back to you soon."
      });
    } catch (error: any) {
      console.error('Error submitting quick contact request:', error);
      res.status(500).json({ message: "Failed to submit request" });
    }
  });

  // Career application form endpoint
  app.post('/api/career-application', async (req, res) => {
    try {
      const { fullName, email, phone, position, experience, coverLetter, hasResume, resumeFileName } = req.body;

      if (!fullName || !email || !phone || !position || !experience || !coverLetter) {
        return res.status(400).json({ message: "All required fields must be filled" });
      }

      // Save to contact submissions table (reusing existing structure)
      const submission = await storage.createContactSubmission({
        name: fullName,
        email,
        phone,
        message: `Career Application:
        
Position: ${position}
Experience Level: ${experience}
Resume Attached: ${hasResume ? `Yes (${resumeFileName})` : 'No'}

Cover Letter:
${coverLetter}`,
        enquiryType: 'Career Application'
      });

      // Send email notification
      const emailContent = `
New Career Application Submission:

Full Name: ${fullName}
Email: ${email}
Phone: ${phone}
Position of Interest: ${position}
Experience Level: ${experience}
Resume Attached: ${hasResume ? `Yes (${resumeFileName})` : 'No'}

Cover Letter:
${coverLetter}

---
This application was submitted through the UrbanGrid careers page.
      `;

      await sendEmail('info@snagging.me', `New Career Application - ${position}`, emailContent);

      res.status(201).json({ 
        message: "Career application submitted successfully! We'll review your application and get back to you soon."
      });
    } catch (error: any) {
      console.error('Error submitting career application:', error);
      res.status(500).json({ message: "Failed to submit application" });
    }
  });

  // Get blog posts for internal linking (simplified data)
  app.get('/api/admin/blog/links', isAdminAuthenticated, async (req: any, res) => {
    try {
      const posts = await storage.getBlogPosts({
        status: 'published',
        limit: 100, // Get all published posts for linking
      });

      // Return simplified data for linking
      const linkData = posts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        category: post.category,
        excerpt: post.excerpt,
      }));

      res.json(linkData);
    } catch (error) {
      console.error("Error fetching blog links:", error);
      res.status(500).json({ message: "Failed to fetch blog links" });
    }
  });

  // Admin dashboard stats
  app.get('/api/admin/stats', isAdminAuthenticated, async (req: any, res) => {
    try {

      const totalPosts = await storage.getBlogPostsCount();
      const draftPosts = await storage.getBlogPostsCount({ status: 'draft' });
      const publishedPosts = await storage.getBlogPostsCount({ status: 'published' });

      res.json({
        totalPosts,
        draftPosts,
        publishedPosts,
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Redirect alternative sitemap paths to the canonical sitemap.xml
  // (Some scanners/crawlers probe /sitemap_index.xml, /sitemaps.xml, etc.)
  app.get([
    '/sitemap_index.xml',
    '/sitemap-index.xml',
    '/sitemaps.xml',
    '/sitemap1.xml',
    '/post-sitemap.xml',
    '/page-sitemap.xml',
    '/category-sitemap.xml',
    '/news-sitemap.xml',
    '/video-sitemap.xml',
    '/image-sitemap.xml',
  ], (_req, res) => {
    res.redirect(301, '/sitemap.xml');
  });

  // Sitemap.xml endpoint
  app.get('/sitemap.xml', async (req, res) => {
    try {
      const protocol = req.get('x-forwarded-proto') || req.protocol;
      const host = req.get('host');
      
      // Use production domain in production
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://urbangrid.ae'
        : `${protocol}://${host}`;

      // Get published blog posts for sitemap
      const blogPosts = await storage.getBlogPosts({
        status: 'published',
        limit: 1000 // Get all published posts
      });

      const urls = getSitemapUrls(baseUrl, blogPosts.map(post => ({
        slug: post.slug,
        updatedAt: post.updatedAt || new Date()
      })));
      const sitemap = generateSitemap(urls);

      res.setHeader('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      res.status(500).send('Error generating sitemap');
    }
  });

  // Robots.txt endpoint
  app.get('/robots.txt', (req, res) => {
    const protocol = req.get('x-forwarded-proto') || req.protocol;
    const host = req.get('host');
    
    // Use production domain in production
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://urbangrid.ae'
      : `${protocol}://${host}`;

    const robotsTxt = `User-agent: *
Allow: /

# Disallow admin pages
Disallow: /admin/
Disallow: /api/

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay
Crawl-delay: 1`;

    res.setHeader('Content-Type', 'text/plain');
    res.send(robotsTxt);
  });

  // Shared helper: inject meta tags + H1 into index.html and serve it
  const serveSPAWithMeta = (res: any, next: any, opts: {
    title: string; description: string; canonical: string; h1: string;
    image?: string; noindex?: boolean;
  }) => {
    try {
      const isProd = process.env.NODE_ENV === 'production';
      const htmlPath = isProd
        ? path.resolve(import.meta.dirname, 'public', 'index.html')
        : path.resolve(import.meta.dirname, '..', 'client', 'index.html');
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
    { path: '/',                 title: 'UrbanGrid – Property Snagging & Inspection in Dubai & UAE',              h1: 'Property Snagging & Inspection Services in Dubai & UAE',           description: 'UrbanGrid: NFPA, ASHRAE & ASTM certified property snagging and inspection across Dubai, Abu Dhabi, Sharjah and the UAE. Same-day reports.' },
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
    'new-build-snagging':              { title: 'New Build Handover Snagging & Inspection', description: 'Comprehensive pre-handover inspection of newly constructed properties to identify defects, incomplete work, and quality issues before you take possession.', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&h=600', category: 'property-snagging' },
    'post-renovation-inspection':      { title: 'Post-Renovation Snagging Inspection', description: 'Quality assessment after renovation or fit-out work to ensure all improvements meet specifications, UAE building standards, and industry best practices.', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&h=600', category: 'property-snagging' },
    'dlp-snagging':                    { title: 'Defect Liability Period (DLP) Snagging', description: 'Strategic inspection during the defect liability period to identify, document, and resolve all defects and quality issues before your warranty expires.', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&h=600', category: 'property-snagging' },
    'move-in-move-out':                { title: 'Property Move-in / Move-out Snagging', description: 'Detailed condition reports for UAE rental properties to protect both tenants and landlords, documenting the property condition during move-in and move-out transitions.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&h=600', category: 'property-snagging' },
    'secondary-market':                { title: 'Secondary Market Property Snagging', description: 'Thorough inspection of pre-owned properties to assess condition, identify defects, and support informed purchasing decisions in the UAE secondary market.', image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&h=600', category: 'property-snagging' },
    'developer-projects':              { title: 'Developer and Contractor Project Snagging', description: 'Quality control inspections for developers and contractors to ensure projects meet industry standards and client expectations.', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&h=600', category: 'property-snagging' },
    'reserve-fund-study':              { title: 'Reserve Fund Study / Sinking Fund', description: 'Comprehensive analysis of building reserve fund requirements and long-term capital expenditure planning for strata properties in compliance with RERA regulations.', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&h=600', category: 'rera-services' },
    'service-charge-allocation':       { title: 'Service Charge Cost Allocation', description: 'Detailed assessment and allocation of service charges across common property areas ensuring fair distribution and full compliance with RERA guidelines.', image: 'https://images.unsplash.com/photo-1607863680198-23d4b2565df0?auto=format&fit=crop&w=1200&h=600', category: 'rera-services' },
    'reinstatement-cost-assessment':   { title: 'Reinstatement Cost Assessment', description: 'Professional valuation of property reinstatement costs for insurance purposes and regulatory compliance requirements under UAE property law.', image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?auto=format&fit=crop&w=1200&h=600', category: 'rera-services' },
    'building-completion-audit':       { title: 'Building Completion Audit', description: 'Comprehensive audit to verify building completion status against approved plans and regulatory requirements for RERA compliance and handover certification.', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&h=600', category: 'rera-services' },
    'building-condition-survey':       { title: 'Building Condition Survey', description: 'Detailed condition assessment of building components and systems for regulatory reporting, maintenance planning, and RERA compliance documentation.', image: 'https://images.unsplash.com/photo-1523287562758-66c7fc58967f?auto=format&fit=crop&w=1200&h=600', category: 'rera-services' },
    'technical-due-diligence':         { title: 'Technical Due Diligence', description: 'Comprehensive technical analysis for property acquisition, covering structural, mechanical, and compliance aspects for informed investment decisions in UAE market.', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=1200&h=600', category: 'technical-inspections' },
    'dilapidation-survey':             { title: 'Dilapidation Survey', description: 'Pre and post-construction condition assessments of adjacent properties to document potential impact from nearby construction activities and protect property interests.', image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1200&h=600', category: 'technical-inspections' },
    'thermographic-survey':            { title: 'Thermographic Survey', description: 'Advanced thermal imaging inspections following ASHRAE standards to detect energy losses, moisture intrusion, and electrical compliance issues invisible to conventional inspection methods.', image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&h=600', category: 'technical-inspections' },
    'noise-survey':                    { title: 'Noise Level Survey & Acoustic Assessment', description: 'Professional acoustic assessments to measure and analyze noise levels for compliance with local regulations and habitability standards in UAE residential and commercial properties.', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&h=600', category: 'technical-inspections' },
    'structural-survey':               { title: 'Structural Survey', description: 'Detailed structural engineering assessment following ASTM E2018 standards, examining building integrity, load-bearing elements, and structural compliance with UAE building regulations.', image: 'https://images.unsplash.com/photo-1581094613018-d1db5d0b5b30?auto=format&fit=crop&w=1200&h=600', category: 'technical-inspections' },
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

      // Any unknown or non-published slug → 410 Gone (these URLs previously existed)
      const send410 = () => {
        res
          .status(410)
          .setHeader('Content-Type', 'text/html')
          .setHeader('X-Robots-Tag', 'noindex, nofollow');
        return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="robots" content="noindex,nofollow">
    <title>Page no longer available | UrbanGrid</title>
    <link rel="canonical" href="https://urbangrid.ae/blog">
</head>
<body>
    <h1>This article has been removed</h1>
    <p>The page you requested is no longer available. <a href="/blog">Browse our current articles</a> or visit our <a href="/">home page</a>.</p>
</body>
</html>`);
      };

      if (!post || post.status !== 'published') {
        return send410();
      }

      // Helpers: keep title <= 60 chars before suffix; description <= 160 chars
      const escapeHtml = (s: string) =>
        s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const truncate = (s: string, max: number) =>
        s.length <= max ? s : s.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
      // Defense-in-depth: hard-restrict slug to URL-safe chars before interpolating
      const safeSlug = String(post.slug).replace(/[^a-zA-Z0-9_-]/g, '');
      const safeUrl = `https://urbangrid.ae/blog/${safeSlug}`;

      const seoTitleRaw = truncate(post.title, 48); // 48 + " | UrbanGrid" (12) = 60 chars max
      const seoDescRaw = truncate(post.excerpt || post.title, 155);
      const seoTitle = escapeHtml(seoTitleRaw) + ' | UrbanGrid';
      const seoDesc = escapeHtml(seoDescRaw);
      const seoKeywords = escapeHtml(post.tags?.join(', ') || 'property inspection, snagging, UAE');
      const featuredImage = post.featuredImage || 'https://urbangrid.ae/og-image.jpg';
      const headlineForSchema = JSON.stringify(truncate(post.title, 110));
      const descForSchema = JSON.stringify(seoDescRaw);
      const imageForSchema = JSON.stringify(featuredImage);
      const urlForSchema = JSON.stringify(safeUrl);
      const toIso = (v: unknown) => {
        if (v instanceof Date) return v.toISOString();
        if (typeof v === 'string' || typeof v === 'number') {
          const d = new Date(v);
          if (!isNaN(d.getTime())) return d.toISOString();
        }
        return new Date().toISOString();
      };
      const datePub = JSON.stringify(toIso(post.createdAt));
      const dateMod = JSON.stringify(toIso(post.updatedAt ?? post.createdAt));

      // Generate basic HTML with meta tags for SEO
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${seoTitle}</title>
    <meta name="description" content="${seoDesc}">
    <meta name="keywords" content="${seoKeywords}">
    <meta property="og:title" content="${seoTitle}">
    <meta property="og:description" content="${seoDesc}">
    <meta property="og:url" content="${safeUrl}">
    <meta property="og:type" content="article">
    <meta property="og:image" content="${escapeHtml(featuredImage)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${seoTitle}">
    <meta name="twitter:description" content="${seoDesc}">
    <meta name="twitter:image" content="${escapeHtml(featuredImage)}">
    <link rel="canonical" href="${safeUrl}">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="preconnect" href="https://cdnjs.cloudflare.com">
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": ${headlineForSchema},
      "description": ${descForSchema},
      "image": ${imageForSchema},
      "author": {
        "@type": "Organization",
        "name": "UrbanGrid Property Inspection",
        "url": "https://urbangrid.ae"
      },
      "publisher": {
        "@type": "Organization",
        "name": "UrbanGrid Property Inspection",
        "url": "https://urbangrid.ae",
        "logo": {
          "@type": "ImageObject",
          "url": "https://urbangrid.ae/favicon-192x192.png",
          "width": 192,
          "height": 192
        }
      },
      "datePublished": ${datePub},
      "dateModified": ${dateMod},
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": ${urlForSchema}
      },
      "url": ${urlForSchema}
    }
    </script>
</head>
<body>
    <div id="root">
        <main>
            <article>
                <h1>${escapeHtml(post.title)}</h1>
                <div>${escapeHtml(post.content)}</div>
            </article>
        </main>
        <footer>
            <nav aria-label="Legal">
                <a href="/privacy-policy">Privacy Policy</a>
                <a href="/terms-of-service">Terms of Service</a>
                <a href="/">UrbanGrid Property Inspection</a>
            </nav>
        </footer>
    </div>
    <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;

      res
        .setHeader('Content-Type', 'text/html')
        .setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
      res.send(html);
    } catch (error) {
      console.error("Error serving blog page:", error);
      next(); // Let Vite handle the error
    }
  });


  const httpServer = createServer(app);
  return httpServer;
}