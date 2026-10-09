import { sql } from 'drizzle-orm';
import {
  index,
  check,
  uniqueIndex,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  serial,
  bigint,
  boolean,
  integer,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { attributionSchema, type LeadAttribution } from "./leads";
import type { BookingCreatedOperationsEvent, OperationsEnvironment, OperationsReceiverIdentifiers } from "./operationsIntegration";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("user"), // 'admin' or 'user'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Private authentication storage. Kept separate so ordinary user selects/API
// serialization can never accidentally include a password hash.
export const adminCredentials = pgTable("admin_credentials", {
  username: varchar("username", { length: 255 }).primaryKey(),
  userId: varchar("user_id").notNull().unique().references(() => users.id),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  credentialVersion: varchar("credential_version", { length: 36 }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  featuredImage: varchar("featured_image", { length: 500 }),
  category: varchar("category", { length: 100 }),
  tags: text("tags").array(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  authorId: varchar("author_id").references(() => users.id),
  status: varchar("status").default("draft"), // 'draft' or 'published'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact form submissions table
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  enquiryType: varchar("enquiry_type", { length: 100 }),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  attribution: jsonb("attribution").$type<LeadAttribution>(),
  leadSource: varchar("lead_source", { length: 100 }),
  submissionKey: varchar("submission_key", { length: 100 }).unique(),
  stage: varchar("stage", { length: 30 }).default("new").notNull(),
  stageUpdatedAt: timestamp("stage_updated_at").defaultNow().notNull(),
  revenueAmountMinor: integer("revenue_amount_minor"),
  revenueCurrency: varchar("revenue_currency", { length: 3 }).default("GBP").notNull(),
  qualifiedAt: timestamp("qualified_at", { withTimezone: true }),
  quotedAt: timestamp("quoted_at", { withTimezone: true }),
  bookedAt: timestamp("booked_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  lostAt: timestamp("lost_at", { withTimezone: true }),
  quoteValueMinor: integer("quote_value_minor"),
  quoteCurrency: varchar("quote_currency", { length: 3 }).default("GBP").notNull(),
  lostReason: text("lost_reason"),
  inspectionDate: date("inspection_date"),
  bookingReference: varchar("booking_reference", { length: 255 }),
}, table => [
  index("contact_submissions_stage_created_idx").on(table.stage, table.createdAt),
  index("contact_submissions_source_created_idx").on(table.leadSource, table.createdAt),
]);

export const leadStageHistory = pgTable("lead_stage_history", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull().references(() => contactSubmissions.id),
  fromStage: varchar("from_stage", { length: 30 }).notNull(),
  toStage: varchar("to_stage", { length: 30 }).notNull(),
  changedAt: timestamp("changed_at", { withTimezone: true }).defaultNow().notNull(),
  note: text("note"),
}, table => [
  index("lead_stage_history_lead_changed_idx").on(table.leadId, table.changedAt),
]);

export const inspectionBookings = pgTable("inspection_bookings", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull().references(() => contactSubmissions.id),
  submissionKey: varchar("submission_key", { length: 100 }).notNull().unique(),
  bookingReference: varchar("booking_reference", { length: 60 }).notNull().unique(),
  service: varchar("service", { length: 80 }).notNull(),
  propertyType: varchar("property_type", { length: 40 }).notNull(),
  areaHundredths: integer("area_hundredths").notNull(),
  bedrooms: varchar("bedrooms", { length: 20 }),
  project: varchar("project", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  emirate: varchar("emirate", { length: 60 }).notNull(),
  inspectionDate: date("inspection_date").notNull(),
  timeWindow: varchar("time_window", { length: 100 }),
  baseMinor: integer("base_minor").notNull(),
  vatMinor: integer("vat_minor").notNull(),
  quoteTotalMinor: integer("quote_total_minor").notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("AED"),
  status: varchar("status", { length: 30 }).notNull().default("booked"),
  inspectionCompletedAt: timestamp("inspection_completed_at", { withTimezone: true }),
  attribution: jsonb("attribution").$type<LeadAttribution>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  confirmationSentAt: timestamp("confirmation_sent_at", { withTimezone: true }),
  confirmationClaimedAt: timestamp("confirmation_claimed_at", { withTimezone: true }),
  isIntegrationTest: boolean("is_integration_test").notNull().default(false),
  strataIdentifiers: jsonb("strata_identifiers").$type<OperationsReceiverIdentifiers>(),
  strataLastSyncAt: timestamp("strata_last_sync_at", { withTimezone: true }),
}, t => [index("inspection_bookings_lead_idx").on(t.leadId),
  check("inspection_bookings_amounts_valid", sql`${t.baseMinor} > 0 and ${t.vatMinor} >= 0 and ${t.quoteTotalMinor} = ${t.baseMinor} + ${t.vatMinor} and ${t.currency} = 'AED' and ${t.areaHundredths} > 0`),
]);

export const inspectionPayments = pgTable("inspection_payments", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull().references(() => inspectionBookings.id),
  leadId: integer("lead_id").notNull().references(() => contactSubmissions.id),
  provider: varchar("provider", { length: 30 }).notNull().default("ziina"),
  providerIntentId: varchar("provider_intent_id", { length: 255 }).unique(),
  operationId: varchar("operation_id", { length: 100 }).notNull().unique(),
  paymentType: varchar("payment_type", { length: 20 }).notNull().default("full"),
  amountMinor: integer("amount_minor").notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("AED"),
  status: varchar("status", { length: 30 }).notNull().default("created"),
  redirectUrl: text("redirect_url"),
  providerReference: varchar("provider_reference", { length: 255 }),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
}, t => [index("inspection_payments_booking_idx").on(t.bookingId),
  check("inspection_payments_amount_valid", sql`${t.amountMinor} > 0 and ${t.currency} = 'AED' and ${t.paymentType} in ('full','refund')`),
  uniqueIndex("inspection_payments_active_ziina_idx").on(t.bookingId)
    .where(sql`${t.provider} = 'ziina' and ${t.status} in ('created','pending')`),
]);

export const bookingAudit = pgTable("booking_audit", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull().references(() => inspectionBookings.id),
  action: varchar("action", { length: 80 }).notNull(),
  actor: varchar("actor", { length: 100 }).notNull(),
  details: jsonb("details").$type<Record<string, unknown>>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, t => [index("booking_audit_booking_idx").on(t.bookingId)]);

// Server-only payloads; never selected by customer booking APIs.
export const operationsDeliveryOutbox = pgTable("operations_delivery_outbox", {
  eventId: varchar("event_id", { length: 160 }).primaryKey(),
  bookingId: integer("booking_id").notNull().references(() => inspectionBookings.id),
  environment: varchar("environment", { length: 20 }).$type<OperationsEnvironment>().notNull(),
  payload: jsonb("payload").$type<BookingCreatedOperationsEvent>().notNull(),
  isIntegrationTest: boolean("is_integration_test").notNull().default(false),
  receiverIdentifiers: jsonb("receiver_identifiers").$type<OperationsReceiverIdentifiers>(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  attempts: integer("attempts").notNull().default(0),
  nextAttemptAt: timestamp("next_attempt_at", { withTimezone: true }).notNull().defaultNow(),
  lastAttemptAt: timestamp("last_attempt_at", { withTimezone: true }),
  lastHttpStatus: integer("last_http_status"),
  lastErrorCode: varchar("last_error_code", { length: 80 }),
  lastFailureAt: timestamp("last_failure_at", { withTimezone: true }),
  lastFailureCode: varchar("last_failure_code", { length: 80 }),
  lastFailureHttpStatus: integer("last_failure_http_status"),
  leaseToken: varchar("lease_token", { length: 36 }),
  leaseExpiresAt: timestamp("lease_expires_at", { withTimezone: true }),
  deliveredAt: timestamp("delivered_at", { withTimezone: true }),
  nextReconcileAt: timestamp("next_reconcile_at", { withTimezone: true }).defaultNow().notNull(),
  lastReconcileAt: timestamp("last_reconcile_at", { withTimezone: true }),
  reconcileErrorCode: varchar("reconcile_error_code", { length: 80 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, t => [
  index("operations_outbox_due_idx").on(t.environment, t.status, t.nextAttemptAt),
  check("operations_outbox_status_valid", sql`${t.status} in ('pending','processing','failed','delivered')`),
  check("operations_outbox_attempts_valid", sql`${t.attempts} >= 0`),
  check("operations_outbox_environment_valid", sql`${t.environment} in ('development','production')`),
]);

// Website -> Network lead delivery queue. Local lead and event are committed atomically.
export const websiteLeadOutbox = pgTable("website_lead_outbox", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id").notNull().references(() => contactSubmissions.id),
  eventId: varchar("event_id", { length: 200 }).notNull().unique(),
  clientCode: varchar("client_code", { length: 80 }).notNull(),
  envelope: jsonb("envelope").notNull(),
  status: varchar("status", { length: 30 }).notNull().default("pending"),
  attempts: integer("attempts").notNull().default(0),
  nextAttemptAt: timestamp("next_attempt_at", { withTimezone: true }).notNull().defaultNow(),
  lastError: text("last_error"),
  deliveredAt: timestamp("delivered_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Inspectors table for inspector authentication
export const inspectors = pgTable("inspectors", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 50 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Separate operations progress from website money/report-release eligibility.
export const operationsLifecycle = pgTable("operations_lifecycle", {
  bookingId: integer("booking_id").primaryKey().references(() => inspectionBookings.id, { onDelete: "cascade" }),
  environment: varchar("environment", { length: 20 }).notNull(),
  status: varchar("status", { length: 40 }).notNull(),
  version: bigint("version", { mode: "number" }).notNull(),
  eventId: varchar("event_id", { length: 160 }).notNull().unique(),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
  receiverIdentifiers: jsonb("receiver_identifiers").$type<OperationsReceiverIdentifiers>(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const operationsLifecycleEvents = pgTable("operations_lifecycle_events", {
  eventId: varchar("event_id", { length: 160 }).primaryKey(),
  bookingId: integer("booking_id").notNull().references(() => inspectionBookings.id, { onDelete: "cascade" }),
  payloadHash: varchar("payload_hash", { length: 64 }).notNull(),
  receivedAt: timestamp("received_at", { withTimezone: true }).defaultNow().notNull(),
});

// Durable verification evidence survives cleanup of the synthetic booking.
export const operationsIntegrationChecks = pgTable("operations_integration_checks", {
  environment: varchar("environment", { length: 20 }).primaryKey(),
  evidence: jsonb("evidence").$type<{
    creationEndpoint: string; statusEndpoint: string; keyFingerprint: string;
    creationHttpStatus: number; statusHttpStatus: number; duplicateHttpStatus: number;
    identifiers: OperationsReceiverIdentifiers; duplicateConfirmed: boolean;
  }>().notNull(),
  checkedAt: timestamp("checked_at", { withTimezone: true }).notNull().defaultNow(),
});

// Visitor tracking table
export const visitorLogs = pgTable("visitor_logs", {
  id: serial("id").primaryKey(),
  ipAddress: varchar("ip_address", { length: 45 }).notNull(), // IPv6 can be up to 45 chars
  userAgent: text("user_agent"),
  path: varchar("path", { length: 500 }).notNull(),
  method: varchar("method", { length: 10 }).notNull(),
  statusCode: varchar("status_code", { length: 3 }).notNull(),
  responseTime: varchar("response_time", { length: 20 }),
  referer: text("referer"),
  createdAt: timestamp("created_at").defaultNow(),
});

// WhatsApp tracking table
export const conversionLogs = pgTable("conversion_logs", {
  id: serial("id").primaryKey(),
  conversionType: varchar("conversion_type", { length: 50 }).notNull(), // 'whatsapp_click', 'call_click', etc.
  ipAddress: varchar("ip_address", { length: 45 }),
  path: varchar("path", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const visibilityCampaigns = pgTable("visibility_campaigns", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const visibilityPrompts = pgTable("visibility_prompts", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull().references(() => visibilityCampaigns.id, { onDelete: "cascade" }),
  prompt: text("prompt").notNull(),
  service: varchar("service", { length: 120 }),
  location: varchar("location", { length: 120 }),
  intent: varchar("intent", { length: 40 }).notNull(),
  queryType: varchar("query_type", { length: 40 }).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const visibilityCompetitors = pgTable("visibility_competitors", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  domain: varchar("domain", { length: 255 }),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const visibilityRuns = pgTable("visibility_runs", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull().references(() => visibilityCampaigns.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 40 }).notNull(),
  methodology: varchar("methodology", { length: 80 }).notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const visibilityTests = pgTable("visibility_tests", {
  id: serial("id").primaryKey(),
  runId: integer("run_id").notNull().references(() => visibilityRuns.id, { onDelete: "cascade" }),
  promptId: integer("prompt_id").notNull().references(() => visibilityPrompts.id, { onDelete: "cascade" }),
  platform: varchar("platform", { length: 40 }).notNull(),
  model: varchar("model", { length: 120 }),
  response: text("response"),
  mentioned: boolean("mentioned"),
  recommended: boolean("recommended"),
  position: integer("position"),
  cited: boolean("cited"),
  citedUrls: jsonb("cited_urls").$type<string[]>().default([]),
  competitors: jsonb("competitors").$type<Array<{ name: string; position?: number }>>().default([]),
  sentiment: varchar("sentiment", { length: 20 }),
  context: text("context"),
  testedAt: timestamp("tested_at").defaultNow().notNull(),
});

// Relations
export const userRelations = relations(users, ({ many }) => ({
  blogPosts: many(blogPosts),
}));

export const blogPostRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions, {
  name: z.string().trim().min(2).max(255),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(50).refine((value) => value === "" || /^\+?[\d\s()-]{7,50}$/.test(value), "Please enter a valid phone number").nullable().optional(),
  message: z.string().trim().min(1).max(10000),
  attribution: attributionSchema.nullable().optional(),
  submissionKey: z.string().uuid().nullable().optional(),
}).omit({
  id: true,
  isRead: true,
  createdAt: true,
  stage: true,
  stageUpdatedAt: true,
  revenueAmountMinor: true,
  revenueCurrency: true,
  qualifiedAt: true,
  quotedAt: true,
  bookedAt: true,
  completedAt: true,
  lostAt: true,
  quoteValueMinor: true,
  quoteCurrency: true,
  lostReason: true,
  inspectionDate: true,
  bookingReference: true,
});

export const insertVisitorLogSchema = createInsertSchema(visitorLogs).omit({
  id: true,
  createdAt: true,
});

export const insertInspectorSchema = createInsertSchema(inspectors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertConversionLogSchema = createInsertSchema(conversionLogs).omit({
  id: true,
  createdAt: true,
});

// Re-export chat models for the AI chatbot integration
export * from "./models/chat";

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type BlogPostWithAuthor = BlogPost & { author: User | null };
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertVisitorLog = z.infer<typeof insertVisitorLogSchema>;
export type VisitorLog = typeof visitorLogs.$inferSelect;
export type InsertInspector = z.infer<typeof insertInspectorSchema>;
export type Inspector = typeof inspectors.$inferSelect;
export type InsertConversionLog = z.infer<typeof insertConversionLogSchema>;
export type ConversionLog = typeof conversionLogs.$inferSelect;
