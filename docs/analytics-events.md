# Browser measurement contract

## Commercial stages and engagement

See [the country-site commercial contract](country-site-integration-contract.md#commercial-measurement-contract).
`generate_lead`, `whatsapp_click`, `call_click`, `booking_confirmed` and `purchase`
are distinct commercial stages. Explicit site events carry `event_category`,
`commercial_stage` and `is_primary_business_conversion`. Engagement events,
including `form_start` and generic `click`, are classified false, not suppressed.
Call intent is limited to UrbanGrid's own business telephone numbers.
Booking confirmation never reports quote value as revenue. Payment measurement
uses completed actual ledger entries and stable transaction IDs; test, pending
and refunded payments are excluded. Browser retry events are deduplicated.

GA4 key-event markings and published GTM/Ads triggers are external settings.
Unmark engagement as key events and restrict conversion triggers to the explicit
commercial allowlist; retain Enhanced Measurement engagement. This repository
change does not claim to have changed those external settings.

Google Tag Manager container **GTM-NGVDWWRF** owns browser-side Google Ads conversion firing and Google tag configuration. The sole GA4 destination remains **G-ZX4B5QJGB4**. Application code specifies that GA4 destination for business events only; it never initializes another Google tag or specifies an Ads conversion destination.

The first script queues the unchanged Consent Mode v2 default before any tag/application script: all four consent types are denied, with `wait_for_update: 500`. The existing first-party controller restores and persists Accept/Reject choices and queues updates. GTM and the advertising pixel initialize only after acceptance on `urbangrid.ae` or `www.urbangrid.ae`. Business events also require accepted consent on those hosts. Withdrawal blocks business events and sets the Google-documented `ga-disable-G-ZX4B5QJGB4` flag to stop automatic GA4 measurement. Attribution storage and internal contact-click logging are unchanged.

The website queues these named events on `window.dataLayer`:

| Event | When it is pushed | Specific context |
| --- | --- | --- |
| `whatsapp_click` | A click on a business WhatsApp link; sharing a blog or contacting another recipient is excluded | `contact_channel: "whatsapp"`, CTA region |
| `call_click` | A click on a `tel:` link | `contact_channel: "phone"`, CTA region |
| `generate_lead` | A successful backend response confirms a positive saved lead ID | `lead_id`, `form_source` |

All events include `page_url`, `page_path`, `cta_source`, `first_touch`, and `last_touch`. Each touch includes available UTM parameters, `gclid`, `gbraid`, `wbraid`, a sanitized `landing_page`, and `captured_at`. Missing fields are explicit `null` values to prevent GTM's merged data-layer model retaining identifiers from an older event.

Measurement payloads exclude form values, contact details, WhatsApp message text, arbitrary URL query parameters, fragments, and raw referrers. Page URLs retain only recognized marketing parameters. Values resembling email addresses or phone numbers in textual UTMs are omitted. This measurement projection does not change the attribution saved with leads.

Each action queues **one** standard Google `event` Arguments entry with `send_to: "G-ZX4B5QJGB4"`. It retains the original top-level `event` and context fields for observers. Google's runtime converts that same command into the named GTM custom event, so the existing Ads triggers run once per action without a second plain-object push. Never emit both a plain object and an event command for the same action: even GA4-only `send_to` would duplicate the GTM Ads trigger.

GA4 receives sanitized scalar parameters, with `page_location`/`page_referrer`, non-null business fields, and flattened first/last attribution. Redundant timestamps and nulls remain in the original context/storage but are omitted from the GA4 projection to keep it within 25 parameters.

Lead events require a positive integer persisted lead ID and are deduplicated across module instances and session-storage retries, including when storage is blocked. One delegated, idempotently installed click listener emits one event per contact action without preventing navigation. Denied/development events are not buffered for later consent. Internal click logging is retained and does not fire Google Ads conversions.

## GTM configuration

GTM retains the existing Ads custom-event triggers and tags. Published behavior is one WhatsApp conversion tag, two call conversion tags, and one lead conversion tag; this site change does not alter those counts. Do not add another GA4 forwarder for these events alongside the site's explicit send path. Repository changes do not change the externally managed container.

The application never emits `form_start`. Enhanced Measurement's automatic form tracking and GA4's `form_start` key-event marking are GA4-admin settings. Unmark `form_start` as a key event in the verified UrbanGrid property; do not suppress it through a site workaround.

Broker partnership leads retain `form_source: "broker_referral"` so GTM can exclude them from service-lead conversion goals.

## Verification

Run `npx tsx scripts/test-paid-search.mjs https://$REPLIT_DEV_DOMAIN` against development. The test uses real lead route handlers with stubbed email delivery, removes its database fixtures, and verifies submission retries, attribution and lifecycle persistence, and development measurement exclusion. Development does not load the production GTM container.

Run `node scripts/test-ga4-business-events.mjs` after a production build for browser-only tracking verification. It uses real site helpers and Google's published scripts on intercepted production-like hosts; no collection requests or API writes leave the fixture. It compares original Ads request paths with GA4-enabled paths, verifies exactly one GA4 business event each, and covers consent denial/revocation, persisted-lead success/failures/retries, booking-created leads, blocked storage, module aliases, both live hosts, and non-live host exclusion. Non-key GA4 events batch for about five seconds; checks wait for that flush. This verifies request generation, not receipt in GA4.