# Batch 17 — exact public source times for 2026-10-23 to 2026-10-29 (2026-10-30)

## Fixed read-only primary evidence

- [GitHub Actions source probe #41030621795](https://github.com/Charlie-Wang-03/ai4math-radar/actions/runs/41030621795), probe HEAD `c287c526c59c3d3addb6984fcb56d6d731095c0b`, artifact `publication-time-candidates` ID **12965064266**.
- Official machine JSON returned **HTTP 200 / parseable JSON for 11/11 matched source records**: 9 Hexagon v1, 2 Palomar immutable version records. For Hexagon match `work.identifier` with original Hexagon article identifier and use `work.publishedAt`, never `createdAt` or `versionCreatedAt`. For Palomar require exact `id`, `version`, title/claim match against original registration URL, then use the requested version's `registered_at` — not the original ID's `first_registered_on`.
- `publishedAtPrecision` represents the **specific platform public release or proof registry registration**, not the first private research discovery; `chronology.earliestVerifiedPublic` is independent when supported.
- Canonical snapshot **314** selected entries. **10** source instants are on the legacy ID's exact UTC day and can upgrade `publishedAt` to source-supported second precision. **One** (Palomar v2) falls on a different UTC day and must be `chronology.milestone` only. Stable URLs, title, score, claim, source, discoveredAt and ordering identity retained.
- Mathematical statements and claimed Lean certificates were **not** independently checked.

## 11-item source reconciliation

| Stable news ID | Provider matched source | Source event UTC timestamp | Action |
| --- | --- | --- | --- |
| `2026-10-28-kisin-serre-artin-character-gpt-astra` | [hexagon-v1 `2610.00597v1`](https://hexagonmath.org/api/v1/works/2610.00597v1) | `2026-10-28T17:33:34.452Z` | `PROMOTE_EXACT` |
| `2026-10-29-liu-hecke-l-zero-free-0874468` | [hexagon-v1 `2610.00655v1`](https://hexagonmath.org/api/v1/works/2610.00655v1) | `2026-10-29T18:05:51.329Z` | `PROMOTE_EXACT` |
| `2026-10-29-grechuk-ratcliffe-quadratic-diophantine-parametrization` | [hexagon-v1 `2610.00652v1`](https://hexagonmath.org/api/v1/works/2610.00652v1) | `2026-10-29T17:54:55.354Z` | `PROMOTE_EXACT` |
| `2026-10-29-lopez-callejas-random-graph-ideal-ai` | [hexagon-v1 `2610.00659v1`](https://hexagonmath.org/api/v1/works/2610.00659v1) | `2026-10-29T20:00:57.203Z` | `PROMOTE_EXACT` |
| `2026-10-29-price-degroot-symmetric-analytic-floating-bodies` | [hexagon-v1 `2610.00629v1`](https://hexagonmath.org/api/v1/works/2610.00629v1) | `2026-10-29T17:49:55.159Z` | `PROMOTE_EXACT` |
| `2026-10-29-fraccaro-zeta-sixth-moment-lower-bound` | [hexagon-v1 `2610.00634v1`](https://hexagonmath.org/api/v1/works/2610.00634v1) | `2026-10-29T17:50:11.026Z` | `PROMOTE_EXACT` |
| `2026-10-29-shelley-bosch-collision-systems-geodesic-bounds` | [hexagon-v1 `2610.00601v1`](https://hexagonmath.org/api/v1/works/2610.00601v1) | `2026-10-29T16:12:25.192Z` | `PROMOTE_EXACT` |
| `2026-10-29-agrawal-automated-conjecturing-better-than-minimo` | [hexagon-v1 `2610.00631v1`](https://hexagonmath.org/api/v1/works/2610.00631v1) | `2026-10-29T17:09:06.011Z` | `PROMOTE_EXACT` |
| `2026-10-29-slutsky-boolean-levy-free-action-ai` | [hexagon-v1 `2610.00635v1`](https://hexagonmath.org/api/v1/works/2610.00635v1) | `2026-10-29T17:50:23.018Z` | `PROMOTE_EXACT` |
| `2026-10-28-rudich-rousseau-deterministic-subexponential-factoring` | [proof-registry `PALOMAR-2026-10-28-000015-v1`](https://data.palomar-registry.org/entries/PALOMAR-2026-10-28-000015-v1.json) | `2026-10-28T07:48:00Z` | `PROMOTE_EXACT` |
| `2026-10-23-davies-euclid-uniform-processes-lean` | [proof-registry `PALOMAR-2026-10-23-000012-v2`](https://data.palomar-registry.org/entries/PALOMAR-2026-10-23-000012-v2.json) | `2026-10-27T21:12:20Z` | `CROSS_UTC_DAY_METADATA_ONLY` |

## The cross-day conflict must remain explicit

- `2026-10-23-davies-euclid-uniform-processes-lean` has original URL `https://palomar-registry.org/entry?id=PALOMAR-2026-10-23-000012&version=2`.
- The exact requested **version 2** has `registered_at=2026-10-27T21:12:20Z` (Beijing 2026-10-28 05:12:20). Its ID embeds **2026-10-23**, the original registration/day of the entry, not version 2's release. Never substitute v1's registration for v2 or rewrite immutable Radar permalink IDs.
- Set only the canonical `chronology.eventKind="registry-release"` and `chronology.milestone` for v2's **actual public registration instant**. Leave `publishedAt="2026-10-23T00:00:00.000Z"` and explicit day precision for V1 compatibility until a separately reviewed feed migration.
- Future editorial work may review the headline/reason to distinguish original theorem vs v2 proof registration, **not** silently redate or recast the claim here.

## Precision, timezone, and provenance implications

- Timestamps are stored in RFC3339 **UTC**. Some exact Hexagon times at 16:xx–20:xx UTC will display on the **following Beijing calendar day** in the current static timeline. That is expected for a correct clock; check static day-card rendering and timezone conversion after deployment.
- Palomar source returns UTC-second-granularity `registered_at`; stored as `.000Z` with precision `second`, not inferred higher precision.
- After this batch, **314** stories remain; legacy date-only count is expected to move **107 → 97**, while the cross-day Palomar item continues to have a date-only legacy clock.
- Hosted gates: `npm run content:check`, static build/precision regression, `check`/`docker`, CodeQL/review resolution, exact-SHA squash merge and Pages/post-merge checks. No unsourced exact HH:mm assertions.
