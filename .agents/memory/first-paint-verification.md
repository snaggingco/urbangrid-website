---
name: First-paint verification
description: Production versus development differences when checking initial public HTML.
---

Validate first-paint injection against built production HTML, not just the Vite
development response.

**Why:** Vite moves the entry module script from the body to the head during
production builds. An injection boundary based on the development script
position can silently miss the production root. Development also needs an
explicit early stylesheet for meaningful pre-JavaScript visual checks.

**How to apply:** Use explicit root boundaries and compare initial and final
geometry with production-built assets. Test delayed authentication separately
so public rendering cannot accidentally depend on it.

Build-only Vite rendering must disable HMR.

**Why:** A middleware-mode Vite instance can still open an HMR listener; Replit
can then add an unwanted port mapping even though the instance only exists to
generate markup.

**How to apply:** Keep build-only rendering free of listeners and application
startup side effects. Inspect configuration diffs after adding such helpers.

Separate production builds from running development-preview checks.

**Why:** Build-time Vite rendering can invalidate the live server's optimized
dependency metadata, causing otherwise valid lazy pages to return
`504 Outdated Optimize Dep`.

**How to apply:** Complete the build before restarting the development workflow
and checking preview routes. Keep build-only dependency caches isolated if
changing the rendering tooling; do not diagnose a stale dependency cache as a
page-logic regression.