---
name: Dependency security
description: Security-policy failures during clean dependency installation
---

A previously working installed dependency is not proof that the current lockfile can be installed again.

**Why:** A clean post-merge installation encountered critical-CVE policy blocks for dependencies that had already been running in the workspace.

**How to apply:** Treat security-policy download failures as dependency-update work, not registry connectivity errors. Use allowed fixed releases rather than bypassing the firewall, and verify the affected functionality after any required version upgrade.

Keep dependency lockfiles portable to external deployment providers.

**Why:** Dependency updates in this workspace can record private registry download URLs. Vercel cannot reach those hosts; its npm installation can fail with an unhelpful “Exit handler never called” message.

**How to apply:** Before external deployment, check for development-only registry hosts. Use canonical public download URLs for the same approved versions, preserving integrity hashes and security checks. Verify a clean locked install and production build; deploy the updated commit rather than retrying an old one.
