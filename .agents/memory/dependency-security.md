---
name: Dependency security
description: Security-policy failures during clean dependency installation
---

A previously working installed dependency is not proof that the current lockfile can be installed again.

**Why:** A clean post-merge installation encountered critical-CVE policy blocks for dependencies that had already been running in the workspace.

**How to apply:** Treat security-policy download failures as dependency-update work, not registry connectivity errors. Use allowed fixed releases rather than bypassing the firewall, and verify the affected functionality after any required version upgrade.
