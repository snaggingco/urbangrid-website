---
name: UAE release scope and execution limits
description: Minimal-change security scope and honest Autoscale delivery guarantees for UAE DOS releases.
---

Preserve the current design stack when resolving UAE release-critical security
issues; distinguish trusted-file build tooling advisories from demonstrated
public request exposure rather than forcing a Tailwind replacement.

**Why:** The user requested release blockers only, with minimal behavior changes
and preservation of SEO, routes, lead flow and design. Runtime fixes do not
justify a styling migration.

**How to apply:** Report remaining advisory severity honestly, retain separate
security debt, and test the production build/first-paint output after compatible
toolchain changes.

Durable queues and expiring leases establish restart recovery, not execution
while Autoscale is scaled to zero. Manual authenticated admin recovery is not
an authenticated scheduler.

**Why:** UAE release review requires evidence for delivery/status recovery and an
explicit supported execution arrangement; an idle web-process timer cannot run.

**How to apply:** Verify separate-process recovery with synthetic Development
data and isolated transports. If scheduling is absent, report that provisioning
blocker rather than claiming continuous delivery. Production provisioning,
schema application and publishing require separate authorization.

An independent GitHub Actions tick is the chosen no-upgrade execution mechanism
for this UAE web app. Scheduled workflows must live on the repository's default
branch, even when website source is synchronized on a separate release branch.
Keep the existing integration credential encrypted in Actions secrets, not YAML.

**Why:** The user requires durable retries and status reconciliation when Autoscale
sleeps, using already authorized hosting without buying upgrades. The repository
has authorized Actions capability; an external request can wake Autoscale.

**How to apply:** Preserve other default-branch application files when updating
the scheduler. Require successful published-route jobs and scheduled-run evidence;
GitHub schedules can be delayed and must not be described as a strict SLA.

Repository admin metadata and `repo` OAuth scope do not establish permission to
write Actions workflow files. GitHub's separate `workflow` scope is required even
when ordinary source and encrypted Actions-secret writes succeed.

**Why:** The authorized connection allowed ordinary Git tree creation and secret
provisioning but rejected workflow-file creation. Reauthorizing the same declared
scope set cannot be assumed to add a scope the provider configuration omits.

**How to apply:** Keep the workflow as a versioned ordinary-file template until a
workflow-authorized owner or connection installs it on the default branch. Verify
actual writes and runs; do not infer scheduler activation from repository roles.