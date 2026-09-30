import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import crypto from "crypto";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { db } from "./db";
import { visitorLogs } from "@shared/schema";
import { startVisitorReportScheduler } from "./visitorReport";
import { WebhookHandlers } from "./webhookHandlers";

const app = express();

// Trust the first proxy hop so req.protocol correctly reflects HTTPS behind Replit/nginx.
// This is required for Stripe checkout return URLs to use https://.
app.set('trust proxy', 1);

// Health check endpoint — must be before all other middleware
app.get("/health", (_req, res) => {
  res.status(200).send("OK");
});

// ── Stripe webhook — MUST be registered BEFORE express.json() ─────────────────
// Stripe requires the raw Buffer body to verify the signature.
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["stripe-signature"];
    if (!signature) {
      return res.status(400).json({ error: "Missing stripe-signature header" });
    }
    try {
      const sig = Array.isArray(signature) ? signature[0] : signature;
      await WebhookHandlers.processWebhook(req.body as Buffer, sig);
      res.status(200).json({ received: true });
    } catch (error: any) {
      console.error("Stripe webhook error:", error.message);
      res.status(400).json({ error: "Webhook processing failed" });
    }
  }
);

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
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://googleads.g.doubleclick.net https://www.googleadservices.com https://replit.com https://bzrcdn.openai.com",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "img-src 'self' data: blob: https: https://bzr.openai.com",
      "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://www.google.com https://googleads.g.doubleclick.net https://ad.doubleclick.net https://stats.g.doubleclick.net https://*.replit.dev wss://*.replit.dev https://bzr.openai.com https://bzrcdn.openai.com",
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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  if (req.path === "/health") return next();

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

    if (res.statusCode < 400) {
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

// ── Stripe initialisation (non-blocking on startup) ────────────────────────────
async function initStripe() {
  try {
    const { runMigrations } = await import('stripe-replit-sync');
    const { getStripeSync } = await import('./stripeClient');
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error('DATABASE_URL required');

    await runMigrations({ databaseUrl, schema: 'stripe' });
    const stripeSync = await getStripeSync();
    const webhookBase = `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;
    await stripeSync.findOrCreateManagedWebhook(`${webhookBase}/api/stripe/webhook`);
    stripeSync.syncBackfill().catch((e: any) => console.error('Stripe backfill error:', e));
    log('Stripe initialised');
  } catch (e: any) {
    // Non-fatal — app works without Stripe if not yet connected
    log(`Stripe init skipped: ${e.message}`);
  }
}

(async () => {
  // Init Stripe in background — don't block server startup
  initStripe();

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
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
    startVisitorReportScheduler();
  });
})();
