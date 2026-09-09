# UrbanGrid Independent SEO, GEO & LLM Visibility Audit

**Website:** https://urbangrid.ae  
**Audit date:** 9 September 2026  
**Method:** Live production HTTP checks, rendered-page review, source inspection, three independent security scanners, three independent specialist reviews, and current web-discovery tests.

## Executive scorecard

| Engine | Score | Assessment |
|---|---:|---|
| SEO Engine | **62/100** | Sound crawl basics and metadata, but weakened by SPA rendering, duplicated H1s, unsupported schema claims, broken social imagery, weak caching, and severe security risk. |
| GEO Engine | **55/100** | AI crawlers are allowed and service/FAQ schema exists, but `llms.txt` is invalid, core copy is JS-dependent, citations are sparse, and entity evidence is inconsistent. |
| LLM Visibility Engine | **45/100** | UrbanGrid is discoverable for branded searches but absent from the sampled top ten for two high-intent non-branded query groups. |
| Security posture | **Critical action required** | A public API exposes inspector records including password-hash fields, and hardcoded privileged credentials exist in source. |

## Bottom line

UrbanGrid has a better technical foundation than many local-service sites: HTTPS is enforced, important crawlers receive HTTP 200, `robots.txt` allows crawling, the sitemap is populated, canonical tags and JSON-LD are server-injected, and branded discovery works.

The site is not yet “world class.” The highest priority is security, not metadata. The next priorities are making substantive page content available in initial HTML, publishing a real `llms.txt`, correcting schema credibility issues, and building external authority around citable UAE inspection expertise.

## Critical findings

### P0 — Public inspector data and password-hash exposure

**Evidence:** An unauthenticated production request to `https://urbangrid.ae/api/inspectors` returned HTTP 200 and an array of inspector records. Returned fields include `username`, `passwordHash`, `fullName`, `email`, and `phone`. The route in `server/routes.ts` does not apply authentication or a safe response DTO.

**Impact:** Staff PII and credential material are exposed publicly. Password hashes are not passwords, but disclosure enables offline cracking and account targeting.

**Required action:** Immediately require admin authentication, return only explicitly approved public fields, rotate affected inspector credentials, and review access logs.

### P0 — Hardcoded privileged credentials

**Evidence:** `server/adminAuth.ts` and `server/inspectorAuth.ts` contain privileged usernames and passwords in source. Values are deliberately omitted from this report.

**Impact:** Anyone with source access, a leaked repository, or a copied build context may obtain privileged access. Default accounts also persist predictable credentials.

**Required action:** Remove hardcoded credentials, rotate them, store secrets only in managed secrets, disable automatic default-account creation, and add MFA or managed identity.

### P1 — Vulnerable dependency surface

**Evidence:** Dependency scan: **115 findings** — **2 critical, 46 high, 53 moderate, 14 low**. The two critical advisories affect `fast-xml-parser` versions with non-major fixes available. High findings include `axios`, `drizzle-orm`, `nodemailer`, `rollup`, `ws`, `postcss`, and other direct or transitive packages.

**Impact:** Actual exploitability varies by runtime use, but the count is too high to accept. Some advisories involve SQL injection, SSRF, denial of service, credential leakage, and arbitrary file operations.

**Required action:** Prioritize production runtime dependencies, update direct parents, rerun all three scanners, and avoid blanket version overrides until compatibility is tested.

### P1 — Invalid `llms.txt`

**Evidence:** `https://urbangrid.ae/llms.txt` returns HTTP 200 with `text/html` and the homepage SPA shell. It is not an LLM-readable text file.

**Impact:** AI systems receive no concise canonical inventory, service definitions, evidence links, or citation guidance. The false 200 also hides the defect from basic uptime checks.

**Required action:** Publish a genuine UTF-8 `text/plain` file at `/llms.txt` listing the company entity, core services, emirates served, authoritative pages, key facts, contact details, and citation-worthy resources.

## SEO Engine audit

### What is working

- HTTPS and HTTP/2 are active.
- HSTS, CSP, `X-Content-Type-Options`, `X-Frame-Options`, referrer policy, and permissions policy are present.
- `robots.txt` is valid and references `https://urbangrid.ae/sitemap.xml`.
- The sitemap includes core pages, all seven emirate pages, detailed service pages, and blog posts.
- Titles, descriptions, canonical URLs, and JSON-LD are present in initial HTML for tested routes.
- Homepage schema includes Organization, LocalBusiness, and WebSite; service pages include Service and FAQPage.
- Production TTFB measured approximately **178 ms** in a fresh specialist sample, which is healthy.

### P1 — Core content remains too dependent on JavaScript

The server injects route-specific title, description, canonical, hidden H1, and schema, but most meaningful body copy, internal links, proof, FAQs, and service explanations arrive after React hydration.

**Impact:** Google can render JavaScript, but Bing-based systems and time-limited AI crawlers may extract only the generic shell. This also reduces resilience when scripts fail.

**Fix:** Server-render or pre-render substantive route content. At minimum, include the primary answer block, service summary, key proof, FAQ text, and internal links in initial HTML.

### P1 — Duplicate H1 signals

The tested initial HTML contains both a route-specific visually hidden H1 and the generic hero H1.

**Impact:** Multiple H1s are not automatically penalized, but this implementation sends mixed topic signals and repeats a generic company claim across routes.

**Fix:** Use one route-specific H1 per page. Render the visible page heading as the H1 and make the shared hero heading a non-H1 element on inner pages.

### P1 — Trust claims are inconsistent

The site presents “40,000+ properties inspected,” “600,000+ defects documented,” “2,000+ clients,” “10+ years,” and high satisfaction/review claims without a visible methodology or consistent source.

**Impact:** Inconsistency weakens E-E-A-T, conversion trust, and LLM confidence. AI systems prefer facts they can verify and quote safely.

**Fix:** Create a fact registry with definitions, dates, and evidence. Use one current set of claims site-wide and link to methodology, case studies, certifications, or independent profiles.

### P2 — Unsupported aggregate ratings in schema

`aggregateRating` values are attached to Organization, LocalBusiness, and Service provider schema without visible review entities or an identified external review source.

**Impact:** Search engines may ignore the markup or treat it as self-serving. Repeated unsupported ratings reduce schema trust.

**Fix:** Remove aggregate ratings until verifiable reviews are displayed and eligible under Google’s structured-data policies.

### P2 — Location schema overstates physical presence

Emirate pages vary `areaServed` but reuse a Dubai/Business Bay address.

**Impact:** This can confuse local entity signals and imply offices that may not exist.

**Fix:** Use Service/areaServed for service areas. Only use LocalBusiness addresses for genuine staffed locations with consistent GBP/NAP evidence.

### P2 — Broken Open Graph image

The homepage declares `https://urbangrid.ae/og-image.jpg`, but the specialist live check found that URL resolving to HTML rather than a valid image.

**Impact:** Social previews and some AI source cards may fail or show no image.

**Fix:** Publish a real 1200×630 image with the correct MIME type and validate Open Graph/Twitter cards.

### P2 — Static assets are not cached effectively

Fingerprint-named production assets return `cache-control: private, max-age=0`.

Measured payloads:

- Main JavaScript: **403,503 bytes raw**
- Main CSS: **204,329 bytes raw**
- Initial JS + CSS: approximately **618 KB raw / 168 KB gzip**

**Impact:** Repeat visitors must revalidate immutable files, increasing latency and bandwidth. The main bundle also increases hydration and interaction risk.

**Fix:** Serve hashed assets with `public, max-age=31536000, immutable`; continue splitting non-critical UI and reduce the main bundle.

## GEO Engine audit

### AI crawler access

Live checks returned HTTP 200 for:

- GPTBot
- ChatGPT-User
- ClaudeBot
- Google-Extended
- PerplexityBot
- Bingbot
- Googlebot

This is a genuine strength. The universal `Allow: /` policy does not block major discovery or training crawlers.

### Citability weaknesses

- Important copy is often promotional rather than source-backed.
- Few claims cite named regulators, standards bodies, studies, or dated UAE sources.
- Case studies and statistics lack transparent methodology.
- Author credentials and reviewer information are not consistently prominent.
- The `sameAs` schema points only to UrbanGrid’s own site rather than authoritative external profiles.
- Generic hero content appears across many routes, reducing page-specific answer density.

### Priority GEO improvements

1. Add a 40–60 word direct answer at the top of each key page.
2. Turn H2/H3 headings into natural questions buyers ask.
3. Add named sources for RERA, Dubai Municipality, NFPA, ASHRAE, and relevant UAE regulations.
4. Publish inspectable case studies with property type, size, stage, tools used, defect categories, totals, and outcomes.
5. Add expert bylines and reviewer credentials.
6. Use comparison tables, checklists, definitions, and concise FAQ answers.
7. Strengthen Organization schema with stable `@id` values and genuine external `sameAs` profiles.
8. Add `datePublished`/`dateModified` and visible update dates to knowledge content.

## LLM Visibility Engine audit

### Current discovery tests

Three current web-grounding query groups were sampled:

| Query group | UrbanGrid result |
|---|---|
| Best property snagging / building inspection companies in UAE and Dubai | **Absent from sampled top 10** |
| Building condition assessment / technical due diligence providers in UAE | **Absent from sampled top 10** |
| What is UrbanGrid UAE / branded property inspection query | **Present, approximately position 3** |

One indexed careers snippet still displayed the old assistant name “Lena,” indicating stale external indexing even though the live site now uses Nova.

### Interpretation

UrbanGrid has branded entity recognition but weak non-branded category visibility. This is the typical profile of a site with good owned-page coverage but insufficient external authority, citation density, and top-ten traditional search presence.

### Important limitation

This run used current search-grounding evidence and an independent LLM synthesis. It did **not** authenticate into the consumer interfaces or APIs of ChatGPT, Claude, and Gemini. Therefore it must not be represented as a direct three-model share-of-voice benchmark.

A direct benchmark should run the same 20–30 prompts across all three platforms, in fresh sessions, from the UAE target geography, recording brand mention, citation URL, citation position, competitors, and answer sentiment. Repeat monthly because outputs vary by model version, location, and retrieval state.

## Security detail

### Confirmed strengths

- Strong baseline response headers.
- No high/critical SAST findings were returned by the automated static scanner.
- HoundDog returned five privacy/dataflow findings: one medium and four low.

### Confirmed risks

- Public inspector endpoint exposes PII and password-hash fields.
- Hardcoded privileged credentials and fallback session secret.
- Session cookie configuration explicitly sets `secure: false`.
- API responses are captured and written to application logs; successful visitor requests also store IP address and user agent.
- HoundDog confirmed contact email/phone data can be written to logs.
- Source contains unauthenticated conversation CRUD and model-invocation routes. The tested production `/api/conversations` currently returned the SPA shell, so live exposure was **not confirmed** for that module; route registration must still be reviewed.

## Prioritized action plan

### First 24 hours

1. Protect `/api/inspectors` and remove sensitive fields from its response.
2. Rotate admin and inspector credentials; remove all hardcoded credentials.
3. Verify production session-secret enforcement and secure cookie settings.
4. Review logs for access to the exposed endpoint.

### First 7 days

1. Patch critical and high production dependencies, then rerun scans.
2. Publish a valid `llms.txt`.
3. Fix the Open Graph image.
4. Remove unsupported rating markup.
5. Reconcile all company metrics and credentials.
6. Stop logging API response bodies and contact PII.

### First 30 days

1. Pre-render meaningful content for every priority service and location route.
2. Correct H1 hierarchy and location schema.
3. Add citable expert content, evidence, bylines, and update dates.
4. Configure immutable caching for fingerprinted assets.
5. Build a 20–30 prompt LLM visibility benchmark.

### 60–90 days

1. Publish authoritative UAE inspection datasets and case-study clusters.
2. Earn citations from property, facilities-management, standards, and UAE business sources.
3. Establish verified entity profiles and consistent NAP/GBP signals.
4. Track non-branded ranking, AI mention rate, citation rate, and lead conversion monthly.

## Measurement framework

Track:

- Indexed canonical pages vs. sitemap pages
- Search Console clicks/impressions by service and emirate
- Core Web Vitals field data
- AI crawler hits by user agent
- LLM brand mention rate
- LLM citation rate and cited URL
- Share of voice against five named competitors
- Branded vs. non-branded organic leads
- Schema validation errors
- Security scanner critical/high counts

## Audit confidence

- **High confidence:** Live headers, crawler status, `robots.txt`, sitemap, invalid `llms.txt`, exposed inspector endpoint, source-level hardcoded credentials, schema payloads, static asset caching, bundle sizes.
- **Medium confidence:** SEO/GEO scores, because they are composite judgment scores rather than search-engine metrics.
- **Limited:** Direct ChatGPT/Claude/Gemini visibility and field Core Web Vitals; authenticated model tests and PageSpeed API data were unavailable in this run.
