---
name: Database target verification
description: Prove development database ownership before running tests that write fixtures.
---

A workspace can carry a production environment label even while connected to development data. Do not treat that label alone as proof of the database target, and do not simply override it to make a test pass.

**Why:** This fork's workspace exposed a production label; a fresh marker written through the development database tool established that the test connection actually reached development.

**How to apply:** Before mutable database tests, insert a unique harmless development-only marker through the environment-aware database tool and require the app connection to see it. Abort on mismatch; remove the marker and fixtures afterward. Keep production queries read-only and never print connection strings or credentials.
