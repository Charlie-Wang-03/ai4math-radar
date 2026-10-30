# Batch 12 — arXiv OAI-PMH provenance investigation and reproducible probe (2026-10-30)

## Problem and correction

18 canonical arXiv-sourced items still have date-only `publishedAt`. The [arXiv Search API](https://info.arxiv.org/help/api/user-manual.html) `entry.published` represents the first version's submission, **not** a certified first-public announcement timestamp. The [announcement Atom feed](https://info.arxiv.org/help/atom_specifications.html) is a different source; its `published` represents the public announcement of a listing or update. Historical article-matched announcement Atom snapshots have not been established for all 18.

The [official availability policy](https://info.arxiv.org/help/availability.html) explains that article IDs are allocated **when announced**. A March submission attached to a 2604 identifier is possible after a cross-month moderation delay, not inherently an error:
- `2026-04-21-lean-atlas-semantic-alignment` links [2604.16347](https://arxiv.org/abs/2604.16347), with v1 **submitted March 16**, and a **2604 April ID**. This does **not** establish either that the April 21 archive date is right or that it is wrong. The earlier Batch 11 assertion that this is an ID/month anomaly is corrected by the erratum in that document.
- `2023-02-23-proofnet` links [2302.12433](https://arxiv.org/abs/2302.12433), v1 **submitted February 24 03:28:46 UTC**. A Feb 23 *arXiv public-paper* event would need independent earlier external release evidence or an explicitly distinct event identity; the historical permalink is preserved while unresolved.

## Reusable no-write collector, not a production MCP server

Existing `scripts/probe-publication-evidence.mjs` and `.github/workflows/publication-time-evidence-probe.yml` already provide an allowlisted read-only research artifact workflow, so a separately hosted and authenticated MCP server would add deployment/secret/operations costs without unlocking required facts.

This PR adds `scripts/probe-arxiv-chronology.mjs`, targeting exactly canonical selected arXiv abs URLs with date-only precision. It requests official [OAI-PMH GetRecord](https://info.arxiv.org/help/oa/index.html) in `arXivRaw` format for each article from **only** `https://oaipmh.arxiv.org/oai`, with:
- ID and canonical domain validation, strict HTTPS, no follow-redirects, fixed payload limit (1.2 MB), 15-second timeout per item, conservative sequential interval (3.3 seconds);
- verification of `oai:arXiv.org:<id>` response identity and matching internal metadata ID;
- OAI header `datestamp`, metadata `created`/`updated`, and version dates collected as **candidate fields** with provenance and SHA-256 response digest;
- row-by-row error preservation and no automatic updates of canonical data, no guessed dates, no publication acceptance from a last-modified metadata timestamp.

OAI-PMH may not carry the precise initial announcement timestamp at all. This probe improves **forensic evidence** and identifies which paper/version metadata requires a different archived announcement source; it is **not** a claim that a successful OAI response solves first-public-time dating.

The workflow retains `contents: read`, runs safety regression tests, and uploads `evidence/arxiv-oai-candidates.json` with the existing source artifact for 14 days. No tokens, API keys, new long-running server, DB, MCP exposure or write privileges are necessary.

## Research status and next decision

- **18** original arXiv records scoped; **zero** automatic timestamp corrections; **zero** stable ID changes.
- Inspect actual GitHub Actions evidence output before interpreting any returned `created`/OAI `datestamp` values.
- If the official per-article public announcement day can be identified independently via archived daily feeds/listing snapshots, create a **separate source-backed content PR** with day/second precision consistent with temporal contract #104.
- If the official initial announcement cannot be inspected, retain date-only/unresolved rather than infer a universal nightly schedule.
- The existing 301 records and all public permalinks remain unchanged by Batch 12.

## Acceptance checklist

1. Node tests for no-write behavior, ID matching, source allowlist, OAI error and malformed response, delayed cross-month submissions, and redirect rejection;
2. GitHub `check` / `docker` and opt-in publication evidence probe workflow; inspect emitted artifact rather than assuming access works;
3. No file changes to `portable/content/selected.jsonl`; no touching inactive native AIHOT MCP;
4. No claim of independent mathematical proof verification.

## Actual first GitHub Actions evidence results (2026-10-30)

[GitHub Actions run #41004507551](https://github.com/Charlie-Wang-03/ai4math-radar/actions/runs/41004507551) **succeeded**; immutable artifact `publication-time-candidates` (artifact ID `12955166646`) includes `arxiv-oai-candidates.json`, SHA-256 digest for each response and the full provider evidence matrix. **18/18** OAI GetRecord requests returned HTTP 200 and matched the expected official article ID.

| arXiv ID | Historical Radar day | OAI last metadata date | OAI v1 submission day |
| --- | --- | --- | --- |
| [2609.36663](https://arxiv.org/abs/2609.36663) | 2026-09-29 | 2026-09-30 | 2026-09-29 |
| [2609.25575](https://arxiv.org/abs/2609.25575) | 2026-09-22 | 2026-09-23 | 2026-09-22 |
| [2609.27041](https://arxiv.org/abs/2609.27041) | 2026-09-22 | 2026-09-25 | 2026-09-22 |
| [2605.17283](https://arxiv.org/abs/2605.17283) | 2026-05-17 | 2026-05-19 | 2026-05-17 |
| [2604.16347](https://arxiv.org/abs/2604.16347) | 2026-04-21 | 2026-04-21 | 2026-03-16 |
| [2302.12433](https://arxiv.org/abs/2302.12433) | 2023-02-23 | 2023-02-27 | 2023-02-24 |
| [2306.01694](https://arxiv.org/abs/2306.01694) | 2023-06-02 | 2023-11-07 | 2023-06-02 |
| [2306.15626](https://arxiv.org/abs/2306.15626) | 2023-06-27 | 2023-10-30 | 2023-06-27 |
| [2610.26467](https://arxiv.org/abs/2610.26467) | 2026-10-19 | 2026-10-20 | 2026-10-19 |
| [2610.28208](https://arxiv.org/abs/2610.28208) | 2026-10-20 | 2026-10-21 | 2026-10-20 |
| [2610.28079](https://arxiv.org/abs/2610.28079) | 2026-10-20 | 2026-10-21 | 2026-10-20 |
| [2610.28111](https://arxiv.org/abs/2610.28111) | 2026-10-20 | 2026-10-21 | 2026-10-20 |
| [2610.36534](https://arxiv.org/abs/2610.36534) | 2026-10-27 | 2026-10-28 | 2026-10-27 |
| [2610.37125](https://arxiv.org/abs/2610.37125) | 2026-10-27 | 2026-10-28 | 2026-10-27 |
| [2610.37018](https://arxiv.org/abs/2610.37018) | 2026-10-27 | 2026-10-28 | 2026-10-27 |
| [2610.36377](https://arxiv.org/abs/2610.36377) | 2026-10-26 | 2026-10-28 | 2026-10-26 |
| [2610.34516](https://arxiv.org/abs/2610.34516) | 2026-10-25 | 2026-10-27 | 2026-10-25 |
| [2610.34389](https://arxiv.org/abs/2610.34389) | 2026-10-25 | 2026-10-27 | 2026-10-25 |

**Interpretation:** 17/18 OAI header datestamps are later than the archived event day, and 1/18 (Lean Atlas) matches it. This is **not** evidence that 17 article dates are wrong. OAI datestamps represent metadata changes and can reflect first ingestion, corrections, or later versions (e.g. CheckMate 2023-11-07, LeanDojo 2023-10-30). All 18 have **zero independently established announcement clock instants** from this method. The result is an evidence collection success, not a date correction. The date-only legacy count remains 94 after Batch 11.

Next work should obtain **first-announcement listing records**, not reinterpret these OAI dates as public timestamps. Preserve the original ID and `publishedAt` even when v1 submission day and legacy event day conflict.
