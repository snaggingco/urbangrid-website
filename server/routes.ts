import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupLocalAuth } from "./adminAuth";
import { insertBlogPostSchema, insertContactSubmissionSchema } from "@shared/schema";
import { z } from "zod";
import nodemailer from "nodemailer";
import { generateSitemap, getSitemapUrls } from "./sitemap";

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
  // Auth middleware
  setupLocalAuth(app);

  // Auth routes - only local admin auth
  app.get('/api/auth/user', async (req: any, res) => {
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

      if (!post || post.status !== 'published') {
        return res.status(404).json({ message: "Blog post not found" });
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

  // Sitemap.xml endpoint
  app.get('/sitemap.xml', async (req, res) => {
    try {
      const protocol = req.get('x-forwarded-proto') || req.protocol;
      const host = req.get('host');
      const baseUrl = `${protocol}://${host}`;

      // Get published blog posts for sitemap
      const blogPosts = await storage.getBlogPosts({
        status: 'published',
        limit: 1000 // Get all published posts
      });

      const urls = getSitemapUrls(baseUrl, blogPosts);
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
    const baseUrl = `${protocol}://${host}`;

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

  const httpServer = createServer(app);
  return httpServer;
}