# Publication-time audit — 2026-10-17 to 2026-10-19 (Batch 04)

## Scope and safeguards

- Source corpus: `main@9e0f559a15fc38cd6bd46cd727ae0b106a5a17d8`, 294 selected records; 174 legacy UTC-midnight records lacking clock precision before this batch.
- Period: **2026-10-17, 18, 19** (UTC dates encoded in canonical `publishedAt`), **27 records**: Oct17=14, Oct18=11, Oct19=2.
- Reviewed **22 first-party Hexagon v1 pages**, **2 original WordPress posts**, **1 original Proofs and Intuitions post**, and the **2 external arXiv / Zenodo records** via accessible mirror metadata because the primary pages could not be retrieved. This is a **source/day evidence audit**, not proof that every exact release instant is known.
- New `chronology.milestone` on 25 records (22 Hexagon v1 calendar days, 2 WordPress original article dates, 1 original blog day). A Hexagon version's displayed calendar day **does not guarantee the submission-to-public-acceptance interval was instantaneous**; no hour/minute inferred.
- One **earlier, claim-matched, published GitHub Release** verified for Golomb–Welch lattice tilings; stored `earliestVerifiedPublic` separately from the Oct17 Hexagon paper milestone.
- **0** `publishedAt` upgrades and no ID/title/source/score/claimed mathematics/dependency edits. All 27 main timeline entries continue to show **未注明** for clock time. `chronology` metadata is additional evidence, not a newly invented datetime.
- Refer to [chronology semantics contract](../editorial-temporal-contract-v1.md). The earlier GitHub artifact is not proof of mathematical correctness or absolute first disclosure.

## Per-record evidence (all 27)

| # | Stable event ID | Primary / platform source | Date, artifact and clock finding | Verdict | Canonical edit |
|---|---|---|---|---|---|
| 1 | `2026-10-19-arad-herzog-conditional-ai-proof-claim` | [原始来源](https://zenodo.org/records/23450488) | Zenodo 23450488 dated Oct 19 in secondary roundup; authoritative record/API was inaccessible in this audit. Claim itself flagged conditional and withheld artifacts; no public minute verified. | `PRIMARY_CLOCK_NOT_VERIFIED` | 不修改 |
| 2 | `2026-10-19-rozsa-lean-equational-reasoning` | [原始来源](https://arxiv.org/abs/2610.26467) | arXiv v1 `2026-10-19T14:16:17Z` is **submission** timestamp (mirrored by borowiecki.dev), not verified first public announcement; direct arXiv fetch unavailable. | `PRIMARY_CLOCK_NOT_VERIFIED` | 不修改 |
| 3 | `2026-10-18-acyclic-polynomial-two-lean-counterexamples` | [原始来源](https://hexagonmath.org/2610.00325v1) | Hexagon v1 Oct18; HAL deposit cited without verified timestamp or independent matching first public minute. | `DAY_MILESTONE_VERIFIED` | 仅补充 chronology |
| 4 | `2026-10-18-affine-subspace-union-stability-lean` | [原始来源](https://hexagonmath.org/2610.00328v1) | Hexagon v1 Oct18; no verified time of public acceptance. | `DAY_MILESTONE_VERIFIED` | 仅补充 chronology |
| 5 | `2026-10-18-ai-nonnested-matching-counterexample` | [原始来源](https://hexagonmath.org/2610.00329v1) | Hexagon v1 date only; no independently verified public minute. | `DAY_MILESTONE_VERIFIED` | 仅补充 chronology |
| 6 | `2026-10-18-claude-roy-strong-six-exponentials-lean` | [原始来源](https://hexagonmath.org/2610.00338v1) | Claim-matched GitHub `telaviv/strong-six-exponentials` created Oct18 `08:39:09Z`, but repo creation alone does not establish when it became publicly visible; no GitHub Releases. | `DAY_MILESTONE_VERIFIED` | 仅补充 chronology |
| 7 | `2026-10-18-hales-sphere-packing-magic-functions` | [原始来源](https://hexagonmath.org/2610.00330v1) | Hexagon v1 day visible; no first-public clock. Earlier mathematical magic functions are distinct from this construction. | `DAY_MILESTONE_VERIFIED` | 仅补充 chronology |
| 8 | `2026-10-18-huang-ma-invariant-ai-proof` | [原始来源](https://hexagonmath.org/2610.00331v1) | Hexagon v1 date only; manuscript's AI run duration does not timestamp public release. | `DAY_MILESTONE_VERIFIED` | 仅补充 chronology |
| 9 | `2026-10-18-hypercube-nullstellensatz-lean-counterexample` | [原始来源](https://hexagonmath.org/2610.00327v1) | Hexagon v1 Oct18; HAL/Lean relation alone not a public manuscript clock. | `DAY_MILESTONE_VERIFIED` | 仅补充 chronology |
| 10 | `2026-10-18-lattice-yang-mills-dobrushin-mass-gap` | [原始来源](https://hexagonmath.org/2610.00341v1) | Claim-matched repo `creelie/4Y-M` GitHub Release v1.0.0 published Oct18 `00:46:37Z`, later v2.0.0 at `08:35:34Z`. Same UTC day as Hexagon; direct relative order not established. Differing paper revisions may change claim scope. | `DAY_MILESTONE_VERIFIED` | 仅补充 chronology |
| 11 | `2026-10-18-maggi-math-ai-golden-dark-age-essay` | [原始来源](https://terrytao.wordpress.com/2026/10/18/will-it-be-a-golden-age-or-a-dark-age-for-mathematics-and-science/) | Original Tao WordPress guest blog Oct18, no verifiable original `date_gmt`/RSS `pubDate`; comment times are not the post's publication time. | `DAY_MILESTONE_VERIFIED` | 仅补充 chronology |
| 12 | `2026-10-18-stirling-lucky-sets-lean` | [原始来源](https://hexagonmath.org/2610.00324v1) | Hexagon v1 Oct18; HAL deposit number not a verified public release instant. | `DAY_MILESTONE_VERIFIED` | 仅补充 chronology |
| 13 | `2026-10-18-vermilion-lean-backend-verus` | [原始来源](https://proofsandintuitions.net/2026/10/18/vermilion-experiment-lean-backend-verus/) | Original Proofs and Intuitions blog explicitly dates Oct18, not a precise time; its code repository timestamp does not establish blog post time. | `DAY_MILESTONE_VERIFIED` | 仅补充 chronology |
| 14 | `2026-10-17-ai-2d-euler-vanishing-viscosity` | [原始来源](https://hexagonmath.org/2610.00314v1) | Hexagon v1 Oct17; no second-level release clock. | `DAY_MILESTONE_VERIFIED` | 仅补充 chronology |
| 15 | `2026-10-17-ai-graceful-graph-obstructions` | [原始来源](https://hexagonmath.org/2610.00316v1) | Hexagon v1 Oct17; source describes AI review of earlier draft, not first public clock. | `DAY_MILESTONE_VERIFIED` | 仅补充 chronology |
| 16 | `2026-10-17-bhargava-primitive-elliptic-point` | [原始来源](https://hexagonmath.org/2610.00294v1) | Hexagon v1 Oct17; earlier cited work is distinct from this elliptic-curve follow-up. | `DAY_MILESTONE_VERIFIED` | 仅补充 chronology |
| 17 | `2026-10-17-converse-discrete-four-vertex-lean` | [原始来源](https://hexagonmath.org/2610.00295v1) | Hexagon v1 Oct17; Palomar proof registration `PALOMAR-2026-10-17-000001` same day, exact clock not available. | `DAY_MILESTONE_VERIFIED` | 仅补充 chronology |
| 18 | `2026-10-17-cyclic-rotation-set-cover-npc-lean` | [原始来源](https://hexagonmath.org/2610.00307v1) | Hexagon v1 Oct17; HAL deposit is not automatically identical to manuscript public release. | `DAY_MILESTONE_VERIFIED` | 仅补充 chronology |
| 19 | `2026-10-17-erdos-188-bounds-sat-certificates` | [原始来源](https://hexagonmath.org/2610.00297v1) | Hexagon v1 Oct17; references older Erdős problem approaches, not exact first-public time of this result. | `DAY_MILESTONE_VERIFIED` | 仅补充 chronology |
| 20 | `2026-10-17-exact-junta-bound-hamming-lean` | [原始来源](https://hexagonmath.org/2610.00301v1) | Hexagon v1 Oct17; no exact primary publication minute. | `DAY_MILESTONE_VERIFIED` | 仅补充 chronology |
| 21 | `2026-10-17-golomb-welch-lattice-35-805-lean` | [原始来源](https://hexagonmath.org/2610.00317v1) | Author-linked claim-matched GitHub Release v1.0.0 published `2026-10-15T14:47:39Z`, **two days before** Hexagon v1 Oct17; title, cases n=35/805 and lattice-only scope match. Added earliest verified public artifact metadata. | `DAY_MILESTONE_VERIFIED + EARLIER_MATCHED_RELEASE` | 仅补充 chronology |
| 22 | `2026-10-17-grothendieck-rings-ai-classification-atlas` | [原始来源](https://hexagonmath.org/2610.00300v1) | Hexagon v1 Oct17, prior project/census scope not proven to have first appeared at this time. | `DAY_MILESTONE_VERIFIED` | 仅补充 chronology |
| 23 | `2026-10-17-hypermatrix-partition-counts-lean` | [原始来源](https://hexagonmath.org/2610.00306v1) | Hexagon v1 Oct17; HAL proof deposit referenced without independent public timestamp. | `DAY_MILESTONE_VERIFIED` | 仅补充 chronology |
| 24 | `2026-10-17-lean-verified-journal-proposal` | [原始来源](https://terrytao.wordpress.com/2026/10/17/starting-a-new-journal/) | Original Tao WordPress guest post Oct17; no authoritative `date_gmt` or RSS original publication clock retrieved. | `DAY_MILESTONE_VERIFIED` | 仅补充 chronology |
| 25 | `2026-10-17-pharos-moduli-fifteenth-cohomology` | [原始来源](https://hexagonmath.org/2610.00267v1) | Hexagon v1 Oct17 (later version exists); exact initial public v1 time unavailable. | `DAY_MILESTONE_VERIFIED` | 仅补充 chronology |
| 26 | `2026-10-17-simple-lengths-markoff-generalization` | [原始来源](https://hexagonmath.org/2610.00298v1) | Hexagon v1 Oct17; cited earlier results/drafts require identity matching, no precise first-public time established. | `DAY_MILESTONE_VERIFIED` | 仅补充 chronology |
| 27 | `2026-10-17-three-graph-eigenvalue-conjectures-lean` | [原始来源](https://hexagonmath.org/2610.00305v1) | Hexagon v1 Oct17; three theorem-specific Palomar dates Oct15, Oct16, Oct17; earlier partial registered proof is not a verified timestamp for the combined manuscript. | `DAY_MILESTONE_VERIFIED` | 仅补充 chronology |

## Aggregate audit

- 25 day-level evidence annotations; 2 records remain without chronology annotation because a primary exact public record/acceptance could not be retrieved.
- 1 documented earlier, claim-matched GitHub Release: `2026-10-17-golomb-welch-lattice-35-805-lean`; [v1.0.0](https://github.com/creelie/refactored-waddle/releases/tag/v1.0.0) published Oct15 14:47:39 UTC; original Oct17 Hexagon still treated as later preprint milestone.
- Matching same-day GitHub release for forest-gauge Yang–Mills is recorded in the ledger but is **not** inferred to precede Hexagon. Later revisions substantially expand scope and must not be mixed with the Oct18 manuscript.
- arXiv submission timestamps (Rózsa), WordPress comments, Zenodo secondary roundups, private drafts and repository creation times are not first-public clock timestamps.
- This audit does **not** claim that all 27 have exact first-public times, and it does not verify any theorem or Lean code independently.

## Next actions

1. Seek Hexagon's machine-readable, source-specific **public acceptance/visibility** timestamp with documented semantics; the [API index](https://hexagonmath.org/api/v1) is public but its `/works` endpoints could not be retrieved during this check.
2. Retrieve first-party WordPress RSS `pubDate` or post `date_gmt` (currently inaccessible), not the timestamp of a later comment/syndication.
3. Retrieve Zenodo record 23450488 first-public immutable metadata and arXiv 2610.26467 actual **announced** date/time instead of the v1 submit-click.
4. Continue other unverified dates in subsequent self-contained 10–30 record batches. Keep all historic `id` values and link paths stable.

## Merge gates

- `npm run content:check`; static build; regression tests, GitHub-hosted `check` + `docker` + CodeQL.
- Exactly 25 existing canonical rows receive optional chronology objects; 0 original UTC time fields changed; 0 new/deleted records.
