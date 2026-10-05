---
name: Measurement CSP verification
description: Separate correct consent state from CSP permission and successful measurement delivery
---

Correct Google consent state and data-layer events do not prove that outbound measurement requests are permitted by CSP or delivered. Request interception used to avoid recording test conversions can mask or alter normal CSP/network failures.

**Why:** Consent runtime checks passed, but Tag Assistant subsequently identified a blocked Google measurement endpoint in the enforced policy. The previous tests intentionally suppressed measurement delivery.

**How to apply:** Inspect the enforcing response headers and browser CSP violations separately from consent-state and mocked conversion checks. Report client event integrity, CSP permission, and actual delivery as distinct verification results.

For this project, preserve the existing CSP directives and allowed origins. Measurement fixes should add only missing explicit Google origins required by Google's documented guidance, never an unrestricted wildcard or generic HTTPS allowance for connections.

**Why:** The user required Google measurement compatibility without broadly weakening the policy.

**How to apply:** Retain existing development-host patterns and non-Google allowances; do not expand unrelated directives or tracking ownership.