# Restoration and provenance

The five premium UI modules and stylesheet were recovered from uploads. The stylesheet is split into css/base.css, css/screens.css and css/tour.css, imported in the original order by css/styles.css. Splitting the files is not a redesign.

Supporting configuration, SVG icons, utilities, state, action handlers, renderer, HTML shell, manifest and service worker were reconstructed using the earlier conversation and uploaded UI contracts. They are not asserted byte-identical to the previous ZIP.

Defensive fixes include aggregated checkout stock validation, one-time draft finalisation, demo OTP validation, timer cancellation, correct handling of array-valued search renderers, the missing Till/Paybill action, scoped cache cleanup and storage-failure messaging. A renderer typo introduced during GitHub transfer was corrected in a subsequent commit.

## Cleanup and uploaded image paths

The backup/pre-cleanup branch preserves the repository before twelve loose root JavaScript/CSS files were removed. Active scripts remain in js/ and js/ui/; active styles remain in css/. The uploaded ZIP remains at the root as a backup, not an app dependency.

The five uploaded image filenames are present at the root. The HTML shell, shared logo component, manifest, service-worker shell list and package verifier now intentionally use those root locations rather than assets/. This update changes text references only: it does not move or re-encode the binaries, certify their formats or claim successful browser/offline tests. Run tests/verify_package.py to check actual PNG signatures and dimensions.

prototypes/operations.html is present. Original and Workflow standalone prototypes, additional archival material and screenshots are not asserted fully transferred by this update.

## Scope

The premium app and experimental prototypes are separate versions with separate storage keys. Preserving source is not the same as merging and testing credit/refund features. No automatic migration is implemented. Backend/payment integration and deployment remain out of scope. See the root README for local serving and verification commands.
