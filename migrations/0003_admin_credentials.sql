-- Additive development migration; no password values and no startup DDL.
BEGIN;
CREATE TABLE IF NOT EXISTS admin_credentials (
  username varchar(255) PRIMARY KEY,
  user_id varchar NOT NULL UNIQUE REFERENCES users(id),
  password_hash varchar(255) NOT NULL,
  credential_version varchar(36) NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
COMMIT;