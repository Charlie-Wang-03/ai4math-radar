# Read-only official arXiv dated listing archive (Batch 14)

## Motivation

arXiv paper `/abs/<id>` submission clocks, Search API `published`, and OAI-PMH datestamps cannot certify a first-public announcement time. Official recent category listings expose **named, dated announcement groups**, but roll older days out of view. Batch 13 successfully identified nine previously misdated arXiv events using those listings on 2026-10-30; without an archived observation, the direct `/recent` evidence link eventually stops showing the event.

## No-MCP evidence capture

This repository already has GitHub Actions, a read-only original-provider probe and a 301+ record editorial content pipeline. A standalone authenticated remote MCP service would be redundant.

The new `scripts/capture-arxiv-dated-listings.mjs` captures ten **explicitly allowlisted original arXiv category listing URLs**: `math.AC`, `cs.CC`, `cs.LG`, `cs.LO`, `math.NT`, `cs.AI`, `cs.DS`, `math.CO`, `cs.CL`, `math.AG`.

- Fixed `https://arxiv.org/list/<category>/recent?show=2000&skip=0` sources; no redirects or arbitrary user URLs; HTTPS-only, 15-second request timeouts, 3.8 MB maximum individual page, sequential requests separated by 3.3 seconds.
- Parse dated `h3` heading groups and official arXiv article links, preserving date-to-ID membership, page SHA-256 digest, source URL, retrieval time and a **candidate-only** match to canonical selected news by exact arXiv ID.
- **No publication-time promotion**: `recent` can include replacements/cross-listings. No change to `selected.jsonl`, feed sort, scores, source claims, original permalinks or theorem validity. It must be checked against the exact v1 and event type before publishing.
- GitHub Actions [arxiv-dated-listing-capture.yml](../../.github/workflows/arxiv-dated-listing-capture.yml): manual dispatch, PR safety checks and low-cost weekday capture at **07:27 UTC Mon–Fri** (after the US-Eastern evening announcement window). Artifact retention **90 days**.
- `contents: read` only; no secret tokens, remote MCP server, Docker, database, privileged workflow writes or user data.

## Evidence promotion procedure

1. Read `arxiv-dated-listings` artifact and identify `matchedNews`; verify the page was fetched successfully (`ok=true`) and there is an exact article ID under the exact dated category heading.
2. Cross-check the arXiv v1 identity with original article history and ensure this is a **new paper**, not a cross-listing/replacement or an already known independent announcement.
3. Only then manually submit a narrow **content PR** setting optional `chronology.milestone` at **day precision** with original dated listing evidence and the archived digest/run link in its audit document. Do not invent 20:00 ET release clocks.
4. Keep permanent IDs and `publishedAt` unchanged per [temporal contract](../editorial-temporal-contract-v1.md), unless a separately reviewed chronology schema/feed migration is approved.
5. For dates older than the rolling window (e.g. ProofNet 2023 and Lean Atlas April 2026), this script cannot recover them retroactively; seek independently archived dated sources.

## Acceptance

- Live official capture is required: the script's fixtures alone do not prove that the current site HTML matches the parser.
- Verify count of valid category results, dated groups, article ID matches and SHA-256 hashes from a real Actions artifact before merge.
- Require repository `Check`, `Docker`, code scanning, review resolution and no canonical content edits.
