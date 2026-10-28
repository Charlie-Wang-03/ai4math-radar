# AI4Math Radar temporal semantics v1 — Issue #104

Status: **adopted additive compatibility contract**, 2026-10-29. Scope: active `static-chatgpt` / portable V1. No breaking migration.

## Four separate axes

| Field | Meaning | Authority | UI / API behavior |
| --- | --- | --- | --- |
| `id` | Published permalink identity; its old YYYY-MM-DD prefix is historical, NOT an authoritative forever-correct discovery date | Existing item contract | **Immutable**. Keep `/items/<id>/`, saved bookmarks and citations working. Never rename to fix chronology. |
| `publishedAt` + `publishedAtPrecision` | Legacy V1 compatibility timestamp and precision | Original public-v1 shape | Keep existing values; legacy UTC midnight without precision remains **date-only / 未注明**, not a real 08:00 Beijing timestamp. The current static main timeline, RSS and item feed retain V1 behavior during adoption. |
| `chronology.milestone` | Public milestone **actually covered by this news item**, e.g. Hexagon v1 deposit or new Lean/Palomar registration | Dated first-party platform evidence | New optional canonical evidence metadata. A claim about a theorem *may* be old while a new proof-registration milestone is new. `milestone.date` is UTC calendar day of that milestone; `at` exists only if the public release instant is justified. |
| `chronology.earliestVerifiedPublic` | **Earliest public evidence currently verified** for the identical result/claim, potentially earlier than the highlighted milestone | Claim-matched, independently inspectable public artifact | Informational provenance; **does not automatically replace the milestone's timeline position**. It is not an assertion of the absolute earliest private discovery. |
| `discoveredAt` | Time the Radar noticed/collected the source | Internal collection | Never treat as the publication time or a fallback to fabricate the release clock. |

The exact meaning of “first public” is the earliest independently inspectable **public disclosure** of the *same claimed result*. Discriminate a mathematical claim, a paper's new version, a Lean proof-artifact release, and a third-party repost. Later versions and proof attestations are independently reportable only if they add substantive new verified scope. Mere mirroring cannot double-count discoveries.

## Chronology extension (optional, additive)

`chronology` is an optional structured object under a portable entry. For the pilot, it may be attached *only with evidence*.

```json
{
  "chronology": {
    "eventKind": "paper-release",
    "milestone": {
      "date": "2026-10-22",
      "precision": "day",
      "evidenceKind": "hexagon-v1",
      "evidenceUrl": "https://hexagonmath.org/2610.00460v1"
    },
    "earliestVerifiedPublic": {
      "date": "2026-10-14",
      "precision": "second",
      "at": "2026-10-14T09:27:13.000Z",
      "evidenceKind": "github-release",
      "evidenceUrl": "https://github.com/creelie/Breakthrough-problems-1/releases/tag/v1.0.0"
    }
  }
}
```

- `eventKind`: `research-result`, `paper-release`, `proof-artifact-release`, `registry-release`, `institution-announcement`, or `other`.
- Evidence kind: `hexagon-v1`, `github-release`, `arxiv-announcement`, `wordpress-original`, `institution-announcement`, `proof-registry`, `original-research-page`, `other`.
- `date` is a verified **UTC calendar date** of this public event. `precision`: `day` / `minute` / `second`; `at` is an exact UTC/RFC3339 instant and is only legal at minute/second precision. For day-only, `at` MUST be absent. `evidenceUrl` must point to the primary basis for the assertion.
- `earliestVerifiedPublic.date <= milestone.date`. A publication exact time cannot be inferred from the timestamp of a Git commit created offline or from an arXiv submission click. GitHub `release.published_at` is appropriate for a **specific matching publicly released artifact**; Palomar `published_at` is proof **registration**, not the first public manuscript. If a day is disputed, do not invent a date/time to populate this field.
- Chronology is **not** a theorem correctness certification, and `score` remains editorial prioritization rather than probability of correctness.
- If `chronology` is absent, all V1 feeds and static pages remain valid.

## Pilot reconciliation (no URL churn)

| Record | Legacy / current news milestone | Earliest verified public artifact | Decision |
| --- | --- | --- | --- |
| `2026-10-22-wormald-tournament-hamilton-lean` | Hexagon v1 Oct 22 (day only) | [Exact-result GitHub Release](https://github.com/creelie/Breakthrough-problems-1/releases/tag/v1.0.0) Oct 14, 09:27:13 UTC | Add both chronology moments; leave ID and legacy `publishedAt` unchanged |
| `2026-10-22-angular-hecke-15-16-lean-xenoproof` | Hexagon v1 Oct 22 (day only) | [Exact-result GitHub Release](https://github.com/TheRealDubb/angular-hecke-15-16-xenoproof/releases/tag/v15-16-2026-10-18) Oct 19, 02:08:55 UTC | Same; do not relabel Hexagon as first-public scientific result |

## Migration and rollout plan

1. **Now / backwards compatible:** add optional `chronology` parser and integrity checks, save primary-source provenance for confirmed chronology conflicts, add regression fixtures. Do not change existing `id` or `publishedAt`, nor reorder the public timeline implicitly. The native AIHOT runtime is inactive and untouched.
2. **Evidence-first backfill:** use audit batches to verify source time semantics and attach opt-in chronology metadata only where justified. A source-reported date is a day, never an invented clock minute. Record unresolved evidence and date conflicts in `docs/audits/` with the reason.
3. **Future UI/API migration (separate PR):** make `chronology.milestone` the declared feed chronology anchor and label earlier verified public disclosures in individual item pages, with exact timezone/precision. Version the public export consumers accordingly and verify bookmark/RSS compatibility before switching sorting. Preserve existing permalinks and maintain a `canonical_id` / alias mapping only if ever essential.
4. **No silent backdating:** a later Hexagon entry can be reported as paper-release/verification milestone, but must not be described as the original research breakthrough if earlier primary evidence proves otherwise. Correct misleading headlines or reasons in a separately reviewed, evidence-cited content PR.
5. **Review gates:** `npm run content:check`, static build and timeline regression, parser invariants, GitHub-hosted required checks, resolved reviews, and no duplicate story IDs. All legacy 294 URLs must remain valid.

These rules resolve Issue #104's **field semantics and compatibility design**; they do not claim that every legacy item is chronologically correct, nor that the live static page already renders the optional metadata. Historical chronology reconciliation and the future UI migration are explicitly separate tasks.
