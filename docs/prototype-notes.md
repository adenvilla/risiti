# Prototype notes

## Scope

This prototype focuses on the shop workflow and interface before backend integration. It uses browser-local storage and does not connect to a backend, payment provider, SMS provider, or tax authority.

## Implemented workflow

- Amount-only checkout with a numeric keypad.
- Product-based checkout with search and quantity controls.
- Cash, pending M-Pesa, and customer-credit payment methods.
- Manual M-Pesa confirmation with a required reference.
- Customer credit ledger with repayments and WhatsApp reminder drafts.
- Item-based refunds with optional stock restoration.
- Correction of unpaid sales through a linked replacement sale.
- Voiding of unpaid sales with a reason and stock restoration.
- Stock corrections with a required reason and audit log.
- Limited English/Swahili toggle for core navigation and checkout labels.
- Printable receipt, browser Save-as-PDF, WhatsApp draft, copy-to-clipboard, CSV export, and JSON backup.

## Tested scenario

A Chromium browser test at 390 × 844 covered:

1. An amount-only cash sale.
2. A full refund.
3. A product sale on credit.
4. A partial repayment.
5. A physical stock-count correction.
6. The language toggle.

The scenario completed without JavaScript page errors.

## Known limitations

- Credit repayments are pooled by customer, not allocated to a particular credit sale.
- Paid credit reimbursements require a future dedicated workflow.
- The Home summary is a sale-date cohort, not a full cashbook; credit repayments appear in the customer ledger rather than Home revenue.
- Swahili covers core navigation and checkout labels only; administrative help text remains English.
- No automated test suite, backend, authentication, cloud sync, staff roles, barcode scanning, JSON import, or eTIMS integration.
- Mobile Safari, low-end Android devices, offline edge cases, and persistence failures need additional QA.

## Security and privacy

- No secrets, API keys, credentials, or real customer records are stored in this repository.
- Prototype data is stored locally in the browser.
- Customer phone numbers should not be entered into a production system without a privacy notice, access controls, retention policy, and secure storage.
