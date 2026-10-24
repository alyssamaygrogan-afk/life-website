# L-I-F-E Social Media HQ — competitive audit and improvement plan

**Reviewed:** 24 October 2026  
**Current live baseline at start of audit:** device-encrypted drafts, basic month calendar, outreach/contact tracker, Monday seven-post generator, venue-release draft, 11 account-setup checklists, encrypted backup/import. No verified administrator login or platform APIs.  
**Scope of review:** Social-media publishing/marketing tools and advertising platforms; product features, not plan pricing or legal certification.

## Independent product references (official documentation)

- [Later getting started](https://help.later.com/hc/en-us/articles/360043246993-Getting-Started-With-Later-Social) — multi-platform publishing, media library, analytics, link-in-bio, collaboration.
- [Later publishing workflow](https://later.com/social-media-scheduler/) — calendar, post scheduling, assets, approvals, inbox, reports.
- [Metricool product overview](https://metricool.com/what-is-metricool/) — cross-platform posts, ads, analytics, competitor research, reporting.
- [Metricool mobile capability matrix](https://help.metricool.com/features-available-in-the-mobile-app-213ni) — which mobile features are supported/not supported.
- [Hootsuite content approvals](https://help.hootsuite.com/s/article/ask-for-approval) — accountable content-review chain and approval queues.
- [Hootsuite social listening](https://help.hootsuite.com/s/article/overview-listening-hootsuite) — brand mentions and trend analysis.
- [Google Ads Overview](https://support.google.com/google-ads/answer/7321090/about-the-overview-page?hl=en-GB) — performance cards, metrics, campaign status.
- [Google Ads budgets](https://support.google.com/google-ads/answer/13630812?hl=en) — daily budgets, spend optimization, financial guardrails.

## Capability comparison

| Area | Established-tool capability | L-I-F-E before audit | This increment / remaining boundary |
| --- | --- | --- | --- |
| One brand across channels | Brand workspaces and connected accounts | Registration checklists only | New intended-platform selection per draft; **OAuth still missing** |
| Content creation | Platform-specific post composer, asset templates | Single generic caption | Format selector, intended channels, media filename reference, CTA; **platform-specific preview missing** |
| Accessibility and consent | Approval/creative workflows | No caption signoff or image descriptions | Alt-text editor and review acknowledgment before Ready; **no verifiable consent archive yet** |
| Approvals | Multi-user assignment, permissioned signoff | Single local status dropdown | Explicit local reviewed checkbox and release blocks; **not verified co-founder/role sign-off** |
| Scheduling and calendars | Queues, automated posting, drag/drop | Simple monthly calendar and Monday draft generation | Click-to-edit calendar entries, searchable/filterable drafts; **automatic publishing remains unavailable** |
| Free publicity | Outreach CRM/contacts | Local contacts and notes | Existing tracker retained; **submission pipeline and follow-up reminders missing** |
| Paid campaigns | Campaign setup, budgets, spend, approval, targeting | Provider account checklist only | Private ad-plan register and manual approved-budget check; **no spending or campaign deployment integration** |
| Insights | Verified reach, link clicks, conversions, top posts | No reporting | Optional manually copied post metrics, CSV export; **no live APIs / conversions / attribution** |
| Media | Uploads, previews, library | None | Media reference and alt text; **actual uploads and video preview missing** |
| Inbox/listening | Comments, mentions, sentiment | None | **Not built**; requires provider APIs and permissions |
| Link-in-bio/UTM | Destination management and click tracking | Existing public website/free reservations | CTA field and URL validation; **UTM attribution and landing-page funnel not yet built** |
| Data portability | Export reports | Encrypted JSON whole-workspace backup | Posts and ads CSV export; CSV explicitly unencrypted/private |
| Team management | Multiple roles, audit logs, authorization | One locally encrypted workspace | **Not built**; do not treat single password as server authentication |
| Mobile usability | Mobile editing and on-the-go publishing | Responsive dashboard | Enhanced editor/reporting/mobile horizontal nav and browser tests; actual iOS Safari acceptance still needed |

## Major blockers before claiming parity or turning on automatic actions

1. **P0: Administrator identity.** GitHub Pages is publicly readable; the current email check is a label only. Move private admin routes/assets behind verified account authentication and enforce authorization server-side. No platform tokens/secrets in static JS or local storage.
2. **P0: Google Drive/device synchronization.** Connect verified Google Cloud OAuth and Drive API, verify conflict-safe multi-device writes, retention and recovery. Current records are encrypted on one browser only.
3. **P0: Publication rights and proof.** L-I-F-E accounts must exist and each provider must independently approve required scopes. TikTok/LinkedIn access cannot be assumed. Manual status is not proof that a social platform published a post.
4. **P1: Multi-person approval.** Authenticated Heidi/Alyssa-May approvals and an auditable review history (including safeguarding, copyright/consent and charity claims), not a locally spoofable checkbox.
5. **P1: Real media assets.** Secure asset management, file previews, alt text, video subtitles/transcripts, rights/credit and per-channel aspect ratios.
6. **P1: Publishing engine.** Queue, retry/backoff, platform requirements, provider receipts, failure visibility, per-channel variants; never claim a post was sent without API confirmation.
7. **P2: Analytics/reporting.** Connected platform stats, website analytics, link UTMs/conversions and historical snapshots with exact source and last-updated date.
8. **P2: Advertising engine.** Charity-approved budgets/currency, separate account permissions, objectives/targeting, conversion instrumentation, spend alerts and external campaign confirmation. **Never auto-spend without explicit authority.**
9. **P2: Community + press.** Moderated social inbox, local directories, radio/newspapers/outreach follow-ups; respect platform rules.
10. **P3: Visual/efficiency.** Reusable brand templates, media previews, calendar drag/drop, bulk import, visual grid, accessibility polish.

## L-I-F-E-specific publishing gates

- Public reveal and ticket-promotion target: **3 December 2026**, exactly 40 days after **24 October 2026**.
- Actual launch: **30 January 2027, 3:00 PM UK**.
- Protect venue identity and detailed missions until their agreed reveal windows. Only post confirmed venue/booking details and approved ticket terms; existing free reservations are distinct from any unconfirmed paid supporter/presale offerings.
- Media used for vulnerable individuals/children must observe appropriate consent/safeguarding and never disclose private personal records.
- Never post automatically, claim actual advertising spend, or label metrics 'live' in this interim architecture.

## Testing boundaries

New branch tests cover old AES-GCM workspace compatibility, corrupt-record checks, review/venue gates, manual ads, CSV formula-safety and desktop/mobile workflow. CI and browser tests **do not authenticate to live Meta, Google Ads, TikTok, or other platforms** and do not represent a full penetration audit or actual iPhone hardware test.

**Public homepage:** separate from `/admin/`; do not edit countdown, venue placeholder, embedded free ticket form or DNS during this increment.
