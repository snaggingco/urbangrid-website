ALTER TABLE inspection_bookings
  ADD COLUMN IF NOT EXISTS is_integration_test boolean NOT NULL DEFAULT false;
ALTER TABLE operations_delivery_outbox
  ADD COLUMN IF NOT EXISTS is_integration_test boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS receiver_identifiers jsonb;