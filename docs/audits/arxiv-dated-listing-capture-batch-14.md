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

## Real official GitHub Actions acceptance (2026-10-30)

- [Read-only official capture run #41025169577](https://github.com/Charlie-Wang-03/ai4math-radar/actions/runs/41025169577) **PASS**, original source date captured 2026-10-30 UTC. Artifact: `arxiv-dated-listings`, GitHub artifact ID **12963480926**.
- **10/10** official category pages HTTP 200; **50** date-heading groups; **4,765** article occurrences across lists (not 4,765 globally distinct papers; cross-listing overlaps are expected).
- **15** source-to-Radar occurrences, corresponding to **9 unique existing arXiv news IDs**, including two papers under the October 27 group and seven under October 28. All nine match the existing Batch 13 `chronology.milestone.date`, with **0 contrary source days**.
- Category occurrence distribution: `math.AC` 39; `cs.CC` 55; `cs.LG` 1,438; `cs.LO` 73; `math.NT` 202; `cs.AI` 1,497; `cs.DS` 118; `math.CO` 390; `cs.CL` 738; `math.AG` 215.
- **Important debugging/repair:** the original page emits `href ="/abs/2610.40540"` (space before equals), which the initial parser missed. Live evidence in the early exploratory run had `10/10` success but **0 matched** due to mistakenly matching only cited absolute links in abstracts. Final implementation accepts the real spacing and extracts only **main `dt` article identifier anchors**, not `dd` citation links. Bounded raw markup diagnostic fields have been removed from the final collector.
- The resulting artifact is a reproducible **observed membership snapshot**, not an automated timestamp authority. A paper may appear in cross-listing/replacement groups. The nine matches confirm previously manually reviewed days but this pipeline **never writes** or auto-promotes a canonical date.

## Fail-closed archive health (review repair)

The CLI writes the bounded JSON audit artifact first, then **sets a nonzero exit code** if no official-source, dated heading group contains any valid arXiv article ID. GitHub Actions uses `if: always()` for its upload step, so failure preserves diagnostics without falsely claiming that evidence was collected. A capture containing dated paper groups but zero matches to the current Radar catalog remains valid (a legitimate editorial slow day). Other per-source partial failures remain visible in the artifact's individual HTTP statuses and should be monitored separately.

## Batch 15 follow-up — replayable source payloads and historical probes

The first Batch 14 artifact retained only page **hashes and parsed ID/day pairs**. Once the upstream rolling page changes, a digest alone cannot reconstruct or independently verify the observed markup. This patch therefore retains **inert, gzip-compressed raw official HTML response bytes** alongside the JSON, for each successful category request. Every JSON entry includes `rawEvidence.relativePath`, raw-response SHA-256, compressed-file SHA-256 and compressed byte length; tests decompress and check bitwise fidelity to fetched UTF-8 bytes. These archived HTML files must be treated as **untrusted source data**, never executed or served as application HTML.

For the two unresolved history cases, the workflow additionally probes original older-category monthly pages **only in PR/manual executions**:

| Record | Fixed official original listing | Research goal |
| --- | --- | --- |
| ProofNet (`2302.12433`) | `https://arxiv.org/list/cs.CL/2302?show=2000&skip=0` | Look for ID under an explicit February 2023 daily heading |
| Lean Atlas (`2604.16347`) | `https://arxiv.org/list/cs.HC/2604?show=2000&skip=0` | Look for ID under an explicit April 2026 daily heading |

The monthly URL **by itself never verifies a day**. Only a returned page that *actually contains the exact arXiv ID under a dated heading* yields a candidate. It still requires v1 versus revised/cross-listed record reconciliation and review before changing chronology. Both older pages are preserved as gzip evidence when accessible; if a remote request fails or no dated group appears, status remains unresolved. This research probe does not run on the recurring schedule and never changes `selected.jsonl`.

Validation: read-only GitHub Actions workflow with code tests plus real response count, raw gzip digests and URL/ID evidence inspection. 90-day artifact retention is **not permanent storage**; any long-term archival solution must be reviewed separately with provenance, security and retention policies.
