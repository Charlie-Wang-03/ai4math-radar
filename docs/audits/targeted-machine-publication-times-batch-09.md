# Batch 09 — Targeted machine-readable publication timestamps (2026-10-29)

## Source and data contract

- Baseline: `main@feb62217cac50924faf2abf6f4d6f9fe50da78db` (294 selected entries, 173 legacy date-only UTC-midnight placeholders, 88 optional chronology records).
- Probe run: [GitHub Actions read-only evidence collection #40821513203](https://github.com/Charlie-Wang-03/ai4math-radar/actions/runs/40821513203) on commit `0250addcbb82fae7e77db771c12daf56d3938e85`; `90/90` inspected records returned HTTP 200 with parseable machine JSON.
- Every candidate linked to the precise canonical original URL, provider identifier and version; the precise moment must be `<= discoveredAt`. No user-supplied arbitrary URLs, redirects, repo-creation times, submission timestamps, external summaries or model inference were used.
- **85** records have independently verified release moments in their original canonical ID's **UTC calendar date**, and have `publishedAtPrecision="second"` plus the verified UTC `publishedAt`.
- **5** have a verified **different UTC calendar date** from their historic permalink prefix. Their `publishedAt` and stable `id` stay unchanged; `chronology.milestone` records the precise source release moment with its actual UTC date, avoiding integrity-check bypass or broken permalinks. These source and archive dates are not silently reconciled.
- All **90** also receive `chronology.milestone` with first-party metadata endpoint as `evidenceUrl`. Preserve `chronology.earliestVerifiedPublic` if present (e.g., earlier GitHub release of the same mathematical result); never misstate a later Hexagon paper as the absolute first discovery.
- No rewrite to title, summary, source, mathematical assertion, category, score, discovery time, original news permalink, or original original-source link. No new/deleted events.

## Provider-specific semantics

### Hexagon (75)
- [Hexagon public API index](https://hexagonmath.org/api/v1) declares `/api/v1/works/{identifier}`; every inspected entry was queried at the **v1 URL**, rather than a later v2/v3 displayed on the news item.
- Use `work.publishedAt` (ISO UTC) and verify `work.identifier` equals the Hexagon number in `links.original`. Do **not** use `work.createdAt` or `work.versionCreatedAt`; they can precede the public acceptance/publication.
- [Hexagon moderation policy](https://hexagonmath.org/about) says submitted works appear once moderated and accepted; this is evidence for treating `publishedAt` as the public platform event, not the draft creation time. Whether the same theorem appeared on GitHub or elsewhere earlier is represented separately.

### WordPress.com (10)
- Native per-site `/wp-json/wp/v2/posts` returned 404; the official [WordPress.com public REST proxy](https://developer.wordpress.com/docs/rest-api-urls-by-site-type/) returned the original article record.
- Require `status="publish"`, exact `URL` identity match to `links.original`, and the first-party `date` with explicit local UTC offset. Convert to UTC once; do **not** use `modified`, attachment dates or third-party syndication clocks. WordPress [posts reference](https://developer.wordpress.org/rest-api/reference/posts/) distinguishes publication time from modification.
- Two posts were published on the *following UTC date* relative to their local blog-post date, and thus receive chronology-only metadata rather than a breaking stable-ID/date modification.

### Palomar (5)
- Follow the immutable version index `https://data.palomar-registry.org/versions/<ID>.json` to the exact version-specific `entries/<ID>-vN.json`, requiring the ID/version/title to match the original `PALOMAR-...&version=N` link.
- Use `registered_at` from the **exact registered entry**, not `first_registered_on` (which intentionally refers to version 1), not mechanical verification run time, nor a Palomar screenshot.
- [Palomar publication/version contract](https://github.com/PalomarRegistry/PalomarPolicy/blob/main/docs/specification.md) distinguishes initial ID, later versions and registration as a separate public event. For unit-distance exponent, **v2** was registered on 2026-10-10, not the ID's original October 1 creation day.

## Reconciliation matrix (all 90 records)

| # | Immutable event ID | Original archive date | Verified primary-source UTC time | Provider / primary machine evidence | Action |
|---|---|---|---|---|---|
| 1 | `2026-10-26-murphy-brualdi-goldwasser-tree-laplacian-max` | `2026-10-26` | `2026-10-27T20:12:46.036Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00565v1) | `CROSS_UTC_DAY_METADATA_ONLY` |
| 2 | `2026-10-27-davies-pierce-expansion-lean-palomar` | `2026-10-27` | `2026-10-27T20:31:55.750Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00588v1) | `PROMOTE_EXACT` |
| 3 | `2026-10-27-tang-quantum-theta-lefschetz-ai-claim` | `2026-10-27` | `2026-10-27T20:30:48.287Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00587v1) | `PROMOTE_EXACT` |
| 4 | `2026-10-24-huppert-psl4-5-degree-counterexample` | `2026-10-24` | `2026-10-26T04:51:28.160Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00529v1) | `CROSS_UTC_DAY_METADATA_ONLY` |
| 5 | `2026-10-25-amit-planar-seven-distance-16` | `2026-10-25` | `2026-10-26T04:51:58.441Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00534v1) | `CROSS_UTC_DAY_METADATA_ONLY` |
| 6 | `2026-10-26-amit-ashurst-p-groups-counterexamples` | `2026-10-26` | `2026-10-26T18:05:40.776Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00563v1) | `PROMOTE_EXACT` |
| 7 | `2026-10-26-tomar-u1-lattice-area-law-all-couplings` | `2026-10-26` | `2026-10-26T16:11:47.215Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00552v1) | `PROMOTE_EXACT` |
| 8 | `2026-10-23-ai-weyl-polynomial-explicit-rates` | `2026-10-23` | `2026-10-23T00:24:16.808Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00486v1) | `PROMOTE_EXACT` |
| 9 | `2026-10-23-bhattacharjee-graffiti-pc-six-conjectures` | `2026-10-23` | `2026-10-23T14:52:23.961Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00500v1) | `PROMOTE_EXACT` |
| 10 | `2026-10-23-bhattacharjee-lattice-convex-geometry-counterexamples` | `2026-10-23` | `2026-10-23T14:49:00.033Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00497v1) | `PROMOTE_EXACT` |
| 11 | `2026-10-23-codex-lean-priority-fault-complexity` | `2026-10-23` | `2026-10-23T14:53:11.052Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00503v1) | `PROMOTE_EXACT` |
| 12 | `2026-10-23-enomoto-representation-finite-algebras-gpt6` | `2026-10-23` | `2026-10-23T14:53:59.534Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00505v1) | `PROMOTE_EXACT` |
| 13 | `2026-10-23-geometric-selection-mirror-clause-ai-refutation` | `2026-10-23` | `2026-10-23T14:47:47.396Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00493v1) | `PROMOTE_EXACT` |
| 14 | `2026-10-23-grundy-domination-strong-product-claude` | `2026-10-23` | `2026-10-23T14:48:06.377Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00494v1) | `PROMOTE_EXACT` |
| 15 | `2026-10-23-lopatto-goe-largest-eigenvalue-gaps` | `2026-10-23` | `2026-10-23T14:46:34.354Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00491v1) | `PROMOTE_EXACT` |
| 16 | `2026-10-23-morley-tetrahedron-tran-counterexample` | `2026-10-23` | `2026-10-23T14:51:16.933Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00499v1) | `PROMOTE_EXACT` |
| 17 | `2026-10-23-riesen-evans-haagerup-izumi-voa` | `2026-10-23` | `2026-10-23T14:46:09.438Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00490v1) | `PROMOTE_EXACT` |
| 18 | `2026-10-23-sahbi-star-forming-bipartite-lean` | `2026-10-23` | `2026-10-23T14:49:18.233Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00498v1) | `PROMOTE_EXACT` |
| 19 | `2026-10-22-angular-hecke-15-16-lean-xenoproof` | `2026-10-22` | `2026-10-22T17:14:02.815Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00458v1) | `PROMOTE_EXACT` |
| 20 | `2026-10-22-book-ramsey-57-58-claude-lean` | `2026-10-22` | `2026-10-22T17:13:16.309Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00455v1) | `PROMOTE_EXACT` |
| 21 | `2026-10-22-claude-d5-two-periodic-sphere-packing` | `2026-10-22` | `2026-10-22T17:34:27.691Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00479v1) | `PROMOTE_EXACT` |
| 22 | `2026-10-22-claude-knotinfo-bridge-four-genus-certificates` | `2026-10-22` | `2026-10-22T17:31:56.795Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00475v1) | `PROMOTE_EXACT` |
| 23 | `2026-10-22-claude-simpson-abelian-squares-lean` | `2026-10-22` | `2026-10-22T17:29:45.726Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00473v1) | `PROMOTE_EXACT` |
| 24 | `2026-10-22-claude-welch-third-order-sumfree` | `2026-10-22` | `2026-10-22T17:29:29.401Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00472v1) | `PROMOTE_EXACT` |
| 25 | `2026-10-22-five-body-planar-central-configuration-ai-lean` | `2026-10-22` | `2026-10-22T17:28:05.190Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00467v1) | `PROMOTE_EXACT` |
| 26 | `2026-10-22-frei-kai-hecke-exceptional-zeros` | `2026-10-22` | `2026-10-22T17:27:34.142Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00466v1) | `PROMOTE_EXACT` |
| 27 | `2026-10-22-kimberling-fibonacci-lucas-greedy-lean` | `2026-10-22` | `2026-10-22T17:34:06.415Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00478v1) | `PROMOTE_EXACT` |
| 28 | `2026-10-22-lehmer-totient-16-factors-lean` | `2026-10-22` | `2026-10-22T17:13:02.749Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00454v1) | `PROMOTE_EXACT` |
| 29 | `2026-10-22-liu-fano-index-fourfold-counterexample` | `2026-10-22` | `2026-10-22T17:35:05.024Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00481v1) | `PROMOTE_EXACT` |
| 30 | `2026-10-22-severn-weil-sixfold-q-i-hodge-ai-proof-claim` | `2026-10-22` | `2026-10-22T17:33:19.518Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00477v1) | `PROMOTE_EXACT` |
| 31 | `2026-10-22-tripodo-double-hall-optimal-degree` | `2026-10-22` | `2026-10-22T17:26:36.966Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00462v1) | `PROMOTE_EXACT` |
| 32 | `2026-10-22-tripodo-projective-determinant-lean` | `2026-10-22` | `2026-10-22T17:13:46.116Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00457v1) | `PROMOTE_EXACT` |
| 33 | `2026-10-22-wigderson-nilpotent-free-matrix-counterexample` | `2026-10-22` | `2026-10-22T17:34:46.031Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00480v1) | `PROMOTE_EXACT` |
| 34 | `2026-10-22-wormald-tournament-hamilton-lean` | `2026-10-22` | `2026-10-22T17:25:31.730Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00460v1) | `PROMOTE_EXACT` |
| 35 | `2026-10-21-acuna-integer-polynomial-critical-values-lean` | `2026-10-21` | `2026-10-21T14:21:38.368Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00428v1) | `PROMOTE_EXACT` |
| 36 | `2026-10-21-buckmaster-young-mathematicians-ai-governance` | `2026-10-21` | `2026-10-21T18:19:00.000Z` | wordpress-original · [machine record](https://public-api.wordpress.com/rest/v1.1/sites/terrytao.wordpress.com/posts/slug:mathematics-is-a-subject-for-the-young) | `PROMOTE_EXACT` |
| 37 | `2026-10-21-chen-merino-welsh-matroid-counterexamples` | `2026-10-21` | `2026-10-21T14:21:54.130Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00434v1) | `PROMOTE_EXACT` |
| 38 | `2026-10-21-chen-tutte-permutation-deletion-counterexamples` | `2026-10-21` | `2026-10-21T14:21:52.715Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00433v1) | `PROMOTE_EXACT` |
| 39 | `2026-10-21-gorenstein-symmetry-gpt6-counterexamples` | `2026-10-21` | `2026-10-21T14:22:06.801Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00436v1) | `PROMOTE_EXACT` |
| 40 | `2026-10-21-mislan-autocatalytic-affinity-robustness` | `2026-10-21` | `2026-10-21T14:22:11.242Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00438v1) | `PROMOTE_EXACT` |
| 41 | `2026-10-21-mislan-autocatalytic-unistationarity-series` | `2026-10-21` | `2026-10-21T14:22:08.969Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00437v1) | `PROMOTE_EXACT` |
| 42 | `2026-10-21-mislan-template-free-chemical-heredity-lean` | `2026-10-21` | `2026-10-21T14:22:22.621Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00440v1) | `PROMOTE_EXACT` |
| 43 | `2026-10-21-pyle-fibonacci-lucas-total-visibility` | `2026-10-21` | `2026-10-21T14:21:31.234Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00427v1) | `PROMOTE_EXACT` |
| 44 | `2026-10-20-aronow-lopatto-sk-glauber-ai-lean` | `2026-10-20` | `2026-10-20T05:12:06.584Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00402v1) | `PROMOTE_EXACT` |
| 45 | `2026-10-20-bloom-vandoorn-human-egyptian-fraction-rewrite` | `2026-10-20` | `2026-10-20T13:27:55.700Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00407v1) | `PROMOTE_EXACT` |
| 46 | `2026-10-20-hippelainen-weil-nonsplit-hodge-ai-proof-claim` | `2026-10-20` | `2026-10-20T05:08:11.019Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00371v1) | `PROMOTE_EXACT` |
| 47 | `2026-10-20-hippelainen-zeta3-five-ai-proof-claim` | `2026-10-20` | `2026-10-20T18:58:47.874Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00408v1) | `PROMOTE_EXACT` |
| 48 | `2026-10-20-krisman-legendre-chi2-irrational-lean` | `2026-10-20` | `2026-10-20T05:08:20.872Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00372v1) | `PROMOTE_EXACT` |
| 49 | `2026-10-20-litsey-irrationality-measures-lean` | `2026-10-20` | `2026-10-20T05:11:46.513Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00401v1) | `PROMOTE_EXACT` |
| 50 | `2026-10-20-ralf-stephan-steering-word-lean-milestone` | `2026-10-20` | `2026-10-20T19:00:00.324Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00414v1) | `PROMOTE_EXACT` |
| 51 | `2026-10-20-tao-tenth-discriminant-ai-challenge` | `2026-10-20` | `2026-10-20T15:35:00.000Z` | wordpress-original · [machine record](https://public-api.wordpress.com/rest/v1.1/sites/terrytao.wordpress.com/posts/slug:an-experimental-ai-math-challenge-using-tenth-discriminant-bounds-to-explore-arguments-ruling-out-siegel-zeroes) | `PROMOTE_EXACT` |
| 52 | `2026-10-20-van-dijk-frobenius-landau-siegel-variant` | `2026-10-20` | `2026-10-20T18:58:56.795Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00409v1) | `PROMOTE_EXACT` |
| 53 | `2026-10-17-lean-verified-journal-proposal` | `2026-10-17` | `2026-10-18T03:11:00.000Z` | wordpress-original · [machine record](https://public-api.wordpress.com/rest/v1.1/sites/terrytao.wordpress.com/posts/slug:starting-a-new-journal) | `CROSS_UTC_DAY_METADATA_ONLY` |
| 54 | `2026-10-18-acyclic-polynomial-two-lean-counterexamples` | `2026-10-18` | `2026-10-18T14:54:13.031Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00325v1) | `PROMOTE_EXACT` |
| 55 | `2026-10-18-affine-subspace-union-stability-lean` | `2026-10-18` | `2026-10-18T14:44:32.647Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00328v1) | `PROMOTE_EXACT` |
| 56 | `2026-10-18-ai-nonnested-matching-counterexample` | `2026-10-18` | `2026-10-18T14:53:16.610Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00329v1) | `PROMOTE_EXACT` |
| 57 | `2026-10-18-claude-roy-strong-six-exponentials-lean` | `2026-10-18` | `2026-10-18T14:56:42.253Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00338v1) | `PROMOTE_EXACT` |
| 58 | `2026-10-18-hales-sphere-packing-magic-functions` | `2026-10-18` | `2026-10-18T02:18:19.008Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00330v1) | `PROMOTE_EXACT` |
| 59 | `2026-10-18-huang-ma-invariant-ai-proof` | `2026-10-18` | `2026-10-18T14:27:43.602Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00331v1) | `PROMOTE_EXACT` |
| 60 | `2026-10-18-hypercube-nullstellensatz-lean-counterexample` | `2026-10-18` | `2026-10-18T14:44:52.758Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00327v1) | `PROMOTE_EXACT` |
| 61 | `2026-10-18-lattice-yang-mills-dobrushin-mass-gap` | `2026-10-18` | `2026-10-18T14:46:35.479Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00341v1) | `PROMOTE_EXACT` |
| 62 | `2026-10-18-maggi-math-ai-golden-dark-age-essay` | `2026-10-18` | `2026-10-18T14:59:49.000Z` | wordpress-original · [machine record](https://public-api.wordpress.com/rest/v1.1/sites/terrytao.wordpress.com/posts/slug:will-it-be-a-golden-age-or-a-dark-age-for-mathematics-and-science) | `PROMOTE_EXACT` |
| 63 | `2026-10-18-stirling-lucky-sets-lean` | `2026-10-18` | `2026-10-18T14:54:37.569Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00324v1) | `PROMOTE_EXACT` |
| 64 | `2026-10-17-ai-2d-euler-vanishing-viscosity` | `2026-10-17` | `2026-10-17T22:21:07.584Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00314v1) | `PROMOTE_EXACT` |
| 65 | `2026-10-17-ai-graceful-graph-obstructions` | `2026-10-17` | `2026-10-17T22:23:09.800Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00316v1) | `PROMOTE_EXACT` |
| 66 | `2026-10-17-bhargava-primitive-elliptic-point` | `2026-10-17` | `2026-10-17T11:38:03.582Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00294v1) | `PROMOTE_EXACT` |
| 67 | `2026-10-17-converse-discrete-four-vertex-lean` | `2026-10-17` | `2026-10-17T22:30:58.693Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00295v1) | `PROMOTE_EXACT` |
| 68 | `2026-10-17-cyclic-rotation-set-cover-npc-lean` | `2026-10-17` | `2026-10-17T22:18:30.662Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00307v1) | `PROMOTE_EXACT` |
| 69 | `2026-10-17-erdos-188-bounds-sat-certificates` | `2026-10-17` | `2026-10-17T22:28:38.286Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00297v1) | `PROMOTE_EXACT` |
| 70 | `2026-10-17-exact-junta-bound-hamming-lean` | `2026-10-17` | `2026-10-17T22:18:45.347Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00301v1) | `PROMOTE_EXACT` |
| 71 | `2026-10-17-golomb-welch-lattice-35-805-lean` | `2026-10-17` | `2026-10-17T22:22:55.533Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00317v1) | `PROMOTE_EXACT` |
| 72 | `2026-10-17-grothendieck-rings-ai-classification-atlas` | `2026-10-17` | `2026-10-17T22:30:12.150Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00300v1) | `PROMOTE_EXACT` |
| 73 | `2026-10-17-hypermatrix-partition-counts-lean` | `2026-10-17` | `2026-10-17T22:27:55.689Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00306v1) | `PROMOTE_EXACT` |
| 74 | `2026-10-17-pharos-moduli-fifteenth-cohomology` | `2026-10-17` | `2026-10-17T22:20:49.516Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00267v1) | `PROMOTE_EXACT` |
| 75 | `2026-10-17-simple-lengths-markoff-generalization` | `2026-10-17` | `2026-10-17T22:31:32.251Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00298v1) | `PROMOTE_EXACT` |
| 76 | `2026-10-17-three-graph-eigenvalue-conjectures-lean` | `2026-10-17` | `2026-10-17T22:28:13.882Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00305v1) | `PROMOTE_EXACT` |
| 77 | `2026-10-16-formalize-all-mathematics` | `2026-10-16` | `2026-10-16T09:54:00.000Z` | wordpress-original · [machine record](https://public-api.wordpress.com/rest/v1.1/sites/xenaproject.wordpress.com/posts/slug:how-to-formalize-all-of-mathematics) | `PROMOTE_EXACT` |
| 78 | `2026-10-16-hales-linchpin-theorems` | `2026-10-16` | `2026-10-16T14:43:18.641Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00289v1) | `PROMOTE_EXACT` |
| 79 | `2026-10-16-markoff-almost-all-unique` | `2026-10-16` | `2026-10-16T14:42:12.511Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00281v1) | `PROMOTE_EXACT` |
| 80 | `2026-10-16-sair-open-math-os` | `2026-10-16` | `2026-10-16T17:32:00.000Z` | wordpress-original · [machine record](https://public-api.wordpress.com/rest/v1.1/sites/terrytao.wordpress.com/posts/slug:sair-open-math-os-released) | `PROMOTE_EXACT` |
| 81 | `2026-10-15-subgaussian-support-palomar` | `2026-10-15` | `2026-10-15T00:45:09.000Z` | proof-registry · [machine record](https://data.palomar-registry.org/entries/PALOMAR-2026-10-15-000001-v1.json) | `PROMOTE_EXACT` |
| 82 | `2026-10-13-unitary-weil-seven-eighths` | `2026-10-13` | `2026-10-13T12:10:42.402Z` | hexagon-v1 · [machine record](https://hexagonmath.org/api/v1/works/2610.00216v1) | `PROMOTE_EXACT` |
| 83 | `2026-10-11-dozz-ai-assisted-formalization` | `2026-10-11` | `2026-10-11T07:06:08.000Z` | proof-registry · [machine record](https://data.palomar-registry.org/entries/PALOMAR-2026-10-11-000008-v1.json) | `PROMOTE_EXACT` |
| 84 | `2026-10-11-zeta-density-39-over-17-palomar` | `2026-10-11` | `2026-10-11T09:00:10.000Z` | proof-registry · [machine record](https://data.palomar-registry.org/entries/PALOMAR-2026-10-11-000010-v1.json) | `PROMOTE_EXACT` |
| 85 | `2026-10-10-nearly-minimax-variance-palomar` | `2026-10-10` | `2026-10-10T04:35:14.000Z` | proof-registry · [machine record](https://data.palomar-registry.org/entries/PALOMAR-2026-10-10-000002-v1.json) | `PROMOTE_EXACT` |
| 86 | `2026-10-10-unit-distance-exponent-palomar-v2` | `2026-10-10` | `2026-10-10T20:31:53.000Z` | proof-registry · [machine record](https://data.palomar-registry.org/entries/PALOMAR-2026-10-01-000018-v2.json) | `PROMOTE_EXACT` |
| 87 | `2026-10-09-hales-lean-reliability-ai` | `2026-10-09` | `2026-10-09T16:35:03.000Z` | wordpress-original · [machine record](https://public-api.wordpress.com/rest/v1.1/sites/terrytao.wordpress.com/posts/slug:what-mathematicians-should-know-about-the-lean-theorem-proverquestions-of-reliability-and-ai) | `PROMOTE_EXACT` |
| 88 | `2026-09-18-sair-open-math-model` | `2026-09-18` | `2026-09-18T15:06:20.000Z` | wordpress-original · [machine record](https://public-api.wordpress.com/rest/v1.1/sites/terrytao.wordpress.com/posts/slug:sairs-open-math-model-initiative) | `PROMOTE_EXACT` |
| 89 | `2026-09-11-severe-misalignment-ai-mathematics` | `2026-09-11` | `2026-09-11T17:27:46.000Z` | wordpress-original · [machine record](https://public-api.wordpress.com/rest/v1.1/sites/terrytao.wordpress.com/posts/slug:a-severe-misalignment-of-ai-in-mathematics) | `PROMOTE_EXACT` |
| 90 | `2026-08-18-palomar-launch` | `2026-08-18` | `2026-08-19T02:40:46.000Z` | wordpress-original · [machine record](https://public-api.wordpress.com/rest/v1.1/sites/terrytao.wordpress.com/posts/slug:palomar-a-registry-of-lean-verified-mathematics) | `CROSS_UTC_DAY_METADATA_ONLY` |

## Five exact-clock / historic-date conflicts

- `2026-08-18-palomar-launch`: ID date `2026-08-18`, source-public moment `2026-08-19T02:40:46.000Z` via [provider record](https://public-api.wordpress.com/rest/v1.1/sites/terrytao.wordpress.com/posts/slug:palomar-a-registry-of-lean-verified-mathematics). Kept old `publishedAt` and permalink, updated only chronology.
- `2026-10-17-lean-verified-journal-proposal`: ID date `2026-10-17`, source-public moment `2026-10-18T03:11:00.000Z` via [provider record](https://public-api.wordpress.com/rest/v1.1/sites/terrytao.wordpress.com/posts/slug:starting-a-new-journal). Kept old `publishedAt` and permalink, updated only chronology.
- `2026-10-24-huppert-psl4-5-degree-counterexample`: ID date `2026-10-24`, source-public moment `2026-10-26T04:51:28.160Z` via [provider record](https://hexagonmath.org/api/v1/works/2610.00529v1). Kept old `publishedAt` and permalink, updated only chronology.
- `2026-10-25-amit-planar-seven-distance-16`: ID date `2026-10-25`, source-public moment `2026-10-26T04:51:58.441Z` via [provider record](https://hexagonmath.org/api/v1/works/2610.00534v1). Kept old `publishedAt` and permalink, updated only chronology.
- `2026-10-26-murphy-brualdi-goldwasser-tree-laplacian-max`: ID date `2026-10-26`, source-public moment `2026-10-27T20:12:46.036Z` via [provider record](https://hexagonmath.org/api/v1/works/2610.00565v1). Kept old `publishedAt` and permalink, updated only chronology.

## Editorial safeguards

- `chronology.milestone` names the actual provider-specific public posting or registration; this is not proof the mathematical claim is true, nor proof that no matching artifact appeared earlier. The item page's two-time display remains source- and precision-labeled.
- Existing static timeline groups **exact** publication timestamps in `Asia/Shanghai`; some verified UTC timestamps late in the evening may naturally appear under the next **Beijing calendar day**. This is correct timezone conversion, not an ID rename. Visual regressions should be inspected.
- Do not promote any remaining arXiv `[v1]` submit-click timestamps, mutable Epoch dashboards, editorial first-observed times or unverified institution webpage clocks. They require their own source-semantic investigation.
- Preserve the original 5 UTC date-conflict items' day-level position until a separately approved URL-compatible chronology migration; they show precise source evidence in detail but retain the historical timeline day.
- `registered_at` is publication of a formal proof **registry entry**, not first disclosure of the theorem or the initial draft.

## Required verification

- `npm run content:check`, static build, existing static temporal precision tests, CI `check` and `docker`, CodeQL.
- Verify exactly **90** pre-existing record lines changed: 85 publication-time promotions; 5 chronology-only date conflicts.
- Recompute exact remaining pending as 173 - 85 = **88**; all 294 permanent IDs preserved.
