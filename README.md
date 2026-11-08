# Risiti

**Risiti** is a workflow prototype for a mobile-first shop tool: digital receipts, M-Pesa-style payment tracking, customer credit, stock control and daily sales visibility for Kenyan small businesses.

This repository currently contains the project documentation and structure. The interactive prototype HTML will be added in a follow-up commit.

## Current workflow

- **Quick sale:** enter an amount on a keypad and check out.
- **Product sale:** search products, add quantities, and check out.
- **Payment methods:** cash, pending M-Pesa, or customer credit.
- **M-Pesa:** sales start as pending and require manual confirmation with a reference. No payment API is connected.
- **Credit:** customer name and phone are required. A customer ledger tracks credit issued and repayments.
- **Refunds:** item-based, with optional restocking and a required reason.
- **Corrections:** an unpaid sale can be corrected through a linked replacement sale; the original remains in history.
- **Voids:** unpaid sales can be voided with a reason and stock restoration.
- **Stock:** sales and refunds adjust tracked stock; stock corrections require a reason and audit entry.
- **Language:** limited English/Swahili toggle for core navigation and checkout labels only.
- **Exports:** sales CSV and JSON backup.
- **Receipts:** printable or browser Save-as-PDF receipt, WhatsApp draft, and copy-to-clipboard.

## Important boundaries

This is a prototype, not a production financial system.

- No real OTP authentication.
- No Safaricom Daraja integration or payment verification.
- No cloud database, account system, multi-device sync, or staff permissions.
- No KRA eTIMS integration.
- No barcode scanning.
- Credit repayments are pooled by customer rather than allocated to individual invoices.
- The Home total reflects paid sales created today, net of refunds against those sales; it is not a complete cashbook.

## Roadmap

1. Credit allocation to individual sales and statements.
2. Faster checkout and one-tap quick sale.
3. M-Pesa verification workflow and payment status controls.
4. Cashbook-style daily, weekly and monthly reporting.
5. Stock-take workflow and product cost/profit tracking.
6. Backend, authentication, encrypted storage and role-based access.
7. Safaricom Daraja integration and KRA eTIMS support where required.

## Repository structure

```text
README.md
 docs/
   prototype-notes.md
 .gitignore
 LICENSE
```

## Status

Prototype only. Do not use for real financial records, tax reporting, or production payments.
