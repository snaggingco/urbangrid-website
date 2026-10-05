---
name: Browser listener ownership
description: Why module-local installation guards can still duplicate delegated click measurement
---

Browser-wide delegated measurement listeners need a page-global installation guard.

**Why:** Vite imports with different URL/query aliases can instantiate the same module more than once. Each instance has separate module-local state, so a module-local guard does not prevent duplicate listeners.

**How to apply:** Keep listener ownership and cleanup shared at the page level. Test repeated installation through a separate dynamic import, not only repeated calls to the same imported function. Cleanup must not remove ownership of a subsequently installed replacement listener.