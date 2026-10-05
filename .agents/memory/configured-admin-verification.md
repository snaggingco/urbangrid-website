---
name: Configured admin verification
description: Prevent auth verification from changing the account it is supposed to test
---

For configured-identity authentication verification, confirm that the existing runtime secret already authenticates the existing account before starting an isolated auth server. Stop on mismatch rather than making login pass by bootstrapping or rotating credentials.

**Why:** Normal authentication initialization reconciles stored credentials with the initial-password secret, so starting a test server is not necessarily read-only. Synthetic bootstrap/rotation tests do not establish that the actual configured identity can log in.

**How to apply:** Test real login, session restoration, protected access and logout with the configured identity; keep credentials, hashes and cookies out of output. Compare the account and credential records before/after internally and clean up only the test sessions.