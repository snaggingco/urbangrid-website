CREATE TABLE IF NOT EXISTS operations_lifecycle (
  booking_id integer PRIMARY KEY REFERENCES inspection_bookings(id) ON DELETE CASCADE,
  environment varchar(20) NOT NULL CHECK (environment IN ('development', 'production')),
  status varchar(40) NOT NULL CHECK (status IN ('scheduled', 'inspection_started', 'inspection_completed', 'qa_approved', 'report_published', 'report_released')),
  version integer NOT NULL CHECK (version > 0),
  event_id varchar(160) NOT NULL UNIQUE,
  occurred_at timestamptz NOT NULL,
  receiver_identifiers jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE operations_delivery_outbox
  ADD COLUMN IF NOT EXISTS next_reconcile_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS last_reconcile_at timestamptz,
  ADD COLUMN IF NOT EXISTS reconcile_error_code varchar(80);
CREATE INDEX IF NOT EXISTS operations_outbox_reconcile_due
  ON operations_delivery_outbox(environment, status, next_reconcile_at);
CREATE TABLE IF NOT EXISTS operations_lifecycle_events (
  event_id varchar(160) PRIMARY KEY,
  booking_id integer NOT NULL REFERENCES inspection_bookings(id) ON DELETE CASCADE,
  payload_hash varchar(64) NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now()
);