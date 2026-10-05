import type { Express, RequestHandler } from "express";
import { z } from "zod";
import { leadFiltersSchema, leadUpdateSchema } from "@shared/leads";
import { countLeads, leadHistory, listLeads, marketingSummary, updateLead } from "./leadPipeline";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "./db";
import { contactSubmissions } from "@shared/schema";
import { leadConditions } from "./leadPipeline";
import { acquisitionFiltersSchema } from "@shared/acquisition";
import { acquisitionReport } from "./acquisitionReporting";

export function registerLeadRoutes(app: Express, authenticate: RequestHandler) {
  app.get("/api/admin/booking-leads", authenticate, async (req, res) => {
    try {
      const { q = "" } = z.object({ q: z.string().trim().max(200).optional() }).strict().parse(req.query);
      const term = `%${q.replace(/[\\%_]/g, "\\$&")}%`;
      const match = q ? or(ilike(contactSubmissions.name, term), ilike(contactSubmissions.email, term),
        /^\d+$/.test(q) && Number.isSafeInteger(Number(q)) && Number(q) <= 2147483647
          ? eq(contactSubmissions.id, Number(q)) : undefined) : undefined;
      const rows = await db.select({ id: contactSubmissions.id, name: contactSubmissions.name,
        email: contactSubmissions.email, phone: contactSubmissions.phone, stage: contactSubmissions.stage,
        createdAt: contactSubmissions.createdAt }).from(contactSubmissions)
        .where(and(leadConditions({ includeNonSales: false }), match))
        .orderBy(desc(contactSubmissions.createdAt), desc(contactSubmissions.id)).limit(25);
      res.set("Cache-Control", "no-store").json({ leads: rows });
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: "Invalid enquiry search" });
      res.status(500).json({ message: "Could not search enquiries" });
    }
  });
  app.get("/api/admin/acquisition", authenticate, async (req, res) => {
    try {
      res.set("Cache-Control", "no-store").json(await acquisitionReport(acquisitionFiltersSchema.parse(req.query)));
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: "Invalid acquisition dates" });
      res.status(500).json({ message: "Could not load acquisition report" });
    }
  });
  app.get("/api/admin/leads", authenticate, async (req, res) => {
    try {
      const filters = leadFiltersSchema.parse(req.query);
      const [leads, total] = await Promise.all([listLeads(filters), countLeads(filters)]);
      res.set("Cache-Control", "no-store").json({ leads, total });
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: "Invalid lead filters" });
      console.error("Lead list error:", error);
      res.status(500).json({ message: "Could not load leads" });
    }
  });
  app.patch("/api/admin/leads/:id", authenticate, async (req, res) => {
    try {
      const id = z.coerce.number().int().positive().parse(req.params.id);
      const lead = await updateLead(id, leadUpdateSchema.parse(req.body));
      if (!lead) return res.status(404).json({ message: "Lead not found" });
      res.set("Cache-Control", "no-store").json({ lead });
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: "Invalid lead update" });
      if (error instanceof Error && error.message === "LOST_REASON_REQUIRED") {
        return res.status(400).json({ message: "A lost reason is required when moving a lead to lost" });
      }
      console.error("Lead update error:", error);
      res.status(500).json({ message: "Could not update lead" });
    }
  });
  app.get("/api/admin/leads/:id/history", authenticate, async (req, res) => {
    try {
      const id = z.coerce.number().int().positive().parse(req.params.id);
      res.set("Cache-Control", "no-store").json({ history: await leadHistory(id) });
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: "Invalid lead ID" });
      console.error("Lead history error:", error);
      res.status(500).json({ message: "Could not load lead history" });
    }
  });
  app.get("/api/admin/marketing-summary", authenticate, async (req, res) => {
    try {
      res.set("Cache-Control", "no-store").json(await marketingSummary(leadFiltersSchema.parse(req.query)));
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: "Invalid summary filters" });
      console.error("Marketing summary error:", error);
      res.status(500).json({ message: "Could not load marketing summary" });
    }
  });
}