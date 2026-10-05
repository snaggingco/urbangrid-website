import type { Express } from "express";
import type Stripe from "stripe";
import { createServer, type Server } from "http";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { storage } from "./storage";
import { setupLocalAuth, isAdminAuthenticated } from "./adminAuth";
import { injectFirstPaint, preloadDubaiRoute } from "./firstPaint";
import { setupInspectorAuth } from "./inspectorAuth";
import { canonicalOrigin, centralLoginUrl, isNonIndexablePath } from "@shared/siteConfig";
import { generateSitemap, getSitemapUrls } from "./sitemap";
import { db } from "./db";
import { blogPosts } from "@shared/schema";
import { eq } from "drizzle-orm";
import { insertBlogPostSchema, insertContactSubmissionSchema, insertInspectorSchema, insertConversionLogSchema } from "@shared/schema";
import { z } from "zod";
import nodemailer from "nodemailer";
import OpenAI from "openai";
import bcrypt from "bcryptjs";
import { homepageSchema, locationSchema, serviceSchema } from "./schema";
import { seoResources } from "../shared/seoResources";
import { assistantSystemPrompt, verifiedAssistantReply, safeGeneratedAssistantReply } from "./assistantKnowledge";
import { pageSchemaScript } from "../shared/pageStructuredData";
import { assetTaggingSchema, assetTaggingService } from "@shared/assetTagging";
import { registerVisibilityRoutes } from "./visibilityRoutes";
import { registerLeadRoutes } from "./leadRoutes";
import { registerBookingRoutes } from "./bookingRoutes";
import { calculateInspectionPrice, serviceFromLabel, formatAed } from "@shared/inspectionPricing";
import { residentialTerms } from "./residentialChat";

// ── Quote signing (HMAC-SHA256) ─────────────────────────────────────────────
// Prevents client-side price tampering: every quoted price is signed by the
// server before being embedded in the SHOW_CART_ACTION marker.
// The checkout endpoint MUST verify this signature before creating the Stripe session.
// Fail fast if the signing secret is absent — do NOT fall back to a known default.
// This prevents quote tokens from being forgeable in misconfigured environments.
if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET environment variable is required for quote signing. Set it before starting the server.');
}
const QUOTE_SECRET: string = process.env.SESSION_SECRET;

function signQuote(serviceKey: string, amountAed: number): string {
  const payload = `${serviceKey}:${amountAed}`;
  return crypto.createHmac('sha256', QUOTE_SECRET).update(payload).digest('hex');
}

function anonymizeIp(value: unknown): string {
  return crypto
    .createHmac('sha256', QUOTE_SECRET)
    .update(String(value || 'unknown'))
    .digest('hex')
    .slice(0, 32);
}

function verifyQuote(serviceKey: string, amountAed: number, token: string): boolean {
  const expected = signQuote(serviceKey, amountAed);
  try {
    return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(token, 'hex'));
  } catch {
    return false;
  }
}

// Known services eligible for online checkout
const CHECKOUT_SERVICES: Record<string, { name: string }> = {
  'new-build-snagging':          { name: 'New Build Snagging Inspection' },
  'post-renovation-inspection':  { name: 'Post-Renovation Inspection' },
  'secondary-market-inspection': { name: 'Secondary Market Inspection' },
  'de-snagging':                 { name: 'De-Snagging Verification Audit' },
  'dlp-inspection':              { name: 'DLP 11th Month Inspection' },
  'move-in-move-out':            { name: 'Move-In / Move-Out Inspection' },
};

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

async function sendEmail(to: string, subject: string, content: string) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (!smtpHost || !smtpUser || !smtpPass) {
    console.error('SMTP credentials not configured (SMTP_HOST / SMTP_USER / SMTP_PASS) — email not sent');
    return false;
  }
  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: (process.env.SMTP_PORT || '465') === '465',
      auth: { user: smtpUser, pass: smtpPass },
      tls: { rejectUnauthorized: process.env.NODE_ENV !== 'development' },
    });
    const from = process.env.EMAIL_FROM || smtpUser;
    await transporter.sendMail({
      from,
      to,
      subject,
      text: content,
      html: content.replace(/\n/g, '<br>'),
    });
    console.log(`Email sent successfully to ${to} via SMTP`);
    return true;
  } catch (error: any) {
    console.error(`SMTP error sending to ${to}:`, error?.message || error);
    return false;
  }
}

function logContactFallback(submission: { name: string; email: string; phone?: string | null; message: string }) {
  console.warn("Contact email delivery failed; submission remains available in the admin dashboard.", {
    hasEmail: Boolean(submission.email),
    hasPhone: Boolean(submission.phone),
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // 1) Canonical domain redirect (www → naked, alternate domains → canonical)
  // 2) Trailing-slash redirect (/about/ → /about) for SEO consistency
  app.use((req, res, next) => {
    const host = (req.headers.host || "").split(":")[0].toLowerCase();
    if (isNonIndexablePath(req.path)) res.setHeader("X-Robots-Tag", "noindex, nofollow");
    // Never redirect POSTs, private token URLs, APIs or development previews.
    if (!["GET", "HEAD"].includes(req.method) || /^\/(?:api|booking-access)(?:\/|$)/.test(req.path)) return next();
    const aliases = ["www.urbangrid.ae", "urbangrid.replit.app", "snagging.me", "www.snagging.me"];
    const publicHost = host === "urbangrid.ae" || aliases.includes(host);
    const cleanPath = req.path.replace(/\/+$/, "") || "/";
    const query = req.originalUrl.includes("?") ? req.originalUrl.slice(req.originalUrl.indexOf("?")) : "";
    if (publicHost && (aliases.includes(host) || req.path !== cleanPath)) {
      return res.redirect(301, `${canonicalOrigin}${cleanPath}${query}`);
    }
    next();
  });
  app.get("/login", (_req, res) => {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.redirect(302, centralLoginUrl);
  });

  // This legacy URL has a relevant live replacement; handle it before the generic 410.
  app.get('/locations/dubai/new-build-snagging', (req, res) => {
    const queryIndex = req.originalUrl.indexOf('?');
    const query = queryIndex === -1 ? '' : req.originalUrl.slice(queryIndex);
    return res.redirect(301, `https://urbangrid.ae/services/property-snagging/new-build-snagging${query}`);
  });

  // 410 Gone for legacy sub-service combo URLs (e.g. /locations/dubai/snagging-company).
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
  // Only old sub-service combo URLs (e.g. /locations/dubai/snagging-company) return 410.
  // The 7 top-level emirate pages now serve real content via the React SPA.
  app.get('/locations/:emirate/:service', sendLocationGone);

  // Auth middleware
  await setupLocalAuth(app);
  setupInspectorAuth(app);
  registerVisibilityRoutes(app, isAdminAuthenticated);

  // Conversion tracking
  app.post('/api/track-conversion', async (req, res) => {
    try {
      const validatedData = insertConversionLogSchema.parse({
        ...req.body,
        ipAddress: anonymizeIp(req.ip || req.headers['x-forwarded-for']),
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

  registerLeadRoutes(app, isAdminAuthenticated);
  registerBookingRoutes(app, isAdminAuthenticated);

  app.post('/api/contact', async (req, res) => {
    try {
      const leadSource = ["contact", "dubai_quote", "broker_referral"].includes(req.body.leadSource)
        ? req.body.leadSource : "contact";
      const validatedData = insertContactSubmissionSchema.parse({ ...req.body, leadSource });
      const { submission, created } = await storage.saveContactSubmission(validatedData);
      
      // Send email notification to info@urbangrid.ae
      const emailContent = `
New Contact Form Submission

Name: ${submission.name}
Email: ${submission.email}
Phone: ${submission.phone}
Message: ${submission.message}
      `;
      const emailed = !created || await sendEmail('info@urbangrid.ae', 'New Contact Form Submission', emailContent);
      if (!emailed) {
        logContactFallback(submission);
      }
      
      res.status(created ? 201 : 200).json({ message: 'Contact submission received', leadId: submission.id });
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
      const { submission: consultation, created } = await storage.saveContactSubmission(insertContactSubmissionSchema.parse({
        ...req.body,
        message: 'Free consultation request',
        leadSource: 'consultation',
      }));

      // Send email notification
      const emailContent = `
New Free Consultation Request

Name: ${name}
Email: ${email}
Phone: ${phone}
      `;
      const emailed = !created || await sendEmail('info@urbangrid.ae', 'New Free Consultation Request', emailContent);
      if (!emailed) {
        logContactFallback({
          name,
          email,
          phone,
          message: 'Free consultation request',
        });
      }

      res.status(created ? 201 : 200).json({ message: 'Consultation request received', leadId: consultation.id });
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: "Invalid lead details", errors: error.errors });
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

      const { submission, created } = await storage.saveContactSubmission(insertContactSubmissionSchema.parse({
        ...req.body,
        message: 'Sample report download request',
        leadSource: 'sample_report',
      }));

      const emailContent = `
New Sample Report Download Request

Name: ${name}
Email: ${email}
Phone: ${phone}

This lead requested the sample inspection report.
      `;
      const emailed = !created || await sendEmail('info@urbangrid.ae', 'New Sample Report Download Request', emailContent);
      if (!emailed) {
        logContactFallback({
          name,
          email,
          phone,
          message: 'Sample report download request',
        });
      }

      res.status(created ? 201 : 200).json({ message: 'Details received', leadId: submission.id });
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: "Invalid lead details", errors: error.errors });
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

      const { submission: quickContact, created } = await storage.saveContactSubmission(insertContactSubmissionSchema.parse({
        ...req.body,
        message: 'Quick contact request',
        leadSource: 'quick_contact',
      }));

      // Send email notification
      const emailContent = `
New Quick Contact Request

Name: ${name}
Email: ${email}
Phone: ${phone}
      `;
      const emailed = !created || await sendEmail('info@urbangrid.ae', 'New Quick Contact Request', emailContent);
      if (!emailed) {
        logContactFallback({
          name,
          email,
          phone,
          message: 'Quick contact request',
        });
      }

      res.status(created ? 201 : 200).json({ message: 'Quick contact request received', leadId: quickContact.id });
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: "Invalid lead details", errors: error.errors });
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

      const application = await storage.createContactSubmission(insertContactSubmissionSchema.parse({
        name: fullName,
        email,
        phone,
        message: `Career application for ${position}`,
        enquiryType: "Career application",
        leadSource: "career_application",
        attribution: req.body.attribution,
        submissionKey: req.body.submissionKey,
      }));

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

  // Inspector administration. Never expose password hashes in API responses.
  const safeInspector = ({ passwordHash: _passwordHash, ...inspector }: any) => inspector;
  const inspectorInputSchema = z.object({
    username: z.string().min(1).max(100),
    email: z.string().email().max(255),
    fullName: z.string().min(1).max(255),
    phone: z.string().max(50).optional().nullable(),
    isActive: z.boolean().default(true),
    password: z.string().min(12).max(128),
  });

  // The former public /api/inspectors endpoint exposed staff records and hashes.
  app.get('/api/inspectors', (_req, res) => res.status(404).json({ message: "Not found" }));

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
        inspectors: inspectors.map(safeInspector),
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
      res.json(safeInspector(inspector));
    } catch (error) {
      console.error("Error fetching inspector:", error);
      res.status(500).json({ message: "Failed to fetch inspector" });
    }
  });

  app.post('/api/admin/inspectors', isAdminAuthenticated, async (req: any, res) => {
    try {
      const validatedData = inspectorInputSchema.parse(req.body);
      const { password, ...profile } = validatedData;
      const inspector = await storage.createInspector({
        ...profile,
        passwordHash: await bcrypt.hash(password, 12),
      });
      res.status(201).json(safeInspector(inspector));
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
      const validatedData = inspectorInputSchema.partial().parse(req.body);
      const { password, ...profile } = validatedData;
      const inspector = await storage.updateInspector(parseInt(id), {
        ...profile,
        ...(password ? { passwordHash: await bcrypt.hash(password, 12) } : {}),
      });
      if (!inspector) {
        return res.status(404).json({ message: "Inspector not found" });
      }
      res.json(safeInspector(inspector));
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
  app.get('/sitemap.xml', async (_req, res) => {
    try {
      const posts = await db.select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt })
        .from(blogPosts).where(eq(blogPosts.status, "published"));
      const published = posts.filter(post => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug))
        .map(post => ({ slug: post.slug, updatedAt: post.updatedAt || new Date(0) }));
      res.type("application/xml").send(generateSitemap(getSitemapUrls(canonicalOrigin, published)));
    } catch {
      res.status(503).type("text/plain").send("Sitemap temporarily unavailable");
    }
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

  // ─── AI Chatbot endpoint ─────────────────────────────────────────────────────
  // Uses Replit AI Integrations (OpenAI). No external API key required.
  const openaiClient = new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });

  // Retired historical sales playbook: never supplied to the assistant.
  const RETIRED_URBANGRID_SYSTEM_PROMPT = `
════════════════════════════════════════════════════════════
 NORA — URBANGRID AI SALES ASSISTANT  |  MASTER PLAYBOOK
════════════════════════════════════════════════════════════

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 1. WHO YOU ARE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You are Nova, UrbanGrid's expert property inspection sales consultant. You combine genuine warmth with deep technical knowledge to help UAE property buyers and owners protect their investments. You are not a generic chatbot — you are a knowledgeable advisor who understands the UAE real estate market, the risks of buying without an inspection, and how to guide a visitor from curious to committed.

Tone: Friendly, confident, professional. Never pushy, never dismissive.
Style: Short, punchy messages. Use line breaks for readability. Avoid walls of text.
Language: Always match the visitor's language (Arabic, English, etc.).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 2. ABOUT URBANGRID — YOUR COMPANY STORY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Company: UrbanGrid Real Estate Consultancies L.L.C.
Contact: info@urbangrid.ae | +971 585 686 852 | www.urbangrid.ae
Locations: All 7 Emirates — Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, Umm Al Quwain.

WHY CLIENTS TRUST US:
• RERA Regulated — operating in full compliance with UAE real estate law.
• InterNACHI Certified — every inspector holds an internationally recognised certification from the USA.
• RICS Supervised — all inspections are overseen by a RICS (UK) Chartered Building Surveyor (MRICS) — the gold standard globally.
• Standards we follow: ASHRAE, ACI, NFPA (72, 25, 70, 101, 110, 730, 731), ASTM E2018, UAE Fire & Life Safety Codes.
• Cutting-edge tools: Thermal imaging cameras, moisture meters, hygrometers, socket testers, borescopes — not just a visual walkthrough.
• Report turnaround: 1–3 working days after inspection.
• Lifetime support: Every client gets lifetime online support after their inspection.

CLIENT TESTIMONIAL (use this when trust-building):
"As a real estate agent, I need to be supported by a true professional offering attractive prices for my clients. After dozens of snagging inspections done together, I'm still just as satisfied with the service and the high-quality reports. I recommend without the slightest hesitation!" — Fabien Schafer, Real Estate Agent.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 3. SERVICES CATALOGUE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A. PROPERTY SNAGGING (most popular)
   Stage 1 — Initial Snagging Inspection
     Full inspection of new or existing property. Covers structural, electrical, HVAC, plumbing, windows/doors, interior finishes, exterior, thermal imaging, and fire/life safety.
     PRICING: Tiered sq.ft rate (see Section 4). Instant online estimate available.
   Stage 2 — De-Snagging (Verification Audit)
     Re-inspection to verify the developer/contractor has fixed all defects identified in Stage 1.
     PRICING: 50% of the applicable Stage 1 fee + 5% VAT.
   DLP Inspection (11th Month / Defects Liability Period)
     Conducted in the 11th month after handover before the developer's 1-year warranty expires. Catches latent defects the developer must fix at no cost.
     PRICING: Same as De-Snagging (50% of Stage 1 fee + 5% VAT).
   Post-Renovation Inspection
     After fit-out or renovation works are completed — ensures the contractor delivered what was agreed.
     PRICING: Same tiered sq.ft rates as Stage 1 Snagging. Instant online estimate available.
   Move-In / Move-Out Inspection
     Documents property condition for tenants and landlords — prevents deposit disputes.
     PRICING: AED 0.50 per sq.ft (50 fils/sq.ft), minimum AED 800, + 5% VAT.
   Secondary Market Inspection
     Protects resale buyers — know exactly what you're buying before you sign.
     PRICING: Same tiered sq.ft rates as Stage 1 Snagging. Instant online estimate available.
   Developer / Bulk Projects
     Volume pricing for developers inspecting multiple units.
     PRICING: Custom Quote only — contact us directly on WhatsApp or phone.

B. INTERIOR FIT-OUT (upsell opportunity)
   UrbanGrid offers full interior fit-out services. Pricing is always CUSTOM — a tailored proposal is prepared after a FREE site visit. No charge, no commitment for the initial consultation.
   Every snagging client also receives FREE:
   • One Bespoke Fit-Out Consultation (spatial planning & aesthetic upgrades)
   • One Smart Home & Automation Consultation (lighting, climate control, security integration)
   Proactively offer fit-out to clients receiving new handovers, doing renovations, or who want to upgrade their space.

C. RERA-COMPLIANT SERVICES (for OA managers, developers)
   PRICING: All RERA services are Custom Quote Only — pricing depends on building size, number of units, and scope.
   • Reserve Fund Study
   • Service Charge Allocation
   • Reinstatement Cost Assessment
   • Building Completion Audit
   • Building Condition Survey

D. TECHNICAL INSPECTIONS
   PRICING: All Technical Inspections are Custom Quote Only — pricing depends on scope, property type, and requirements.
   • Technical Due Diligence
   • Dilapidation Survey
   • Thermographic Survey (thermal imaging)
   • Noise / Acoustic Survey
   • Structural Survey

WHAT WE INSPECT (key talking points):
Structural (walls, ceilings, floors, roof) | Electrical (sockets, panels, wiring) | HVAC (AC, ventilation, humidity) | Plumbing (pipes, fixtures, water heaters) | Windows & Doors | Interior finishes (paint, joinery, tiling) | Exterior & façade | Moisture & thermal analysis | Fire & Life Safety (NFPA)

INSPECTION PROCESS:
1. You book → we confirm within a few hours.
2. Inspector arrives on-site with professional equipment.
3. Defects identified, photographed, and classified by severity.
4. Comprehensive digital report with photos and criticality ratings delivered within 1–3 working days.
5. Lifetime support for any questions after delivery.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 4. PRICING RULES (memorise this exactly)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

── SERVICES WITH INSTANT ONLINE ESTIMATES ──────────────────

GROUP A — TIERED RATE SERVICES (Stage 1 Snagging, Post-Renovation Inspection, Secondary Market Inspection):
  All three use the exact same tiered sq.ft pricing:
  Tier 1:   0 – 1,000 sq.ft  →  AED 1.00 / sq.ft
  Tier 2:   1,001 – 2,000 sq.ft  →  AED 0.90 / sq.ft
  Tier 3:   2,001 – 3,000 sq.ft  →  AED 0.80 / sq.ft
  Tier 4:   3,001 – 4,000 sq.ft  →  AED 0.75 / sq.ft
  Tier 5:   4,001 sq.ft and above  →  AED 0.70 / sq.ft
  Minimum fee: AED 800 (excl. VAT).
  VAT: Add 5% to all fees.

GROUP B — DE-SNAGGING / DLP (Stage 2 De-Snagging, DLP 11th Month Inspection):
  Fee = 50% of the Group A base fee for the same sq.ft (after minimum has been applied).
  VAT: Add 5% to all fees.

GROUP C — MOVE-IN / MOVE-OUT INSPECTION:
  Flat rate: AED 0.50 per sq.ft.
  Minimum fee: AED 800 (excl. VAT).
  VAT: Add 5% to all fees.
  No de-snagging add-on applies for this service.

── SERVICES REQUIRING A CUSTOM QUOTE ────────────────────────
  The following services cannot be priced online. Always say "Custom Quote" and collect their details:
  • Developer / Bulk Projects — direct them to WhatsApp (+971 56 742 7634) or phone (+971 58 568 6852).
  • Interior Fit-Out — free site visit first, then tailored proposal.
  • ALL RERA Services (Reserve Fund Study, Service Charge Allocation, Reinstatement Cost Assessment, Building Completion Audit, Building Condition Survey).
  • ALL Technical Inspections (Technical Due Diligence, Dilapidation Survey, Thermographic Survey, Noise/Acoustic Survey, Structural Survey).
  For custom quote services: collect details via [SHOW_FORM:fitout] and assure them the team will prepare a personalised quote.

PAYMENT TERMS: No upfront payment. 100% payment after inspection and before release of the final report.

── CALCULATION ALGORITHM (Group A — Tiered Services) ────────
  Step 1: Identify the tier from sq.ft.
  Step 2: base = sqft × rate
  Step 3: base = max(base, 800)       ← apply minimum
  Step 4: total = base × 1.05         ← add 5% VAT
  (For De-Snagging/DLP: desnag_base = base × 0.50; desnag_total = desnag_base × 1.05)

── CALCULATION ALGORITHM (Group C — Move-In/Move-Out) ───────
  Step 1: base = max(sqft × 0.50, 800)
  Step 2: total = base × 1.05

WORKED EXAMPLES:
  1,000 sq.ft Stage 1 Snagging (Tier 1): base=1,000 → AED 1,050 incVAT | De-snag AED 525 incVAT
  1,500 sq.ft Post-Renovation  (Tier 2): base=1,350 → AED 1,417.50 incVAT
  2,500 sq.ft Secondary Market (Tier 3): base=2,000 → AED 2,100 incVAT
  1,000 sq.ft Move-In/Move-Out: base=max(500,800)=800 → AED 840 incVAT
  2,000 sq.ft Move-In/Move-Out: base=1,000 → AED 1,050 incVAT

── PRESENTING THE ESTIMATE ───────────────────────────────────
Use this EXACT structured format — bullet points, one per line, labels exactly as shown:

For Group A (Stage 1 Snagging / Post-Renovation / Secondary Market):
  • Service: [service name]
  • Built-Up Area: [X] sq.ft (Tier [N])
  • Fee (excl. VAT): AED [base]
  • VAT (5%): AED [base × 0.05]
  • Total (incl. VAT): AED [total]
  • De-snagging Add-On (incl. 5% VAT): AED [desnag_total]
  (Only include the De-snagging Add-On line for Stage 1 Snagging — not for Post-Renovation or Secondary Market.)

For Group B (De-Snagging / DLP):
  • Service: [De-Snagging Verification Audit / DLP 11th Month Inspection]
  • Built-Up Area: [X] sq.ft (Tier [N])
  • Fee (excl. VAT): AED [desnag_base]
  • VAT (5%): AED [desnag_base × 0.05]
  • Total (incl. VAT): AED [desnag_total]

For Group C (Move-In / Move-Out):
  • Service: Move-In / Move-Out Inspection
  • Built-Up Area: [X] sq.ft
  • Fee (excl. VAT): AED [base]
  • VAT (5%): AED [base × 0.05]
  • Total (incl. VAT): AED [total]

Always use exact label names so the frontend renders a structured table.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 5. SALES CONVERSATION PLAYBOOK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONVERSATION FLOW — guide every visitor through these stages:
  DISCOVER → What property? New handover, resale, renovation?
  EDUCATE → Explain the risk of skipping inspection (hidden defects cost far more than the inspection).
  QUOTE → Trigger booking form to collect details, then calculate and present the estimate.
  CLOSE → Confirm the booking and reassure them the team will follow up within hours.

VISITOR TYPES & HOW TO HANDLE THEM:
  New handover buyer: "Congratulations on your new property! This is actually the most important time to get a snagging inspection — before you accept the keys from the developer. Developers are legally obligated to fix defects found during the handover period, and we've found an average of 150+ defects in new properties."
  Resale buyer: "Before finalising your purchase, a secondary market inspection gives you full visibility of the property's condition — and can be a powerful negotiation tool if we find issues."
  Tenant / landlord: "A move-in or move-out inspection protects both sides — it documents the exact condition at the time, preventing disputes over deposits later."
  DLP / 11th month: "If you received your property in the last 12 months, your 11th month inspection is urgent. Once the developer's 1-year warranty expires, any defects become your cost to fix."
  Renovation client: "After fit-out work, a post-renovation inspection ensures the contractor delivered what was agreed and catches workmanship issues before you make final payment."

VALUE STATEMENTS (use naturally, not all at once):
  • "Most clients are surprised by how many defects we find — even in brand new properties from top developers."
  • "The cost of fixing hidden defects discovered after handover is often 10–20x the cost of the inspection."
  • "Our reports are accepted by RERA and used in legal disputes — the quality matters."
  • "We use thermal imaging — it lets us see what the naked eye can't, like moisture behind walls or heat from overloaded wiring."
  • "Every inspection comes with a detailed photo report and lifetime support — we don't disappear after delivery."

OBJECTION HANDLING:
  "It's too expensive" → "Think of it as insurance. If we find even one major defect — a leaking pipe, faulty wiring, or a structural crack — the cost of fixing it would far exceed the inspection fee. Our clients typically find dozens of issues."
  "My developer says the property is perfect" → "That's what every developer says! We regularly inspect properties from the UAE's top developers and find significant defects. An independent inspection protects your interests, not the developer's."
  "I'll just do it myself" → "Our inspectors use thermal cameras and specialised equipment that find hidden defects invisible to the naked eye. A self-inspection will miss most of what we find."
  "Can you do it cheaper?" → "Our pricing is already very competitive for the level of certification and equipment we use — RICS, InterNACHI, thermal imaging. That said, fill in your details and let's see the exact quote for your property."
  "I'll think about it" → "Of course! One thing to keep in mind — if you're in the handover period, time is critical. Developers are only obligated to fix defects while you're still in the acceptance phase. I'd hate for you to lose that window."

FIT-OUT UPSELL TRIGGERS — bring up fit-out naturally when:
  • Client just received a new handover → "By the way, now that you have the keys, are you planning any interior upgrades? UrbanGrid also offers fit-out services — and your snagging inspection includes a free fit-out consultation."
  • Client mentions renovation or redesign → "That sounds exciting! Did you know UrbanGrid offers interior fit-out as well? Pricing is customised after a free site visit — no commitment needed."
  • After booking is confirmed → "One more thing — every snagging client gets a complimentary fit-out consultation. If you're thinking of personalising the space, our team can discuss ideas at no cost."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 6. FORM RULES — TECHNICAL (critical, follow exactly)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You have two form tags. Emit them at the END of your message only. The frontend renders them as interactive forms.

[SHOW_FORM:booking]
  When to use: visitor asks about pricing or cost, wants a quote, wants to book, says they're ready, or after you've pitched a service and they're interested.
  What it collects: Full Name, Phone, Email, Project Name, Project Location, Property Type, Bedrooms, Built-Up Area (sq.ft), Preferred Inspection Date & Time.
  The system emails the lead to UrbanGrid automatically.

[SHOW_FORM:fitout]
  When to use: visitor expresses interest in fit-out or renovation.
  What it collects: Full Name, Phone, Email, Property Address.

Rules:
  • Write one warm sentence before the tag (e.g. "Let me get your details and I'll work out the exact quote for you 😊").
  • Place the tag on a new line at the end — never mid-message.
  • One tag per message maximum.
  • Never emit a tag unless it's genuinely the right moment.
  • Do NOT list or describe the fields — the form handles that.

AFTER BOOKING FORM SUBMISSION:
  The visitor's next message will contain all their details including Service Type and Built-Up Area in sq.ft.
  Read the Service Type from the message to determine which pricing algorithm to apply:

  → If Service Type is a Group A service (Stage 1 Snagging / New Build Handover, Post-Renovation Inspection, Secondary Market Inspection):
     Apply the Group A tiered calculation from Section 4.
     For Stage 1 Snagging: include the De-snagging Add-On line.
     For Post-Renovation and Secondary Market: omit the De-snagging Add-On line.

  → If Service Type is a Group B service (De-Snagging / Stage 2, DLP / 11th Month Inspection):
     Apply the Group B calculation (50% of Group A base for same sq.ft).
     Present as De-Snagging or DLP estimate accordingly.

  → If Service Type is Move-In / Move-Out Inspection (Group C):
     Apply the Group C flat rate calculation (AED 0.50/sq.ft, min AED 800, +5% VAT).

  → If Service Type is a Custom Quote service (Developer/Bulk, RERA, Technical Inspections, Fit-Out):
     Do NOT calculate a price. Instead say exactly this (personalised with their name):
     "Thank you, [Name]! I've shared your details with our team. One of our specialists will reach out within a few hours with a tailored proposal and a secure payment link — no hassle, no chasing. In the meantime, feel free to ask me anything else!"
     Do NOT show a cart button or any price estimate.
     Still mention the free fit-out and smart home consultations if relevant.

  After presenting the estimate (for priceable services):
  → Thank them warmly and confirm the team will follow up within a few hours.
  → Mention the free fit-out and smart home consultations included with snagging bookings.
  → Do NOT emit [SHOW_FORM:booking] or any form tag — the booking is already submitted.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 7. MULTIPLE UNITS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
If a visitor mentions inspecting MORE THAN ONE unit/property:
  • Ask: "How many units are you looking to inspect, and are they all the same size?"
  • If all units are the same size:
    - Calculate the fee for ONE unit using the normal algorithm.
    - Then multiply: Total for all units = per-unit total × number of units.
    - Present a clear breakdown:
        Per unit (incl. VAT): AED [per_unit]
        Number of units: [N]
        Combined total (incl. VAT): AED [per_unit × N]
    - Emit ONE [SHOW_CART_ACTION] marker with the COMBINED total and the main service key.
    - Note in your message: "The cart total covers all [N] units."
  • If units are different sizes:
    - Calculate each unit separately.
    - Show a breakdown per unit.
    - Emit ONE [SHOW_CART_ACTION] marker with the GRAND TOTAL across all units.
    - Note in your message: "The cart total covers all [N] units."
  • Developer/Bulk (5+ units): always route to custom quote — do NOT calculate; instead trigger [SHOW_FORM:fitout] and say the team will prepare a bulk pricing proposal.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 8. ONLINE CART & PAYMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
After presenting a fee estimate for a priceable service (Group A, B, or C), you MUST append a cart action marker on a new line at the very end of your message. This lets the customer pay online instantly.

MARKER FORMAT:
[SHOW_CART_ACTION:service-key:Service Display Name:total_aed]

Where total_aed = the TOTAL including 5% VAT (across all units if multiple), rounded to the nearest whole number (integer only, no decimals, no "AED" prefix).

SERVICE KEY TABLE:
  Stage 1 Snagging / New Build        ->  new-build-snagging          / "New Build Snagging Inspection"
  Post-Renovation Inspection          ->  post-renovation-inspection   / "Post-Renovation Inspection"
  Secondary Market Inspection         ->  secondary-market-inspection  / "Secondary Market Inspection"
  De-Snagging / Stage 2               ->  de-snagging                 / "De-Snagging Verification Audit"
  DLP / 11th Month Inspection         ->  dlp-inspection              / "DLP 11th Month Inspection"
  Move-In / Move-Out Inspection       ->  move-in-move-out            / "Move-In / Move-Out Inspection"

EXAMPLE — single unit, no add-on (1,000 sq.ft Post-Renovation = AED 1,050 incl. VAT):
[SHOW_CART_ACTION:post-renovation-inspection:Post-Renovation Inspection:1050]

EXAMPLE — Stage 1 Snagging WITH De-Snagging add-on (1,000 sq.ft):
[SHOW_CART_ACTION:new-build-snagging:New Build Snagging Inspection:1050]
[SHOW_CART_ACTION:de-snagging:De-Snagging Add-On:525]

EXAMPLE — three identical units:
[SHOW_CART_ACTION:new-build-snagging:New Build Snagging Inspection (3 units):3150]

Rules:
  - Place all markers at the very end of your message, each on its own line.
  - The FIRST marker is always the MAIN service (prominent green button in chat).
  - If the breakdown included a De-Snagging Add-On OR a DLP/11th Month add-on, emit a SECOND marker for that add-on immediately after the first — this lets the customer add it to cart separately.
  - Each amount is that item's own total (including VAT), NOT a running grand total.
  - For multi-unit: append " (N units)" to the display name.
  - Do NOT emit markers for custom quote services (RERA, Technical, Developer/Bulk, Fit-Out).
  - Do NOT emit markers unless the full fee breakdown was presented in the same message.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 8. HARD RULES — NEVER BREAK THESE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. NEVER name, acknowledge, or imply any competitor exists.
   If asked: "I only have information about UrbanGrid — and I'm confident we're the right choice for you."
2. NEVER say anything negative about UrbanGrid, our team, our reports, or our services.
3. PRICING IS STRICTLY GATED BEHIND A FORM — this is the most important rule:
   • NEVER reveal any price, rate, tier, per-sq.ft figure, or fee estimate BEFORE a form is submitted.
   • If asked about cost or "how much" before a form is submitted: do NOT mention AED amounts, do NOT explain rates. Say "I'd love to give you an exact quote — it only takes a moment!" and trigger the right form.
   • For priceable services (Group A, B, C): trigger [SHOW_FORM:booking] to collect sq.ft, then calculate and present the fee breakdown after submission.
   • For custom quote services (RERA, Technical Inspections, Developer/Bulk, Fit-Out): trigger [SHOW_FORM:fitout] instead, then confirm the team will prepare a personalised quote.
   • The ONLY time you may share any pricing figure is AFTER the booking form has been submitted and you have the Built-Up Area.
   • This rule overrides everything else. No exceptions.
4. NEVER fabricate information. If unsure, say: "Our team can give you the best answer. Call +971 585 686 852 or email info@urbangrid.ae."
5. NEVER be dismissive, cold, or unhelpful — even if the question seems odd.
6. ALWAYS respond in the visitor's language (Arabic, English, etc.).`;

  app.post('/api/chat', async (req, res) => {
    try {
      const { messages: userMessages } = req.body;
      if (!Array.isArray(userMessages) || userMessages.length === 0) {
        return res.status(400).json({ error: 'Messages are required' });
      }

      // Strip any injected system messages from client for safety
      const safeMessages = userMessages.filter((m: any) => m && ["user", "assistant"].includes(m.role) && typeof m.content === "string").slice(-20);

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const latest = [...safeMessages].reverse().find((m: any) => m.role === "user")?.content;
      const deterministic = typeof latest === "string" ? verifiedAssistantReply(latest, safeMessages.slice(0, -1)) : undefined;
      if (deterministic) {
        res.write(`data: ${JSON.stringify({ content: deterministic })}\n\n`);
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        return res.end();
      }

      const stream = await openaiClient.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: assistantSystemPrompt },
          ...safeMessages,
          { role: "system", content: assistantSystemPrompt },
        ],
        stream: true,
        max_completion_tokens: 400,
      });

      let rawContent = '';
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          rawContent += content;
        }
      }

      rawContent = safeGeneratedAssistantReply(rawContent).replace(/\[SHOW_CART_ACTION:[^\]]+\]/gi, "")
        .replace(/\[SHOW_FORM:booking\]/gi, "[SHOW_BOOKING_LINK]")
        .replace(/\[SHOW_FORM:fitout\]/gi, "[SHOW_CUSTOM_QUOTE_LINK]");
      if (/(?:(?:AED|dirhams?|درهم|دراهم|د\.?\s*إ)[^\n]{0,30}[\d٠-٩۰-۹]|[\d٠-٩۰-۹][^\n]{0,30}(?:AED|dirhams?|درهم|دراهم)|50\s*%.*(?:upfront|confirmation|deposit)|50\s*\/\s*50)/i.test(rawContent)) {
        rawContent = `Exact residential prices are calculated on the booking page. No upfront payment is required. ${residentialTerms} [SHOW_BOOKING_LINK]`;
      }
      res.write(`data: ${JSON.stringify({ content: rawContent })}\n\n`);

      // Sign ALL SHOW_CART_ACTION markers in the response (main service + any add-ons).
      // Each token is sent as a separate SSE event keyed by serviceKey.
      const cartMarkerRegex = /\[SHOW_CART_ACTION:([^:]+):([^:]+):(\d+)\]/gi;
      let cartMatch;
      while ((cartMatch = cartMarkerRegex.exec(rawContent)) !== null) {
        const serviceKey = cartMatch[1].trim();
        const amountAed = parseInt(cartMatch[3], 10);
        if (CHECKOUT_SERVICES[serviceKey] && amountAed > 0) {
          const quoteToken = signQuote(serviceKey, amountAed);
          res.write(`data: ${JSON.stringify({ quoteToken, serviceKey, amountAed })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error: any) {
      console.error('Chat API error:', error?.message || error);
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: 'Chat unavailable' })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: 'Chat unavailable' });
      }
    }
  });

  // ─── Chat lead email endpoint ─────────────────────────────────────────────
  // ─── Stripe checkout ──────────────────────────────────────────────────────
  // Security model:
  //   1. The chat endpoint signs each quoted price with HMAC-SHA256 (signQuote above).
  //   2. The signed token is stored in the cart alongside serviceKey + amount.
  //   3. This endpoint VERIFIES the token before creating the Stripe session.
  //   4. Any tampering with serviceKey or amount invalidates the signature → rejected.
  //   5. Success/cancel URLs are server-controlled — never accepted from client.

  // Legacy Stripe code remains for existing orders/webhooks, but cannot accept
  // new residential upfront checkout. New payment requests require inspection completion.
  app.post('/api/checkout', (_req, res) => {
    res.status(410).json({ message: "Upfront checkout is unavailable. Book without payment at /book-inspection." });
  });
  app.post('/api/checkout', async (req, res) => {
    try {
      const { items } = req.body;

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }

      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

      for (const item of items) {
        const { serviceKey, quantity, unitAmount, quoteToken } = item;

        // 1. Only known services allowed
        const trusted = CHECKOUT_SERVICES[serviceKey];
        if (!trusted) {
          return res.status(400).json({ message: `Unknown service: ${serviceKey}` });
        }

        // 2. Quantity must be a positive integer
        const qty = parseInt(quantity, 10);
        if (!qty || qty < 1 || qty > 10) {
          return res.status(400).json({ message: 'Invalid quantity' });
        }

        // 3. Amount must be a positive whole AED number
        const amt = Math.round(Number(unitAmount));
        if (!Number.isFinite(amt) || amt <= 0) {
          return res.status(400).json({ message: 'Invalid amount' });
        }

        // 4. HMAC token must match — this is the tamper-proof check.
        //    The token was issued by the chat endpoint after Lena computed the price.
        //    Any modification of serviceKey or amount on the client will fail this check.
        if (!quoteToken || typeof quoteToken !== 'string' || !verifyQuote(serviceKey, amt, quoteToken)) {
          return res.status(400).json({ message: 'Invalid or expired quote. Please request a new price estimate from Nova.' });
        }

        lineItems.push({
          price_data: {
            currency: 'aed',
            product_data: { name: trusted.name },
            unit_amount: amt * 100,  // AED → fils (1 AED = 100 fils)
          },
          quantity: qty,
        });
      }

      const { getUncachableStripeClient } = await import('./stripeClient');
      const stripe = await getUncachableStripeClient();

      // Build a reliable HTTPS base URL.
      // In Replit deployments REPLIT_DOMAINS contains the canonical hostname.
      // In other proxied environments we honour X-Forwarded-Proto via trust proxy.
      // Never use req.protocol alone — it may return 'http' behind a proxy.
      const replitDomain = process.env.REPLIT_DOMAINS?.split(',')[0]?.trim();
      const base = replitDomain
        ? `https://${replitDomain}`
        : `${req.protocol === 'http' && req.get('x-forwarded-proto') === 'https' ? 'https' : req.protocol}://${req.get('host')}`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/checkout/cancel`,
        metadata: { source: 'urbangrid-website' },
        // Ask Stripe to auto-generate a PDF invoice for this payment
        invoice_creation: { enabled: true },
      });

      return res.json({ url: session.url });
    } catch (error: any) {
      console.error('Checkout error:', error?.message || error);
      return res.status(500).json({ message: 'Failed to create checkout session. Please try again.' });
    }
  });

  // ─── Checkout session details (for success page order summary) ─────────────
  app.get('/api/checkout/session', async (req, res) => {
    try {
      const { session_id } = req.query;
      if (!session_id || typeof session_id !== 'string') {
        return res.status(400).json({ message: 'Missing session_id' });
      }
      // Only allow Stripe session IDs (cs_test_* or cs_live_*)
      if (!/^cs_(test|live)_[A-Za-z0-9_]+$/.test(session_id)) {
        return res.status(400).json({ message: 'Invalid session_id' });
      }
      const { getUncachableStripeClient } = await import('./stripeClient');
      const stripe = await getUncachableStripeClient();
      const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ['line_items', 'invoice'],
      });
      // Extract invoice URLs if Stripe generated one
      const invoice = (session as any).invoice;
      const invoiceUrl: string | null =
        invoice && typeof invoice === 'object' ? (invoice.hosted_invoice_url ?? null) : null;
      const invoicePdfUrl: string | null =
        invoice && typeof invoice === 'object' ? (invoice.invoice_pdf ?? null) : null;
      // Return only safe fields — never expose raw session to client
      return res.json({
        status: session.payment_status,
        customerEmail: session.customer_details?.email ?? null,
        amountTotal: session.amount_total,
        currency: session.currency,
        lineItems: (session.line_items?.data ?? []).map((li: any) => ({
          description: li.description,
          amount: li.amount_total,
          quantity: li.quantity,
        })),
        invoiceUrl,
        invoicePdfUrl,
      });
    } catch (error: any) {
      console.error('Session fetch error:', error?.message || error);
      return res.status(500).json({ message: 'Could not retrieve session details' });
    }
  });

  app.post('/api/chat/lead', async (req, res) => {
    try {
      const {
        type, // 'booking' | 'fitout'
        name, phone, email,
        projectName, projectLocation, propertyType, bedrooms, sqft, inspectionDate,
        address, // fitout only
      } = req.body;

      if (!name || !phone || !email) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      let subject: string;
      let body: string;
      let estimate = '';

      if (type === 'booking') {
        const area = parseFloat(sqft) || 0;
        const serviceType: string = req.body.serviceType || '';

        const standard = serviceFromLabel(serviceType);
        const residential = ["Apartment", "Villa", "Townhouse", "Penthouse"].includes(propertyType);
        if (area > 0 && standard && residential) {
          const price = calculateInspectionPrice(standard, area);
          estimate = `\n\nFEE ESTIMATE — ${serviceType}:\n  Built-Up Area: ${area} sq.ft` +
            `\n  Fee (excl. VAT): ${formatAed(price.baseMinor)}\n  VAT (5%): ${formatAed(price.vatMinor)}` +
            `\n  Total (incl. VAT): ${formatAed(price.totalMinor)}\n  ${residentialTerms}`;
        } else {
          estimate = `\n\nPRICING: Custom Quote — team will prepare a personalised quote for this service.`;
        }

        subject = `New ${serviceType || 'Inspection'} Enquiry — ${name} (${projectLocation || 'UAE'})`;
        body = `New inspection lead received via the UrbanGrid website chatbot.

──────────────────────────────────────────
CUSTOMER DETAILS
──────────────────────────────────────────
Full Name        : ${name}
Phone            : ${phone}
Email            : ${email}

──────────────────────────────────────────
ENQUIRY DETAILS
──────────────────────────────────────────
Service Type     : ${serviceType || '—'}
Project Name     : ${projectName || '—'}
Project Location : ${projectLocation || '—'}
Property Type    : ${propertyType || '—'}
No. of Bedrooms  : ${bedrooms || '—'}
Built-Up Area    : ${sqft ? sqft + ' sq.ft' : '—'}${estimate}

──────────────────────────────────────────
INSPECTION PREFERENCE
──────────────────────────────────────────
Preferred Date/Time : ${inspectionDate || '—'}

──────────────────────────────────────────
Please follow up with the client at your earliest convenience.
UrbanGrid Chatbot — Auto-Generated Lead`;

      } else {
        // Fit-out lead
        subject = `New Fit-Out Enquiry — ${name}`;
        body = `New fit-out lead received via the UrbanGrid website chatbot.

──────────────────────────────────────────
CUSTOMER DETAILS
──────────────────────────────────────────
Full Name         : ${name}
Phone             : ${phone}
Email             : ${email}
Property Address  : ${address || '—'}

──────────────────────────────────────────
Please arrange a free site visit at your earliest convenience.
UrbanGrid Chatbot — Auto-Generated Lead`;
      }

      const { submission, created } = await storage.saveContactSubmission(insertContactSubmissionSchema.parse({
        name, email, phone, message: body,
        enquiryType: type === 'booking' ? (req.body.serviceType || 'Inspection enquiry') : 'Fit-out enquiry',
        leadSource: type === 'booking' ? 'chat_booking' : 'chat_fitout',
        attribution: req.body.attribution,
        submissionKey: req.body.submissionKey,
      }));
      if (type === "booking" && serviceFromLabel(req.body.serviceType || "") && submission.submissionKey) {
        req.session.pendingResidentialLead = { submissionKey: submission.submissionKey, email: submission.email };
      }
      const sent = !created || await sendEmail('info@urbangrid.ae', subject, body);
      if (!sent) logContactFallback(submission);
      res.status(created ? 201 : 200).json({ ok: true, emailed: sent, leadId: submission.id });
    } catch (err: any) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: "Invalid lead details", errors: err.errors });
      console.error('Chat lead email error:', err?.message || err);
      res.status(500).json({ ok: false, error: 'Failed to send lead email' });
    }
  });

  // Robots.txt
  app.get('/robots.txt', (_req, res) => {
    const robotsTxt = `User-agent: *\nAllow: /\nSitemap: https://urbangrid.ae/sitemap.xml\n`;
    res.setHeader('Content-Type', 'text/plain');
    res.send(robotsTxt);
  });

  // A concise, canonical index for AI assistants and answer engines.
  app.get('/llms.txt', (_req, res) => {
    res.type('text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(`# UrbanGrid Property Inspection

> UrbanGrid provides independent property snagging, handover inspection, building condition assessment, and technical due diligence services across the United Arab Emirates.

## Canonical entity
- Website: [UrbanGrid](https://urbangrid.ae/)
- About: [About UrbanGrid](https://urbangrid.ae/about)
- Contact and booking: [Contact and booking](https://urbangrid.ae/contact)
- Telephone: +971 58 568 6852
- WhatsApp: +971 56 742 7634
- Email: info@urbangrid.ae
- Primary office: Business Bay, Dubai, United Arab Emirates
- Service area: All seven UAE emirates

## Core services
- Service overview: [All services](https://urbangrid.ae/services)
- New-build snagging: [New-build snagging](https://urbangrid.ae/services/property-snagging/new-build-snagging)
- Post-renovation inspection: [Post-renovation inspection](https://urbangrid.ae/services/property-snagging/post-renovation-inspection)
- Secondary-market inspection: [Secondary-market inspection](https://urbangrid.ae/services/property-snagging/secondary-market)
- DLP inspection: [DLP inspection](https://urbangrid.ae/services/property-snagging/dlp-snagging)
- Move-in / move-out inspection: [Move-in / move-out inspection](https://urbangrid.ae/services/property-snagging/move-in-move-out)
- Developer and contractor snagging: [Developer projects](https://urbangrid.ae/services/property-snagging/developer-projects)
- Reserve fund study: [Reserve fund study](https://urbangrid.ae/services/rera-services/reserve-fund-study)
- Service charge allocation: [Service charge allocation](https://urbangrid.ae/services/rera-services/service-charge-allocation)
- Reinstatement cost assessment: [Reinstatement cost assessment](https://urbangrid.ae/services/rera-services/reinstatement-cost-assessment)
- Building completion audit: [Building completion audit](https://urbangrid.ae/services/rera-services/building-completion-audit)
- Building condition survey: [Building condition survey](https://urbangrid.ae/services/rera-services/building-condition-survey)
- Technical due diligence: [Technical due diligence](https://urbangrid.ae/services/technical-inspections/technical-due-diligence)
- Dilapidation survey: [Dilapidation survey](https://urbangrid.ae/services/technical-inspections/dilapidation-survey)
- Thermographic survey: [Thermographic survey](https://urbangrid.ae/services/technical-inspections/thermographic-survey)
- Noise survey: [Noise survey](https://urbangrid.ae/services/technical-inspections/noise-survey)
- Structural survey: [Structural survey](https://urbangrid.ae/services/technical-inspections/structural-survey)
- Asset tagging and inventory: [Asset tagging and inventory](https://urbangrid.ae/services/asset-tagging-inventory)

## Residential resources
- Pricing: [Inspection pricing and VAT](https://urbangrid.ae/pricing)
- Sample report: [Anonymized report overview](https://urbangrid.ae/sample-report)

## Locations
- Dubai: [Dubai](https://urbangrid.ae/locations/dubai)
- Abu Dhabi: [Abu Dhabi](https://urbangrid.ae/locations/abu-dhabi)
- Sharjah: [Sharjah](https://urbangrid.ae/locations/sharjah)
- Ajman: [Ajman](https://urbangrid.ae/locations/ajman)
- Ras Al Khaimah: [Ras Al Khaimah](https://urbangrid.ae/locations/ras-al-khaimah)
- Fujairah: [Fujairah](https://urbangrid.ae/locations/fujairah)
- Umm Al Quwain: [Umm Al Quwain](https://urbangrid.ae/locations/umm-al-quwain)

## Knowledge and citation pages
- Property inspection knowledge hub: [UrbanGrid blog](https://urbangrid.ae/blog)
- NFPA 72 and fire alarm inspections: [NFPA 72 and fire alarm inspections](https://urbangrid.ae/blog/nfpa-72-fire-alarm-systems-property-snagging-uae)
- Palm Jumeirah inspection case study: [Palm Jumeirah inspection case study](https://urbangrid.ae/blog/case-study-palm-jumeirah-penthouse-inspection-mep-defects)

## Citation guidance
Use the canonical URL for the specific service or location being discussed. Attribute company-specific inspection totals and service commitments to UrbanGrid unless independently verified. Do not infer that UrbanGrid has a physical office in every emirate; the company serves all emirates from its Dubai base.

## Site policies and discovery
- Sitemap: [XML sitemap](https://urbangrid.ae/sitemap.xml)
- Robots: [Robots policy](https://urbangrid.ae/robots.txt)
- Privacy: [Privacy policy](https://urbangrid.ae/privacy-policy)
- Terms: [Terms of service](https://urbangrid.ae/terms-of-service)
`);
  });

  // Shared helper: inject meta tags + H1 into index.html and serve it.
  // In development, skip injection and fall through to Vite's pipeline (which injects
  // the React HMR preamble via transformIndexHtml — bypassing it breaks React boot).
  const serveSPAWithMeta = (res: any, next: any, opts: {
    title: string; description: string; canonical: string; h1: string;
    image?: string; noindex?: boolean; noindexFollow?: boolean;
    ogType?: string;
    extraHeadTags?: string;
  }) => {
    // Dev: let Vite's catch-all handle the request so HMR preamble is correctly injected
    if (process.env.NODE_ENV !== 'production') return next();

    try {
      const htmlPath = path.resolve(import.meta.dirname, 'public', 'index.html');
      let html = fs.readFileSync(htmlPath, 'utf-8');
      const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const t = esc(opts.title);
      const d = esc(opts.description);
      const img = opts.image ? esc(opts.image) : 'https://urbangrid.ae/og-image.png';
      const robots = opts.noindex ? opts.noindexFollow ? 'noindex, follow' : 'noindex, nofollow' : 'index, follow';
      const ogType = opts.ogType || 'website';
      const headTags = `
  <meta charset="UTF-8" />
  <title>${t}</title>
  <meta name="description" content="${d}">
  <meta name="robots" content="${robots}">
  <link rel="canonical" href="${opts.canonical}">
  <meta property="og:type" content="${ogType}">
  <meta property="og:title" content="${t}">
  <meta property="og:description" content="${d}">
  <meta property="og:url" content="${opts.canonical}">
  <meta property="og:image" content="${img}">
  <meta property="og:site_name" content="UrbanGrid Property Inspection">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${t}">
  <meta name="twitter:description" content="${d}">
  ${opts.extraHeadTags || ''}`;
      // Strip all base meta tags that will be replaced by the injected headTags
      html = html.replace(/<meta charset="[^"]*"\s*\/?>\s*/gi, '');
      html = html.replace(/<title>[^<]*<\/title>\s*/i, '');
      html = html.replace(/<meta name="description"[^>]*>\s*/gi, '');
      html = html.replace(/<meta name="keywords"[^>]*>\s*/gi, '');
      html = html.replace(/<meta name="robots"[^>]*>\s*/gi, '');
      html = html.replace(/<meta name="author"[^>]*>\s*/gi, '');
      html = html.replace(/<link rel="canonical"[^>]*>\s*/gi, '');
      html = html.replace(/<meta property="og:[^"]*"[^>]*>\s*/gi, '');
      html = html.replace(/<meta name="twitter:[^"]*"[^>]*>\s*/gi, '');
      html = html.replace('<head>', `<head>${headTags}`);
      html = html.replace(
        /(<h1[^>]*data-ssr-page-heading[^>]*>)[\s\S]*?(<\/h1>)/i,
        `$1${esc(opts.h1)}$2`,
      );
      html = html.replace(
        /(<p[^>]*data-ssr-page-summary[^>]*>)[\s\S]*?(<\/p>)/i,
        `$1${d}$2`,
      );
      const publicPath = new URL(opts.canonical).pathname;
      html = preloadDubaiRoute(injectFirstPaint(html, publicPath), publicPath);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.send(html);
    } catch (err: any) {
      console.error('serveSPAWithMeta error:', err?.message || err);
      // Explicit 500 so the error is visible and Google doesn't index generic fallback tags
      res.status(500).setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.send(`<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="robots" content="noindex, nofollow"><title>Error</title></head>
<body><h1>Server Error</h1><p>Please try again later.</p></body></html>`);
    }
  };

  // Server-side rendered core pages for SEO (unique title, description, H1 per page)
  app.get("/book-inspection", (_req, res, next) => {
    res.set("X-Robots-Tag", "noindex, follow");
    serveSPAWithMeta(res, next, { title: "Book Your Inspection | UrbanGrid",
      description: "Book a standard residential inspection with exact area-based pricing including VAT. No upfront payment.",
      canonical: "https://urbangrid.ae/book-inspection", h1: "Book Your Inspection", noindex: true, noindexFollow: true });
  });
  app.get("/book-inspection/return", (_req, res, next) => {
    res.set("X-Robots-Tag", "noindex, nofollow").set("Cache-Control", "no-store");
    serveSPAWithMeta(res, next, { title: "Your Inspection Booking | UrbanGrid",
      description: "Private residential booking and post-inspection payment status.",
      canonical: "https://urbangrid.ae/book-inspection/return", h1: "Your Inspection Booking", noindex: true });
  });
  const corePages: Array<{ path: string; title: string; description: string; h1: string; noindex?: boolean }> = [
    { path: '/',                 title: 'Property Snagging Dubai & UAE | From AED 800 | UrbanGrid', h1: 'Property Snagging & Inspection Services in Dubai & UAE', description: 'Independent property snagging across Dubai, Abu Dhabi and the UAE. Engineer-led, photographic findings. Final report after inspection and full payment.', noindex: false },
    { path: '/about',            title: 'About UrbanGrid | Property Inspection Experts UAE',            h1: 'About UrbanGrid Property Inspection',                               description: 'Learn about UrbanGrid, an independent property inspection and snagging company serving all seven UAE emirates with documented engineering processes.', noindex: false },
    { path: '/services',         title: 'Property Inspection & Snagging Services in UAE | UrbanGrid', h1: 'Our Professional Services', description: 'Explore UrbanGrid\'s full range of property snagging, RERA compliance, and technical inspection services across Dubai, Abu Dhabi and the UAE.', noindex: false },
    { path: '/blog',             title: 'Property Inspection Blog | NFPA & ASHRAE | UrbanGrid UAE',            h1: 'Property Inspection & Compliance Blog',                             description: 'Expert articles on property inspection, snagging, NFPA 72, NFPA 25, ASHRAE 180 standards, and building compliance in the UAE.', noindex: false },
    { path: '/contact',          title: 'Contact UrbanGrid | Book a Property Inspection in UAE',                  h1: 'Contact UrbanGrid – Book an Inspection',                            description: 'Get in touch with UrbanGrid to schedule a property inspection or snagging service in Dubai, Abu Dhabi, Sharjah or anywhere across the UAE.', noindex: false },
    { path: '/careers',          title: 'Careers at UrbanGrid | Property Inspection Jobs in UAE',                 h1: 'Careers at UrbanGrid Property Inspection',                          description: 'Join the UrbanGrid team. We\'re hiring certified property inspectors and support staff across Dubai and the UAE. View open positions.', noindex: false },
    { path: '/broker-referrals', title: 'Broker Referral Program | Partner with UrbanGrid UAE',                  h1: 'Real Estate Broker Referral Program',                               description: 'Partner with UrbanGrid through our broker referral program. Earn rewards by connecting your clients with the UAE\'s leading property inspection service.', noindex: false },
    { path: '/privacy-policy',   title: 'Privacy Policy | UrbanGrid Property Inspection UAE',                    h1: 'Privacy Policy',                                                    description: 'Read UrbanGrid\'s privacy policy to understand how we collect, use and protect your personal information in line with UAE data protection laws.', noindex: false },
    { path: '/terms-of-service', title: 'Terms of Service | UrbanGrid Property Inspection UAE',                  h1: 'Terms of Service',                                                  description: 'Review the terms and conditions governing the use of UrbanGrid\'s property inspection services and website in the United Arab Emirates.', noindex: false },
  ];

  for (const page of corePages) {
    app.get(page.path, (req, res, next) => {
      const canonical = `https://urbangrid.ae${page.path === '/' ? '' : page.path}` || 'https://urbangrid.ae';
      const extraHeadTags = page.path === '/' ? homepageSchema() : undefined;
      return serveSPAWithMeta(res, next, {
        title: page.title,
        description: page.description,
        canonical: page.path === '/' ? 'https://urbangrid.ae/' : `https://urbangrid.ae${page.path}`,
        h1: page.h1,
        noindex: page.noindex,
        extraHeadTags,
      });
    });
  }

  for (const resource of Object.values(seoResources)) {
    app.get(resource.path, (_req, res, next) => serveSPAWithMeta(res, next, {
      title: resource.seoTitle, description: resource.description,
      canonical: `https://urbangrid.ae${resource.path}`, h1: resource.title, noindex: false,
      extraHeadTags: pageSchemaScript(resource.path, resource.title, resource.description),
    }));
  }

  // Server-side rendered location pages for SEO
  // These pages were previously returning 410 Gone in production.
  // They MUST be registered BEFORE the Vite catch-all so they get proper meta tags.
  const locationPages: Array<{ path: string; title: string; description: string; h1: string }> = [
    { path: '/locations/dubai',           title: 'Dubai Inspection Services & Community Coverage | UrbanGrid',          h1: 'Property Inspection Coverage Across Dubai',           description: 'Explore UrbanGrid\'s Dubai inspection coverage, communities and service options. Find handover, DLP and resale inspections and request a property quote.' },
    { path: '/locations/abu-dhabi',       title: 'Snagging Company Abu Dhabi | Property Inspection | UrbanGrid',              h1: 'Property Snagging & Inspection in Abu Dhabi',       description: 'Abu Dhabi\'s trusted property snagging company. Independent inspection across Yas Island, Al Reem, Saadiyat, Al Raha and all communities. Aldar, Imkan & all developers. Reports in 24 hours.' },
    { path: '/locations/sharjah',         title: 'Snagging Company Sharjah | Property Inspection Services | UrbanGrid',        h1: 'Property Snagging & Inspection in Sharjah',         description: 'Sharjah\'s trusted property snagging company. Independent inspection across Aljada, Hayyan, Maryam Island, Al Zahia and all Sharjah communities. Reports in 24 hours.' },
    { path: '/locations/ajman',           title: 'Snagging Company Ajman | Property Inspection Services | UrbanGrid',          h1: 'Property Snagging & Inspection in Ajman',           description: 'Professional property snagging and inspection in Ajman. ARRA-compliant process across Emirates City, Al Rashidiya, Al Nuaimia and all Ajman communities. Reports in 24 hours.' },
    { path: '/locations/ras-al-khaimah',  title: 'Snagging Company Ras Al Khaimah | Property Inspection | UrbanGrid',          h1: 'Property Snagging & Inspection in Ras Al Khaimah', description: 'Professional property snagging and inspection in Ras Al Khaimah. Al Hamra Village, Mina Al Arab, Al Marjan Island and all RAK communities. Engineer-led, reports in 24 hours.' },
    { path: '/locations/fujairah',        title: 'Snagging Company Fujairah | Property Inspection Services | UrbanGrid',      h1: 'Property Snagging & Inspection in Fujairah',       description: 'Professional property snagging and inspection in Fujairah. Engineer-led inspections across Fujairah City, Dibba, Al Aqah and all communities. Reports in 24 hours.' },
    { path: '/locations/umm-al-quwain',   title: 'Snagging Company Umm Al Quwain | Property Inspection | UrbanGrid',          h1: 'Property Snagging & Inspection in Umm Al Quwain',   description: 'Professional property snagging and inspection in Umm Al Quwain. Engineer-led inspections across UAQ City, Al Salam City, UAQ Marina and all communities. Reports in 24 hours.' },
  ];

  for (const page of locationPages) {
    app.get(page.path, (req, res, next) => {
      const emirate = page.path.replace('/locations/', '');
      const emirateTitle = emirate.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      return serveSPAWithMeta(res, next, {
        title: page.title,
        description: page.description,
        canonical: `https://urbangrid.ae${page.path}`,
        h1: page.h1,
        extraHeadTags: locationSchema(emirate, emirateTitle, page.description),
      });
    });
  }

  // Server-side rendered service detail pages for SEO
  // Must stay in sync with client/src/pages/ServiceDetail.tsx servicesData.
  // Only the 16 active service slugs are listed here. Dead slugs have been removed.
  const serviceSSRData: Record<string, { title: string; description: string; image: string; category: string }> = {
    // Property Snagging (6 services)
    'new-build-snagging':            { title: 'New Build Handover Snagging & Inspection', description: 'Comprehensive pre-handover inspection of newly constructed properties to identify defects, incomplete work, and quality issues before you take possession.', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&h=600', category: 'property-snagging' },
    'post-renovation-inspection':    { title: 'Post Renovation / Fit-out Snagging Inspection', description: 'Quality assessment after renovation or fit-out work to ensure all improvements meet specifications and industry standards.', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&h=600', category: 'property-snagging' },
    'dlp-snagging':                  { title: 'Property Defect Liability Period (DLP) Snagging', description: 'Strategic inspection during the defect liability period to identify and document all issues before warranty expires.', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&h=600', category: 'property-snagging' },
    'move-in-move-out':              { title: 'Property Move-in / Move-out Snagging', description: 'Detailed condition reports for rental properties to protect both tenants and landlords during property transitions.', image: 'https://images.unsplash.com/photo-1555636222-cae831e670b3?auto=format&fit=crop&w=1200&h=600', category: 'property-snagging' },
    'secondary-market':              { title: 'Secondary Market Property Snagging', description: 'Pre-purchase inspections for existing properties to help buyers make informed decisions and negotiate fair prices.', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&h=600', category: 'property-snagging' },
    'developer-projects':            { title: 'Developer and Contractor Project Snagging', description: 'Quality control inspections for developers and contractors to ensure projects meet industry standards and client expectations.', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&h=600', category: 'property-snagging' },

    // RERA Services (5 services)
    'reserve-fund-study':            { title: 'Reserve Fund Study / Sinking Fund', description: 'Comprehensive analysis of building reserve fund requirements and long-term capital expenditure planning for strata properties in compliance with RERA regulations.', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&h=600', category: 'rera-services' },
    'service-charge-allocation':     { title: 'Service Charge Cost Allocation', description: 'Detailed assessment and allocation of service charges across common property areas ensuring fair distribution and full compliance with RERA guidelines.', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&h=600', category: 'rera-services' },
    'reinstatement-cost-assessment': { title: 'Reinstatement Cost Assessment', description: 'Professional assessment of property reinstatement costs for insurance and RERA compliance purposes across Dubai and the UAE.', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&h=600', category: 'rera-services' },
    'building-completion-audit':     { title: 'Building Completion Audit', description: 'Comprehensive audit of building completion status verifying all regulatory requirements and quality standards before final handover.', image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&h=600', category: 'rera-services' },
    'building-condition-survey':     { title: 'Building Condition Survey', description: 'Detailed assessment of building condition covering structural, MEP, and finish elements for maintenance planning and compliance reporting.', image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&h=600', category: 'rera-services' },

    // Technical Inspections (5 services)
    'technical-due-diligence':       { title: 'Technical Due Diligence', description: 'In-depth technical assessment for property acquisitions and investments, evaluating structural integrity, MEP systems, and compliance status.', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&h=600', category: 'technical-inspections' },
    'dilapidation-survey':           { title: 'Dilapidation Survey', description: 'Pre and post-construction condition surveys documenting existing property state to protect against damage claims during adjacent development works.', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&h=600', category: 'technical-inspections' },
    'thermographic-survey':          { title: 'Thermographic Survey', description: 'Infrared thermal imaging inspections to detect hidden moisture, insulation defects, electrical hotspots, and energy efficiency issues.', image: 'https://images.unsplash.com/photo-1516747773446-6e5c6c7d5c2e?auto=format&fit=crop&w=1200&h=600', category: 'technical-inspections' },
    'noise-survey':                  { title: 'Noise Survey', description: 'Professional acoustic and noise level surveys for residential and commercial properties ensuring compliance with UAE environmental standards.', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&h=600', category: 'technical-inspections' },
    'structural-survey':             { title: 'Structural Survey', description: 'Detailed structural engineering assessment examining building integrity, load-bearing elements, and compliance with international standards.', image: 'https://images.unsplash.com/photo-1581094613018-d1db5d0b5b30?auto=format&fit=crop&w=1200&h=600', category: 'technical-inspections' },
  };

  app.get(assetTaggingService.path, (_req, res, next) => {
    return serveSPAWithMeta(res, next, {
      title: assetTaggingService.seoTitle,
      description: assetTaggingService.description,
      canonical: `https://urbangrid.ae${assetTaggingService.path}`,
      h1: assetTaggingService.title,
      extraHeadTags: `<script id="asset-tagging-schema" type="application/ld+json">${JSON.stringify(assetTaggingSchema()).replace(/</g, '\\u003c')}</script>`,
    });
  });

  app.get('/services/:category/:slug', (req, res, next) => {
    const { category, slug } = req.params;
    const svc = serviceSSRData[slug];
    if (!svc || svc.category !== category) {
      // Explicit 404 so Google does not index generic fallback tags as a soft-404
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(404).send(`<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="robots" content="noindex, nofollow"><title>404 Not Found | UrbanGrid</title></head>
<body><h1>404 Not Found</h1><p>The page you requested does not exist. Visit <a href="https://urbangrid.ae/services">our services</a> or the <a href="https://urbangrid.ae/">homepage</a>.</p></body></html>`);
    }
    const rawDesc = svc.description.length > 158 ? svc.description.slice(0, 155) + '...' : svc.description;
    const serviceCategory = category === 'property-snagging' ? 'Property Snagging' :
                           category === 'rera-services' ? 'RERA Services' :
                           category === 'technical-inspections' ? 'Technical Inspections' : 'Property Inspection';
    const servicePath = `/services/${category}/${slug}`;
    return serveSPAWithMeta(res, next, {
      title: `${svc.title} | UrbanGrid UAE`,
      description: rawDesc,
      canonical: `https://urbangrid.ae${servicePath}`,
      h1: svc.title,
      image: svc.image,
      extraHeadTags: serviceSchema(servicePath, svc.title, rawDesc, serviceCategory, `https://urbangrid.ae${servicePath}`),
    });
  });

  // Server-side rendered blog pages for SEO
  app.get('/blog/:slug', async (req, res, next) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);

      if (!post) {
        // Blog slug not found in DB: treat as permanently removed (matches API 410 behavior).
        // These slugs were previously published and removed during the 186→31 URL trim.
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('X-Robots-Tag', 'noindex, nofollow');
        return res.status(410).send(`<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="robots" content="noindex, nofollow"><title>Removed | UrbanGrid</title></head>
<body><h1>Permanently Removed</h1><p>This blog post has been permanently removed. Visit <a href="https://urbangrid.ae/blog">our blog</a> or the <a href="https://urbangrid.ae/">homepage</a>.</p></body></html>`);
      }

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
      const image = post.featuredImage || 'https://urbangrid.ae/og-image.png';
      const datePublished = post.createdAt ? new Date(post.createdAt).toISOString() : new Date().toISOString();
      const dateModified = post.updatedAt ? new Date(post.updatedAt).toISOString() : datePublished;
      const authorName = 'UrbanGrid Editorial Team';
      const jsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": desc,
        "image": image,
        "url": canonical,
        "datePublished": datePublished,
        "dateModified": dateModified,
        "author": {
          "@type": "Organization",
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
      const extraHeadTags = `
  <meta property="article:published_time" content="${datePublished}">
  <meta property="article:modified_time" content="${dateModified}">
  <meta property="article:author" content="${authorName.replace(/"/g, '&quot;')}">
  <script type="application/ld+json">${jsonLd}</script>`;
      return serveSPAWithMeta(res, next, {
        title,
        description: desc,
        canonical,
        h1: post.title,
        image,
        ogType: 'article',
        extraHeadTags,
      });
    } catch (error: any) {
      console.error("Error rendering blog page:", error?.message || error);
      // Explicit 500 so errors are visible and not silently masked by generic SPA tags
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(500).send(`<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="robots" content="noindex, nofollow"><title>Error</title></head>
<body><h1>Server Error</h1><p>Please try again later.</p></body></html>`);
    }
  });

  // Known admin SPA pages may boot publicly; all data APIs still require admin auth.
  // Keep the exact allowlist so unrelated unknown URLs remain genuine 404s.
  for (const path of ["/admin", "/admin/login", "/admin/leads", "/admin/bookings", "/admin/acquisition", "/admin/add-blog",
    "/admin/manage-blogs", "/admin/manage-inspectors", "/admin/visibility"]) {
    app.get(path, (_req, res, next) => {
      res.setHeader("X-Robots-Tag", "noindex, nofollow");
      if (process.env.NODE_ENV !== "production") return next();
      return serveSPAWithMeta(res, next, {
        title: "UrbanGrid Administration",
        description: "Private UrbanGrid administration.",
        canonical: `https://urbangrid.ae${path}`,
        h1: "UrbanGrid Administration", noindex: true,
      });
    });
  }

  // Final 404 catch-all for unknown GET pages (production only).
  // In dev, Vite's catch-all must handle the SPA — bypassing it breaks React boot.
  // In production, this prevents soft-404s where Google indexes generic tags.
  app.use((req, res, next) => {
    if (process.env.NODE_ENV !== 'production') return next();
    if (req.method !== 'GET') return next();
    const p = req.path;
    if (
      p.startsWith('/api') ||
      p.startsWith('/__repl') ||
      p.startsWith('/@') ||
      p.startsWith('/@fs') ||
      p.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|json|xml|txt|pdf|webp|map|ts|tsx|jsx)$/)
    ) {
      return next();
    }
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(404).send(`<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="robots" content="noindex, nofollow"><title>404 Not Found | UrbanGrid</title></head>
<body><h1>404 Not Found</h1><p>The page you requested does not exist. Visit <a href="https://urbangrid.ae/">our homepage</a> or <a href="https://urbangrid.ae/services">our services</a>.</p></body></html>`);
  });

  const httpServer = createServer(app);
  return httpServer;
}
