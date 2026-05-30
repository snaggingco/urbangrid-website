---
name: Bundle perf — eager shell pulls heavy deps
description: Why the main JS chunk was bloated and how lazy boundaries fixed it
---

# Initial-bundle bloat from eagerly-loaded shell

The app shell (App.tsx imports Home eagerly; FloatingButtons is in the shell
on every route) transitively pulled heavy libraries into the every-page main
chunk:
- ChatWidget (via FloatingButtons) → date-fns, react-day-picker (Calendar),
  react-phone-number-input + CSS.
- ConsultationForm (inline section on the eager Home page) AND
  SampleReportModal → react-phone-number-input country metadata (~197 KB).

**Rule:** anything reachable from App.tsx's eager imports (Home, Header, Footer,
FloatingButtons, SEO, providers) lands in the every-page bundle. Before adding a
heavy dep to one of these, check if the feature can be lazy-loaded behind
interaction or below-the-fold.

**Why:** main index chunk was 683 KB → high TBT (script parse/eval). Lazy-loading
the chat + the two phone-input forms dropped it to ~392 KB (~43%).

**How to apply:**
- Lazy-load interaction-gated UI (chat, modals): `lazy()` + only render after a
  mounted/open flag, wrap the flag's setState in `startTransition` to avoid
  React's "component suspended while responding to synchronous input" warning.
- For below-fold inline sections, lazy + `<Suspense fallback={min-height div}>`
  to avoid layout shift.
- Constraint: vite.config.ts is off-limits here, so no manualChunks — splitting
  must be done with code-level `React.lazy` boundaries.
