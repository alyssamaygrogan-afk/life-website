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

## 24 October — v0.3 candidate

A new *downloadable* v0.3 candidate adds stale OAuth callback invalidation, session-generation checks during login and Drive discovery, explicit failed-token revocation, no pre-authorized workspace DOM rendering, scoped mobile Home Screen manifest and iPhone icons. Twelve mocked local Chromium tests passed (the previous eight plus four regressions). JavaScript syntax checks passed. The ZIP remains off the website and outside this PR; no public files or DNS records were changed. Google OAuth client ID and server/edge authorization remain outstanding. The PR remains a review-only draft and **must not be merged as a deployment**.

## 24 October — v0.4 candidate

Another **local downloadable** build completed (app source remains in the ZIP, **not committed to this public GitHub repository**). No production deployment, OAuth registration, social publishing, domain change or Google Drive write occurred.

**Code changes:** Stale cloud refreshes cannot repopulate the workspace after sign-out, reconnect or local edits. Remote revision is rechecked after reading. Sign-out now clears private content from the JavaScript runtime and page DOM as well as the device cache. Private workspace content is not loaded into application state before a verified login. Google Identity Services is preloaded once when a public OAuth client ID is configured, reducing popup timing failures. Uploads check session state before writing.

**Validation:** 16/16 mocked Chromium scenarios passed: baseline five, three Drive reliability, four OAuth/PWA and four new sign-out/cloud-refresh regressions. JS syntax checks and ZIP integrity passed. These tests did not use the real Google OAuth app, real Google Drive or actual iPhone Safari. The existing 4 MB Drive workspace cap and best-effort (non-transactional) concurrent write guard remain.

**Still blocking public release:** OAuth web client ID, production server-enforced admin route privacy, real approved-account/Drive tests, phone and desktop acceptance, explicit deployment authorization. The site's public home page and registration form are unchanged.

## 24 October — v0.5 private edge gate

The current candidate now validates individual Drive records before accepting them and includes a fail-closed Cloudflare Worker route package. Local test evidence: 20 mocked Chromium cases and 8 synthetic RS256 Access JWT tests passed, plus JS syntax and ZIP integrity. The Worker code has also been staged for review as a **draft** in the private In Full repository PR #113: https://github.com/alyssamaygrogan-afk/in-full/pull/113. The full app source is **not committed** in that PR; it is in the conversation's v0.5 build package. The public life-website homepage and ticket form remain untouched. No DNS, Access app, Google OAuth client, live sync or admin website deployment is configured. This public-repo draft remains documentation-only.
