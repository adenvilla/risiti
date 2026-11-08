# Risiti — premium prototype

Risiti is a mobile-first receipts and stock prototype for Kenyan small businesses. The main app preserves the emerald, ivory and gold design.

## Upload status

The premium HTML shell, JavaScript modules, split stylesheets, manifest and service worker have been committed. The five PNG brand assets, standalone prototypes, original-source archives and screenshots are still pending transfer. This README must not be taken as confirmation that the full restoration archive is uploaded or that a live site exists.

## Premium app features

- Welcome tour, simulated phone OTP and shop setup.
- Starter products, cart quantities, discounts, notes and optional customer phone.
- Cash receipts, pending M-Pesa and explicitly simulated STK confirmation.
- Draft receipts and finalisation.
- Receipt sharing by WhatsApp/SMS/copy, and QR when the optional library is available.
- Product stock tracking, low-stock indicators and adjustments.
- Receipt search, customer history, daily summary and CSV export.
- Shop logo upload, Till/Paybill details and a demo 16% VAT setting.

Credit, refunds, repayment allocation and linked corrections belong to separate uploaded experimental prototypes. They have NOT been merged into the premium app. Existing docs/prototype-notes.md describes earlier experimental work, not feature parity with the premium source.

## Run locally

After all required assets are present:

```sh
python3 -m http.server 8080
```

Open http://localhost:8080. A GitHub repository URL displays source, not a live app. No GitHub Pages or other deployment has been configured by these uploads.

## Verification

```sh
python3 tests/verify_package.py
```

This reports missing files, PNG header/dimension mismatches, broken local shell/import references and JavaScript syntax errors when Node.js is available. It is not a full browser or financial audit.

## Boundaries

- OTP and STK are simulations. No authentication or real payment API is connected.
- Storage and auto-backup are browser-local, not cloud backups.
- Home sales aggregates include pending sales; the summary separately calculates paid revenue. Neither is a complete cashbook.
- English remains the main app default. Limited Swahili stays in the separate prototypes.
- Fonts and QR generation have optional external dependencies.
- No staff permissions, database sync, barcode scanner or eTIMS integration.

Do not use for real financial records or live payments. See docs/RESTORATION.md and docs/QA.md.
