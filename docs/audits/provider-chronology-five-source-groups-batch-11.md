# Batch 11 — Source-by-source chronology verification (2026-10-30)

Scope: **41** original-source records across arXiv (18), OpenAI (8), GitHub (6), ProofAtlas (5), Google DeepMind (4). Baseline follows [PR #116](https://github.com/Charlie-Wang-03/ai4math-radar/pull/116), merged SHA `9130e26125145529c9b8c1f11fb3a08c5c4e499f`. The ledger includes one upgraded Jackson item; before changes there were **95** date-only legacy records out of **301**.

## Source semantics — mandatory safeguards

- Official [arXiv Search API manual](https://info.arxiv.org/help/api/user-manual.html) specifies ordinary query Atom `<published>` as first-version **submitted/processed**, whereas official [announcement Atom](https://info.arxiv.org/help/atom_specifications.html) `<published>` means announcement time for the day/category listing. Those **are different feeds**. Historic article-matched announcement snapshots were not retrieved. No derived 20:00 ET clock, no broad schedule backfill, and no reintroduction of six unsupported arXiv announcement certifications removed by PR #116.
- OpenAI and Google DeepMind article headers show **dates**, not exact public clocks; subsequent article edits and press release distributions may be separate.
- GitHub public PR `created_at` is an inspectable **PR-specific public disclosure**, but not proof of earliest public branch push or earliest unrelated official announcement. Commit author/committer, repo creation and Release `published_at` must not be conflated.
- ProofAtlas version-specific public credit JSON `releasedAt` can denote a particular release record; whole-clock midnight values often represent **date-only placeholders**. Distinguish revised v002 and paper v001, as well as manuscript date vs credit release date. Exact time must come from matching source-specific version and not be blindly backdated.
- Mathematical/Lean correctness is **not** independently assessed here. All public IDs, 301 story count, source URLs, summaries, headlines and ranking scores preserved.

## Canonical data mutations (exactly four rows)

1. `2026-07-23-jackson-hamilton-counterexample`: the original [ProofAtlas v001 release metadata](https://www.proofatlas.ai/data/releases/jackson-hamilton-decomposition-counterexample.json) identifies the same canonical route, subject, version and `releasedAt=2026-07-23T19:15:17.560Z`. New exact `publishedAt`, `publishedAtPrecision="second"` and matching `chronology.milestone`. This is **first-party provider-recorded release time**, not external independent priority proof.
2. `2026-10-26-openai-local-smoothing-kakeya-formalization` and `2026-10-26-openai-subexponential-k-sat-eth-proof-claim`: official [openai/math public PR #3](https://github.com/openai/math/pull/3) opened **2026-10-26T21:03:27Z**, body matches both preprints; each original PDF's GitHub path first appears in commit `42907c9` (committer clock `20:52:18Z` is *not* an established public instant). Add `chronology.milestone` at exact **PR** time, leave legacy `publishedAt` day-only: original OpenAI blog could have appeared earlier on the same day without a precise clock.
3. `2026-10-26-openai-yang-mills-qcd-proof-announcement`: the [original institutional article](https://openai.com/index/building-scientific-understanding-with-academic-communities/) is dated Oct 26; add day-only announcement chronology. Its physics artifacts were **withheld** and cannot inherit PR #3's time.

After this batch **94** legacy day-only timestamps remain (95 → 94); the two OpenAI public PR times are **chronology-only**, not additional legacy `publishedAt` upgrades. All original permanent URLs and `discoveredAt` preserved.

## Important outstanding conflicts

- `2023-02-23-proofnet`: arXiv [2302.12433](https://arxiv.org/abs/2302.12433) says v1 **Feb 24, 2023 03:28:46Z**, later than the archived Feb 23 date. Its exact public-announcement date is still unknown; this is a clear contradiction with using Feb 23 as the *arXiv paper release* day, not authorization to rename the historical permalink.
- `2026-04-21-lean-atlas-semantic-alignment`: arXiv [2604.16347](https://arxiv.org/abs/2604.16347) page displays v1 **Mar 16, 2026**—even at odds with the `2604` identifier's month. The archive has Apr 21. This needs independent canonical source history and is held for date adjudication.
- `2026-09-06-collatz-predecessors-positive-density`: source [manuscript v1.0](https://www.proofatlas.ai/formalizations/positive-lower-density-collatz-predecessors/) is **Sep 6**; its [credit release JSON](https://www.proofatlas.ai/data/releases/positive-lower-density-collatz-predecessors.json) has `releasedAt=2026-09-07T08:08:49Z`. These may be **distinct source/version events**; do not overwrite the manuscript calendar date to Sep 7 without establishing identity and priority.
## arxiv.org — 18 records

| Immutable ID | Original source | Evidence verdict |
| --- | --- | --- |
| `2026-09-29-genlimitlib` | [original](https://arxiv.org/abs/2609.36663) | UNVERIFIED_ANNOUNCEMENT: official abs page gives submission/version history, not item-matched public announcement clock |
| `2026-09-22-direct-optimization-atp` | [original](https://arxiv.org/abs/2609.25575) | UNVERIFIED_ANNOUNCEMENT: official abs page gives submission/version history, not item-matched public announcement clock |
| `2026-09-22-math-reasoning-approach-not-topic` | [original](https://arxiv.org/abs/2609.27041) | UNVERIFIED_ANNOUNCEMENT: official abs page gives submission/version history, not item-matched public announcement clock |
| `2026-05-17-oprover-agentic-training` | [original](https://arxiv.org/abs/2605.17283) | UNVERIFIED_ANNOUNCEMENT: official abs page gives submission/version history, not item-matched public announcement clock |
| `2026-04-21-lean-atlas-semantic-alignment` | [original](https://arxiv.org/abs/2604.16347) | DATE_CONFLICT: v1 submission shown as Mar 16 (and April identifier is inconsistent), versus archive Apr 21; no original announcement day |
| `2023-02-23-proofnet` | [original](https://arxiv.org/abs/2302.12433) | DATE_CONFLICT: v1 submitted Feb 24, 2023 03:28:46Z, later than archive Feb 23 |
| `2023-06-02-checkmate` | [original](https://arxiv.org/abs/2306.01694) | UNVERIFIED_ANNOUNCEMENT: official abs page gives submission/version history, not item-matched public announcement clock |
| `2023-06-27-leandojo` | [original](https://arxiv.org/abs/2306.15626) | UNVERIFIED_ANNOUNCEMENT: official abs page gives submission/version history, not item-matched public announcement clock |
| `2026-10-19-rozsa-lean-equational-reasoning` | [original](https://arxiv.org/abs/2610.26467) | UNVERIFIED_ANNOUNCEMENT: official abs page gives submission/version history, not item-matched public announcement clock |
| `2026-10-20-mds-even-characteristic-independent-ai-assisted-proof` | [original](https://arxiv.org/abs/2610.28208) | UNVERIFIED_ANNOUNCEMENT: official abs page gives submission/version history, not item-matched public announcement clock |
| `2026-10-20-chudnovsky-logarithm-irrationality-lean` | [original](https://arxiv.org/abs/2610.28079) | UNVERIFIED_ANNOUNCEMENT: official abs page gives submission/version history, not item-matched public announcement clock |
| `2026-10-20-kurik-ball-nonexpansive-ai-lean` | [original](https://arxiv.org/abs/2610.28111) | UNVERIFIED_ANNOUNCEMENT: official abs page gives submission/version history, not item-matched public announcement clock |
| `2026-10-27-hellwig-morgan-mullen-completely-normal-lean` | [original](https://arxiv.org/abs/2610.36534) | UNVERIFIED_ANNOUNCEMENT: official abs page gives submission/version history, not item-matched public announcement clock |
| `2026-10-27-wang-zeng-bialostocki-lotspeich-zero-sums` | [original](https://arxiv.org/abs/2610.37125) | SUBMISSION_ONLY: Oct 27 12:24:34Z is submission, not public announcement |
| `2026-10-27-ortali-rectilinear-planarity-lean-ai` | [original](https://arxiv.org/abs/2610.37018) | UNVERIFIED_ANNOUNCEMENT: official abs page gives submission/version history, not item-matched public announcement clock |
| `2026-10-26-chen-wang-gross-prasad-geometric-langlands-ai` | [original](https://arxiv.org/abs/2610.36377) | SUBMISSION_ONLY: v1 submission Oct 26 22:49:06Z |
| `2026-10-25-jaakkola-mee-many-one-sigma2-gpt-sol` | [original](https://arxiv.org/abs/2610.34516) | WEEKEND_SUBMISSION: Oct 25 Sunday submitted, not an authenticated announcement |
| `2026-10-25-li-wang-radical-well-mixed-difference-ideals` | [original](https://arxiv.org/abs/2610.34389) | WEEKEND_SUBMISSION: Oct 25 Sunday 15:47:32Z submitted, not authenticated announcement |

## openai.com — 8 records

| Immutable ID | Original source | Evidence verdict |
| --- | --- | --- |
| `2026-09-08-openai-navier-stokes` | [original](https://openai.com/index/navier-stokes-solution/) | SOURCE_DAY_ONLY: official OpenAI page dates original article, with no confirmed precise public clock |
| `2026-08-01-openai-ten-advances` | [original](https://openai.com/index/ten-advances-in-mathematics/) | SOURCE_DAY_ONLY: official OpenAI page dates original article, with no confirmed precise public clock |
| `2026-05-20-openai-unit-distance` | [original](https://openai.com/index/model-disproves-discrete-geometry-conjecture/) | SOURCE_DAY_ONLY: official OpenAI page dates original article, with no confirmed precise public clock |
| `2026-04-23-gpt55-offdiagonal-ramsey` | [original](https://openai.com/index/introducing-gpt-5-5/) | SOURCE_DAY_VERIFIED: Apr 23 release vs later Apr 24 API availability |
| `2026-03-04-openai-graviton-amplitudes` | [original](https://openai.com/index/extending-single-minus-amplitudes-to-gravitons/) | SOURCE_DAY_ONLY: official OpenAI page dates original article, with no confirmed precise public clock |
| `2026-02-20-openai-first-proof` | [original](https://openai.com/index/first-proof-submissions/) | SOURCE_DAY_ONLY: official OpenAI page dates original article, with no confirmed precise public clock |
| `2026-10-06-openai-math-catalog` | [original](https://openai.com/index/sharing-ai-progress-in-mathematics/) | SOURCE_DAY_VERIFIED: Oct 6 original article vs Oct 15 editorial update |
| `2026-10-26-openai-yang-mills-qcd-proof-announcement` | [original](https://openai.com/index/building-scientific-understanding-with-academic-communities/) | NEW_DAY_VERIFIED: original OpenAI Oct 26 announcement; QCD artifacts withheld |

## github.com — 6 records

| Immutable ID | Original source | Evidence verdict |
| --- | --- | --- |
| `2026-09-24-ground-false-neurips` | [original](https://github.com/marcusm117/ProofNet-Verified) | NO_MATCHING_RELEASE: public v4.28.0 July 25 and v4.34.0 Oct 26 Lean compatibility releases are not Sep 24 Ground False paper publication |
| `2026-09-14-nivat-gpt6-lean` | [original](https://github.com/boonsuan/nivat) | NO_MATCHING_RELEASE: repo created Sep 14 01:41:58Z; no release/PR, created_at is not theorem publication |
| `2026-09-03-kothe-astra-autonomous` | [original](https://github.com/tadamcz/koethe) | NO_MATCHING_RELEASE: repo created Sep 3 22:51:02Z, dependency PR #1 not paper disclosure |
| `2026-08-12-hadamard-668-claude` | [original](https://github.com/nreff/hadamard-search) | NO_MATCHING_RELEASE: repo created 2025 Aug 11; no research Release or PR matches Aug 12 2026 |
| `2026-10-26-openai-local-smoothing-kakeya-formalization` | [original](https://github.com/openai/math/blob/main/preprints/Local-smoothing-for-the-Euclidean-wave-equation-October-25-2026/paper.pdf) | NEW_EXACT_PR_MILESTONE: PR #3 created Oct 26 21:03:27Z, public PR named matched manuscript; earlier blog/fork push possible |
| `2026-10-26-openai-subexponential-k-sat-eth-proof-claim` | [original](https://github.com/openai/math/blob/main/preprints/The-Exponential-Time-Hypothesis-is-False-October-25-2026/paper.pdf) | NEW_EXACT_PR_MILESTONE: same PR #3 exact public disclosure and matched file path, not git commit author time |

## www.proofatlas.ai — 5 records

| Immutable ID | Original source | Evidence verdict |
| --- | --- | --- |
| `2026-09-06-collatz-predecessors-positive-density` | [original](https://www.proofatlas.ai/formalizations/positive-lower-density-collatz-predecessors/) | VERSION_DATE_CONFLICT: manuscript Sept 6, first-party credit release releasedAt Sept 7 08:08:49Z; distinct events, no silent redating |
| `2026-08-05-sendov-proof-candidate` | [original](https://www.proofatlas.ai/formalizations/sendov-conjecture/) | MIDNIGHT_SENTINEL: first-party JSON releasedAt Aug 5 00:00:00Z not a verified clock |
| `2026-08-14-berlekamp-domineering-counterexample` | [original](https://www.proofatlas.ai/research/berlekamp-domineering-temperature-counterexample/) | MIDNIGHT_SENTINEL: version v002 JSON releasedAt Aug 14 00:00:00-04:00 not a proven HH:mm |
| `2026-08-16-bondy-longest-cycle-ai` | [original](https://www.proofatlas.ai/formalizations/bondy-longest-cycle-proof/) | MIDNIGHT_SENTINEL: version v002 JSON releasedAt Aug 16 00:00:00Z, not first-public clock |
| `2026-07-23-jackson-hamilton-counterexample` | [original](https://www.proofatlas.ai/formalizations/jackson-hamilton-decomposition-counterexample/) | NEW_EXACT_RELEASE: first-party v001 releasedAt July 23 19:15:17.560Z; exact source-backed version and original article match |

## deepmind.google — 4 records

| Immutable ID | Original source | Evidence verdict |
| --- | --- | --- |
| `2025-07-21-gemini-deep-think-imo-gold` | [original](https://deepmind.google/blog/advanced-version-of-gemini-with-deep-think-officially-achieves-gold-medal-standard-at-the-international-mathematical-olympiad/) | SOURCE_DAY_ONLY: original Google DeepMind article date verified, no exact clock |
| `2025-05-14-alphaevolve` | [original](https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/) | SOURCE_DAY_ONLY: original Google DeepMind article date verified, no exact clock |
| `2024-07-25-alphaproof-alphageometry2-imo-silver` | [original](https://deepmind.google/blog/ai-solves-imo-problems-at-silver-medal-level/) | SOURCE_DAY_VERIFIED: first-party explicitly first published July 25, 2024; Nature November 2025 is separate paper |
| `2024-01-17-alphageometry` | [original](https://deepmind.google/blog/alphageometry-an-olympiad-level-ai-system-for-geometry/) | SOURCE_DAY_ONLY: original Google DeepMind article date verified, no exact clock |
## Acceptance, limitations and next steps

- The original-source **provider group was inventoried** for every listed item. For arXiv the actual paper-specific archive/Atom announcement timestamps could not be independently retrieved for all 18; `UNVERIFIED_ANNOUNCEMENT` means **not proven**, not proof a date is false.
- For official blog posts the verified evidence here is original **calendar day**, not site-internal `datePublished` with timezone; no `HH:mm` invented.
- For GitHub, release collections, repository creation metadata, PR lists and the two manuscript path histories were inspected; the four other GitHub stories lack matching public release-time proof.
- For ProofAtlas, all five original pages and linked release credit JSON were reviewed; distinguish first-party version-clock, version-day, and independent third-party review.
- Next step: obtain article-matched official arXiv announcement feed archive (record ID, announce_type, first public UTC time), original historical snapshot for the two specific arXiv date conflicts, and check if older OpenAI/Google structured metadata provides reliable source publication offsets. Do not force a guess when feeds are unavailable.
- Test gates before merge: `npm run content:check`, static build / chronology regression and configured hosted Check/Docker/CodeQL, no unresolved review threads. This connector session did **not** run local npm tests. Avoid a claim of CI green before the hosted check finishes.
