# Crash Handling Explanation (Week 15)

## 1. Objective

Provide reliable client-side crash/error observability for a web-based stack and produce auditable evidence for Week 15 testing deliverables.

## 2. Approach Rationale

Firebase Crashlytics is optimized for native platforms. For BazaarPK web, an equivalent observability mechanism is implemented using browser-level error interception and Firestore persistence.

### 2.1 Why this is acceptable for Week 15

- Captures unhandled runtime failures in production-like conditions.
- Produces traceable records for verification and reporting.
- Supports investigation with message, stack, and execution context.

## 3. Implemented Architecture

| Layer | Component | Responsibility |
|---|---|---|
| Bootstrap | `src/main.tsx` | Installs global error handlers at app startup |
| Error utility | `src/lib/crashReporting.ts` | Centralized capture and normalization |
| Browser hooks | `window.onerror`, `window.onunhandledrejection` listeners | Intercepts runtime and async failures |
| Persistence | Firestore `client_errors` collection | Stores crash/error records for audit and review |

## 4. Captured Error Schema

| Field | Description |
|---|---|
| `context` | Source context (`window.error`, `window.unhandledrejection`, etc.) |
| `message` | Error summary / message text |
| `stack` | Stack trace (when available) |
| `timestamp` | Server-side event time (`serverTimestamp`) |
| `userAgent` | Browser and client metadata |

## 5. Validation Procedure (Week 15)

1. Launch application in browser.
2. Trigger controlled error from console:
   - `setTimeout(() => { throw new Error('Week15 crash simulation'); }, 0);`
3. Confirm a new document is created in Firestore `client_errors`.
4. Capture screenshot evidence and attach to TC-10.

## 6. Evidence Mapping

| Deliverable Item | Evidence |
|---|---|
| Crash handling explanation | This document + `src/lib/crashReporting.ts` |
| Crash simulation execution | `docs/evidence/TC-10/after.png` |
| Persisted crash record | Firestore `client_errors` entry screenshot (appendix) |

## 7. Known Limitations and Tradeoffs

- Stack traces are not symbolicated at native Crashlytics level by default.
- Persistence depends on Firestore availability and write permissions.
- Despite these constraints, the implemented strategy provides practical, testable, and report-ready crash observability for a web-first academic project.
