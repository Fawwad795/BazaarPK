# Manual Testing Evidence Guide

Store screenshots in this folder structure:

- `docs/evidence/TC-01/`
- `docs/evidence/TC-02/`
- ...
- `docs/evidence/TC-10/`

Each folder should include:

1. `before.png` (optional for setup visibility)
2. `after.png` (required)
3. `notes.txt` with:
   - tester name
   - execution date/time
   - browser and OS
   - pass/fail
   - short observation

## Required Screenshot Set (minimum)

- TC-01 registration success state
- TC-03 listing page with product cards
- TC-06 checkout confirmation
- TC-08 seller onboarding completed
- TC-09 admin disputes view
- TC-10 simulated error capture proof (console + Firestore doc)

## Naming Convention

- `TC-06-after-2026-04-30.png`
- `TC-09-admin-disputes.png`

This makes evidence directly traceable to Week 15 rubric items.

## Capture Automation Helper

To quickly produce baseline screenshots for report compilation:

- `npm run evidence:week15`

This command captures `after.png` in each `TC-01` ... `TC-10` folder and can be supplemented with additional manual screenshots if needed.
