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
