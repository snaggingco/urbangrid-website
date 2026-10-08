---
name: Programmatic runtime compatibility
description: Avoid unavailable crypto and clock globals in the programmatic callback sandbox
---

Some programmatic-callback sessions do not provide the documented top-level
`crypto` global or zero-argument `new Date()`.

**Why:** A runtime rejected both before a live test request could be sent.
Assuming the general sandbox documentation matched this session caused avoidable
failures.

**How to apply:** When these calls are rejected, obtain UUIDs with an impure
function importing `node:crypto`, and obtain advancing timestamps inside that
function. Return serializable values to durable scope. Before retrying any
mutating request, establish whether the failed block reached the HTTP call;
never create another test identity merely because output was interrupted.
