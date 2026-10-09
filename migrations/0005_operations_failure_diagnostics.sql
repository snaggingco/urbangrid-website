ALTER TABLE operations_delivery_outbox
  ADD COLUMN IF NOT EXISTS last_failure_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_failure_code varchar(80),
  ADD COLUMN IF NOT EXISTS last_failure_http_status integer;