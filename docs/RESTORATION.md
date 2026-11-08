# Restoration and provenance

The five premium UI modules and stylesheet were recovered from uploads. The stylesheet is split into css/base.css, css/screens.css and css/tour.css, imported in the original order by css/styles.css. Splitting the files is not a redesign.

Supporting configuration, SVG icons, utilities, state, action handlers, renderer, HTML shell, manifest and service worker were reconstructed using the earlier conversation and uploaded UI contracts. They are not asserted byte-identical to the previous ZIP.

Defensive fixes include aggregated checkout stock validation, one-time draft finalisation, demo OTP validation, timer cancellation, correct handling of array-valued search renderers, the missing Till/Paybill action, scoped cache cleanup and storage-failure messaging. A renderer typo introduced during GitHub transfer was corrected in a subsequent commit.

## Remaining transfer

- assets/logo.png, assets/favicon-32.png, assets/apple-touch-icon.png, assets/icon-192.png, assets/og-image.png.
- Original, Workflow and Operations standalone HTML prototypes.
- Uploaded-source archival copies, image originals and preview screenshots.

The supplied images arrived as JPEG. Proper PNG re-encoding preserves their dimensions but cannot recover any information already lost to JPEG compression. The connector's native file-writing tools accept text; binary image transfer is not yet completed. No placeholder logo is being substituted.

## Scope

The premium app and experimental prototypes are separate versions with separate storage keys. Preserving source is not the same as merging and testing credit/refund features. No automatic migration is implemented. Backend/payment integration and deployment remain out of scope for this restoration.
