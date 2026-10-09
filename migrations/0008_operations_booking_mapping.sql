-- Additive Development migration; never run automatically against Production.
ALTER TABLE inspection_bookings
  ADD COLUMN IF NOT EXISTS strata_identifiers jsonb,
  ADD COLUMN IF NOT EXISTS strata_last_sync_at timestamptz;
ALTER TABLE operations_lifecycle DROP CONSTRAINT IF EXISTS operations_lifecycle_status_check;
ALTER TABLE operations_lifecycle ADD CONSTRAINT operations_lifecycle_status_check
  CHECK (status IN ('booked', 'scheduled', 'inspection_started', 'inspection_completed',
    'qa_approved', 'report_published', 'report_released'));