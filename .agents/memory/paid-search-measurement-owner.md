---
name: Paid-search measurement owner
description: The user's decision about which GA4 property owns UrbanGrid measurement
---

Use the GTM-managed GA4 property G-ZX4B5QJGB4 as UrbanGrid's sole GA4 receiver. Do not reinstate the parallel standalone GA4 configuration.

GTM is the sole owner of browser-side Google Ads conversion firing. The user subsequently authorized explicit GA4-only business events to the same sole receiver, while preserving existing GTM event names and Ads behavior. Never add direct Ads conversion calls or reuse a WhatsApp conversion label for form successes.

Use one Google event command per action, explicitly sent to the sole GA4 destination, retaining the original event/context fields on that same queue entry. Do not also push a separate plain custom-event object.

**Why:** Google's runtime turns a Google event command into a same-named GTM custom event. A plain event plus a second GA4-only command fires the existing Ads custom-event triggers twice; `send_to` restricts Google event delivery, not GTM trigger evaluation. Isolated extra Google-tag/data-layer initialization did not reliably preserve the connected tag's destinations and Ads pipeline in real-script fixtures.

**How to apply:** Preserve the single-entry bridge and test against Google's real published scripts with all collection traffic intercepted. Non-key GA4 events can batch for about five seconds; waiting less than that can falsely report missing delivery.

The user chose first-party consent controls with Accept/Reject non-essential choices and no third-party CMP. Preserve the pre-GTM denied defaults for all four Google consent types, and restore explicit saved choices before GTM. Consent default/update commands are the exception to the custom-event-only rule; never turn them into tag initialization or conversion commands.

**Why:** The user explicitly chose the GTM-managed property after an audit identified two GA4 receivers, then required all Google Ads conversion firing to remain in GTM to prevent mixed ownership and misclassified leads.

**Why (consent):** The user required early denied defaults to prevent tags reading unset consent, then requested persisted first-party choices without disrupting GTM ownership, contact events, attribution, or forms. Google consent does not govern separate non-Google advertising pixels; those must honor the same explicit choice separately.

**How to apply:** Preserve GTM-NGVDWWRF and the chosen GA4 destination. Emit whatsapp_click, call_click, and server-confirmed generate_lead with non-sensitive context only on the production hostnames after accepted consent. Keep storage/consent decisions unchanged. Check live container behavior; do not add a second GA4 forwarder alongside the site bridge. GA4 form_start key-event marking is an admin setting, not a site-side workaround.