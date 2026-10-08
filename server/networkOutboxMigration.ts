import { pool } from "./db";

/** Idempotent deployment-time migration. Run before accepting contact traffic. */
export async function ensureNetworkOutboxSchema() {
  const connection = await pool.connect();
  try {
    await connection.query("BEGIN");
    await connection.query("SELECT pg_advisory_xact_lock(831677244)");
    await connection.query(
      "CREATE TABLE IF NOT EXISTS website_lead_outbox (" +
      "id serial PRIMARY KEY," +
      "contact_id integer NOT NULL REFERENCES contact_submissions(id)," +
      "event_id varchar(200) NOT NULL UNIQUE," +
      "client_code varchar(80) NOT NULL," +
      "envelope jsonb NOT NULL," +
      "status varchar(30) NOT NULL DEFAULT 'pending'," +
      "attempts integer NOT NULL DEFAULT 0," +
      "next_attempt_at timestamptz NOT NULL DEFAULT now()," +
      "last_error text," +
      "delivered_at timestamptz," +
      "updated_at timestamptz NOT NULL DEFAULT now()," +
      "created_at timestamptz NOT NULL DEFAULT now()" +
      ")"
    );
    await connection.query(
      "CREATE INDEX IF NOT EXISTS idx_website_lead_outbox_due " +
      "ON website_lead_outbox(status,next_attempt_at,created_at)"
    );
    await connection.query("COMMIT");
  } catch {
    await connection.query("ROLLBACK").catch(() => {});
    // Never expose DB connection parameters or customer information.
    throw new Error("Network lead outbox migration failed: refusing to serve unqueued leads");
  } finally {
    connection.release();
  }
}
