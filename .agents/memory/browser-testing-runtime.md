---
name: Browser testing runtime availability
description: Fallback when the documented browser-testing subagent subtype is not registered
---

The documented testing subagent subtype was rejected by this workspace runtime
as an unknown configuration kind. Check actual availability rather than assuming
the skill documentation guarantees that subtype.

**Why:** The rejection was an environment/runtime mismatch, not an application
failure. Existing isolated Chromium fixtures were able to verify the changed
protected UI with real rendering, stubbed authentication and blocked external traffic.

**How to apply:** If the runtime rejects the documented subtype, use existing
isolated browser fixtures or direct browser automation. Never weaken real app
authentication, invent an alternative callback/configuration or send real
customer/payment/notification traffic to compensate. Distinguish fixture-auth UI
verification from verification of the actual configured account.