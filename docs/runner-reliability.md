# Windows runner reliability

The runner uses Windows Network Service and starts automatically before sign-in. The manual `Windows runner smoke test` workflow verifies an isolated exact-revision checkout, service identity, Node.js, npm, Git, Java, temporary writes and at least 10 GB free disk space. It does not install packages or deploy anything. Its ten-minute limit bounds execution; time waiting for a runner is separate.

Existing job timeouts are explicit. Keep the three runner registrations on this PC lightly loaded: it has two logical processors and approximately 7 GB RAM. Multiple repository registrations share the same physical machine; they do not add compute capacity.

Do not change self-hosted workflows to run untrusted pull-request code without a separate isolation review. Registration does not alter existing workflow triggers or permissions.

The hourly public-repository heartbeat runs at minute 7. An independent GitHub-hosted monitor runs at minute 37, so it can detect a powered-off PC. It creates one public issue assigned to the repository owner when health is missing/stale/failed, leaves an ongoing incident quiet, and closes it after recovery. It exposes only this public health check's status and link, never private repository names or credentials. GitHub schedules may be delayed and public-repository schedules can be disabled after 60 days of inactivity. Issue/email delivery depends on the owner's GitHub notification settings. No paid runner, artifact or cache storage is requested.

## Verification on 18 November 2026

The branch [runner smoke job](https://github.com/alyssamaygrogan-afk/life-website/actions/runs/44300837239) completed successfully under Network Service. This proves checkout and installed-tool execution on the registered runner; it does not assert that all application tests pass.

The existing Social HQ audit independently failed at `tests/social-hq-audit.test.mjs` with `Missing source section async function save(){`. Its source files and test assertions were not changed by this runner maintenance. The audit job timeout remains 20 minutes; this existing application-test failure requires separate investigation.
