# Social Media HQ — deployment review (not live)

A responsive `/admin/` candidate was prepared separately and tested in five simulated browser passes. **Do not merge/deploy yet.** The candidate files are not included in this branch because the Google OAuth client configuration and production authorization boundary are not ready.

## Current site
Keep the existing public `index.html`, countdown, and Google Forms ticket reservation unchanged.

## Proposed `/admin/`
- Separate login UI and campaign planner
- Allowlisted Google account: `alyssa-may.grogan@lifeinfullecosystem.org`
- Google Drive `drive.file` OAuth storage, folder `LIFE Social Media HQ`, file `workspace.json`
- Mobile/desktop layout, post editor, calendar, drafts, contacts, JSON backups
- No automated social-network posting

## Production gates
1. Register an OAuth web client with Google Cloud and authorize `https://lifeinfullecosystem.org`; confirm ownership and Google Drive access for the exact account.
2. Add a server-side access-control boundary or identity-aware proxy if `/admin/` itself must be private. A static GitHub Pages path plus browser-only email checking is **not** a secure server-enforced login. Static HTML and JS would remain publicly retrievable.
3. Test actual Google OAuth, scopes/verification, Drive read/write, mobile Safari, session expiry, concurrent edits and recovery with authorized test data.
4. Add cloud backup/version recovery and consider separate Drive files for media. Current draft is capped at 4 MB and uses a single JSON workspace.
5. Obtain explicit approval before production deployment.

## Five local simulated browser passes
1. Login gate rejects wrong Google email and missing client ID.
2. Authorized simulated login and Drive save.
3. Calendar, 100-day prompt generator, JSON backup.
4. Cross-device load and remote-version conflict stop.
5. Mobile layout and sign-out.

These are mocked browser tests, **not** verification against live Google services.
