# Deploy Risiti on Vercel

## Included configuration

This repository is a plain HTML/CSS/JavaScript app. vercel.json selects no framework, skips install/build commands and serves the repository root. No package.json or npm dependencies are required for this deployment layout. Existing relative paths are preserved; no catch-all rewrite masks missing files.

.vercelignore excludes uploaded ZIP backups, docs, tests, prototypes and archive folders from the deployed site. Those files stay in GitHub. The public deployment is the premium main app only.

The service-worker response has no-store/no-cache headers so browsers can check for updates. The index document is revalidated. These headers do not clear localStorage and do not replace manual browser/offline testing.

## First deployment

1. Sign in to Vercel and choose Add New > Project.
2. Import the GitHub repository adenvilla/risiti and grant Vercel repository access when prompted.
3. Use Framework Preset: Other, Root Directory: repository root (not js/, css/ or the uploaded ZIP), no build/install command and Output Directory: . . The committed vercel.json supplies the deployment settings; remove conflicting dashboard overrides.
4. Use main as the production branch. No environment variables are required for the current simulated app.
5. Deploy and open the actual URL Vercel reports. This commit alone does not prove a deployment exists. If the repository is already connected, it may trigger a deployment automatically.

## Verify before relying on it

- From a downloaded checkout, run python3 tests/verify_package.py. It must report no errors. In particular, the uploaded .png files must contain genuine PNG data of the expected dimensions, not merely renamed JPEGs. This configuration does not convert images.
- Check that the welcome screen, logo, demo shop, cart, receipt, stock and CSV export work in a browser.
- Check that root image URLs, css/styles.css and js/app.js load without 404 responses.
- Check service-worker installation and offline reload after the first online visit. Fonts and the optional CDN QR library are not included in the offline shell.
- On mobile, check the browser's Add to Home Screen flow after icon validation.

## Data and safety

OTP and M-Pesa/STK are simulations. There is no real authentication, payment integration or server database. Shop records are stored in the current browser and origin; moving from localhost or another host to Vercel does not transfer them. Export any records you need before changing hosts or clearing site data. Do not put real financial or sensitive customer information into a public demo.

Deployment and browser validation have not been performed merely by committing these configuration files.
