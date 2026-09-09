import type { Express, RequestHandler } from "express";
import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "./db";
import {
  visibilityCampaigns,
  visibilityCompetitors,
  visibilityPrompts,
  visibilityRuns,
  visibilityTests,
} from "@shared/schema";

const starterPrompts = [
  ["Best snagging company in Dubai", "Property snagging", "Dubai", "commercial"],
  ["Best property inspection company in Dubai", "Property inspection", "Dubai", "commercial"],
  ["Best handover inspection company in Dubai", "Handover inspection", "Dubai", "commercial"],
  ["Best snagging company in Abu Dhabi", "Property snagging", "Abu Dhabi", "commercial"],
  ["Property inspection companies in Dubai", "Property inspection", "Dubai", "commercial"],
  ["Professional snagging services in Dubai", "Property snagging", "Dubai", "commercial"],
  ["How much does snagging cost in Dubai?", "Property snagging", "Dubai", "informational"],
  ["How much does a property inspection cost in Dubai?", "Property inspection", "Dubai", "informational"],
  ["Who should I hire for a property handover inspection in Dubai?", "Handover inspection", "Dubai", "commercial"],
  ["Best property inspector in Dubai Hills Estate", "Property inspection", "Dubai Hills Estate", "commercial"],
  ["Best snagging company in Dubai Marina", "Property snagging", "Dubai Marina", "commercial"],
  ["Best snagging company in Downtown Dubai", "Property snagging", "Downtown Dubai", "commercial"],
  ["Best snagging company in Palm Jumeirah", "Property snagging", "Palm Jumeirah", "commercial"],
  ["Best property inspection company in Abu Dhabi", "Property inspection", "Abu Dhabi", "commercial"],
  ["Which company provides reliable snagging services in Dubai?", "Property snagging", "Dubai", "commercial"],
  ["What company should inspect my new apartment before handover in Dubai?", "Handover inspection", "Dubai", "commercial"],
  ["Best companies for new-build property inspections in Dubai", "New-build inspection", "Dubai", "commercial"],
  ["Best snagging companies in the UAE", "Property snagging", "UAE", "commercial"],
  ["Building condition assessment companies in the UAE", "Building condition assessment", "UAE", "commercial"],
  ["Technical due diligence company in Dubai", "Technical due diligence", "Dubai", "commercial"],
  ["MEP inspection services in Dubai", "MEP inspection", "Dubai", "commercial"],
  ["What is included in a Dubai property snagging inspection?", "Property snagging", "Dubai", "informational"],
  ["Do I need a snagging inspection before property handover in the UAE?", "Handover inspection", "UAE", "informational"],
  ["UrbanGrid property inspection reviews and services", "Brand", "UAE", "branded"],
] as const;

async function ensureStarterCampaign() {
  const existing = await db.select().from(visibilityCampaigns).limit(1);
  if (existing[0]) return existing[0];
  const [campaign] = await db.insert(visibilityCampaigns).values({
    name: "UAE Core Visibility",
    description: "Core commercial and informational prompts for UrbanGrid services and priority UAE locations.",
  }).returning();
  await db.insert(visibilityPrompts).values(starterPrompts.map(([prompt, service, location, queryType]) => ({
    campaignId: campaign.id,
    prompt,
    service,
    location,
    intent: queryType === "informational" ? "research" : queryType === "branded" ? "brand" : "hire",
    queryType,
  })));
  return campaign;
}

async function fetchText(url: string) {
  const started = Date.now();
  try {
    const response = await fetch(url, { headers: { "user-agent": "UrbanGridVisibilityAudit/1.0" }, signal: AbortSignal.timeout(12000) });
    return { ok: response.ok, status: response.status, type: response.headers.get("content-type") || "", text: await response.text(), ms: Date.now() - started };
  } catch {
    return { ok: false, status: 0, type: "", text: "", ms: Date.now() - started };
  }
}

async function runReadinessAudit() {
  const base = "https://urbangrid.ae";
  const [home, robots, sitemap, llms, service] = await Promise.all([
    fetchText(base + "/"),
    fetchText(base + "/robots.txt"),
    fetchText(base + "/sitemap.xml"),
    fetchText(base + "/llms.txt"),
    fetchText(base + "/services/property-snagging/new-build-snagging"),
  ]);
  const check = (name: string, passed: boolean, evidence: string, weight = 10) => ({ name, passed, evidence, weight });
  const seoChecks = [
    check("HTTPS and indexable homepage", home.ok && home.text.includes("index, follow"), `HTTP ${home.status}`, 15),
    check("Unique title and description", /<title>[^<]{20,}<\/title>/i.test(home.text) && /name=\"description\"/i.test(home.text), "Initial HTML metadata", 15),
    check("Canonical URL", /rel=\"canonical\"/i.test(home.text), "Canonical tag in initial HTML", 10),
    check("Single primary heading", (home.text.match(/<h1/gi) || []).length === 1, `${(home.text.match(/<h1/gi) || []).length} H1 element(s)`, 10),
    check("XML sitemap", sitemap.ok && /<urlset/i.test(sitemap.text), `HTTP ${sitemap.status}`, 10),
    check("robots.txt", robots.ok && /sitemap:/i.test(robots.text), `HTTP ${robots.status}`, 10),
    check("Organization schema", /\"@type\":\"Organization\"/i.test(home.text), "JSON-LD in initial HTML", 10),
    check("Service and FAQ schema", /\"@type\":\"Service\"/i.test(service.text) && /\"@type\":\"FAQPage\"/i.test(service.text), "Service-page JSON-LD", 10),
    check("Fast server response", home.ms < 800, `${home.ms} ms audit response`, 10),
  ];
  const geoChecks = [
    check(
      "AI crawler access",
      robots.ok && !robots.text.toLowerCase().split(/\r?\n/).some(line => line.trim() === "disallow: /"),
      "robots.txt does not block site-wide crawling",
      20,
    ),
    check("Useful llms.txt", llms.ok && llms.type.includes("text/plain") && llms.text.includes("## Core services"), `${llms.type || "no content type"}`, 20),
    check("AI-readable initial content", home.text.includes("data-ssr-page-summary") && home.text.length > 5000, "Heading and factual summary in initial HTML", 20),
    check("Entity clarity", /UrbanGrid[\\s\\S]{0,500}(property|snagging|inspection)/i.test(home.text), "Company, category and service relationship present", 15),
    check("Service definitions", /new.build|handover|snagging/i.test(service.text), "Dedicated service content", 10),
    check("Citation structure", /FAQPage/i.test(service.text) && llms.text.includes("## Citation guidance"), "FAQ and citation guidance", 15),
  ];
  const score = (items: typeof seoChecks) => Math.round(items.reduce((sum, item) => sum + (item.passed ? item.weight : 0), 0));
  return {
    measuredAt: new Date().toISOString(),
    source: "live_first_party_audit",
    target: base,
    seo: { score: score(seoChecks), checks: seoChecks },
    geo: { score: score(geoChecks), checks: geoChecks },
  };
}

function calculateMetrics(rows: Array<typeof visibilityTests.$inferSelect>) {
  const completed = rows.filter(r => r.response);
  if (!completed.length) return null;
  const commercial = completed.filter(r => r.recommended !== null);
  const positions = completed.map(r => r.position).filter((n): n is number => typeof n === "number");
  const competitorMentions = new Map<string, number>();
  for (const row of completed) for (const item of row.competitors || []) competitorMentions.set(item.name, (competitorMentions.get(item.name) || 0) + 1);
  const urbanMentions = completed.filter(r => r.mentioned).length;
  const totalMentions = urbanMentions + [...competitorMentions.values()].reduce((a, b) => a + b, 0);
  return {
    testedQueries: completed.length,
    mentionRate: Math.round(urbanMentions / completed.length * 100),
    recommendationRate: commercial.length ? Math.round(commercial.filter(r => r.recommended).length / commercial.length * 100) : 0,
    citationRate: Math.round(completed.filter(r => r.cited).length / completed.length * 100),
    averagePosition: positions.length ? Number((positions.reduce((a, b) => a + b, 0) / positions.length).toFixed(2)) : null,
    shareOfVoice: totalMentions ? Math.round(urbanMentions / totalMentions * 100) : 0,
  };
}

export function registerVisibilityRoutes(app: Express, requireAdmin: RequestHandler) {
  app.get("/api/admin/visibility/overview", requireAdmin, async (_req, res) => {
    const campaign = await ensureStarterCampaign();
    const [prompts, competitors, runs, tests, audit] = await Promise.all([
      db.select().from(visibilityPrompts).where(eq(visibilityPrompts.campaignId, campaign.id)).orderBy(visibilityPrompts.id),
      db.select().from(visibilityCompetitors).orderBy(visibilityCompetitors.name),
      db.select().from(visibilityRuns).orderBy(desc(visibilityRuns.startedAt)).limit(20),
      db.select().from(visibilityTests),
      runReadinessAudit(),
    ]);
    res.json({
      audit,
      llm: {
        status: tests.some(t => t.response) ? "benchmarked" : "not_benchmarked",
        score: calculateMetrics(tests)?.mentionRate ?? null,
        metrics: calculateMetrics(tests),
        disclaimer: "LLM Visibility is calculated only from observed platform responses. SEO and GEO signals are never substituted.",
      },
      platforms: ["ChatGPT", "Claude", "Gemini", "Perplexity"].map(platform => ({ platform, status: "not_connected" })),
      campaign,
      prompts,
      competitors,
      runs,
    });
  });

  const campaignSchema = z.object({ name: z.string().min(2).max(255), description: z.string().max(2000).optional() });
  app.post("/api/admin/visibility/campaigns", requireAdmin, async (req, res) => {
    const value = campaignSchema.parse(req.body);
    const [campaign] = await db.insert(visibilityCampaigns).values(value).returning();
    res.status(201).json(campaign);
  });

  const promptSchema = z.object({
    campaignId: z.number().int().positive(),
    prompt: z.string().min(5).max(1000),
    service: z.string().max(120).optional(),
    location: z.string().max(120).optional(),
    intent: z.enum(["hire", "research", "compare", "brand"]),
    queryType: z.enum(["commercial", "informational", "comparison", "branded"]),
  });
  app.post("/api/admin/visibility/prompts", requireAdmin, async (req, res) => {
    const value = promptSchema.parse(req.body);
    const [prompt] = await db.insert(visibilityPrompts).values(value).returning();
    res.status(201).json(prompt);
  });
  app.delete("/api/admin/visibility/prompts/:id", requireAdmin, async (req, res) => {
    await db.delete(visibilityPrompts).where(eq(visibilityPrompts.id, Number(req.params.id)));
    res.status(204).end();
  });

  const competitorSchema = z.object({ name: z.string().min(2).max(255), domain: z.string().max(255).optional() });
  app.post("/api/admin/visibility/competitors", requireAdmin, async (req, res) => {
    const value = competitorSchema.parse(req.body);
    const [competitor] = await db.insert(visibilityCompetitors).values(value).returning();
    res.status(201).json(competitor);
  });
  app.delete("/api/admin/visibility/competitors/:id", requireAdmin, async (req, res) => {
    await db.delete(visibilityCompetitors).where(eq(visibilityCompetitors.id, Number(req.params.id)));
    res.status(204).end();
  });

  app.post("/api/admin/visibility/runs", requireAdmin, async (_req, res) => {
    res.status(409).json({
      message: "No official AI platform is connected. Connect a supported platform before running a benchmark; results will not be simulated.",
    });
  });
}