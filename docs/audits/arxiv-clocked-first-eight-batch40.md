# Batch 40 — first eight non-midnight arXiv clocks; preserve conflicting feed evidence

Checked **2026-11-02 UTC**. Continues [Issue #151](https://github.com/Charlie-Wang-03/ai4math-radar/issues/151), separately from #127's two midnight-valued cases. Baseline `fcea9ce8f277d0caf5f79733d842408740dcd781`; catalog Git blob `dde56d03c262a590a63fbffe9b7ccfaafeb9462d`, SHA-256 `d3d13ed022defbb2d249b5421722179bb6dcb26656842189142142ae7476284e`.

## Frozen population and precise scope

The verified baseline has **334 records / 120 arXiv original links / 99 non-midnight arXiv clocks / 98 such records without optional chronology**. The new permanent [98-row TSV](evidence/issue151-clocked-arxiv-baseline.tsv) is sorted newest first and preserves every baseline ID, legacy clock and original URL. Its SHA-256 is `a8abdc29c0fbc92037d55431eb9d987b45a01eadba8280da94453dece6afad80`. This is a frozen audit population, not a rule that future daily additions must keep the catalog at 334.

This batch checks the newest **eight**, spanning October 12–15. Every stored clock below matches the first-party page's explicitly labelled **Submission history [v1]**. This positively identifies submission-clock provenance; it does not establish a replacement public-release instant. The remaining 90 baseline candidates have not been individually reviewed in this batch. Later scientific claims, proof validity and AI-attribution assertions are outside this date audit.

| Existing ID | First-party v1 submission UTC (legacy value retained) | Additional date evidence | Editorial decision |
| --- | --- | --- | --- |
| `2026-10-15-lean-graph-search` | [2610.22339](https://arxiv.org/abs/2610.22339), Oct15 17:55:21 | Rendered `cs.LG` v1/new: Oct16, 04:00 AM, without an explicit timezone | HOLD rendered-only date; visible submission qualification |
| `2026-10-15-learning-lean-feedback-gpu` | [2610.21881](https://arxiv.org/abs/2610.21881), Oct15 13:46:41 | Rendered `cs.LG` v1/new: Oct16, 04:00 AM, without an explicit timezone | HOLD rendered-only date; visible submission qualification |
| `2026-10-14-ineqagent-symbolic-lean` | [2610.20681](https://arxiv.org/abs/2610.20681), Oct14 16:29:11 | Original-feed copy says **Oct17**, rendered archive says **Oct16**, both v1/new | HOLD conflicting dates; do not choose an earlier date automatically |
| `2026-10-14-euler-human-centered-math-agents` | [2610.19864](https://arxiv.org/abs/2610.19864), Oct14 09:27:36 | Rendered `cs.AI` v1/new: Oct15, without an explicit timezone | HOLD rendered-only date; visible submission qualification |
| `2026-10-14-aristotle-postage-stamp-h-bases` | [2610.19470](https://arxiv.org/abs/2610.19470), Oct14 02:51:11 | Original `math.CO` item: `2610.19470v1`, `new`, `Thu, 15 Oct 2026 00:00:00 -0400` | **Adopt Oct15 paper-announcement day only** |
| `2026-10-13-definition-grounding-reusebench` | [2610.19223](https://arxiv.org/abs/2610.19223), Oct13 21:42:35 | Rendered `cs.AI` v1/new: Oct15, without an explicit timezone | HOLD rendered-only date; qualify Oct13 as submission |
| `2026-10-13-annalschallenge` | [2610.18301](https://arxiv.org/abs/2610.18301), Oct13 12:48:33 | The same v1/new has original-copy item dates **Oct14 and Oct15**; rendered archive says Oct14 | HOLD conflicting dates; replace unsupported Oct13 release wording with submission |
| `2026-10-12-mini-lean-agent-baseline` | [2610.17331](https://arxiv.org/abs/2610.17331), Oct12 19:40:30 | The same v1/new has original-copy item dates **Oct14 and Oct15**; rendered archive says Oct14 | HOLD conflicting dates; visible submission qualification |

## Source acquisition and interpretation

Two finite, isolated-branch hosted inspections were run; neither changed the news catalog:

1. [Run 41387622863](https://github.com/Charlie-Wang-03/ai4math-radar/actions/runs/41387622863), head `7517b0f29aa3fe0190501cd0838ea36b39f34176`: **15** fixed original-feed XML copies, three categories (`cs.LG`, `cs.AI`, `math.CO`), filename partitions Oct12–16, at immutable `ehijano/rss_fetch` commit `e597e5120c034115fda2049d72812f2da7f99f3a`. All fifteen reads parsed; **12,969,391 bytes** total. [Artifact 13115632347](https://github.com/Charlie-Wang-03/ai4math-radar/actions/runs/41387622863/artifacts/13115632347), ZIP SHA-256 `f7b425ae6caf04f178613d91b5d1eaabc9ffe661bef02153b71a2e02b26b1112`.
2. [Run 41387806992](https://github.com/Charlie-Wang-03/ai4math-radar/actions/runs/41387806992), head `27d6ace381518142393733dff49c44c32bd683c2`: ten fixed rendered-feed paths for `cs.AI`/`cs.LG`, Oct12–16, at `sifted-network/sifted-awesome-ai-agents` commit `9e971e4a9ec325fec5eadf178c36e2afe223b0b2`. **Eight files read, two Oct13 mirror paths returned 404**; 3,339,126 readable bytes. Missing mirror paths do not establish non-publication. [Artifact 13115663962](https://github.com/Charlie-Wang-03/ai4math-radar/actions/runs/41387806992/artifacts/13115663962), ZIP SHA-256 `f7ccc11a9e4e57e63bc66fd8b3bf485b59c1c944058db8681a82a5174dc2ca29`.

Both ZIP hashes and all successful original XML/source-file hashes were independently checked after download. Full source bytes remain in the 30-day artifacts and at the immutable source URLs; the permanent [normalized receipt](evidence/arxiv-clocked-batch40.json) keeps selected metadata and source digests, not all article abstracts. Original article submission histories were read separately from the first-party arXiv pages above, not inferred by the transformation script.

The original XML copies come from a third-party archive of the publisher's RSS bytes, **not a fresh direct response from arXiv**. The [archive collector](https://github.com/ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/fetch_arxiv_feeds.py) uses curl and a fixed UTC-minus-five filename partition. Neither that filename nor its Git commit clock is a publication date. The accepted h-bases evidence is the article-matched item in [this frozen math.CO XML](https://github.com/ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/rss_data/math.CO/2026-10-15_math.CO.xml), with matching ID, title, v1 GUID, description and explicit `new` marker. No other date for this item was found in the fixed inspected files; this does not assert absolute research priority.

[arXiv's RSS specifications](https://info.arxiv.org/help/rss_specifications.html) distinguish item `new`, `cross` and replacements and describe item `pubDate`. [Availability guidance](https://info.arxiv.org/help/availability.html) separates submission/moderation from public announcement. RSS midnight is standardized date metadata, not an actual public clock. Hence the single adopted milestone has **day precision and no `at`**.

### Newly discovered conflict must not be hidden

The Oct14 and Oct15 `cs.AI` XML snapshots repeat mini-Lean-agent and AnnalsChallenge as v1/new with different item dates. IneqAgent's original-copy date is Saturday Oct17, while the rendered archive says Oct16. This is a source-consistency warning, **not proof that arXiv, the archive author or the paper authors fabricated data**. The cause has not been determined. Matching ID/v1/new alone is insufficient when dates conflict. The probe's `candidateOnly=true` means it found eligible-looking fields, not final editorial acceptance. Do not pick `min(date)`, borrow a channel date, silently drop conflicting observations, or use the usual 20:00 ET schedule to break a tie.

For four other papers the rendered mirror preserves a v1/new description and `Published` text, but no explicit timezone. The timestamp conversion implementation was not established in this batch. Existing earlier batches' use of similar archives does not itself prove the missing transformation semantics here. These four remain held; the suspected Oct15/16 days are leads, not new canonical dates.

## Content changes, regressions and acceptance

- Append user-visible Chinese submission/public-announcement qualifications to **eight** existing summaries. Correct the three dated prose openings for h-bases, Definition Grounding and AnnalsChallenge rather than leaving the new caveat contradicted by the opening.
- Add only h-bases `chronology`: `paper-release`, Oct15, `day`, `arxiv-announcement`, `https://rss.arxiv.org/rss/math.CO`. No `earliestVerifiedPublic`, no exact clock, no claim that this paper announcement dates Aristotle's original discovery/proof artifact.
- Preserve every ID, legacy `publishedAt`, original/public link, score, category and other metadata; **326 other lines byte-identical**. Neither #127 case is modified.
- Seven focused local tests PASS on Node 22.16.0 with type stripping. Tests cover immutable inventory, legacy values, original item identity, conflicting dates, rendered-only evidence limits, visible qualifications and separate progress counters. Local full-suite execution is not claimed; hosted content/static/tests/Docker/CodeQL and completed review must pass before merge.
- The temporary source-inspection and blob-preparation workflows are removed from the final tree before PR review. The preparation job verifies exact baseline/artifact hashes and creates only unattached blobs, never ref writes. No workflow/permission/schema/UI/schedule/MCP change is merged.

Resulting catalog blob: `ab23fb10e8e764f7f5657d6c4a98806ac57e2b3a`, SHA-256 `8d30c9c53a4b7b6f52bc477be7343443052bc2220a8d3bc8b53b74a69903cc73`.

**Progress after acceptance:** original 98 = **1 adopted + 7 reviewed/held + 90 not yet reviewed**. Thus **97** of this frozen population still lack optional chronology, not 90. The old midnight-valued count remains **105**, with the same **two** structural gaps under #127. Next untouched candidate is `2026-10-11-banks-landau-siegel-explicit`; keep the seven held cases in a separate source-conflict/provenance queue.
