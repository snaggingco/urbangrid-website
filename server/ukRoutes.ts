import { createServer, type Server } from "node:http";
import type { Express, RequestHandler } from "express";
import { z } from "zod";
import { databaseConfigured } from "./db";
import { storage } from "./storage";
import { setupLocalAuth, isAdminAuthenticated } from "./adminAuth";
import { registerLeadRoutes } from "./leadRoutes";
import { insertContactSubmissionSchema, insertBlogPostSchema } from "@shared/schema";
import { canonicalOrigin, centralLoginUrl } from "@shared/siteConfig";
import { generateSitemap, getSitemapUrls } from "./sitemap";
import { getNetworkDeliveryHealth } from "./networkGatewayHealth";
import { networkRuntime } from "./network/runtime";
import { ukEnvironment } from "./ukRuntime";
import { registerUkPublicPages } from "./ukPublicPages";
import { ukAssistantReply } from "./ukAssistant";
import { sendUkEnquiryNotification } from "./ukEmail";

const adminConfigured = databaseConfigured && Boolean(process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32);
const unavailable = {
  message: "Online enquiries are not available yet. Please call UrbanGrid UK on +44 7436 597890.",
  code: "UK_DATABASE_NOT_CONFIGURED",
};
const protectedResponse = (_req: unknown, res: any) => res.status(410).set("Cache-Control", "no-store").json({
  message: "UK services are enquiry-led. Online booking and payment are disabled.", enquiryUrl: "/contact",
});
const hits = new Map<string, { count: number; until: number }>();
const limit: RequestHandler = (req, res, next) => {
  const now = Date.now(), key = req.ip || "unknown";
  hits.forEach((value, ip) => { if (value.until <= now) hits.delete(ip); });
  if (!hits.has(key) && hits.size >= 10000) return res.status(429).json({ message: "Please try again later." });
  const value = hits.get(key) || { count: 0, until: now + 600000 };
  hits.set(key, value);
  if (++value.count > 30) return res.status(429).json({ message: "Please wait before submitting another enquiry." });
  next();
};
const sameOrigin: RequestHandler = (req, res, next) => {
  try {
    const origin = new URL(req.get("origin") || "");
    if (origin.host === req.get("host") && ["https:", ...(process.env.NODE_ENV === "development" ? ["http:"] : [])].includes(origin.protocol)) return next();
  } catch { /* No missing-origin mutation exceptions. */ }
  res.status(403).json({ message: "A same-origin request is required." });
};

export async function registerRoutes(app: Express): Promise<Server> {
  app.use((req, res, next) => {
    res.set("X-Content-Type-Options", "nosniff");
    if (req.path.startsWith("/api/") || req.path.startsWith("/admin")) res.set("Cache-Control", "no-store").set("X-Robots-Tag", "noindex, nofollow");
    const host = (req.get("host") || "").split(":")[0].toLowerCase();
    if (["GET", "HEAD"].includes(req.method) && !req.path.startsWith("/api/")) {
      const clean = req.path.replace(/\/+$/, "") || "/";
      if (host === "www.urbangrid.co.uk" || (host === "urbangrid.co.uk" && clean !== req.path)) {
        const query = req.originalUrl.includes("?") ? req.originalUrl.slice(req.originalUrl.indexOf("?")) : "";
        return res.redirect(301, `${canonicalOrigin}${clean}${query}`);
      }
    }
    next();
  });
  app.all(/^\/api\/(?:bookings|checkout|stripe|ziina)(?:\/|$)/, protectedResponse);
  app.all(/^\/api\/admin\/(?:bookings|integrations\/operations)(?:\/|$)/, protectedResponse);
  app.get(/^\/(?:book-inspection|checkout|booking-access)(?:\/|$)/, (_req, res) =>
    res.set("X-Robots-Tag", "noindex, nofollow").redirect(302, "/contact"));
  app.get(/^\/(?:broker-referrals|careers)$/, (_req, res) => res.redirect(302, "/contact"));
  app.get("/sample-report", (_req, res) => res.status(410).set("X-Robots-Tag", "noindex").send("No approved UK sample report is currently published."));
  app.get(/^\/locations\/(?!london(?:\/|$))/, (_req, res) =>
    res.status(410).set("X-Robots-Tag", "noindex, nofollow").type("html").send(
      '<!doctype html><title>Location unavailable | UrbanGrid UK</title><h1>This location is not part of our UK site</h1><a href="/locations/london">London coverage</a>',
    ));
  app.all("/api/sample-report-download", (_req, res) => res.status(410).json({ message: "No approved UK sample report is available. Please enquire about reporting." }));
  app.get("/login", (_req, res) => res.redirect(302, centralLoginUrl));
  app.get("/api/launch-readiness", (_req, res) => {
    const networkConfigured = Boolean(databaseConfigured && networkRuntime(ukEnvironment(process.env)));
    res.status(databaseConfigured && networkConfigured ? 200 : 503).json({
      country: "GB", currency: "GBP", timezone: "Europe/London", mode: "enquiries",
      databaseConfigured, networkConfigured, onlineBookingEnabled: false, onlinePaymentEnabled: false,
      note: "Configuration does not establish successful delivery, legal review or launch acceptance.",
    });
  });
  app.get("/api/auth/user", (_req, res, next) => {
    if (!databaseConfigured) return res.status(401).json({ message: "Unauthorized" });
    next();
  });
  app.use("/api", (req, res, next) => {
    if (!databaseConfigured && !(req.method === "GET" && /^\/blog(?:\/|$)/.test(req.path)) &&
        req.path !== "/chat") return res.status(503).json(unavailable);
    next();
  });
  if (adminConfigured) await setupLocalAuth(app);
  app.get("/api/auth/user", (req, res) => {
    if (!req.isAuthenticated?.()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    res.json({ id: user.claims?.sub, email: user.claims?.email, role: user.claims?.role, type: user.type });
  });
  app.use("/api/admin", (_req, res, next) => adminConfigured ? next() : res.status(503).json({ message: "UK admin session configuration is incomplete; enquiries remain saved in the UK database." }));
  app.use("/api/admin", (req, res, next) =>
    ["GET", "HEAD", "OPTIONS"].includes(req.method) || req.path === "/login" ? next() : sameOrigin(req, res, next));
  registerLeadRoutes(app, isAdminAuthenticated);
  app.get("/api/admin/network-gateway-health", isAdminAuthenticated, async (_req, res) => {
    try { res.json(await getNetworkDeliveryHealth()); }
    catch { res.status(503).json({ message: "Network status unavailable" }); }
  });
  const endpointSources: Record<string, string> = {
    "/api/contact": "contact", "/api/consultation": "consultation",
    "/api/quick-contact": "quick_contact", "/api/chat/lead": "chat_enquiry",
    "/api/career-application": "career_application",
  };
  for (const [endpoint, defaultSource] of Object.entries(endpointSources)) {
    app.post(endpoint, limit, sameOrigin, async (req, res) => {
      try {
        const source = defaultSource === "contact" && ["london_quote", "broker_referral"].includes(req.body.leadSource)
          ? req.body.leadSource : defaultSource;
        const input = insertContactSubmissionSchema.parse({
          ...req.body, name: req.body.name || req.body.fullName,
          enquiryType: req.body.enquiryType || req.body.serviceType || req.body.position || "General Enquiry",
          message: req.body.message || req.body.coverLetter || (defaultSource === "career_application"
            ? `Career application for ${String(req.body.position || "an available role").slice(0, 100)}`
            : "Please contact me to discuss a custom quote."),
          leadSource: source,
        });
        const { submission, created } = await storage.saveContactSubmission(input);
        if (created) void sendUkEnquiryNotification(submission).catch(() =>
          console.warn("UK staff notification unavailable; enquiry retained in the UK dashboard."));
        res.status(created ? 201 : 200).json({
          ok: true, message: "Your UK enquiry has been received. The team will discuss scope and provide a custom quote.",
          leadId: submission.id,
        });
      } catch (error) {
        if (error instanceof z.ZodError) return res.status(400).json({ message: "Please check your enquiry details.", errors: error.flatten().fieldErrors });
        console.warn("UK enquiry could not be saved.");
        res.status(503).json({ message: "Your enquiry could not be confirmed. Please retry or call +44 7436 597890." });
      }
    });
  }
  app.post("/api/chat", limit, async (req, res) => {
    const parsed = z.object({ messages: z.array(z.object({
      role: z.enum(["user", "assistant"]), content: z.string().max(10000),
    })).min(1).max(30) }).safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Valid chat messages are required." });
    const latest = [...parsed.data.messages].reverse().find(m => m.role === "user");
    res.type("text/event-stream").set("Cache-Control", "no-store");
    res.write(`data: ${JSON.stringify({ content: ukAssistantReply(latest?.content || "") })}\n\n`);
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  });
  app.post("/api/track-conversion", (_req, res) => res.status(410).json({
    message: "UK analytics destinations have not been configured. No UAE tracking is used.",
  }));

  const blogQuery = z.object({
    page: z.coerce.number().int().min(1).max(100000).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(9),
    category: z.string().max(100).optional(), search: z.string().max(200).optional(),
    status: z.enum(["draft", "published"]).optional(),
  });
  for (const admin of [false, true]) {
    const prefix = admin ? "/api/admin/blog" : "/api/blog";
    app.get(prefix, ...(admin ? [isAdminAuthenticated] : []), async (req, res) => {
      try {
        const query = blogQuery.parse(req.query);
        if (!databaseConfigured) return res.json({ posts: [], total: 0, page: query.page, pages: 0 });
        const filter = { ...query, status: admin ? query.status : "published", offset: (query.page - 1) * query.limit };
        const [posts, total] = await Promise.all([storage.getBlogPosts(filter), storage.getBlogPostsCount(filter)]);
        res.json({ posts, total, page: query.page, pages: Math.ceil(total / query.limit) });
      } catch { res.status(400).json({ message: "Unable to load UK articles." }); }
    });
  }
  app.get("/api/blog/:slug", async (req, res) => {
    const post = databaseConfigured ? await storage.getBlogPostBySlug(req.params.slug).catch(() => undefined) : undefined;
    if (!post || post.status !== "published") return res.status(404).json({ message: "UK article not found" });
    res.json(post);
  });
  app.get("/api/admin/blog/:id", isAdminAuthenticated, async (req, res) => {
    const id = z.coerce.number().int().positive().safeParse(req.params.id);
    if (!id.success) return res.status(400).json({ message: "Invalid article ID" });
    const post = await storage.getBlogPost(id.data);
    res.status(post ? 200 : 404).json(post || { message: "Article not found" });
  });
  app.post("/api/admin/blog", isAdminAuthenticated, async (req, res) => {
    try {
      const post = insertBlogPostSchema.parse({ ...req.body, authorId: (req.user as any).claims.sub });
      res.status(201).json(await storage.createBlogPost(post));
    } catch { res.status(400).json({ message: "Article could not be created" }); }
  });
  app.patch("/api/admin/blog/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const id = z.coerce.number().int().positive().parse(req.params.id);
      const post = await storage.updateBlogPost(id, insertBlogPostSchema.partial().parse(req.body));
      res.status(post ? 200 : 404).json(post || { message: "Article not found" });
    } catch { res.status(400).json({ message: "Article could not be updated" }); }
  });
  app.delete("/api/admin/blog/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const removed = await storage.deleteBlogPost(z.coerce.number().int().positive().parse(req.params.id));
      res.status(removed ? 200 : 404).json({ success: removed });
    } catch { res.status(400).json({ message: "Article could not be deleted" }); }
  });
  app.get("/api/admin/stats", isAdminAuthenticated, async (_req, res) => {
    const [totalBlogs, publishedBlogs, totalContacts] = await Promise.all([
      storage.getBlogPostsCount(), storage.getBlogPostsCount({ status: "published" }), storage.getContactSubmissionsCount(),
    ]);
    res.json({ totalBlogs, publishedBlogs, totalContacts, totalInspectors: 0 });
  });
  app.get("/sitemap.xml", async (_req, res) => {
    const posts = databaseConfigured ? await storage.getBlogPosts({ status: "published", limit: 1000 }).catch(() => []) : [];
    res.type("application/xml").send(generateSitemap(getSitemapUrls(canonicalOrigin,
      posts.map(p => ({ slug: p.slug, updatedAt: p.updatedAt || p.createdAt || new Date() })))));
  });
  app.get(/^\/(?:sitemap[_-]index|sitemaps|sitemap1|post-sitemap|page-sitemap|category-sitemap|news-sitemap|video-sitemap|image-sitemap)\.xml$/,
    (_req, res) => res.redirect(301, "/sitemap.xml"));
  app.get("/blog/:slug", async (req, res, next) => {
    const post = databaseConfigured ? await storage.getBlogPostBySlug(req.params.slug).catch(() => undefined) : undefined;
    if (!post || post.status !== "published") return res.status(404).set("X-Robots-Tag", "noindex, nofollow")
      .type("html").send('<!doctype html><title>Article not found | UrbanGrid UK</title><h1>Article not found</h1><a href="/services">Explore UK services</a>');
    next();
  });
  registerUkPublicPages(app);
  // Missing APIs must never return the HTML shell with a misleading 200.
  app.use("/api", (_req, res) => res.status(404).json({ message: "Endpoint not available in the UK application." }));
  return createServer(app);
}
