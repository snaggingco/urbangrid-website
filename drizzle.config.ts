import { defineConfig } from "drizzle-kit";
import { ukDatabaseConfiguration } from "./server/ukRuntime";
const config = ukDatabaseConfiguration(process.env);
if (!config.configured) throw new Error("Dedicated UK database is required; never migrate the inherited UAE database");

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: config.url,
  },
});
