# BazaarPK

BazaarPK is a Firebase-first marketplace web application built with React, Vite, and TypeScript.  
It supports role-based buyer, seller, and admin workflows, with analytics and QA evidence aligned to an academic software engineering delivery cycle.

## Key Features

- Role-based flows for buyers, sellers, and admins
- Product listing, cart, checkout, and order tracking journeys
- Seller operations: onboarding, order management, analytics, and payments
- Admin operations: seller verification, dispute management, and platform analytics
- Firebase-backed authentication, data storage, and analytics events
- Selenium automation for repeatable end-to-end evidence capture

## Tech Stack

- **Frontend:** React 19, Vite 8, TypeScript 5
- **State & Forms:** Zustand, React Hook Form, Zod
- **Backend Services:** Firebase Authentication, Firestore, Storage, Analytics
- **Testing & QA:** Selenium WebDriver, Chromedriver
- **Tooling:** ESLint, TypeScript compiler

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create a `.env.local` file and add your Firebase web app configuration values:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID` (optional but recommended for analytics)

### 3) Start the development server

```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start local dev server
- `npm run build` - Type-check and create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint checks
- `npm run test:selenium` - Run checkout flow Selenium automation
- `npm run evidence:week15` - Capture Week 15 automation evidence

## Firebase Setup

1. Create a Firebase project.
2. Enable the following services:
   - Authentication (Email/Password)
   - Firestore Database
   - Storage
   - Analytics
3. Apply database configuration from:
   - `firestore.rules`
   - `firestore.indexes.json`
4. (Optional) Deploy selected Firebase resources:

```bash
firebase deploy --only firestore:rules,firestore:indexes,hosting
```

## Project Structure

- `src/` - Application source code (pages, components, stores, services, utilities)
- `tests/automation/` - Selenium test scripts for automation evidence
- `docs/` - Testing artifacts, traceability, and delivery documentation
- `public/` - Static assets

## Documentation and Deliverables

- Screen inventory: `docs/figma-screen-inventory.md`
- Test plan: `docs/week15-test-plan.md`
- Test cases: `docs/week15-test-cases.md`
- Manual testing guide: `docs/manual-testing-evidence.md`
- Selenium run guide: `docs/selenium-run-guide.md`
- Analytics KPI mapping: `docs/analytics-kpi-map.md`
- Crash handling explanation: `docs/crash-handling-explanation.md`
- Final traceability index: `docs/week15-deliverables-traceability.md`

## Notes

- This repository includes documentation and evidence artifacts produced for Week 15 software engineering deliverables.
- Sensitive local configuration is intentionally excluded from version control via `.gitignore`.
