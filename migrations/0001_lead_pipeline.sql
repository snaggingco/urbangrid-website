-- Additive schema reference for the development-only Drizzle db:push flow.
-- Do not execute against production or add this to startup/deployment hooks.
-- Existing records are retained; legacy milestone dates are intentionally not inferred.
BEGIN;
ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS qualified_at timestamptz,
  ADD COLUMN IF NOT EXISTS quoted_at timestamptz,
  ADD COLUMN IF NOT EXISTS booked_at timestamptz,
  ADD COLUMN IF NOT EXISTS completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS lost_at timestamptz,
  ADD COLUMN IF NOT EXISTS quote_value_minor integer,
  ADD COLUMN IF NOT EXISTS quote_currency varchar(3) NOT NULL DEFAULT 'AED',
  ADD COLUMN IF NOT EXISTS lost_reason text,
  ADD COLUMN IF NOT EXISTS inspection_date date,
  ADD COLUMN IF NOT EXISTS booking_reference varchar(255);
CREATE TABLE IF NOT EXISTS public.lead_stage_history (
  id serial PRIMARY KEY,
  lead_id integer NOT NULL REFERENCES public.contact_submissions(id),
  from_stage varchar(30) NOT NULL,
  to_stage varchar(30) NOT NULL,
  changed_at timestamptz NOT NULL DEFAULT now(),
  note text
);
CREATE INDEX IF NOT EXISTS contact_submissions_stage_created_idx
  ON public.contact_submissions(stage, created_at);
CREATE INDEX IF NOT EXISTS contact_submissions_source_created_idx
  ON public.contact_submissions(lead_source, created_at);
CREATE INDEX IF NOT EXISTS lead_stage_history_lead_changed_idx
  ON public.lead_stage_history(lead_id, changed_at);
COMMIT;