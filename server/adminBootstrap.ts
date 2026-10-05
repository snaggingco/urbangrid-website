import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { db } from "./db";
import { adminCredentials, users } from "@shared/schema";

export const ADMIN_EMAIL = "info@urbangrid.ae";
export const ADMIN_PASSWORD_SECRET = "URBANGRID_ADMIN_INITIAL_PASSWORD";
export type AdminIdentity = {
  id: string; email: string; firstName: string | null; lastName: string | null; credentialVersion: string;
};

export async function bootstrapAdminAccount() {
  // This is the only initial-password source. Never fall back to ADMIN_PASSWORD,
  // a default password, an input file or a public API.
  const initialPassword = process.env.URBANGRID_ADMIN_INITIAL_PASSWORD;
  if (!initialPassword) return { configured: false, changed: false };
  const bytes = Buffer.byteLength(initialPassword, "utf8");
  // bcrypt ignores bytes after 72. Reject instead of silently truncating.
  if (bytes < 12 || bytes > 72) throw new Error("Admin bootstrap configuration is invalid");
  return db.transaction(async tx => {
    // Serialize concurrent process startups, including the initially absent row.
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext('urbangrid-admin-bootstrap'))`);
    const [credential] = await tx.select().from(adminCredentials)
      .where(eq(adminCredentials.username, ADMIN_EMAIL)).for("update");
    const [existing] = await tx.select().from(users)
      .where(sql`lower(${users.email}) = ${ADMIN_EMAIL}`).for("update");
    const [user] = existing
      ? existing.email === ADMIN_EMAIL && existing.role === "admin" && existing.firstName && existing.lastName ? [existing]
        : await tx.update(users).set({ email: ADMIN_EMAIL, role: "admin", updatedAt: new Date(),
          firstName: existing.firstName || "UrbanGrid", lastName: existing.lastName || "Administrator" })
        .where(eq(users.id, existing.id)).returning()
      : await tx.insert(users).values({ email: ADMIN_EMAIL, role: "admin", firstName: "UrbanGrid",
          lastName: "Administrator" }).returning();
    const samePassword = credential && await bcrypt.compare(initialPassword, credential.passwordHash);
    if (credential && samePassword && credential.userId === user.id) {
      return { configured: true, changed: false };
    }
    const passwordHash = await bcrypt.hash(initialPassword, 12);
    await tx.insert(adminCredentials).values({ username: ADMIN_EMAIL, userId: user.id,
      passwordHash, credentialVersion: crypto.randomUUID() })
      .onConflictDoUpdate({ target: adminCredentials.username, set: {
        userId: user.id, passwordHash, credentialVersion: crypto.randomUUID(), updatedAt: new Date() } });
    return { configured: true, changed: true };
  });
}

async function credentialRecord() {
  const [row] = await db.select({ user: users, credential: adminCredentials }).from(adminCredentials)
    .innerJoin(users, eq(users.id, adminCredentials.userId))
    .where(eq(adminCredentials.username, ADMIN_EMAIL));
  return row?.user.role === "admin" && row.user.email === ADMIN_EMAIL ? row : undefined;
}
function identity(row: NonNullable<Awaited<ReturnType<typeof credentialRecord>>>): AdminIdentity {
  return { id: row.user.id, email: ADMIN_EMAIL, firstName: row.user.firstName,
    lastName: row.user.lastName, credentialVersion: row.credential.credentialVersion };
}
export async function authenticateAdmin(username: unknown, password: unknown) {
  if (typeof username !== "string" || typeof password !== "string" || Buffer.byteLength(password, "utf8") > 72) return null;
  const row = await credentialRecord();
  if (!row) return null;
  const matches = await bcrypt.compare(password, row.credential.passwordHash);
  return matches && username.trim().toLowerCase() === ADMIN_EMAIL ? identity(row) : null;
}
export async function restoreAdminSession(id: string, version: string) {
  const row = await credentialRecord();
  return row && row.user.id === id && row.credential.credentialVersion === version ? identity(row) : null;
}