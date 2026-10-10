import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import crypto from "crypto";
import { registerRoutes } from "./ukRoutes";
import { setupVite, serveStatic, log } from "./vite";
import { db, pool, databaseConfigured } from "./db";
import { visitorLogs } from "@shared/schema";
import { startNetworkLeadWorker } from "./networkLeadSync";
import { BUILD_STAMP } from "./buildStamp";
import { assertUkApplication } from "./ukRuntime";

assertUkApplication(process.env);
const app = express();

// Trust the first proxy hop so req.protocol correctly reflects HTTPS behind Replit/nginx.
// This is required for Stripe checkout return URLs to use https://.
app.set('trust proxy', 1);

// Health check endpoint — must be before all other middleware
app.get("/health", (_req, res) => {
  res.status(200).send("OK");
});
app.get("/api/build-info", (_req, res) => {
  res.set("Cache-Control", "no-store").status(200).json(BUILD_STAMP);
});

// Enquiries-only UK launch: no inherited Stripe/Ziina webhooks or checkout.

// gzip / brotli compression for all responses
app.use(compression());

// Security headers middleware
app.use((_req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), usb=()'
  );
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://googleads.g.doubleclick.net https://www.googleadservices.com https://www.google.com https://replit.com https://bzrcdn.openai.com",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "img-src 'self' data: blob: https: https://bzr.openai.com",
      "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://www.google.com https://googleads.g.doubleclick.net https://ad.doubleclick.net https://stats.g.doubleclick.net https://pagead2.googlesyndication.com https://www.googleadservices.com https://*.replit.dev wss://*.replit.dev https://bzr.openai.com https://bzrcdn.openai.com",
      "frame-src 'self' https://www.googletagmanager.com https://td.doubleclick.net https://www.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://checkout.stripe.com",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join('; ')
  );
  next();
});

app.use(express.json({ verify: (req, _res, buffer) => {
  if (req.url === "/api/ziina/webhook") (req as typeof req & { rawBody?: Buffer }).rawBody = Buffer.from(buffer);
} }));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  if (req.path === "/health" || req.path.startsWith("/booking-access/") ||
      req.path.startsWith("/api/admin/login") || req.path === "/api/admin/logout" ||
      req.path === "/api/auth/user") return next();

  const start = Date.now();
  const path = req.path;
  const getClientIP = (req: any) => {
    return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
           req.headers['x-real-ip'] ||
           req.connection?.remoteAddress ||
           req.socket?.remoteAddress ||
           req.ip ||
           'unknown';
  };

  const clientIP = getClientIP(req);
  const anonymousVisitorId = crypto
    .createHmac("sha256", process.env.SESSION_SECRET!)
    .update(String(clientIP))
    .digest("hex")
    .slice(0, 32);

  res.on("finish", () => {
    const duration = Date.now() - start;
    let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
    if (logLine.length > 120) {
      logLine = logLine.slice(0, 119) + "…";
    }
    log(logLine);

    if (databaseConfigured && res.statusCode < 400 && path.startsWith("/api/")) {
      db.insert(visitorLogs).values({
        ipAddress: anonymousVisitorId,
        userAgent: null,
        path: path,
        method: req.method,
        statusCode: res.statusCode.toString(),
        responseTime: `${duration}ms`,
        referer: null,
      }).catch(error => {
        console.error("Failed to store visitor log:", error);
      });
    }
  });

  next();
});

(async () => {
  // Ensure every accepted enquiry is backed by a durable queue.
  // SQL is additive and idempotent; never run a destructive schema push.
  if (databaseConfigured) {
    await pool.query("SELECT 1 FROM contact_submissions LIMIT 0");
    await pool.query("SELECT 1 FROM website_lead_outbox LIMIT 0");
  }
  else log("UK onboarding incomplete: static preview only; submissions and admin access are disabled.");

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    console.error("Request failed:", status);
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
    if (databaseConfigured) startNetworkLeadWorker();
  });
})();
