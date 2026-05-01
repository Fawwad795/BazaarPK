# Week 15 Deliverables Traceability Index

| Week 15 Item | Required Deliverable | BazaarPK Evidence |
|---|---|---|
| Test Plan | Structured | `docs/week15-test-plan.md` |
| Test Case 1 | Valid | `docs/week15-test-cases.md` (TC-01) |
| Test Case 2 | Valid | `docs/week15-test-cases.md` (TC-02) |
| Test Case 3 | Valid | `docs/week15-test-cases.md` (TC-03) |
| Test Case 4 | Valid | `docs/week15-test-cases.md` (TC-04) |
| Test Case 5 | Valid | `docs/week15-test-cases.md` (TC-05) |
| Test Case 6 | Valid | `docs/week15-test-cases.md` (TC-06) |
| Test Case 7 | Valid | `docs/week15-test-cases.md` (TC-07) |
| Test Case 8 | Valid | `docs/week15-test-cases.md` (TC-08) |
| Test Case 9 | Valid | `docs/week15-test-cases.md` (TC-09) |
| Test Case 10 | Valid | `docs/week15-test-cases.md` (TC-10) |
| Manual Testing Evidence | Real screenshots | `docs/manual-testing-evidence.md` + `docs/evidence/TC-01/after.png` ... `docs/evidence/TC-10/after.png` |
| Automation Test (1 case) | Working | `tests/automation/checkout-flow.selenium.mjs` + `docs/evidence/automation/checkout-flow-pass.png` + `docs/selenium-run-guide.md` |
| Analytics Events Setup | Relevant events | `src/lib/analytics.ts`, `src/pages/CheckoutPage.tsx`, `src/pages/ProductDetailPage.tsx`, `src/pages/SellerOnboardingPage.tsx`, `src/store/authStore.ts`, `src/store/productStore.ts` |
| Analytics Dashboard | KPIs shown | `docs/analytics-kpi-map.md` + Firebase DebugView screenshots (attach in report appendix) |
| Crash Handling Explanation | Understanding | `docs/crash-handling-explanation.md`, `src/lib/crashReporting.ts`, `docs/evidence/TC-10/after.png` |

## Verification Commands

- `npm run test:selenium`
- `npm run evidence:week15`
- `npm run lint`
- `npm run build`

## Figma-to-Route Mapping Evidence

- `docs/figma-screen-inventory.md`
