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
