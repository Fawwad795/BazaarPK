# Week 15 Test Plan - BazaarPK

## Objective

Validate BazaarPK core web application flows for buyers, sellers, and admin users with emphasis on reliability, analytics instrumentation, and crash/error handling readiness.

## Scope

- Authentication (register/login/logout, role handling)
- Product browsing and product detail
- Cart and checkout intent flow
- Orders, tracking, disputes
- Seller onboarding and seller dashboard/orders
- Admin panel overview/disputes/products
- Firebase-backed data reads/writes and fallback behavior
- Analytics event firing for key user journeys

## Out of Scope

- Native mobile Appium execution (web Selenium is used this week)
- Real payment gateway settlement
- Production infra hardening and DDoS/security penetration testing

## Test Environment

- OS: Windows 10
- Browser: Chrome latest
- Frontend runtime: Vite dev server
- Backend services: Firebase Auth + Firestore + Analytics + Storage
- Automation tool: Selenium WebDriver (Node)

## Entry Criteria

- `.env.local` filled with valid Firebase credentials
- Firestore rules and indexes applied
- App runs with `npm run dev` without startup errors

## Exit Criteria

- All 10 Week 15 test cases executed and documented
- At least 1 Selenium end-to-end case passes
- Manual test evidence screenshots captured for critical flows
- Analytics events visible in DebugView / Firebase events stream
- Crash handling mechanism documented and tested with simulated error

## Risks and Mitigations

- Firebase permission/rules mismatch -> run validation on auth and collection access per role.
- Test data contamination -> use deterministic seed path and fixed test accounts.
- Event under-reporting -> enforce event naming map and verify DebugView after each scenario.
