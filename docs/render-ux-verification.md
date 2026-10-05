# Public first-paint render verification

Scope: homepage and Dubai coverage page. No publication, database/schema
changes, booking/payment logic changes, or authentication logic changes.

## Approach

Build-time markup uses the actual shared header, homepage hero/stats and Dubai
hero components. Production injects it into explicit HTML root markers;
development renders those components through Vite with an early stylesheet.
React replaces this visible shell at commit rather than deleting it first.
Dubai's page chunk is preloaded before the first React commit. Public content
does not wait for authentication; existing protected-route guards remain.

Static-preview controls wait for React, keeping early navigation/contact
clicks behind attribution and delegated tracking setup, and preventing form
submissions or lost typing before commit. Real React controls/forms are
unchanged. The page itself is never hidden.

## Measurements — 2026-10-03

Three cold-cache runs per view against the actual production-render helper and
production-built assets, using headless Chromium:

- Desktop homepage: 1366 × 900.
- Mobile Dubai: 402 × 874.
- Network: 150 ms simulated latency, 200,000 bytes/s download.
- CPU: 4× slowdown.
- Fixture authentication deliberately delayed by 2.5 seconds.
- Fixture does not start the application, connect to a database, send email,
  submit forms, take payments, sign in or run production advertising tags.

| View | CLS range | Median FCP/LCP | Median React commit | Median auth completion |
|---|---:|---:|---:|---:|
| Homepage desktop | 0.000285–0.000285 | 1.38 s | 2.32 s | 4.90 s |
| Dubai mobile | 0–0 | 1.41 s | 2.43 s | 4.92 s |

All runs showed only the first-paint shell followed by the real page, with no
empty or spinner stage. Initial and final H1 text, font size and rectangle
matched exactly:

- Homepage: 72 px; x=163.5, y=112, width=768, height=288.
- Dubai: 36 px; x=20, y=144, width=362, height=116.625.

Earlier live audit samples measured CLS of approximately 0.036 on desktop
home and 0.409 on mobile Dubai, with final hero LCP around 2.91/2.65 seconds.
Those were live samples, not a same-origin controlled before/after experiment.
The more complete initial paint now waits for real styling/fonts; its FCP is
slightly later than the earlier simplified fallback, but the main hero is
already final-size at that paint.

## Checks and remaining limits

- Production build passed.
- Production public/admin/booking shell and SEO checks passed, including
  canonical ownership, noindex rules, consent-before-app ordering and genuine 404.
- Initial controls are held; real quote fields become enabled after commit.
- Both views visually inspected; development Dubai mobile preview checked.
- No server-side authorization, consent/GTM, attribution or conversion code
  was changed. Real advertising delivery and signed-in admin UI were not
  exercised in the fixture.
- Tiny homepage font-swap shift remains (approximately 0.0003).
- The existing consent overlay mounts normally; its logic is unchanged.
- Other public routes no longer wait for auth but retain their existing
  generic initial markup. Matching their own first-paint layouts is deferred.
- Type-check still reports the same 22 pre-existing errors, with no new errors
  in the render changes.

Reproduce after building: `node scripts/measure-public-render.mjs`.