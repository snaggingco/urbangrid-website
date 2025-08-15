import {
  users,
  blogPosts,
  contactSubmissions,
  type User,
  type UpsertUser,
  type BlogPost,
  type BlogPostWithAuthor,
  type InsertBlogPost,
  type InsertContactSubmission,
  type ContactSubmission,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, ilike, or } from "drizzle-orm";

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
  getContactSubmissions(options?: {
    isRead?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<ContactSubmission[]>;
  markContactSubmissionAsRead(id: number): Promise<boolean>;
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
    return result.rowCount > 0;
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
      .orderBy(desc(blogPosts.createdAt));

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
    
    let query = db.select({ count: sql<number>`count(*)` }).from(blogPosts);

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
    const [contactSubmission] = await db.insert(contactSubmissions).values(submission).returning();
    return contactSubmission;
  }

  async getContactSubmissions(options: {
    isRead?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<ContactSubmission[]> {
    const { isRead, limit = 50, offset = 0 } = options;
    
    let query = db
      .select()
      .from(contactSubmissions)
      .orderBy(desc(contactSubmissions.createdAt));

    if (typeof isRead === 'boolean') {
      query = query.where(eq(contactSubmissions.isRead, isRead));
    }
    
    return await query.limit(limit).offset(offset);
  }

  async markContactSubmissionAsRead(id: number): Promise<boolean> {
    const result = await db
      .update(contactSubmissions)
      .set({ isRead: true })
      .where(eq(contactSubmissions.id, id));
    return result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();
