# QA status

## Historical restoration checks

The reconstructed local premium package was tested in Chromium at 390x844, with an additional 360px-wide viewport check. The recorded scenario passed:

1. Welcome rendering.
2. Demo OTP enrollment.
3. Shop setup and starter products.
4. Cash checkout and receipt totals.
5. Live receipt search.
6. Till/Paybill editing.
7. Draft stock deduction exactly once.
8. Simulated STK confirmation.
9. Persistence after reload.
10. Demo dashboard/data.
11. Daily summary.
12. All main tabs.
13. No horizontal page overflow at 360px.

That scenario reported no JavaScript page errors or failed local resources. A local HTTP test also cached the app shell and passed offline reload/demo navigation. These are historical local-package results, NOT a fresh end-to-end pass of the incomplete GitHub checkout.

## Current repository

Use tests/verify_package.py to check the checkout. The five missing PNG files are expected to prevent a complete-package pass and service-worker installation until transferred. The split-stylesheet version needs a fresh offline/browser run after all files arrive.

Not verified: mobile Safari, actual home-screen installation, real WhatsApp/SMS delivery, CDN availability, low-end-device performance, screen-reader accessibility, full financial edge cases or prototype feature integration. Screenshots do not establish full visual QA.
