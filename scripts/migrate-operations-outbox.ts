import { readFile } from "node:fs/promises";
import { pool } from "../server/db";

// Additive migration only. Uses the project's configured database, without
// printing its URL or inspecting/replacing unrelated tables.
try {
  await pool.query(await readFile(new URL("../migrations/0004_operations_delivery_outbox.sql", import.meta.url), "utf8"));
  await pool.query(await readFile(new URL("../migrations/0005_operations_failure_diagnostics.sql", import.meta.url), "utf8"));
  await pool.query(await readFile(new URL("../migrations/0006_operations_development_tests.sql", import.meta.url), "utf8"));
  console.log("Operations outbox additive migration applied.");
} finally {
  await pool.end();
}