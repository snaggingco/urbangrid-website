-- Additive; apply to the website's existing PostgreSQL/Neon DATABASE_URL BEFORE publishing the gateway build.
-- Does not alter public forms, their legacy table, or existing enquiries.
CREATE TABLE IF NOT EXISTS website_lead_outbox (
  id serial PRIMARY KEY,
  contact_id integer NOT NULL REFERENCES contact_submissions(id),
  event_id varchar(200) NOT NULL UNIQUE,
  client_code varchar(80) NOT NULL,
  envelope jsonb NOT NULL,
  status varchar(30) NOT NULL DEFAULT 'pending',
  attempts integer NOT NULL DEFAULT 0,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  last_error text,
  delivered_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_website_lead_outbox_due
  ON website_lead_outbox (status,next_attempt_at,created_at);
