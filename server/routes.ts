import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { setupLocalAuth } from "./adminAuth";
import { insertBlogPostSchema, insertContactSubmissionSchema } from "@shared/schema";
import { z } from "zod";

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

// Email sending function (mock for now, replace with actual email service)
async function sendEmail(to: string, subject: string, content: string) {
  console.log(`Sending email to ${to}: ${subject}\n${content}`);
  // TODO: Implement actual email sending using Nodemailer or similar
  return true;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);
  setupLocalAuth(app);

  // Auth routes - handle both Replit auth and local admin auth
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // Check if user is authenticated
      if (req.isAuthenticated() && req.user) {
        // Local admin authentication
        if (req.user.claims?.sub === 'super-admin') {
          return res.json({
            id: 'super-admin',
            email: 'admin@urbangrid.ae',
            firstName: 'Arif',
            lastName: 'Admin',
            role: 'admin',
            profileImageUrl: null
          });
        }
        
        // Replit authentication
        if (req.user.claims?.sub && req.user.claims.sub !== 'super-admin') {
          const userId = req.user.claims.sub;
          const user = await storage.getUser(userId);
          if (user) {
            return res.json(user);
          }
        }
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
  app.get('/api/admin/blog', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

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

  app.get('/api/admin/blog/:id', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

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

  app.post('/api/admin/blog', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

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

  app.put('/api/admin/blog/:id', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

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

  app.delete('/api/admin/blog/:id', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

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

      await sendEmail('info@urbangrid.ae', 'New Contact Form Submission', emailContent);

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

      await sendEmail('info@urbangrid.ae', 'New Free Consultation Request', emailContent);

      res.status(201).json({ message: "Thank you! We'll contact you soon for your free consultation." });
    } catch (error) {
      console.error("Error handling consultation request:", error);
      res.status(500).json({ message: "Failed to submit request. Please try again." });
    }
  });

  // Admin dashboard stats
  app.get('/api/admin/stats', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

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

  const httpServer = createServer(app);
  return httpServer;
}
