# Selenium Automation Run Guide

Automated case implemented:
- `tests/automation/checkout-flow.selenium.mjs`
- Covers login -> browse products -> add to cart -> checkout -> order confirmation.

## Prerequisites

1. Install dependencies:
   - `npm install`
2. Start app:
   - `npm run dev`
3. Ensure app dev server is running on the target base URL.

## Environment Variables

Set in shell before running:

- `BAZAARPK_BASE_URL` (default: `http://localhost:5174`)
- `HEADLESS=true` (optional)

## Run Command

- `npm run test:selenium`

## Manual Evidence Capture Command

- `npm run evidence:week15`
- This stores screenshots in `docs/evidence/TC-01` ... `docs/evidence/TC-10`.

## Expected Output

- Console logs `Selenium checkout-flow test passed.`
- Exit code `0`
- Pass screenshot saved at `docs/evidence/automation/checkout-flow-pass.png`

If the test fails, collect:
- console output
- app screenshot
- browser version
- failed selector/step
