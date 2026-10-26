# L-I-F-E Social Media HQ — direct Meta connection (free setup)

This is a **real Meta Graph API OAuth connection bridge** for the existing L-I-F-E HQ website. It is not a Meta Business Suite password login or a shortcut to Business Suite.

**Status:** Source code ready for deployment. No real Meta accounts are connected until the founder creates a Meta developer app and Cloudflare Worker, then personally approves Meta OAuth in the HQ interface. No posts are ever published by this bridge.

## Free setup

1. Check that the L-I-F-E Facebook Page and its **professional** Instagram account are linked in Meta Business Suite. You must have the correct Page permissions.
2. Open [Meta for Developers](https://developers.facebook.com/apps/) using the Meta account authorised to manage L-I-F-E. Create a Meta app, enable **Facebook Login for Business** / Instagram API with Facebook Login as permitted by the current Meta dashboard. Obtain the App ID and App Secret. Do not commit the secret to GitHub.
3. Create a Cloudflare account with the **Workers Free** plan (no paid subscription is required for normal initial setup) and make a KV namespace named `life_hq_meta`. Note its namespace ID.
4. Create or deploy a Worker from the `meta-bridge` folder. Update `wrangler.toml` with the KV namespace ID and real worker URL as `META_REDIRECT_URI`. A developer with the Cloudflare CLI can run `npx wrangler kv namespace create life_hq_meta` and `npx wrangler deploy` from this folder. Alternatively use the dashboard to upload the Worker script and create/bind KV.
5. In the Cloudflare Worker **Settings → Variables and Secrets**, add the four encrypted secrets: `META_APP_ID`, `META_APP_SECRET`, `HQ_ADMIN_KEY`, and `META_TOKEN_ENCRYPTION_KEY` (base64url of 32 random bytes). Store the HQ admin key privately. Do not share it in chat.
6. In Meta's Facebook Login settings, add the exact Worker `https://...workers.dev/oauth/callback` address to **Valid OAuth Redirect URIs**. Configure the L-I-F-E website as the app's allowed domain and complete any Meta-provided privacy policy, data deletion, and app review requirements.
7. Open [L-I-F-E Social Media HQ](https://lifeinfullecosystem.org/admin/), go to **Accounts → Direct Meta connection**, enter the Worker URL and private bridge access key **inside HQ**, then use **Authorise with Meta**. After returning to HQ, choose **Check available Pages** and select the **L-I-F-E** Page. Check the verified page and linked Instagram handle.

## Scope and safeguards

- Meta login is completed on Meta's site. HQ never asks for Facebook or Instagram passwords.
- Worker encrypts the Page token in Cloudflare KV with a secret not placed in GitHub.
- HQ's separate private admin key authenticates calls to the Worker; only the configured HQ domain can make browser API requests (CORS).
- The integration distinguishes account connection from publishing. The Worker has **no publishing endpoint**, and cannot spend money or automatically schedule a post.
- This starter connects and verifies a Page and linked Instagram account. **Posting** requires a later reviewed, explicitly authorised integration with public image hosting for Meta to fetch media, plus relevant Meta permissions and any needed app review.
- If the app is only used by people assigned developer/tester/admin roles, Meta may allow testing in development mode. Public availability or more advanced access can require Meta App Review and business verification.
- Avoid granting Meta app administration, tokens or Worker access to anyone outside the authorised charity roles. Use independent credentials, 2FA and explicit roles.

## API routes

`GET /health` — no account tokens; reports service setup readiness.

Requires `X-LIFE-HQ-Key: <your private access key>` (except callback and health):
- `GET /status` — verify Meta Page connection; expose public page and Instagram name only.
- `POST /auth/start` — one-time Meta OAuth URL and flow ID.
- `GET /candidates?flow=...` — list Pages for *this* Meta authorisation without revealing tokens.
- `POST /select` with JSON `{"flow":"...","pageId":"..."}` — connect the explicitly selected Page.
- `POST /disconnect` — revoke HQ's locally held connection (also revoke app permissions in Meta to revoke Meta-side grants).

Meta OAuth callback: `GET /oauth/callback`.

## Documentation

- [Meta Instagram API with Facebook Login](https://www.postman.com/meta/instagram/folder/u4g5a2a/instagram-api-with-facebook-login)
- [Cloudflare Workers Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
- [Cloudflare Workers Limits](https://developers.cloudflare.com/workers/platform/limits/)
