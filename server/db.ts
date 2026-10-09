import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { ukDatabaseConfiguration } from "./ukRuntime";

neonConfig.webSocketConstructor = ws;

const config = ukDatabaseConfiguration(process.env);
export const databaseConfigured = config.configured;
const unavailable = () => { throw new Error("UK database is not configured; no UAE fallback is permitted"); };
// Static preview is intentionally available during onboarding. No database-backed
// request can succeed until its dedicated UK database is configured.
export const pool: Pool = config.configured
  ? new Pool({ connectionString: config.url })
  : new Proxy({} as Pool, { get: unavailable });
export const db = drizzle({ client: pool, schema });