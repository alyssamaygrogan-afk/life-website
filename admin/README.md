# L-I-F-E Social Media HQ — device-only interim build

This folder adds `/admin/` to the existing GitHub Pages website. It **does not replace or change the public holding page**.

## Current capability

- Responsive browser interface for iPhone and computer
- Draft/edit/copy posts, planned dates, month calendar, outreach contact tracking, and a 100-day draft generator
- User-chosen password (minimum 12 characters) encrypts **device-local** storage using PBKDF2-SHA256 (350,000 iterations) and AES-GCM-256
- Encrypted JSON backup export/import to manually transfer work between devices

## Critical limitations

- This is **not real Google Workspace authentication**. The email displayed in the form is a client-side label/check, **not verified identity**; anybody can load public page assets, but not decrypt the browser's existing local workspace without its password.
- No cloud synchronization. Nothing is currently written to Google Drive.
- No social network OAuth or automatic posting. Scheduled dates are planning entries only.
- Website browser data may be erased by Safari/browser cleanup. Export encrypted backups frequently and keep the password safe; forgotten passwords cannot be reset.
- The browser password must **not** be a reused Google, email, bank, or other account password.
- This local mode is for launch publicity drafts and outreach contacts only. Do not use it to store sensitive personal or safeguarding data.

## Production plan

Retain the existing separate Cloudflare Access / edge-gated v0.5 development build in private `in-full` project. Configure the real Google Cloud OAuth client for `alyssa-may.grogan@lifeinfullecosystem.org`, verify live Google Drive reads/writes on both devices and set production identity protection before upgrading `/admin/` to the cloud-backed system. Never embed client secrets in a static repo.

## Social and advertising account setup

The `Accounts` tab now contains an encrypted device-local progress checklist and links to the official registration pages for:
Facebook Page, Instagram, Threads, TikTok, YouTube, LinkedIn Page, Pinterest, Meta Business/Ads, Google Ads, TikTok Business/Ads and LinkedIn Campaign Manager.

- The two checkboxes per provider track **only self-reported setup and 2FA**, not an authorized or tested API connection.
- All providers accurately remain **API not connected**. No token is collected or stored; no publisher or spending operation is available.
- The setup progress is inside the same AES-GCM device workspace and encrypted export. It is **not synced between devices**.
- Use unique platform passwords and provider-hosted sign-in/verification. **Never paste passwords, client secrets, private API tokens or recovery codes into this app, source code, GitHub, or chat.**
- Use genuine members/admins for Meta and LinkedIn, rather than fake personal profiles. Organizational Pages are distinct public identities but their administrators can still be real personal accounts; use platform roles for delegation.
- No spending authorization or billing details should be entered until L-I-F-E approves an actual campaign budget.
- A future protected backend (not static GitHub Pages) and official per-provider OAuth/developer approvals are necessary for posting, analytics and ads.

## Monday weekly draft planning and the 40-day campaign milestone

- **Every Monday while an admin unlocks the device workspace**, the app creates up to seven **Draft** posts (Monday through Sunday) for the current week. No post is automatically published, approved or scheduled with any provider. If the app is closed, it cannot generate drafts in the background.
- On other days, the Overview's **Prepare missing drafts for this week** button creates any missing weekly posts. On Saturday/Sunday, it targets the following Monday.
- Drafts carry a stable `weeklyKey` in the encrypted document. Re-running the planner does not duplicate posts, including after editing their titles/captions. Other user-created posts are never overwritten or deleted.
- The date milestone is **Thursday 3 December 2026**, exactly **40 calendar days after Saturday 24 October 2026**, **not** 40 days before the 30 January 2027 launch. The prior 16/21 December draft dates are superseded.
- The draft generated for **3 December** is a clearly marked, **NOT READY TO PUBLISH** venue and ticket placeholder. It never invents the venue, prices, ticket/payment links, or official approvals; people must confirm the venue and any approved ticket options before sharing.
- The current free ticket reservation form is already publicly available separately on the homepage. It is **not** a paid presale. Any optional donation or paid ticket needs separate approval and accurately published terms.
- A separate ChatGPT weekly reminder provides Monday nudges; **this static website itself does not provide push notifications**. Reminders and browser drafts do not depend on a social media connection.
- Device-local encrypted data stays in the existing `life-hq-device-v1` format; the original password still unlocks the user's drafts. Future cloud sync is not yet available.

## Campaign Studio and competitor-gap improvements (October 2026)

This version adds:

- Post editor with intended Facebook/Instagram/TikTok/LinkedIn/Threads/YouTube/Pinterest targets, creative format and asset reference. These are planning-only fields; no accounts are connected.
- Image alternative text and explicit review acknowledgement; a post cannot move to Ready/Scheduled manually/Published unless the relevant local review checks pass. Marking Published additionally requires confirming a post was made outside this app.
- A gated **3 December 2026** venue/ticket reveal checklist with actual venue confirmation, approved booking link and approved ticket information; this is a self-attestation stored in the local encrypted workspace, not verified approval from trustees or external services.
- Searchable/filterable posts, click-to-edit calendar entries and a separate Campaigns/Reports area.
- Proposed advertising plan budgets and externally reported spend, clearly separated. No spending and no provider activity is possible here.
- Manually entered post views, clicks/interactions, CSV exports (unencrypted; keep private) and a prioritized [competitive gap review](../docs/SOCIAL-MEDIA-HQ-COMPETITOR-REVIEW-20261024.md).

**Still not supported:** media uploads, actual social network sign-in/publishing, real provider analytics, verified multi-user approvals, ad account writes, Google Drive sync or server-enforced administrator authorization. This update does not change the AES-GCM storage key or encrypted backup format. Keep backups secure before use.

## Manual Buffer publishing shortcut

The Accounts screen now links directly to the official Buffer publishing dashboard. Every saved post also has a Buffer shortcut alongside its existing Copy caption action. This allows the user to paste manually reviewed captions into Buffer once they have created their official L-I-F-E social accounts and connected them there. It is **not a connection**, does not transmit any draft automatically, and does not synchronize posting status. The same manual workflow remains available for features the eventual API does not support. Do not copy unreleased venue details or unapproved paid ticket information.


## Profile-specific post and image imports

The Posts page offers a separate importer under the selected **L-I-F-E**, **Bears Adventures**, or any user-created profile. Its packages are **not** the legacy L-I-F-E seven-day countdown ZIPs; that existing importer remains unchanged and L-I-F-E-only.

A profile package is a ZIP using the **Store / no compression** method. It contains a file called exactly \`HQ-PROFILE-POSTS.json\` and **one to seven uniquely named PNG images**, with one separate PNG per post. Alternatively, choose the extracted JSON and PNG files together using the second picker. The ZIP is checked locally (CRC-32, safe file names, no duplicate entries, size/format limits), with no upload to an external service.

The selected profile ID is shown on **Manage profiles**. The JSON profileId must match it exactly. The app provides a **Download example manifest** action with the current profile ID prefilled. An example of the expected manifest:

\`\`\`json
{
  "packageType": "LIFE-HQ-profile-drafts",
  "version": 1,
  "profileId": "bears-adventures",
  "posts": [
    {
      "title": "Bear explores the garden",
      "caption": "An afternoon adventure in the garden!",
      "date": "2026-11-14",
      "time": "12:00",
      "assetRef": "garden.png",
      "altText": "A teddy bear sitting on grass in the garden",
      "networks": ["Instagram"],
      "platformCaptions": {
        "Instagram": "An afternoon adventure in the garden! 🐻"
      }
    }
  ]
}
\`\`\`

Include a real image named \`garden.png\` alongside this JSON. Dates can be omitted or set to an empty string if not yet planned. The allowed network names are Facebook, Instagram, TikTok, LinkedIn, Threads, YouTube and Pinterest. Image posts require a descriptive altText. The app does not assume those networks are connected.

**Safety and recoverability:** The import is always **Draft** and never publishes, schedules or transfers content. It never overwrites earlier posts or approved work. The selected profile must match. Exact repeat packages (same manifest and image contents) are rejected to avoid duplicates; a changed picture produces a new package fingerprint. Every import makes an encrypted local recovery point before changing the workspace. The recovery screen can reverse that **profile's still-unapproved imported drafts only**, preserving other posts and profiles. Imported artwork stays in the private Media library for safety. A maximum of three new dated recovery snapshots are retained; older pre-update recovery points remain accessible with extra whole-workspace warnings. Always keep a separate **complete encrypted backup including images** before major edits or changing iPhone installation.

No Instagram, Facebook or Buffer integration is activated by saving account handles or importing a profile ZIP. The Buffer handoff is still manual through iPhone sharing and requires user verification on the real destination.


## Media Library refinements

The Media screen is scoped to the selected HQ profile and now supports filename/description search, **All / Used in posts / Not used / Needs description** filters, and a load-more control (up to 48 thumbnail previews per page). Each image shows its file size, whether active or recoverable posts reference it, and a link to edit a post using the artwork. In-use and recoverable pictures are protected from binning. Search is briefly debounced to reduce repeated decryption/rendering on mobile.

**Edit description** updates the selected media record's accessible description. It deliberately does not rewrite an already-approved post's own alt text; update and re-approve that post separately when needed.

New **manual uploads** receive a SHA-256 fingerprint stored as private metadata inside the existing encrypted workspace. If a new uploaded file matches an existing valid image in the same profile, HQ reuses the already-encrypted image instead of saving another copy. Uploads to a different profile are separate. Older files and earlier ZIP imports did not have fingerprints, so duplicates among those older assets are not detected retroactively. If the old metadata exists but its encrypted image file is missing, the upload saves the replacement as a new picture. If any batch write or encrypted metadata save fails, newly stored files and the pending attachment list are rolled back; earlier pictures stay unchanged.

No thumbnail, checksum, caption or image is sent to an external server during these local Media Library operations. This does not grant Buffer, Facebook or Instagram access to the images. Keep complete encrypted backups regularly, including the media library.

Testing performed: isolated profile-scoped gallery rendering (search, filters, links, bin guard, pagination); media description save and failed-save rollback; new upload, same-profile deduplication, cross-profile isolation, second-file failure cleanup and failed encrypted-save cleanup. These are component-level tests, **not** a real iPhone Safari end-to-end check.

## Manual per-platform publishing receipts

The Posts screen now displays per-channel external-posting progress, with records entered by the user. These are **not provider-verified Buffer receipts**.

1. Approve a post and hand off via iPhone sharing or manually in Buffer. A successful share-sheet action is not proof of scheduling or publication.
2. After checking the actual correct external account, open More actions > Record external result. Select the platform and whether it is queued/scheduled or live. Give the real account name; live results require a real HTTPS public URL. Confirm that you personally checked.
3. HQ saves the result, source=manual, timestamp and content revision in its encrypted workspace. It does not contact Buffer.
4. A multi-platform post stays Ready while some platforms are outstanding. It becomes Scheduled manually when all selected platforms have a scheduled/live entry; Published only when all are recorded live. Earlier records remain in the history.
5. Reports shows the number of manually recorded external results and outstanding platforms. Legacy Published statuses without per-channel records are labelled as older records.

Quick status selection for Scheduled/Published opens the same per-channel record dialog. Bulk status changes cannot fake an external schedule. Editing substantive content of an externally recorded post is blocked; duplicate the post as a new draft and retain its earlier record. Manual performance numbers remain editable.

Limitations: account handles are self-entered notes, not authenticated channels. True Buffer verification requires a protected server API token, confirmed channel IDs, and real provider response receipts. Never put the Buffer API key in the public static app. Private encrypted device images do not become public URLs automatically. Current Buffer GraphQL draft creation is available on Free but is not connected to HQ.

References: https://developers.buffer.com/examples/create-draft-post.html ; https://developers.buffer.com/guides/authentication.html


## Manual per-platform publishing records

The public /admin/ HQ remains **local, encrypted and offline-first**. The iPhone Share sheet and the “Open Buffer” link are **not an API connection**; a successful share callback does not confirm that Buffer saved, scheduled or published anything. Do not put API keys in the public HTML, local profile notes, GitHub Pages or downloadable ZIPs.

For an approved post, select **Posts → More actions → Record external result**. The dialog asks for (1) one of the post's selected social platforms, (2) the actual external account name/@handle, (3) “Scheduled / queued” or “Published / live”, (4) a checked acknowledgement that the user saw that exact result outside HQ, and (5) an HTTPS public link for a live result. An optional scheduled local date/time is allowed. The platform list and account-name suggestions are scoped to the selected internal LIFE/Bears/future profile, but saved account handles are *notes only* and not proof of authorisation. Per-platform records are tagged `source: manual`, revisioned with the approved content, encrypted in the existing workspace, and visibly described as **self-reported**. A public link is a user assertion, not Buffer API proof.

The overall post status is **Ready** while one or more selected platforms are not yet accounted for; **Scheduled manually** when all channels have some manually recorded scheduled or live outcome but not all are live; **Published** only once all targeted channels have been reported live. The Posts page includes a per-channel status table and a **Publishing follow-up** summary, while Reports shows the manual entries and platform gaps. Older overall Published/Scheduled statuses are retained, with a warning when per-platform details are incomplete. These are only local records and never alter the real Buffer queue.

The **full post editor** and bulk status dropdown cannot fabricate external Scheduled/Published states. Each platform needs its own checked record. A duplicate post becomes an unpublished Draft, without external receipts, dates/links or metrics carried over. Resetting a post to Draft/Needs review increases its content revision, preserving earlier external receipts as historical records but no longer treating them as current publication proof. A truly published record is never implicitly reset or deleted by making a copy. Changes use the existing encrypted save and rollback procedures; all account notes and source records stay profile-scoped.

### Remaining external integration requirements

A direct Buffer integration is **not active**. Real scheduling receipts, provider post IDs and analytics require a trusted server-side integration (not static GitHub Pages), approved user authorisation, protected credentials, explicit allowlisted channel IDs per HQ profile, idempotent draft creation, and a distinction between manual and API-confirmed events. The prepared private `in-full` integration must be independently reviewed, configured and tested with a single approved draft before offering real automation. Never connect or publish to unauthorised/personal/St John accounts.

### Testing performed

Isolated JavaScript checks covered a two-channel Facebook/Instagram example (one live and another scheduled), status transitions, platform-specific report rendering, cross-profile isolation, missing URLs, invalid provider claims, old-receipt revision filtering, single/bulk reset protections, copy sanitisation and source syntax. These checks are **not** a substitute for real iPhone Safari testing or provider-side confirmation. Preserve encrypted backups including images.
