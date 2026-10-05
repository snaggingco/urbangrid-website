---
name: Browser viewport measurement
description: Interpret repeated viewport-wide shifts and compare equivalent cold-load baselines
---
Compare equivalent cold-load baselines before identifying a CLS regression. When testing multiple viewport sizes, resize an empty document before loading the measured page.

**Why:** Cross-page checks recorded identical BODY shifts across several desktop routes. Those values alone did not establish a new regression; the previous build and its loading behavior needed comparison.

**How to apply:** Keep measurement artifacts out of performance claims and preserve the same SSR/asset setup in baseline fixtures. Await completed reply state in conversational tests; matching text may belong to an earlier reply.