# Batch 41 — next eight clocked arXiv records, October 1–11

Checked 2026-11-02 UTC. Continues [Issue #151](https://github.com/Charlie-Wang-03/ai4math-radar/issues/151), independently of the two midnight-date cases in #127. Baseline `b5734eb5b282cf110165fe7490d0870c88b0dddd`, catalog blob `ab23fb10e8e764f7f5657d6c4a98806ac57e2b3a`: 334 selected records. These are rows **9–16** of the unchanged [98-row inventory](evidence/issue151-clocked-arxiv-baseline.tsv), after Batch40's first eight.

## Scope and source semantics

All eight original arXiv pages explicitly label the stored legacy seconds as **Submission history [v1]**. The version-specific URLs and observed UTC values are in the [permanent selected-field receipt](evidence/arxiv-clocked-batch41.json). Numeric precision does not authenticate public availability; [arXiv's availability guidance](https://info.arxiv.org/help/availability.html) distinguishes submission and announcement.

The following dates come from article-specific publisher RSS fields preserved by a third-party archive, **not fresh responses from the historical arXiv endpoint**. The archive is pinned at `ehijano/rss_fetch@e597e5120c034115fda2049d72812f2da7f99f3a`. Each accepted item matches the primary category, exact title, article ID, v1 GUID, description version/type and `arxiv:announce_type=new`. Item `pubDate` has an explicit `-0400` offset; its standardized midnight is treated only as an announcement **day**, never a real publication instant. Mirror filename, commit clock, channel date and the usual publication schedule are not date evidence. See [official RSS definitions](https://info.arxiv.org/help/rss_specifications.html).

## Six adopted day-only milestones

| Stable record / source | Preserved v1 submission UTC | Adopted announcement day | Immutable item evidence |
| --- | --- | --- | --- |
| `2026-10-11-banks-landau-siegel-explicit` / [2610.15483v1](https://arxiv.org/abs/2610.15483v1) | Oct11 09:35:35 | **2026-10-14** | [math.NT XML, lines 329–340](https://github.com/ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/rss_data/math.NT/2026-10-14_math.NT.xml#L329-L340) |
| `2026-10-08-quasi-riemann-ai-assisted-improvement` / [2610.12234v1](https://arxiv.org/abs/2610.12234v1) | Oct8 16:18:53 | **2026-10-09** | [math.NT XML, lines 508–524](https://github.com/ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/rss_data/math.NT/2026-10-09_math.NT.xml#L508-L524) |
| `2026-10-04-aiprover-harnessevolve` / [2610.05367v1](https://arxiv.org/abs/2610.05367v1) | Oct4 16:48:12 | **2026-10-06** | [cs.LO XML, lines 111–125](https://github.com/ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/rss_data/cs.LO/2026-10-06_cs.LO.xml#L111-L125) |
| `2026-10-04-discovery-execution-test-time` / [2610.05322v1](https://arxiv.org/abs/2610.05322v1) | Oct4 15:45:11 | **2026-10-06** | [cs.LG XML, lines 2244–2256](https://github.com/ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/rss_data/cs.LG/2026-10-06_cs.LG.xml#L2244-L2256) |
| `2026-10-01-skillevolean` / [2610.01799v1](https://arxiv.org/abs/2610.01799v1) | Oct1 14:42:54 | **2026-10-02** | [cs.LG XML, lines 2816–2827](https://github.com/ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/rss_data/cs.LG/2026-10-02_cs.LG.xml#L2816-L2827) |
| `2026-10-01-forall-lean-agent` / [2610.00885v1](https://arxiv.org/abs/2610.00885v1) | Oct1 01:00:35 | **2026-10-02** | [cs.SE XML, lines 103–116](https://github.com/ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/rss_data/cs.SE/2026-10-02_cs.SE.xml#L103-L116) |

Only `chronology.eventKind=paper-release`, `milestone.precision=day`, `evidenceKind=arxiv-announcement` and the matching first-party category RSS URL are adopted. No `at` or `earliestVerifiedPublic` is added. This is evidence for these papers' announcements, not for mathematical validity, original discovery priority, proof-artifact upload, model release or the absolute first publication elsewhere.

**Version/type safeguards:** The quasi-Riemann news matches v1's *Slightly improved* title and `0.874957069799…` value. Current v2 has a different title/value; its Oct14 `replace` entry is retained but not substituted. AIProver's `cs.AI` cross-list copies show Oct6 and Oct7; these are recorded as cross-list observations and do not override the primary `cs.LO new` Oct6 event. SkillEvoLean's Oct7 v2 replacement is likewise not its v1 announcement. Adjacent primary-category snapshots were inspected; no conflicting primary v1/new day for the six adoptions was found **within the bounded reviewed set**, not an exhaustive claim about all archives.

## Two reviewed holds

- **SO-RSI / [2610.05701](https://arxiv.org/abs/2610.05701):** matching primary v1/new appears with **Oct6** and **Oct7** item dates in [Oct6 cs.AI XML](https://github.com/ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/rss_data/cs.AI/2026-10-06_cs.AI.xml#L2156-L2167) and [Oct7 cs.AI XML](https://github.com/ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/rss_data/cs.AI/2026-10-07_cs.AI.xml#L2157-L2168). Both are retained. No `min(date)`, schedule inference or substitution of the Oct8 v2/replace record. Keep `HELD_CONFLICTING_NEW_DATES` and no optional chronology. The mirror anomaly is not an allegation of misconduct or proof that either date is false.
- **SCOPE / [2610.08319](https://arxiv.org/abs/2610.08319):** v1 submission is Oct6 13:22:24 UTC, but no matching v1/new item was recovered in this batch's fixed primary-category snapshots. A v2/replace item is present in the already downloaded Batch40 rendered archive `16-ai.md`; it is explicitly not v1. Keep `HELD_NO_MATCHED_V1_NEW`. Absence in these mirrors does not establish that the paper was historically unavailable. No new source time is asserted.

## Actual collection and preservation

[Run 41391551352](https://github.com/Charlie-Wang-03/ai4math-radar/actions/runs/41391551352) read 31 immutable paths: 21 original XML copies and ten rendered feed archives. [Run 41391756120](https://github.com/Charlie-Wang-03/ai4math-radar/actions/runs/41391756120) read **five additional, previously unqueried** adjacent XML paths. All 36 reads returned HTTP 200 and were parsed completely: **17,158,545 bytes**, 14 matching original XML observations and ten rendered observations. Individual byte counts/SHA-256 values, negative-coverage paths and immutable revisions are retained in the receipt. Zero-based `sourceIndex` joins each observation to `sourceReceipts`; reconstruct its immutable URL from `archives[kind]` and `path`.

Downloaded artifacts: `13117363234` / ZIP SHA-256 `0cde02a3e6c47ff3d847355bb82a94e94909ff3a3d4b3e11018c1d656ee8979e`; `13117204063` / ZIP SHA-256 `b3f2d83471479c44704986ece8a845d26d87524197587c0d41bcfb807e82dc67`. Both ZIP hashes and every recorded source hash were independently checked locally. Artifacts retain full snapshots for 30 days; the committed receipt is explicitly a **selected-field transcription**, not all raw source bytes. Rendered locale timestamps omit timezone and are never primary UTC authority here.

## Change integrity and acceptance

Append public Chinese submission/publication qualifications to all eight summaries; replace Banks's unsupported `于 10 月 11 日发布` opening with a v1-submission description. Preserve research content, v1 identity and all other fields. Exactly **8 records changed / 326 other records byte-identical**. All legacy `publishedAt`, IDs, public links, rankings and discovery times remain untouched. #127's **105 midnight-valued fields and two hard cases** are unchanged; no timeline migration.

Local **9/9 focused tests PASS** (Node 22.16.0 with type stripping); this is not a claim to have run the local full suite. [Guarded preparation run 41392125864](https://github.com/Charlie-Wang-03/ai4math-radar/actions/runs/41392125864) independently reproduced catalog blob `cb3e37ab60c1cb537ad1271ed30be9b4aa7a3787` and SHA-256 `909f18c26c561b639e3d3b125b65ca32e7ee26588c8b99497d2d0456db955d8d`, and stored an unattached blob only. All temporary branch-only workflows are removed from the final proposed tree. Final diff: **four** catalog/test/audit/receipt paths; no workflow, permission, schema, UI, scheduling or MCP changes.

Require hosted typecheck/tests/content/static/Docker/CodeQL and final-head review before expected-head squash merge; inspect actual Pages deployment and artifact before claiming deployment acceptance. Audit tests validate evidence consistency and editorial constraints, not the papers' mathematical conclusions.

After adoption, frozen **98 = 7 adopted + 9 reviewed/held + 82 unreviewed**, with **91** still lacking optional chronology. Batch41 itself: **8 reviewed = 6 adopted + 2 held**. The next untouched candidate is `2026-09-28-mathagent`; retain the nine held cases separately. Current batch counters are frozen audit snapshots, not assumptions about future daily additions.
