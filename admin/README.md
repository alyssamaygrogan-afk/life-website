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
