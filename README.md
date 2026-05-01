# BazaarPK Web App (Week 15 Real App)

BazaarPK is a Firebase-first marketplace web app built with React + Vite + TypeScript.

## Stack

- React 19 + Vite
- TypeScript + Zustand + React Hook Form + Zod
- Firebase Auth, Firestore, Storage, Analytics
- Selenium WebDriver (automation evidence for Week 15)

## Local setup

1. Install dependencies:
   - `npm install`
2. Create env file:
   - Copy `.env.example` to `.env.local`
3. Fill Firebase config values from your Firebase console project settings.
4. Start app:
   - `npm run dev`

## Firebase setup

1. Create Firebase project.
2. Enable:
   - Authentication (Email/Password)
   - Firestore Database
   - Storage
   - Analytics
3. Apply rules and indexes from:
   - `firestore.rules`
   - `firestore.indexes.json`
4. Optional Firebase CLI deployment:
   - `firebase deploy --only firestore:rules,firestore:indexes,hosting`

## Week 15 deliverables files

- Figma inventory mapping: `docs/figma-screen-inventory.md`
- Test plan: `docs/week15-test-plan.md`
- Test cases (10): `docs/week15-test-cases.md`
- Manual testing evidence guide: `docs/manual-testing-evidence.md`
- Selenium test: `tests/automation/checkout-flow.selenium.mjs`
- Selenium run guide: `docs/selenium-run-guide.md`
- Analytics KPI map: `docs/analytics-kpi-map.md`
- Crash handling explanation: `docs/crash-handling-explanation.md`
- Final traceability index: `docs/week15-deliverables-traceability.md`
