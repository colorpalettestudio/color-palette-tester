---
name: Palette exports
description: User's standing requirement for downloaded and copied palette content
---

Do not include WCAG passing or failing information in palette or pairing exports.

**Why:** The user explicitly asked to keep that information out of exports.

**How to apply:** Keep accessibility results in the testing interface, not in downloaded images, PDFs, copied codes, or Studio Code exports.

Include the numeric contrast score for each chosen pairing in downloaded PNGs, but still omit WCAG labels and passing/failing information.

**Why:** The user requested contrast scores in pairing downloads after the download pop-up was introduced.

**How to apply:** Show the pair's calculated ratio independently of the selected testing benchmark; keep palette-only exports free of pairing scores.

Keep export actions in a download pop-up, with a choice of colors only or colors and selected pairings. Offer PNG download, copying HEX codes, and copying Studio Code; do not offer PDF or TXT downloads.

**Why:** The user wants the sidebar's vertical space available for all chosen pairings, without cutting them off.

**How to apply:** Show the chosen pairings in normal page flow without a capped scroll area, and keep export-format controls inside the pop-up.
