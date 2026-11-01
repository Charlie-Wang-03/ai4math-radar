# Batch 38 — CheckMate public-project milestone, without an arXiv first-release claim

Checked 2026-11-01. Baseline: `e0a56685492848e41e2cd15980b20f75dda53e04`, after research [PR #148](https://github.com/Charlie-Wang-03/ai4math-radar/pull/148). This is the separate single-record editorial adoption proposed in [Batch 37](author-public-event-and-zenodo-versions-batch37.md), not another source probe.

## Decision and evidence scope

The existing story `2023-06-02-checkmate` reports CheckMate's mathematical-interaction evaluation platform and public prototype. Its author's [PR #1](https://github.com/collinskatie/checkmate/pull/1) and the [README at its merge](https://github.com/collinskatie/checkmate/blob/ce3e52dacea64c8af92113d71f3e17548f1ec998/README.md) identify that same platform and MathConverse data. The PR adds code comments, not a new research result. It is used here only as evidence of contemporaneous public project activity; no duplicate story is created.

Historical visibility was independently checked in Batch 37 using the complete [2023-06-05 12:00 UTC GH Archive object](https://data.gharchive.org/2023-06-05-12.json.gz), not inferred from a currently public repository. Original GitHub events `29533246293` and `29533253947` have `public=true`, historical base repository `private=false`, matching repository ID `643507916`, author ID `19373539` (`albertqjiang`), PR #1, and UTC event clocks `2023-06-05T12:39:49Z` / `2023-06-05T12:40:06Z`. The embedded PR creation and merge clocks are respectively one second earlier. The [permanent normalized receipt](evidence/batch37-author-public-evidence.json) records the complete 209,174-line source read, original archive SHA-256, real execution and artifact provenance. It is a selected-field receipt, not all original archive bytes.

**Established:** on June 5 UTC the same project had author-led, publicly visible source-code collaboration. **Not established:** first arXiv `new` announcement, first repository push, original platform launch time, or a new mathematical result that day. The old June2 value is retained for compatibility and is not newly certified as a public-release date.

## Minimal content change

Only the existing CheckMate object's `summary` and optional `chronology` change:

```json
{
  "eventKind": "other",
  "milestone": {
    "date": "2023-06-05",
    "precision": "day",
    "evidenceKind": "original-research-page",
    "evidenceUrl": "https://github.com/collinskatie/checkmate/pull/1"
  }
}
```

- The visible summary now explicitly says this is **public source-code collaboration**, not a new result or first launch; the first arXiv announcement remains unverified. This qualification is user-facing, not confined to an audit file.
- No `milestone.at` and no `earliestVerifiedPublic` are added. Exact seconds of the corroborating PR are not the original platform release time; global first-public priority remains unasserted.
- Preserve immutable ID, both existing links, legacy `publishedAt=2023-06-02T00:00:00.000Z`, title, original title, source, discovery time, category, score, selected flag, reason and attribution. Original descriptive summary is retained before the appended qualification. No timeline migration or UI/schema change.
- All other **333 records are byte-for-byte unchanged**. Count remains **334**; the structural count of legacy zero-time fields remains **105**. Records without optional chronology change **3 → 2**, namely GenLimitLib and Zenodo v3. This is **not** a claim that CheckMate's first arXiv announcement is resolved or that every original first-release date in the catalog is verified.

## Patch preparation and review gates

The connected file writer accepts whole-file replacement, while this catalog is about 570 KB. To avoid reconstructing hundreds of unrelated records, an isolated, branch-only one-off helper read the exact pinned baseline and verified Git blob `cfcffb42c912271a5b5c6dbb1d75799cf925a29a`. It changed exactly one line, asserted the two changed fields and 333 unchanged records, and created **only an unattached blob** (`16feedd052c010f436582bed443d7ee057e19e1c`). It did not write a ref or modify main. [Preparation run 41323542774](https://github.com/Charlie-Wang-03/ai4math-radar/actions/runs/41323542774) records before/after and validation. Resulting catalog SHA-256: `626ce623a860072dced7ccf6b913035d56ee3ff7784f7644af7d825b1211f36c`.

The helper temporarily used a branch-scoped job with `contents: write` to create the blob, with no checkout or execution of repository code. Its workflow file is **removed before the content PR is opened**; the final tree/PR contains only the catalog line, this audit and focused tests. No workflow or permission change is merged. Normal connector writes install the validated blob on the review branch, followed by required checks and expected-head squash merge; there is no direct main write or forced update.

`tests/checkmate-chronology.test.ts` adds four regressions for permalink/date compatibility, day-only/non-first-release semantics, visible scope qualification and the historical public-author receipt. Require the actual hosted test result, content integrity check, static build, Docker/CodeQL checks and completed review before merging. No local full-suite success is asserted in this audit.

Issue #127 should mark **the optional CheckMate public-project milestone** as adopted only after merge, with the unresolved arXiv-first-announcement caveat retained. Zenodo's source-declared Issued day and GenLimitLib's known cross-listing remain separate evidence types; neither is silently promoted by this patch.
