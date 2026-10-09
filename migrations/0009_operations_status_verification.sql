-- Development-only, explicitly applied; no startup or deployment DDL.
ALTER TABLE operations_lifecycle ALTER COLUMN version TYPE bigint;
CREATE TABLE IF NOT EXISTS operations_integration_checks (
  environment varchar(20) PRIMARY KEY CHECK (environment IN ('development','production')),
  evidence jsonb NOT NULL,
  checked_at timestamptz NOT NULL DEFAULT now()
);