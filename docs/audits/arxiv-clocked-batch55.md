# Issue #151 — Batch55 arXiv announcement-time audit (freeze rows 82–86)

- Checked UTC: **2026-11-15**. Daily content PR [#181](https://github.com/Charlie-Wang-03/ai4math-radar/pull/181) already squash merged as `005f9016c190c737da29fa318457aa28afed9ca9` before this independent audit.
- Fixed upstream: [ehijano/rss_fetch@e597e5120c034115fda2049d72812f2da7f99f3a](https://github.com/ehijano/rss_fetch/tree/e597e5120c034115fda2049d72812f2da7f99f3a); source replays original publisher RSS fields but is **not** itself an arXiv publisher or a valid public clock.
- Scope: exactly 5 frozen candidates; **3 adopted as day-only arXiv original primary v1/new announcement milestones**, 2 **UNRESOLVED**. Read **31 dated XML paths** (listed with fixed primary evidence receipts in [Batch55 JSON](evidence/arxiv-clocked-batch55.json)). Matching means arXiv ID, original paper v1 title, v1 GUID, primary category, `announce_type=new` and item `pubDate` when present.

| ID | Publisher original v1/new date (UTC) | Disposition |
|---|---|---|
| `2025-04-30-deepseek-prover-v2` | **2025-05-01**, cs.CL; [pinned source](https://github.com/ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/rss_data/cs.CL/2025-04-30_cs.CL.xml) (`2f024870f9c97ffd8681da2391c5f2ba3c49e391`) | ADOPTED_DAY_ONLY |
| `2025-04-27-ape-bench` | **2025-04-29**, cs.CL; [pinned source](https://github.com/ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/rss_data/cs.CL/2025-04-28_cs.CL.xml) (`5b38d84d56db1b42163aeac30df5aa961f79da72`) | ADOPTED_DAY_ONLY |
| `2025-02-05-alphageometry2` | **2025-02-07**, cs.AI; [pinned source](https://github.com/ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/rss_data/cs.AI/2025-02-07_cs.AI.xml) (`d1de6775037e7f791595fdc5b3ed47aa15cde0e2`) | ADOPTED_DAY_ONLY |
| `2024-10-08-leanagent` | v1/new **not recovered**, only cs.LG v3/replace (Oct 18 pubDate) | **UNRESOLVED** |
| `2024-06-11-autoformalization-type-checking` | v1/new record found, but **original pubDate absent**, June 11 filename alone insufficient | **UNRESOLVED** |

Publisher `pubDate` values are normalized 00:00 hours with -0400/-0500 offsets; use **UTC calendar day** only. They do **not** certify real second/minute of public release. `publishedAt` are old v1 submission clocks and remain unchanged; no speculative `at` or `earliestVerifiedPublic`. Keep original IDs, permalinks, links, ranking/score, titles and other records intact; source provenance outside the on-site schema is pinned in JSON. Historical timestamp audit does **not** validate any mathematical proof, Lean kernel behavior or benchmark result.

For LeanAgent, checked cs.LG October 07–17 with empty/zero-byte gaps; v3/replace is not new v1. For Autoformalization using Type Checking, the matching fixed cs.CL June 11 XML contains <item> with v1/new but no pubDate: cannot infer official public day from XML capture day. Both remain pending suitable original public evidence; no guessing from arXiv general 20:00 ET schedule or submitting seconds.

Validation: 493 existing rows, only 3 target rows modified by additive day precision chronology, remaining 490 lines byte identical. After audit: 493 IDs remain unique. Freeze: **98** total / **57** chronology / **29** checked-unresolved / **0** blocked / **12** unchecked / **41** missing chronology. Next `2024-06-04-process-driven-autoformalization`. Issue #127 GenLimitLib and Zenodo v3 remain separate. Hosted CI + review must pass before squash merge.
