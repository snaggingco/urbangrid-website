import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  serial,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

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
});

// Durable local outbox: records are committed atomically with the contact submission.
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

// This table must be created through the additive DB migration before the new server build is published.

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

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  isRead: true,
  createdAt: true,
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
