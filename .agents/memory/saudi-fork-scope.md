---
name: Saudi fork scope
description: Intended market of this fork and treatment of inherited UAE context.
---

This project is intended to run the Saudi Arabia site, not the UAE site.

**Why:** The user explicitly confirmed "Saudi Arabia site" when asked which market this project serves.

**How to apply:** Treat inherited UAE business rules and memories as reference context, not confirmed Saudi requirements. Do not register this fork as UAE merely to make publishing pass. Preserve country database and integration credential isolation.

GitHub remains the source of code. Keep Saudi publication corrections on a separate fix branch and do not change UAE/main or UAE data.

**Why:** The user explicitly required GitHub as the source and asked to unblock the Saudi fork without touching UAE.

**How to apply:** Sync source corrections to GitHub; keep this fork's runtime country settings scoped to this Replit project rather than exporting them to the shared UAE deployment.

A project's provisioned managed database can serve that country without duplicating its connection string into a country-specific secret, provided access is explicitly opted in and bound to the correct project. This is not permission to fall back to a copied external UAE database.

**Why:** The Saudi fork already had its own provisioned production database; the inherited external-database isolation rule incorrectly assumed every generic connection was the UAE database.

**How to apply:** Establish database ownership first. Preserve separate country credentials for external databases and integrations, and never enable UAE commercial side effects merely to pass startup.

Do not make publication depend on the editor-only project identifier. A managed database binding must also work with the platform-assigned production domain.

**Why:** Official Replit configuration documentation does not guarantee the editor's project identifier in published deployment environments.

**How to apply:** Require explicit managed-database opt-in and verify the platform-bound site domain in production; copied fork settings must not authorize a different host.
