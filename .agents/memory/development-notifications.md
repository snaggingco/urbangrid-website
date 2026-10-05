---
name: Development notification transport
description: Why lead tests must isolate outbound notification delivery
---

Do not assume that development form submissions are isolated from real notification email delivery.

**Why:** Development route tests delivered labeled notifications to the real staff inbox. Removing development database fixtures does not retract those emails.

**How to apply:** Exercise real route handlers with a stubbed notification transport in a local test harness, or explicitly account for real notifications before testing forms against the running development service. Environment snapshots may omit configured SMTP settings; do not infer that delivery is disabled from the snapshot.