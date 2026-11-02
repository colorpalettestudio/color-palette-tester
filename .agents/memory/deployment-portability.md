---
name: Deployment portability
description: Why successful workspace builds can still fail on Vercel
---

Verify external builds with only Git-eligible source files, not the complete workspace.

**Why:** The workspace's global Git ignore rules exclude uploaded assets. A product image imported directly from the uploads folder worked locally but was absent from Vercel's checkout. A Git-only build reproduced the missing-image failure that a normal workspace build missed.

**How to apply:** Keep small application images in the app's versioned assets directory; never depend on the uploads folder being present after a Git deployment. For large durable assets use App Storage. After deployment fixes, test an isolated copy of Git-eligible sources and verify required assets are included, not ignored.
