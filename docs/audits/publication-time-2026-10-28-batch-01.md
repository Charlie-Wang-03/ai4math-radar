# Publication-time evidence audit — Batch 01 (2026-10-28)

## Scope and rules

- Starting canonical store: `portable/content/selected.jsonl` on `main@c216820d9c6a5eaecbc9ae686a4472bb3270a40e` (294 selected items, 175 legacy day-only UTC-midnight values).
- Batch: 12 most recent legacy day-only records (2026-10-24 through 2026-10-27 UTC).
- Change a `publishedAt` time only when an **independently inspectable primary-source public milestone** is timestamped with sufficient precision. A git commit's author/committer timestamp alone is not automatically proof of public disclosure; repository merge, PR creation and platform v1 public release must be distinguished.
- Source-webpage day, article body creation date, manuscript filename date, file mtime, crawler/discovery time, later public repost, and institution internal execution time do **not** prove first public minute.
- A platform's published calendar **date** is not a warrant to fill in a time. Absence of visible time is `UNRESOLVED_DAY_ONLY`, not a fabricated 00:00 or 08:00. Potentially contradictory original event dates require a separate review rather than silent redating.
- Display is Beijing (UTC+08:00); `publishedAt` remains an RFC3339 UTC timestamp. This is a first verifiable **public research disclosure milestone**, not a claim that the mathematical insight was first discovered at that moment.

## Audited records (ordered newest first)

| Event ID (prefix omitted: `2026-`) | Evidence inspected | Verdict | Canonical mutation |
|---|---|---|---|
| `10-27-anthropic-claude-subexponential-3sat-independent-route` | [Anthropic formal-math PR #31](https://github.com/anthropics/formal-math/pull/31), GitHub API `created_at=2026-10-27T02:46:32Z`; merged into canonical main `2026-10-27T03:07:22Z`, SHA `16a5ce4`. Public fork push also reported `2026-10-27T02:46:16Z`, but repository-level push time does not guarantee the file-level publication instant. | **VERIFIED_PUBLIC_PR_UTC_SECOND**. The PR opening is the precise first directly verifiable disclosure milestone; a public fork push may precede it by 16 seconds. | `publishedAt=2026-10-27T02:46:32.000Z`, `publishedAtPrecision="second"`; China time **10:46:32** |
| `10-27-davies-pierce-expansion-lean-palomar` | [Hexagon v1](https://hexagonmath.org/2610.00588v1): version history lists Oct 27, 2026; [Palomar registry](https://palomar-registry.org/) reference in article. Neither reviewed source exposed a reliable v1 **clock** time. | UNRESOLVED_DAY_ONLY | None |
| `10-27-tang-quantum-theta-lefschetz-ai-claim` | [Hexagon v1](https://hexagonmath.org/2610.00587v1): version 1 listed as Oct 27, no verifiable hour/minute. | UNRESOLVED_DAY_ONLY | None |
| `10-26-openai-local-smoothing-kakeya-formalization` | [OpenAI announcement](https://openai.com/index/building-scientific-understanding-with-academic-communities/) is dated Oct 26 without precise clock time. [Source preprint in openai/math](https://github.com/openai/math/blob/main/preprints/Local-smoothing-for-the-Euclidean-wave-equation-October-25-2026/paper.pdf) first appears in GitHub path history at commit `42907c9`, committer `2026-10-26T20:52:18Z`; predecessor has no such file. That is a **commit timestamp**, not independently verified time of the first public announcement/push. | UNRESOLVED_DAY_ONLY (precise artifact commit observed; not promoted) | None |
| `10-26-openai-subexponential-k-sat-eth-proof-claim` | Same [official announcement](https://openai.com/index/building-scientific-understanding-with-academic-communities/) and [preprint](https://github.com/openai/math/blob/main/preprints/The-Exponential-Time-Hypothesis-is-False-October-25-2026/paper.pdf); same GitHub `42907c9` commit time. The Oct 25 **directory name** is not publication time. | UNRESOLVED_DAY_ONLY (precise artifact commit observed; not promoted) | None |
| `10-26-openai-yang-mills-qcd-proof-announcement` | [Official institutional announcement](https://openai.com/index/building-scientific-understanding-with-academic-communities/) dated Oct 26, no precise public timestamp in reviewed page. Proof artifacts explicitly withheld; a later repo commit for unrelated artifacts is not its announcement time. | UNRESOLVED_DAY_ONLY | None |
| `10-26-axiom-cfsg-lean-complete-classification` | [Axiom institutional article](https://axiommath.ai/research/the-enormous-theorem-formalized/) dated Oct 26, no precise clock time. Some [Oct 27 social coverage](https://www.advanceintelligence.ai/2026-10-27/all) points to a public announcement on another day; **do not silently redate** before establishing which source was public first. | UNRESOLVED_DAY_ONLY + DATE_RECHECK | None |
| `10-26-murphy-brualdi-goldwasser-tree-laplacian-max` | [Hexagon v1](https://hexagonmath.org/2610.00565v1) prominently shows v1 Oct 27, while the canonical date is Oct 26. [GitHub release v1.4.4](https://github.com/DrMurphyIsIn/brualdi-goldwasser/releases/tag/v1.4.4) has public release metadata Oct 9, **but this does not establish the same manuscript's first release event**. Requires claim-matched source/version dating review before any correction. | UNRESOLVED_DAY_ONLY + DATE_RECHECK | None |
| `10-26-tomar-u1-lattice-area-law-all-couplings` | [Hexagon v1](https://hexagonmath.org/2610.00552v1): version 1 dated Oct 26, no precise public clock time. | UNRESOLVED_DAY_ONLY | None |
| `10-26-amit-ashurst-p-groups-counterexamples` | [Hexagon v1](https://hexagonmath.org/2610.00563v1): version history Oct 26, no precise public clock time. | UNRESOLVED_DAY_ONLY | None |
| `10-25-amit-planar-seven-distance-16` | [Hexagon v1](https://hexagonmath.org/2610.00534v1): version-history initial deposit Oct 25, although prominent version header says Oct 26. This verifies source-date ambiguity, not the hour/minute. | UNRESOLVED_DAY_ONLY + DATE_RECHECK | None |
| `10-24-huppert-psl4-5-degree-counterexample` | [Hexagon v1](https://hexagonmath.org/2610.00529v1): initial deposit Oct 24 in history, prominent header Oct 26, no precise public clock time. | UNRESOLVED_DAY_ONLY + DATE_RECHECK | None |

## Batch outcome

- 12 / 175 records examined; **1** precision upgrade backed by an official public GitHub PR timestamp; **11** retain day-only semantics.
- New baseline: 174 unverified legacy UTC-midnight records and 1 additional verified time record, assuming no concurrent editorial changes.
- The 1 edited record changed only `publishedAt` and the optional `publishedAtPrecision`; all 294 IDs, titles, references, scores and claims remain unchanged.
- Four records received a **date-recheck note** without any data edit: Axiom, Murphy, planar seven-distance, Huppert. These require more investigation of first-public semantics and possibly repository-native evidence.
- These results do not independently verify the underlying mathematical claims.

## Next batches and blocking evidence

1. Batch 02: prioritise remaining primary GitHub and institution-backed releases (inspect PR creation/merge, release `published_at`, and official announcement timestamps). Do **not** treat all Git commits as first public publication.
2. For Hexagon-heavy batches, obtain version-record timestamps from the platform's documented [API](https://hexagonmath.org/api/v1) or raw feed if available and **verify whether the field represents public release rather than private submission**. During this audit, public article/history pages exposed only dates; machine-readable v1 clock evidence was not successfully retrieved.
3. Keep an evidence ledger with `checkedAt`, timestamp type, exact source URL, conflict notes and unresolved status. Revisit day-only records only upon new proof, rather than guessing.
4. Preserve UTC calendar-date constraints of dated IDs and `discoveredAt >= publishedAt`; if precise evidence crosses UTC days, escalate the chronology/ID contract separately rather than rewriting stable IDs silently.
