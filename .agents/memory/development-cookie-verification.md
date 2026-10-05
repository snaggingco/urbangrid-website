---
name: Development cookie verification
description: Avoid false authentication failures caused by cookie rewriting in the development preview proxy.
---
Development preview responses have been observed returning HttpOnly, Secure, SameSite=None cookies even when the application sets SameSite=Lax. Treat this as observed preview behavior, not a guarantee about every Replit environment.

**Why:** Real development sign-in succeeded and regenerated the session, but a strict Lax-only assertion incorrectly failed after the preview proxy changed the cookie attributes.

**How to apply:** Check application-issued cookie settings separately from the proxied response. A development verifier may accept None only with Secure and HttpOnly on the runtime-managed development preview domain. Do not weaken production cookie settings to satisfy a preview assertion. Inspect flags only; never print cookie values or credentials.