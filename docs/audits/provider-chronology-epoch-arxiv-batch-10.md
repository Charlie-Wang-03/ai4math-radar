# Batch 10 — Source-provider grouped temporal audit: Epoch AI and arXiv (2026-10-30)

## Snapshot and objective

- Source: `portable/content/selected.jsonl` on `main` immediately after PR #114 (85 precision upgrades, five cross-day provenance-only cases) and PR #115 (seven newly selected items).
- On entry **301** canonical selected records, **95** date-only legacy clock placeholders. The 95 are *not* all incorrect dates; they have no supported exact time (or are cross-UTC-day conflicts).
- Grouped by the host of `links.original`, NOT by inferred editorial brand; changing historical permalinks, published dates and mathematical claims is out of scope.
- This batch scrutinizes **all 15 Epoch** date-only items, **all 18 arXiv** date-only items and **all 4 Hexagon** residual date-only items; 37 records inventoried. Date precision remains day unless independent source clock and semantic mapping are proven.

## Source-provider remaining inventory (before and after this non-time-upgrading batch)

| Original source host | Day-only count |
| --- | ---: |
| `arxiv.org` | 18 |
| `epoch.ai` | 15 |
| `openai.com` | 8 |
| `github.com` | 6 |
| `www.proofatlas.ai` | 5 |
| `deepmind.google` | 4 |
| `hexagonmath.org` | 4 |
| `www.anthropic.com` | 2 |
| `frenzymath.com` | 2 |
| `agmai.org` | 2 |
| `www.vals.ai` | 2 |
| `competition.sair.foundation` | 2 |
| `terrytao.wordpress.com` | 2 |
| `proceedings.mlr.press` | 1 |
| `cims.nyu.edu` | 1 |
| `ai.math.uw.edu` | 1 |
| `www.scientificamerican.com` | 1 |
| `cicm-conference.org` | 1 |
| `lab.cloud` | 1 |
| `aixiv.online` | 1 |
| `djalil.chafai.net` | 1 |
| `1stproof.org` | 1 |
| `www.nature.com` | 1 |
| `www.erdosproblems.com` | 1 |
| `mathai2023.github.io` | 1 |
| `research.meta.ai` | 1 |
| `www.quantamagazine.org` | 1 |
| `retractionwatch.com` | 1 |
| `nbrosse.github.io` | 1 |
| `www.tsinghua.edu.cn` | 1 |
| `www.simonsfoundation.org` | 1 |
| `leodemoura.github.io` | 1 |
| `proofsandintuitions.net` | 1 |
| `zenodo.org` | 1 |
| `www.mefyi.com` | 1 |
| `axiommath.ai` | 1 |
| **Total** | **95** |

## Epoch AI — 15 original-source records

Authoritative source families:
- [Open Problems original changelog](https://epoch.ai/frontiermath/open-problems): explicit Feb 24, Mar 5, Jul 31 and Sep 16 2026 update days (and separate other dates).
- [Tier 4 v2 original changelog](https://epoch.ai/benchmarks/frontiermath-tier-4-v2): June 12 2026 major revision.
- [Tier 4 v1 original changelog](https://epoch.ai/benchmarks/frontiermath-tier-4-v1): January 23 2026 errors/score corrections.
- [Original FrontierMath launch](https://epoch.ai/frontiermath/tiers-1-4/the-benchmark): explicitly states first published November 8 2024.
- [Book Ramsey result-specific progress update](https://epoch.ai/frontiermath/open-problems/ramsey-book-graphs): June 25 2026; subsequent updates are separate.
- [Superpermutations original explanation](https://epoch.ai/frontiermath/open-problems/superpermutations): author's public GitHub/group posts July 26; Epoch's test July 27. July 26 is an *original research-result disclosure day* evidenced by Epoch's firsthand evaluation commentary, **not** the publication clock of Epoch's mutable problem webpage.

| Immutable news ID | Original evidence / context | Verdict |
| --- | --- | --- |
| `2026-09-16-frontiermath-human-ai-status` | [original](https://epoch.ai/frontiermath/open-problems) | NEW_DAY · original Open Problems changelog: 2026-09-16 human+AI status |
| `2026-09-03-frontiermath-erdos-astra` | [original](https://epoch.ai/latest/announcing-frontiermath-erdos) | HOLD · cited Epoch announcement is dated Sep 1, not a separately dated Sep 3 outcome |
| `2026-09-01-frontiermath-erdos-launch` | [original](https://epoch.ai/latest/announcing-frontiermath-erdos) | PREVIOUS_DAY · original dated Sep 1 Epoch announcement |
| `2026-07-26-superpermutations-gpt56` | [original](https://epoch.ai/frontiermath/open-problems/superpermutations) | NEW_DAY · Epoch says matching public GitHub/group posts July 26; verifier test July 27, separate milestones; no exact clock |
| `2026-07-28-q2-galois-frontiermath-confirmation` | [original](https://epoch.ai/frontiermath/open-problems/q2-absolute-galois) | HOLD · mutable problem page shows July 6 progress update / earlier June demonstrations; no dated July 28 confirmation |
| `2026-07-31-frontiermath-open-problems-50` | [original](https://epoch.ai/frontiermath/open-problems) | NEW_DAY · official changelog confirms expansion and problem removals July 31 |
| `2026-06-12-frontiermath-v2-quality-repair` | [original](https://epoch.ai/frontiermath/tiers-1-4) · [primary milestone](https://epoch.ai/benchmarks/frontiermath-tier-4-v2) | NEW_DAY · Epoch Tier 4 v2 official changelog confirms 2026-06-12 release |
| `2026-06-25-book-ramsey-dualverse` | [original](https://epoch.ai/frontiermath/open-problems/ramsey-book-graphs) | NEW_DAY · exact subject matched to dated Epoch Progress Update 2026-06-25 |
| `2026-05-11-frontiermath-fatal-errors-review` | [original](https://epoch.ai/frontiermath/tiers-1-4) | HOLD · currently cited dynamic benchmark hub lacks dated original May 11 public report |
| `2026-03-05-frontiermath-notability-pruning` | [original](https://epoch.ai/frontiermath/open-problems) | NEW_DAY · Open Problems original changelog says removed a non-notable problem March 5 |
| `2026-02-24-frontiermath-open-problems-expansion` | [original](https://epoch.ai/frontiermath/open-problems) | NEW_DAY · Open Problems original changelog says two new problems added Feb 24 |
| `2026-01-23-frontiermath-tier4-fixes` | [original](https://epoch.ai/benchmarks/frontiermath-tiers-1-3-v1) · [primary milestone](https://epoch.ai/benchmarks/frontiermath-tier-4-v1) | NEW_DAY · Tier 4 v1 official changelog explicitly dates grader/statement corrections Jan 23 |
| `2026-01-27-frontiermath-open-problems-pilot` | [original](https://epoch.ai/latest/benchmarking-ai-on-unsolved-math-problems) | PREVIOUS_DAY · original dated Epoch pilot announcement Jan 27 |
| `2024-11-08-frontiermath-launch` | [original](https://epoch.ai/frontiermath/tiers-1-4/the-benchmark) | NEW_DAY · original Epoch launch page explicitly states first published Nov 8 2024 |
| `2024-12-20-openai-o3-frontiermath` | [original](https://epoch.ai/frontiermath/tiers-1-4/about) | HOLD · current Epoch dashboard is not the original OpenAI o3 disclosure record; no exact first-party milestone cited |

**Epoch result:** 9 **new day-only chronology milestones**, two pre-existing day-only milestones, four records still lacking the claimed event-specific original public date. No invented minute/second; source date remains a *day*, never a default 00:00 UTC public release. The July 26 superpermutation event has a distinct July 27 Epoch verification; neither should be silently conflated.

## arXiv — 18 original-source records: submission vs public announcement

arXiv [official submission availability](https://info.arxiv.org/help/availability.html) explicitly distinguishes submission, moderation, and public announcement. Moderation delays and deferred mailing prevent safely deriving the first-public moment from the submission-click time or default schedule. [Official Atom feed specification](https://info.arxiv.org/help/atom_specifications.html) defines a separate `<published>` **announcement** field in the public announcement feed; distinguish it from article submission history and any unrelated API's `published` usage. Obtain an **article-matched original announcement feed record** before certifying a timestamp.

**Important corrective action:** six recently added October 25–27 records (PR #115) carried `chronology.milestone.evidenceKind="arxiv-announcement"` using only arXiv abs pages labelled **Submitted on**. That citation does **not** verify an announcement on the listed UTC day. Remove **only those six unsupported optional chronology assertions**. Preserve immutable ID, `publishedAt`, `publishedAtPrecision:"day"`, source, title and editorial content for follow-up date review, *not* because their historical date has been proven correct.

| Immutable news ID | arXiv primary record | Verdict |
| --- | --- | --- |
| `2026-09-29-genlimitlib` | [original](https://arxiv.org/abs/2609.36663) | HOLD_NO_ITEM_MATCHED_PUBLIC_ANNOUNCEMENT · don't promote submit-click or reuse assumed standard schedule |
| `2026-09-22-direct-optimization-atp` | [original](https://arxiv.org/abs/2609.25575) | HOLD_NO_ITEM_MATCHED_PUBLIC_ANNOUNCEMENT · don't promote submit-click or reuse assumed standard schedule |
| `2026-09-22-math-reasoning-approach-not-topic` | [original](https://arxiv.org/abs/2609.27041) | HOLD_NO_ITEM_MATCHED_PUBLIC_ANNOUNCEMENT · don't promote submit-click or reuse assumed standard schedule |
| `2026-05-17-oprover-agentic-training` | [original](https://arxiv.org/abs/2605.17283) | HOLD_NO_ITEM_MATCHED_PUBLIC_ANNOUNCEMENT · don't promote submit-click or reuse assumed standard schedule |
| `2026-04-21-lean-atlas-semantic-alignment` | [original](https://arxiv.org/abs/2604.16347) | HOLD_NO_ITEM_MATCHED_PUBLIC_ANNOUNCEMENT · don't promote submit-click or reuse assumed standard schedule |
| `2023-02-23-proofnet` | [original](https://arxiv.org/abs/2302.12433) | HOLD_NO_ITEM_MATCHED_PUBLIC_ANNOUNCEMENT · don't promote submit-click or reuse assumed standard schedule |
| `2023-06-02-checkmate` | [original](https://arxiv.org/abs/2306.01694) | HOLD_NO_ITEM_MATCHED_PUBLIC_ANNOUNCEMENT · don't promote submit-click or reuse assumed standard schedule |
| `2023-06-27-leandojo` | [original](https://arxiv.org/abs/2306.15626) | HOLD_NO_ITEM_MATCHED_PUBLIC_ANNOUNCEMENT · don't promote submit-click or reuse assumed standard schedule |
| `2026-10-19-rozsa-lean-equational-reasoning` | [original](https://arxiv.org/abs/2610.26467) | HOLD_NO_ITEM_MATCHED_PUBLIC_ANNOUNCEMENT · don't promote submit-click or reuse assumed standard schedule |
| `2026-10-20-mds-even-characteristic-independent-ai-assisted-proof` | [original](https://arxiv.org/abs/2610.28208) | HOLD_NO_ITEM_MATCHED_PUBLIC_ANNOUNCEMENT · don't promote submit-click or reuse assumed standard schedule |
| `2026-10-20-chudnovsky-logarithm-irrationality-lean` | [original](https://arxiv.org/abs/2610.28079) | HOLD_NO_ITEM_MATCHED_PUBLIC_ANNOUNCEMENT · don't promote submit-click or reuse assumed standard schedule |
| `2026-10-20-kurik-ball-nonexpansive-ai-lean` | [original](https://arxiv.org/abs/2610.28111) | HOLD_NO_ITEM_MATCHED_PUBLIC_ANNOUNCEMENT · don't promote submit-click or reuse assumed standard schedule |
| `2026-10-27-hellwig-morgan-mullen-completely-normal-lean` | [original](https://arxiv.org/abs/2610.36534) | RETRACT_UNPROVEN_ANNOUNCEMENT · v1 submission day != verified public listing day |
| `2026-10-27-wang-zeng-bialostocki-lotspeich-zero-sums` | [original](https://arxiv.org/abs/2610.37125) | RETRACT_UNPROVEN_ANNOUNCEMENT · v1 submission day != verified public listing day |
| `2026-10-27-ortali-rectilinear-planarity-lean-ai` | [original](https://arxiv.org/abs/2610.37018) | RETRACT_UNPROVEN_ANNOUNCEMENT · v1 submission day != verified public listing day |
| `2026-10-26-chen-wang-gross-prasad-geometric-langlands-ai` | [original](https://arxiv.org/abs/2610.36377) | RETRACT_UNPROVEN_ANNOUNCEMENT · v1 submission day != verified public listing day |
| `2026-10-25-jaakkola-mee-many-one-sigma2-gpt-sol` | [original](https://arxiv.org/abs/2610.34516) | RETRACT_UNPROVEN_ANNOUNCEMENT · v1 submission day != verified public listing day |
| `2026-10-25-li-wang-radical-well-mixed-difference-ideals` | [original](https://arxiv.org/abs/2610.34389) | RETRACT_UNPROVEN_ANNOUNCEMENT · v1 submission day != verified public listing day |

Examples of independently visible submission metadata, **not** publish times: [2610.34389](https://arxiv.org/abs/2610.34389) v1 Oct 25 15:47:32Z; [2610.34516](https://arxiv.org/abs/2610.34516) v1 Oct 25 19:18:36Z; [2610.37125](https://arxiv.org/abs/2610.37125) v1 Oct 27 12:24:34Z; [2610.36377](https://arxiv.org/abs/2610.36377) v1 Oct 26 22:49:06Z. Do **not** write these into `publishedAt`.

## Hexagon — four remaining legacy UTC-day conflicts / arrivals

| Immutable news ID | Proven source milestone | Disposition |
| --- | --- | --- |
| `2026-10-24-huppert-psl4-5-degree-counterexample` | [original](https://hexagonmath.org/2610.00529v1) / [machine source](https://hexagonmath.org/api/v1/works/2610.00529v1) `2026-10-26T04:51:28.160Z` | CROSS_UTC_DAY · existing precise chronology retained; leave legacy publishedAt and permalink unchanged |
| `2026-10-25-amit-planar-seven-distance-16` | [original](https://hexagonmath.org/2610.00534v1) / [machine source](https://hexagonmath.org/api/v1/works/2610.00534v1) `2026-10-26T04:51:58.441Z` | CROSS_UTC_DAY · existing precise chronology retained; leave legacy publishedAt and permalink unchanged |
| `2026-10-26-murphy-brualdi-goldwasser-tree-laplacian-max` | [original](https://hexagonmath.org/2610.00565v1) / [machine source](https://hexagonmath.org/api/v1/works/2610.00565v1) `2026-10-27T20:12:46.036Z` | CROSS_UTC_DAY · existing precise chronology retained; leave legacy publishedAt and permalink unchanged |
| `2026-10-28-kisin-serre-artin-character-gpt-astra` | [original](https://hexagonmath.org/2610.00597v1) / [machine source](https://hexagonmath.org/2610.00597v1) `2026-10-28` | CROSS_UTC_DAY · existing precise chronology retained; leave legacy publishedAt and permalink unchanged |

Three previously evidenced cross-day cases are *not unresolved clock times*: the correct machine source instants exist in `chronology.milestone`; they remain on the 95-item *legacy publishedAt placeholder* list pending a separate UI/feed migration. The newly selected 2026-10-28 Kisin item has not yet had its `work.publishedAt` independently collected; its date-only metadata is retained.

## Integrity statement and next actions

- **Canonical mutations:** 9 evidence-backed Epoch *day-level* milestone additions; six unsupported arXiv announcement milestone removals. No exact time promoted, no date or ID rewritten. 301 records preserved.
- **95 legacy day-only records remain**. Optional chronology coverage changes, but a day-only milestone is not a clock upgrade.
- Preserve the migration contract from [Issue #104](../editorial-temporal-contract-v1.md): legacy `publishedAt` and permanent ID remain stable; `chronology.milestone` and `chronology.earliestVerifiedPublic` are distinct.
- Next arXiv step: retrieve and archive per-paper official public announcement Atom records (date, announcement type, category, item ID), compare to six suspect UTC days and 12 older paper records; **no universal daily 20:00 ET guess**.
- Next Epoch step: obtain original dated OpenAI/Epoch publications or immutable archival evidence for Sep 3 Erdős Astra, July 28 Galois confirmation, May 11 audit, and December 20 2024 o3 benchmark claim.
- Next residual source groups: OpenAI institution posts (8); GitHub primary releases/PRs (6); ProofAtlas (5); Google DeepMind (4); institutional/blog remaining (35). For the last group, distinguish sourced dates and exact clocks.
- Merge only after GitHub `check`, `docker`, CodeQL and content/timeline tests are green and reviews resolved. No mathematical result independently validated in this timestamp audit.
