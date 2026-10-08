import {
  users,
  blogPosts,
  contactSubmissions,
  inspectors,
  conversionLogs,
  type User,
  type UpsertUser,
  type BlogPost,
  type BlogPostWithAuthor,
  type InsertBlogPost,
  type InsertContactSubmission,
  type ContactSubmission,
  type InsertInspector,
  type Inspector,
  type InsertConversionLog,
  type ConversionLog,
} from "@shared/schema";
import { db } from "./db";
import { queueNetworkLead } from "./networkLeadSync";
import { eq, desc, and, ilike, or, sql, count } from "drizzle-orm";
import type { LeadUpdate } from "@shared/leads";
import { updateLead } from "./leadPipeline";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Blog operations
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  getBlogPost(id: number): Promise<BlogPostWithAuthor | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPostWithAuthor | undefined>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  getBlogPosts(options?: {
    status?: 'draft' | 'published';
    category?: string;
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<BlogPostWithAuthor[]>;
  getBlogPostsCount(options?: {
    status?: 'draft' | 'published';
    category?: string;
    search?: string;
  }): Promise<number>;
  
  // Contact operations
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  saveContactSubmission(submission: InsertContactSubmission): Promise<{ submission: ContactSubmission; created: boolean }>;
  getContactSubmissions(options?: {
    isRead?: boolean;
    stage?: string;
    limit?: number;
    offset?: number;
  }): Promise<ContactSubmission[]>;
  getContactSubmissionsCount(stage?: string): Promise<number>;
  updateContactSubmissionStage(id: number, update: LeadUpdate): Promise<ContactSubmission | undefined>;
  markContactSubmissionAsRead(id: number): Promise<boolean>;
  
  // Inspector operations
  createInspector(inspector: InsertInspector): Promise<Inspector>;
  getInspector(id: number): Promise<Inspector | undefined>;
  getInspectorByUsername(username: string): Promise<Inspector | undefined>;
  getInspectors(options?: {
    isActive?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Inspector[]>;
  getInspectorsCount(options?: {
    isActive?: boolean;
    search?: string;
  }): Promise<number>;
  updateInspector(id: number, inspector: Partial<InsertInspector>): Promise<Inspector | undefined>;
  deleteInspector(id: number): Promise<boolean>;

  // Conversion operations
  logConversion(log: InsertConversionLog): Promise<ConversionLog>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Blog operations
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [blogPost] = await db.insert(blogPosts).values(post).returning();
    return blogPost;
  }

  async getBlogPost(id: number): Promise<BlogPostWithAuthor | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .where(eq(blogPosts.id, id));
    
    if (!post) return undefined;
    
    return {
      ...post.blog_posts,
      author: post.users,
    };
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPostWithAuthor | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .where(eq(blogPosts.slug, slug));
    
    if (!post) return undefined;
    
    return {
      ...post.blog_posts,
      author: post.users,
    };
  }

  async updateBlogPost(id: number, postData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [post] = await db
      .update(blogPosts)
      .set({ ...postData, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return post;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getBlogPosts(options: {
    status?: 'draft' | 'published';
    category?: string;
    limit?: number;
    offset?: number;
    search?: string;
  } = {}): Promise<BlogPostWithAuthor[]> {
    const { status, category, limit = 10, offset = 0, search } = options;
    
    let query = db
      .select()
      .from(blogPosts)
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .orderBy(desc(blogPosts.createdAt)).$dynamic();

    const conditions = [];
    
    if (status) {
      conditions.push(eq(blogPosts.status, status));
    }
    
    if (category) {
      conditions.push(eq(blogPosts.category, category));
    }
    
    if (search) {
      conditions.push(
        or(
          ilike(blogPosts.title, `%${search}%`),
          ilike(blogPosts.content, `%${search}%`),
          ilike(blogPosts.excerpt, `%${search}%`)
        )
      );
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    const posts = await query.limit(limit).offset(offset);
    
    return posts.map(post => ({
      ...post.blog_posts,
      author: post.users,
    }));
  }

  async getBlogPostsCount(options: {
    status?: 'draft' | 'published';
    category?: string;
    search?: string;
  } = {}): Promise<number> {
    const { status, category, search } = options;
    
    let query = db.select({ count: count() }).from(blogPosts).$dynamic();

    const conditions = [];
    
    if (status) {
      conditions.push(eq(blogPosts.status, status));
    }
    
    if (category) {
      conditions.push(eq(blogPosts.category, category));
    }
    
    if (search) {
      conditions.push(
        or(
          ilike(blogPosts.title, `%${search}%`),
          ilike(blogPosts.content, `%${search}%`),
          ilike(blogPosts.excerpt, `%${search}%`)
        )
      );
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    const [result] = await query;
    return result.count;
  }

  // Contact operations
  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    return (await this.saveContactSubmission(submission)).submission;
  }

  async saveContactSubmission(submission: InsertContactSubmission): Promise<{ submission: ContactSubmission; created: boolean }> {
    // The enquiry and outbound integration event either both commit or both fail.
    // Existing same-key retries return the same lead and do not create another event.
    return db.transaction(async tx => {
      const [inserted] = await tx.insert(contactSubmissions).values(submission)
        .onConflictDoNothing({ target: contactSubmissions.submissionKey }).returning();
      if (inserted) {
        await queueNetworkLead(inserted, tx);
        return { submission: inserted, created: true };
      }
      if (!submission.submissionKey) throw new Error("Lead could not be saved");
      const [existing] = await tx.select().from(contactSubmissions)
        .where(eq(contactSubmissions.submissionKey, submission.submissionKey));
      if (!existing) throw new Error("Lead could not be confirmed");
      return { submission: existing, created: false };
    });
  }

  async getContactSubmissions(options: {
    isRead?: boolean;
    stage?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<ContactSubmission[]> {
    const { isRead, stage, limit = 50, offset = 0 } = options;
    
    let query = db
      .select()
      .from(contactSubmissions)
      .orderBy(desc(contactSubmissions.createdAt)).$dynamic();

    const conditions = [sql`coalesce(${contactSubmissions.leadSource}, '') <> 'integration_test'`];
    if (typeof isRead === 'boolean') conditions.push(eq(contactSubmissions.isRead, isRead));
    if (stage) conditions.push(eq(contactSubmissions.stage, stage));
    if (conditions.length) query = query.where(and(...conditions));
    
    return await query.limit(limit).offset(offset);
  }

  async getContactSubmissionsCount(stage?: string): Promise<number> {
    const [result] = await db.select({ count: count() }).from(contactSubmissions)
      .where(and(sql`coalesce(${contactSubmissions.leadSource}, '') <> 'integration_test'`,
        stage ? eq(contactSubmissions.stage, stage) : undefined));
    return result.count;
  }

  async updateContactSubmissionStage(id: number, update: LeadUpdate): Promise<ContactSubmission | undefined> {
    return updateLead(id, update);
  }

  async markContactSubmissionAsRead(id: number): Promise<boolean> {
    const result = await db
      .update(contactSubmissions)
      .set({ isRead: true })
      .where(eq(contactSubmissions.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Inspector operations
  async createInspector(inspector: InsertInspector): Promise<Inspector> {
    const [inspectorRecord] = await db.insert(inspectors).values({
      ...inspector,
      updatedAt: new Date(),
    }).returning();
    return inspectorRecord;
  }

  async getInspector(id: number): Promise<Inspector | undefined> {
    const [inspector] = await db.select().from(inspectors).where(eq(inspectors.id, id));
    return inspector;
  }

  async getInspectorByUsername(username: string): Promise<Inspector | undefined> {
    const [inspector] = await db.select().from(inspectors).where(eq(inspectors.username, username));
    return inspector;
  }

  async getInspectors(options?: {
    isActive?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Inspector[]> {
    let query = db.select().from(inspectors).$dynamic();

    const conditions = [];
    if (options?.isActive !== undefined) {
      conditions.push(eq(inspectors.isActive, options.isActive));
    }
    if (options?.search) {
      conditions.push(or(
        ilike(inspectors.fullName, `%${options.search}%`),
        ilike(inspectors.email, `%${options.search}%`)
      ));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    query = query.orderBy(desc(inspectors.createdAt));

    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.offset(options.offset);
    }

    return await query;
  }

  async getInspectorsCount(options?: {
    isActive?: boolean;
    search?: string;
  }): Promise<number> {
    let query = db.select({ count: count() }).from(inspectors).$dynamic();

    const conditions = [];
    if (options?.isActive !== undefined) {
      conditions.push(eq(inspectors.isActive, options.isActive));
    }
    if (options?.search) {
      conditions.push(
        or(
          ilike(inspectors.fullName, `%${options.search}%`),
          ilike(inspectors.email, `%${options.search}%`)
        )
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const result = await query;
    return result[0]?.count ?? 0;
  }

  async updateInspector(id: number, inspector: Partial<InsertInspector>): Promise<Inspector | undefined> {
    const [updated] = await db.update(inspectors)
      .set({
        ...inspector,
        updatedAt: new Date(),
      })
      .where(eq(inspectors.id, id))
      .returning();
    return updated;
  }

  async deleteInspector(id: number): Promise<boolean> {
    const [deleted] = await db.delete(inspectors)
      .where(eq(inspectors.id, id))
      .returning();
    return !!deleted;
  }

  // Conversion operations
  async logConversion(log: InsertConversionLog): Promise<ConversionLog> {
    const [conversionLog] = await db.insert(conversionLogs).values(log).returning();
    return conversionLog;
  }
}

export const storage = new DatabaseStorage();
