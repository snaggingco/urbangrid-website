import type { RequestHandler } from "express";
import { resolveSiteIdentity, websiteDatabaseUrl } from "./runtime";

type Environment = Readonly<Record<string, string | undefined>>;
export type WebsiteMarket = "AE" | "SA";

/** The Saudi adapter shares public content/lead storage, not UAE commercial integrations. */
export function websiteMarket(env: Environment): WebsiteMarket {
  const code = (env.URBANGRID_COUNTRY_CODE ||
    resolveSiteIdentity(env)?.countryCode ||
    (env.NODE_ENV === "development" ? "AE" : "")).toUpperCase();
  if (code !== "AE" && code !== "SA") throw new Error("Website application market is unsupported");
  websiteDatabaseUrl(env);
  return code;
}

export function countrySafetyMiddleware(market: WebsiteMarket): RequestHandler {
  return (req, res, next) => {
    if (market === "AE") return next();
    // These handlers contain UAE prices, gateways, report access or staff notifications.
    // Refuse explicitly rather than running them with inherited UAE credentials.
    if (/^\/api\/(?:bookings|checkout|chat|stripe|ziina|inspector|inspectors|operations)(?:\/|$)/i.test(req.path) ||
        /^\/api\/admin\/(?:bookings|booking-leads|inspectors|operations|visibility)(?:\/|$)/i.test(req.path) ||
        /^\/booking-access(?:\/|$)/i.test(req.path) ||
        req.path === "/api/career-application") {
      return res.status(503).json({
        message: "This service requires Saudi-specific configuration and is not yet available.",
      });
    }
    next();
  };
}
