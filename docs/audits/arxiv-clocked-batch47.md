# Issue #151｜Batch47 arXiv 历史时间证据审计（冻结行 42–46）

执行日期：2026-11-07 UTC。先完成 2026-11-06 日报 PR #164 Squash Merge 8f15559f8103adbcbba84cd75956633849d486b0，随后从核实后的 main 单独创建本审计分支。

## 核验结论

| 冻结行 | 记录 ID | 原 publishedAt：仅 v1 提交时间 | 已匹配的主分类 v1/new 公告日（UTC） | 状态 |
| --- | --- | --- | --- | --- |
| 42 | `2026-09-10-sullivan-no-wandering-domains-lean` | `2026-09-10T20:23:10.000Z` | **2026-09-16** / `math.HO` | ADOPTED（day） |
| 43 | `2026-09-10-magenta-lean-verification-loop` | `2026-09-10T09:48:07.000Z` | **2026-09-12** / `cs.AI` | ADOPTED（day） |
| 44 | `2026-09-09-small-undecidable-groups-chatgpt` | `2026-09-09T17:07:46.000Z` | **2026-09-10** / `math.GR` | ADOPTED（day） |
| 45 | `2026-09-08-stochbench` | `2026-09-08T17:59:46.000Z` | **2026-09-10** / `cs.CL` | ADOPTED（day） |
| 46 | `2026-09-07-kothe-conjecture-paper` | `2026-09-07T21:31:38.000Z` | **2026-09-09** / `math.RA` | ADOPTED（day） |

五条公告证据均通过固定历史 RSS 原始发布者字段交叉检查：论文编号、完整标题、`oai:arXiv.org:<id>v1` GUID、原始主分类、`announce_type=new`、`pubDate`。每条所用源文件、固定 Git blob SHA 与完整条目定位见 [Batch47 JSON 回执](evidence/arxiv-clocked-batch47.json)。固定只读镜像为 `ehijano/rss_fetch@e597e5120c034115fda2049d72812f2da7f99f3a`，镜像的 Git 提交时刻**不是**论文首次公开时刻，`pubDate` 中标准化 00:00:00 -0400 也不是经过证实的首次公开秒数。

### 具体语义限制

- Sullivan 定理形式化：v1 于 **9 月 10 日提交**，匹配 `math.HO` 原始 `new` 为 **9 月 16 日**，不能把提交秒数认作公开秒数。
- Magenta：v1 于 **9 月 10 日提交**，匹配 `cs.AI` 原始 `new` 为 **9 月 12 日**。原 RSS 的星期六日期仍只按其**来源声明的日级公告证据**收录，未靠常规 arXiv 时间表推断或修正日期。另检查 9 月 15/16 较大历史 RSS Git blob，未见相同 ID 的条目。
- Small undecidable groups：v1 于 **9 月 9 日提交**，匹配 `math.GR` 原始 `new` 为 **9 月 10 日**。
- StochBench：v1 于 **9 月 8 日提交**，匹配 `cs.CL` 原始 `new` 为 **9 月 10 日**，`cs.LO` 为交叉分类，不能代替主分类。
- Köthe 反例：v1 于 **9 月 7 日提交**，匹配 `math.RA` 原始 `new` 为 **9 月 9 日**，原摘要误称“9 月 7 日公开论文”已同步精确修正。

所有历史 ID、`publishedAt`、`publishedAtPrecision`（如有）、原始来源、固定 permalink、排名和归属保留。五条只补充 `chronology.milestone` 日期（`precision=day`、无 `at`），其中 Köthe 一条另修正摘要的投稿/公开混淆。未填写 `earliestVerifiedPublic`，没有自动重排静态时间线。**目录共 388 行，目标五行改动，其余 383 行字节保持一致**。

这批核验是**原始公告时间证据**，不是对 Köthe 的反例、Sullivan Lean 证明、Magenta 评测或其他数学结论的独立真实性检查。

### 进度与下一条

冻结 98 条：已补 chronology **29**；已检查但证据仍不足/冲突 **17**；技术受阻 **0**；未检查 **52**；仍缺 chronology **69**。下一条未检查 `2026-09-07-complex-grothendieck-odin`。Issue #127 的 GenLimitLib 与 Zenodo Arad–Herzog v3 保持**独立**计数。

只在 GitHub Hosted 内容校验、静态构建、时间线回归、安全检查、审查线程全部完成后 Squash Merge。