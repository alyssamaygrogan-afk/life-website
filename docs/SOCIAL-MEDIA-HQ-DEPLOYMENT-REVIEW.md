# L-I-F-E Social Media HQ — next build review (NOT LIVE)

**Updated 24 October 2026: v0.2 candidate built and validated locally.** The deployable candidate is in the conversation's downloadable ZIP, not in this public repository. Do **not merge or deploy** this review branch as an admin launch. The current public homepage, countdown and Google Forms reservations remain unchanged.

## Candidate functionality
- Proposed URL: `https://lifeinfullecosystem.org/admin/`, using a responsive phone/computer interface
- Google sign-in with an exact checked email of `alyssa-may.grogan@lifeinfullecosystem.org`
- Personal Google Drive OAuth `drive.file` scope, folder `LIFE Social Media HQ`, file `workspace.json`
- Post editor, calendar, 100-day draft generator, image attachment, press/invitation tracker and backups
- No social network authentication or automatic publishing

## v0.2 security and reliability improvements
1. Paginate Google Drive listing using correct `pageSize`/`nextPageToken` and detect duplicate folders/files.
2. Upload new workspace JSON atomically in a multipart request, avoiding a stranded empty Drive file.
3. Preserve the prior cloud revision if a refresh fails and do not knowingly overwrite a changed remote version.
4. Keep edits marked unsynced after OAuth expiry/sync pause; warn on logout with pending work.
5. Revoke rejected access tokens; guard stale callbacks after logout; check 4 MB remote limit.

## Eight browser simulations (all PASS)
- Five baseline: wrong/missing login configuration; simulated new Drive file and post save; calendar/drafts/backup; simulated second-device conflict; mobile viewport/sign-out.
- Three additional: paginated/duplicate Drive folders rejected; unsynced edits remain dirty after sync conflict; failed remote read does not advance revision.

**These are mocked Chromium/browser tests, not real Google OAuth/Drive or production acceptance.** Two simultaneous real Drive writes can still race; the version guard is not a transactional lock.

## Production blockers
1. The Google OAuth Web Client ID is **not configured**. Enable Drive API, consent and authorized origin for `https://lifeinfullecosystem.org` in a controlled Google Cloud project.
2. GitHub Pages is static. Its `/admin/` files would be publicly readable even behind a JavaScript sign-in screen. Use a proven edge/server identity-aware access policy for `/admin/*` that enforces the exact authorized email **before serving any admin assets**, or host the protected app elsewhere. Test a logged-out request to the route and its JS files.
3. Test live sign-in, Drive access, logout, reconnection, iPhone Safari, cloud revision conflict, storage recovery and backups.
4. Device-local storage is unencrypted, so use a trusted device and clear it on sign-out. Do not store sensitive private records.
5. Require explicit deployment approval after completing the gates. **Do not put any passwords, client secrets, or OAuth tokens into GitHub.**

No publishing action, login setup, Google Drive write or website deployment has occurred.
