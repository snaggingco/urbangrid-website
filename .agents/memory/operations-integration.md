---
name: Operations booking integration boundary
description: Scope, privacy and durability decisions for UrbanGrid's outbound Strata Surveyor integration.
---

Outbound creation delivery is for confirmed inspection bookings, not browser conversions or unconfirmed enquiries. The user expanded the integration boundary to authenticated operational lifecycle reconciliation and separated commercial measurement stages. Pricing, payment rules and customer confirmations remain website-owned. Configure the development receiver separately; do not publish as part of integration setup.

**Why:** The user requested server-to-server booking delivery, then explicitly added Strata scheduling/inspection/QA/report progress while retaining verified-payment and report-release safeguards.

**How to apply:** Strata progress must not fabricate money, imply payment clearance or authorize report release. Do not send historical bookings automatically. Keep creation snapshots and delivery recovery unchanged when adding lifecycle integrations.

Creation events must retain the persisted creation-time snapshot and stable, environment-namespaced event ID across retries. Delivery is at least once; the receiver must deduplicate before acknowledging durable receipt. A receiver outage must not fail an already committed booking.

**Why:** Rebuilding payloads from later edits changes the meaning of `booking.created`; blindly retrying without receiver deduplication can create duplicate operational jobs. Booking success must not depend on the operations platform.

**How to apply:** Commit the outbox record in the same transaction as the booking; it becomes deliverable only after commit. Do not split this into an unprotected post-commit insert. Keep delivery credentials server-only in Replit Secrets; expose only the SHA-256 fingerprint through authenticated admin status.

The receiver contract requires the dedicated `URBANGRID_NETWORK_INTEGRATION_KEY` secret in the `x-urbangrid-key` header and an envelope with `eventId`, `type`, `schemaVersion`, `occurredAt`, and `data.booking`.

**Why:** The user specified the exact receiving-system contract; the earlier proposed header/key/envelope names were not the approved contract.

**How to apply:** Keep these names consistent across sender, receiver configuration, tests and documentation. Generate at least 48 random bytes when secure automatic secret creation is available; otherwise report manual Replit Secrets configuration without putting a key elsewhere.

Development end-to-end verification is an explicit exception to the real-booking-only scope: use clearly marked `integration_test` records, reserved invalid contact addresses, and no real contact phone or dispatch address. Send through the normal worker, never through customer form/notification/conversion services.

**Why:** The user requested a real Development receiver test without real customer side effects.

**How to apply:** Keep synthetic records out of business reporting, enforce Development/admin/CSRF guards, and scope cleanup strictly to local synthetic records. Explain that local cleanup cannot retract remote receiver records. Retain only allowlisted receiver identifiers, not whole response bodies.

Trust the actual Development function contracts over the original draft snapshot
contract. Creation can acknowledge only order/job IDs; the project mapping comes
from status. Duplicate acknowledgments can omit IDs entirely.

**Why:** Real receiver verification showed these differences; treating an ID-less
duplicate acknowledgment as a failed replay incorrectly rejects working deduplication.

**How to apply:** Confirm the receiver's explicit duplicate flag and compare
authoritative status mappings before/after replaying the same frozen event. The
status response's `synchronizedAt` is retrieval time, not a revision; use
receiver-owned modification clocks for stable ordering and retain their precision.