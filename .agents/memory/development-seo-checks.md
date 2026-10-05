---
name: Development SEO checks
description: Avoid mistaking development-domain indexing safeguards for production route defects.
---

Do not infer production indexability from development-domain X-Robots-Tag headers.

**Why:** A development-domain request returned a correct permanent redirect but also carried global noindex headers, causing an assertion about absent headers to fail even though the requested route behavior worked.

**How to apply:** Check status codes and redirect destinations in development. Verify application metadata separately and inspect published headers only after the user publishes. Never remove indexing safeguards just to make a development check pass.