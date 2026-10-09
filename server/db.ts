import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { websiteDatabaseUrl } from "./network/runtime";

neonConfig.webSocketConstructor = ws;

export const pool = new Pool({ connectionString: websiteDatabaseUrl(process.env) });
export const db = drizzle({ client: pool, schema });