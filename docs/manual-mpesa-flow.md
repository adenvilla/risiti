# Risiti — Manual M-Pesa Confirmation Flow

## Decision

For the current version of Risiti, M-Pesa payments use a **manual Till/Paybill confirmation flow** instead of STK Push.

This keeps the app simple, works with a merchant’s existing Till or Paybill number, and avoids requiring Safaricom Daraja credentials, callback servers, or customer PIN handling.

## Approved customer flow

1. The merchant creates a sale and selects **M-Pesa**.
2. Risiti displays the shop’s M-Pesa Till or Paybill number and the amount due.
3. The customer pays using their own M-Pesa account.
4. The merchant receives the payment through their normal M-Pesa account.
5. The merchant opens the receipt and selects **Confirm payment received**.
6. Risiti marks the sale as **Paid** and stores the optional M-Pesa confirmation code.

## Screen behaviour

### New sale

When M-Pesa is selected, show:

- Customer pays to: Till or Paybill number
- Amount due
- Instruction: “Ask the customer to send payment, then confirm once received.”
- Primary action: **Create receipt**

The customer phone number remains optional and is used for receipt records and customer history. It is not required for an STK prompt.

### Awaiting-payment receipt

Show:

- Amber status: **Awaiting payment**
- Payment destination: the shop’s Till or Paybill number
- Instruction: “Customer should pay to [Till/Paybill]. Confirm only after you receive the money.”
- Primary action: **Confirm payment received**
- Secondary action: **Share receipt**

### Paid receipt

Show:

- Green status: **Paid**
- Optional M-Pesa confirmation code
- Green **PAID** stamp
- Actions: **Share receipt** and **New sale**

## Data rules

A sale remains `pending` until the merchant explicitly confirms payment.

When confirmed, Risiti should store:

- `status: "paid"`
- `paidAt`: confirmation timestamp
- `mpesaReference`: optional M-Pesa confirmation code

The merchant must not mark a sale as paid merely because a payment request was created. Confirmation should happen only after money has been received.

## Explicitly excluded for now

- STK Push
- Customer M-Pesa PIN handling
- Automatic Safaricom payment verification
- Daraja API integration
- Per-store API credentials
- Automatic callback processing

These may be introduced later, but only after the manual confirmation flow is stable and merchant-tested.
