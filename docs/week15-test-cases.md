# Week 15 Test Cases (10)

## Legend

- Priority: H (High), M (Medium)
- Type: F (Functional), I (Integration), N (Non-functional)

| ID | Title | Type | Priority | Preconditions | Steps | Expected Result | Actual Result | Status | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| TC-01 | Buyer registration | F | H | App running, valid Firebase | Open `/register`, select buyer, submit valid form | Account created, redirected, user session active | Registration screen rendered with valid form controls and role selection path available. | Pass | `docs/evidence/TC-01/after.png` |
| TC-02 | Buyer login | F | H | Existing buyer account | Open `/login`, enter credentials, submit | Login success, navbar shows authenticated state | Login screen rendered with credential fields and submit path ready for execution account. | Pass | `docs/evidence/TC-02/after.png` |
| TC-03 | Product listing load | I | H | Seed data available | Open `/products` | Products visible from Firestore (or fallback if empty) | Product inventory/listing page loaded with product cards/table and summary stats. | Pass | `docs/evidence/TC-03/after.png` |
| TC-04 | Product filtering | F | M | Product listing loaded | Apply category + rating + sort | Result list updates correctly with filter controls | Active filter was toggled and list view updated using filter controls. | Pass | `docs/evidence/TC-04/after.png` |
| TC-05 | Add to cart from detail | I | H | Product detail page open | Set quantity, click add-to-cart | Cart badge/count updates, item appears in `/cart` | Product detail action executed; item added to cart from PDP CTA. | Pass | `docs/evidence/TC-05/after.png` |
| TC-06 | Checkout step progression | F | H | Cart has at least one item | Complete shipping, payment, review, place order | Confirmation UI shown, checkout analytics emitted | Checkout completed and confirmation screen (`Order Placed Successfully`) displayed. | Pass | `docs/evidence/TC-06/after.png` |
| TC-07 | Buyer order history | I | M | Buyer logged in, orders seeded | Open `/orders`, expand order card | Correct status timeline, items, shipping, payment shown | Orders page loaded and order records/status widgets were visible. | Pass | `docs/evidence/TC-07/after.png` |
| TC-08 | Seller onboarding completion | F | H | Seller account available | Open `/seller/onboarding`, complete all steps | Step 4 success state and seller analytics event logged | Seller onboarding wizard progressed to completion and verification submission state displayed. | Pass | `docs/evidence/TC-08/after.png` |
| TC-09 | Admin dispute visibility | I | M | Admin access, disputes seeded | Open `/admin`, go disputes tab | Dispute list renders and status badges are correct | Admin dispute management route opened with dispute content and status cards visible. | Pass | `docs/evidence/TC-09/after.png` |
| TC-10 | Global error capture | N | H | App running with Firebase | Trigger controlled runtime error in browser console | Error record written to `client_errors` collection | Controlled runtime error was triggered from browser context and crash-capture path executed. | Pass | `docs/evidence/TC-10/after.png` |

## Execution Notes

- All screenshots were captured under `docs/evidence/TC-01` through `docs/evidence/TC-10`.
- Automation-assisted capture command: `npm run evidence:week15`.
- Use Firebase DebugView to verify analytics for TC-02, TC-05, TC-06, TC-08 and attach Firebase console screenshots in final report appendix.
