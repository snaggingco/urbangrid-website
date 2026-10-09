-- Additive only. Never run automatically at startup/deploy. Reviewed dev migration.
BEGIN;
CREATE TABLE IF NOT EXISTS inspection_bookings (
  id serial PRIMARY KEY, lead_id integer NOT NULL REFERENCES contact_submissions(id),
  submission_key varchar(100) NOT NULL UNIQUE, booking_reference varchar(60) NOT NULL UNIQUE,
  service varchar(80) NOT NULL, property_type varchar(40) NOT NULL, area_hundredths integer NOT NULL,
  bedrooms varchar(20), project varchar(255) NOT NULL, location varchar(255) NOT NULL, emirate varchar(60) NOT NULL,
  inspection_date date NOT NULL, time_window varchar(100), base_minor integer NOT NULL, vat_minor integer NOT NULL,
  quote_total_minor integer NOT NULL, currency varchar(3) NOT NULL DEFAULT 'AED',
  status varchar(30) NOT NULL DEFAULT 'booked', inspection_completed_at timestamptz,
  attribution jsonb, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  confirmation_sent_at timestamptz, confirmation_claimed_at timestamptz,
  CONSTRAINT inspection_bookings_amounts_valid CHECK
    (base_minor > 0 AND vat_minor >= 0 AND quote_total_minor = base_minor + vat_minor AND currency = 'AED' AND area_hundredths > 0)
);
CREATE INDEX IF NOT EXISTS inspection_bookings_lead_idx ON inspection_bookings(lead_id);
CREATE TABLE IF NOT EXISTS inspection_payments (
  id serial PRIMARY KEY, booking_id integer NOT NULL REFERENCES inspection_bookings(id),
  lead_id integer NOT NULL REFERENCES contact_submissions(id), provider varchar(30) NOT NULL DEFAULT 'ziina',
  provider_intent_id varchar(255) UNIQUE, operation_id varchar(100) NOT NULL UNIQUE,
  payment_type varchar(20) NOT NULL DEFAULT 'full', amount_minor integer NOT NULL, currency varchar(3) NOT NULL DEFAULT 'AED',
  status varchar(30) NOT NULL DEFAULT 'created', redirect_url text, provider_reference varchar(255), metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), completed_at timestamptz,
  CONSTRAINT inspection_payments_amount_valid CHECK (amount_minor > 0 AND currency = 'AED' AND payment_type IN ('full','refund'))
);
CREATE INDEX IF NOT EXISTS inspection_payments_booking_idx ON inspection_payments(booking_id);
CREATE UNIQUE INDEX IF NOT EXISTS inspection_payments_active_ziina_idx ON inspection_payments(booking_id)
  WHERE provider = 'ziina' AND status IN ('created','pending');
CREATE TABLE IF NOT EXISTS booking_audit (
  id serial PRIMARY KEY, booking_id integer NOT NULL REFERENCES inspection_bookings(id),
  action varchar(80) NOT NULL, actor varchar(100) NOT NULL, details jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS booking_audit_booking_idx ON booking_audit(booking_id);
COMMIT;