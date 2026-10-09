CREATE TABLE IF NOT EXISTS operations_delivery_outbox (
  event_id varchar(160) PRIMARY KEY,
  booking_id integer NOT NULL REFERENCES inspection_bookings(id),
  environment varchar(20) NOT NULL CHECK (environment IN ('development','production')),
  payload jsonb NOT NULL,
  status varchar(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','failed','delivered')),
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  last_attempt_at timestamptz,
  last_http_status integer,
  last_error_code varchar(80),
  lease_token varchar(36),
  lease_expires_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS operations_outbox_due_idx
  ON operations_delivery_outbox(environment, status, next_attempt_at);