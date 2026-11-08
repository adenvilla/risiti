# Risiti — premium prototype

Mobile-first receipts and stock prototype for Kenyan small businesses. The emerald, ivory and gold design is unchanged. This is a demo, not production accounting or payment software.

## Repository layout

- index.html: main app entry point.
- js/: active configuration, utilities, state, actions and renderer.
- js/ui/: premium screen and component modules.
- css/: stylesheets, loaded in their original order.
- logo.png, favicon-32.png, apple-touch-icon.png, icon-192.png, og-image.png: uploaded images at the repository root; app paths intentionally match these locations.
- manifest.webmanifest and sw.js: install metadata and same-origin offline shell.
- prototypes/operations.html: separate experimental prototype; not merged into the premium app.
- docs/ and tests/: development notes and checks.
- risiti-repo 3.zip: retained uploaded backup; not loaded by the app.
- backup/pre-cleanup branch: snapshot preserving the loose original source files removed during cleanup.

## Run locally

Download and extract the repository, open a terminal in its root and run:

```sh
python3 -m http.server 8080
```

Open http://localhost:8080 in a browser. Serve the extracted files, not the ZIP itself. A GitHub repository page shows source; this change does not publish a live site or configure hosting.

## Check the package

```sh
python3 tests/verify_package.py
```

The check verifies required files, PNG signatures and dimensions, local HTML/CSS paths, manifest icons, offline-shell paths and JavaScript syntax when Node.js is installed. A .png extension alone does not prove that an uploaded image is PNG. Failures must be fixed before claiming installability. Browser and offline tests are still required; this path update does not claim they passed.

If you previously opened a hosted version, reload after the updated service worker installs. The cache version was changed so the previous Risiti shell can be replaced. External fonts and QR generation are not included in the offline shell.

## Use and limitations

The main app offers demo onboarding, shop setup, products and stock, cart sales, drafts, receipts, sharing, search, customer history, summaries and CSV export. OTP and STK are simulations; no real authentication or payment backend is connected. Shop data and backup settings are browser-local, not cloud storage. Export important demo records before clearing browser storage. Credit/refund experiments remain separate.

Do not use this prototype for live payments or authoritative financial records. Image binaries have not been re-encoded by this text-only path update.
