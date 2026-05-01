# Analytics Events Setup (Firebase) + Event Catalog

## 1. Purpose

This document defines the Week 15 analytics instrumentation for BazaarPK and maps tracked events to reportable KPIs.

## 2. Implementation Scope

### 2.1 Core instrumentation utility

- Analytics helper: `src/lib/analytics.ts`
- Main logger API: `trackEvent(eventName, payload)`
- User identification support: `identifyUser(userId, role)`

### 2.2 Event call sites in application flows

| Flow Area | Primary Files |
|---|---|
| Authentication | `src/store/authStore.ts` |
| Product discovery and detail | `src/store/productStore.ts`, `src/pages/ProductDetailPage.tsx` |
| Checkout | `src/pages/CheckoutPage.tsx` |
| Seller onboarding | `src/pages/SellerOnboardingPage.tsx` |

## 3. Event Catalog

| Event Name | Trigger Point | Parameters | KPI / Metric Use |
|---|---|---|---|
| `sign_up` | Successful account registration | `role` | New user registrations by role |
| `login` | Successful login | `role` | Active users, login conversion |
| `logout` | User logout | `none` | Session-end behavior |
| `view_item_list` | Product list loaded | `item_count` | Catalog engagement volume |
| `view_item` | Product detail page view | `item_id` | PDP interest and product intent |
| `add_to_cart` | Add-to-cart action | `item_id`, `quantity` | Add-to-cart conversion |
| `begin_checkout` | Checkout page opened with cart | `item_count`, `value` | Checkout-start conversion |
| `purchase` | Order placement action | `item_count`, `payment_method`, `value` | Checkout completion / purchase conversion |
| `seller_onboarding_step_completed` | Seller onboarding step transition | `step` | Funnel drop-off by onboarding step |
| `seller_onboarding_completed` | Seller onboarding completion | `seller_id` | Seller activation rate |

## 4. KPI Definition Matrix

| KPI Group | KPI Name | Formula / Read Rule | Source Events |
|---|---|---|---|
| Buyer funnel | Product discovery volume | Count of product list/detail views | `view_item_list`, `view_item` |
| Buyer funnel | Add-to-cart rate | `add_to_cart / view_item` | `add_to_cart`, `view_item` |
| Buyer funnel | Checkout start rate | `begin_checkout / add_to_cart` | `begin_checkout`, `add_to_cart` |
| Buyer funnel | Purchase conversion | `purchase / begin_checkout` | `purchase`, `begin_checkout` |
| Seller funnel | Onboarding completion | `seller_onboarding_completed / seller_onboarding_step_completed` | `seller_onboarding_step_completed`, `seller_onboarding_completed` |
| Auth funnel | Login adoption | Daily and weekly `login` volume by role | `login` |

## 5. Firebase Validation Procedure

1. Open Firebase Analytics **DebugView**.
2. Execute each target journey once (auth, browse, checkout, seller onboarding).
3. Confirm event names and key parameters match the catalog in Section 3.
4. Open Firebase **Events** view and verify counts accumulate.
5. Capture screenshots for report appendix.

## 6. Minimum Screenshot Evidence for Week 15 Report

| Evidence Item | Expected Proof |
|---|---|
| DebugView `login` | Event appears with role parameter |
| DebugView `add_to_cart` | Event appears with item and quantity context |
| DebugView `begin_checkout` | Event appears with item_count and value |
| DebugView `purchase` | Event appears with payment_method and value |
| DebugView `seller_onboarding_completed` | Event appears after onboarding completion |
| Events dashboard table | Event count totals visible for tracked custom events |

## 7. Report Notes / Constraints

- Firebase Analytics can show slight ingestion delay; verify over multiple refreshes if needed.
- This KPI map is designed for Week 15 validation scope and can be extended for Week 16 dashboards.
