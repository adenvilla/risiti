# Risiti reliability patch — prepared, not deployed

Target: adenvilla/risiti, feature/backup-checkout-customers-export.
Includes index.html and sw.js replacements plus js/reliability.js and tests/reliability.cjs.
The new module loads after app.js and adapts existing views/actions without rewriting saved records on startup.

Implemented: explicit recorded/received/pending reporting; paid-only summary count; receipt payment wording; searchable compact checkout with optional details and sticky totals/action; decimal prices; repeated product entry; structured Settings address and visibility; full JSON backup and validated restore preview; pre-restore browser recovery copy; CSV status-specific amount columns.

Tests: node tests/reliability.cjs. These are pure reporting and backup-validation tests. Passing tests are not proof of end-to-end app reliability.

Manual release checks still required: fresh setup and reload; cash and pending M-Pesa sales; mark paid; void twice and confirm stock restored once; export/open CSV; download and restore real backup; reject invalid backup; deny location permission; narrow iPhone layout; offline reload; storage quota error handling.

Backup files contain customer details and are not encrypted. Restore requires explicit replacement confirmation, turns off local auto-copy, and returns to the existing simulated sign-in flow. No cloud recovery or production authentication is added.

No GitHub commit, deployment, browser walkthrough, or existing full-package verification was performed in this preparation step.
