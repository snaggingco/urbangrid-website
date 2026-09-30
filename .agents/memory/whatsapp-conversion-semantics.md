---
name: WhatsApp conversion semantics
description: How to interpret advertising conversions from WhatsApp contact links
---

An outbound click to UrbanGrid's WhatsApp contact number is a **contact intent** event, not proof that a visitor sent a message, submitted a lead, or booked an inspection. Keep ad-platform conversion naming and reports explicit about this distinction. Do not count WhatsApp share-to-contact links as business enquiries.

**Why:** Clicking an external WhatsApp link can open the app without any message being sent. Labeling these clicks as confirmed leads would overstate ad performance.

**How to apply:** When extending measurement, retain a separate event for actual confirmed leads or bookings. Avoid automatically treating outbound clicks as `lead_created` or merging them into downstream conversion totals.