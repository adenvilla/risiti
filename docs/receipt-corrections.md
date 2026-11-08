# Risiti — Receipt Corrections

## Purpose

This document defines how Risiti handles a receipt created by mistake.

The rule is simple: **never silently delete a receipt.** Cancel or void it, restore affected stock, and keep an auditable record.

## Receipt states

| State | Meaning | Counts in daily sales? |
|---|---|---|
| `draft` | Saved but not issued | No |
| `pending` | Awaiting M-Pesa payment | No |
| `paid` | Payment received | Yes |
| `voided` | Cancelled or corrected | No |

## Unpaid receipt

For a `draft` or `pending` receipt, the merchant can select **Cancel receipt**.

When cancelled:

- The receipt status becomes `voided`.
- Any stock previously reduced by that sale is restored.
- The receipt remains visible in Receipts with a **VOIDED** label.
- It is excluded from daily sales, M-Pesa/Cash totals, top seller, and customer spending totals.

## Paid receipt

For a `paid` receipt, the merchant can select **Void & correct**.

Before voiding, Risiti asks for a reason:

- Wrong item added
- Wrong quantity
- Wrong price
- Wrong customer
- Duplicate receipt
- Other reason

When voided:

- The receipt status becomes `voided`.
- The exact quantity sold is restored to stock.
- The original receipt remains visible with a **VOIDED** stamp.
- The original receipt number, date, items, and amount remain unchanged for audit purposes.
- It is excluded from daily sales and payment totals.

## Correcting a mistake

After voiding an incorrect receipt, the merchant creates a new receipt with the correct details.

Example:

1. A merchant accidentally records 10 Coca-Cola instead of 1.
2. They void the incorrect receipt.
3. Risiti restores 10 Coca-Cola to stock.
4. The merchant creates a new receipt for 1 Coca-Cola.
5. Daily sales now show only the correct amount.

## What is not allowed

- Do not permanently delete a paid receipt.
- Do not edit the amount, items, or customer on a paid receipt silently.
- Do not restore stock twice for the same voided receipt.
- Do not count a voided receipt in daily revenue or payment breakdowns.

## Future workflow

Customer returns and refunds should be handled as a separate **Refund / Return** workflow. They are not the same as correcting a mistaken receipt.
