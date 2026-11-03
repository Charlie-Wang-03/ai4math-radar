# Batch 43｜arXiv 带秒旧时间核验：大文件可读采证与源日期冲突

核验日期：**2026-11-03 UTC**。关联 [Issue #151](https://github.com/Charlie-Wang-03/ai4math-radar/issues/151)，冻结清单 `docs/audits/evidence/issue151-clocked-arxiv-baseline.tsv`。每日新闻 [PR #156](https://github.com/Charlie-Wang-03/ai4math-radar/pull/156) 已先合并；本审计以新的 main 为基线。与 Issue #127 的两个独立困难项分开计数。

## 范围与结果

对冻结清单 **22–26 行五条首次核验**，并用新的只读完整 Git blob 读取路径重访 **17、18、20、21 行**原技术性受阻项目。合计实际核对 **9 条**：**6 条**新增日精度 `chronology.milestone`，另 **3 条**因原始 RSS 同一 `v1/new` 的不同日期仍冲突，不能采用。

| 冻结行 | ID（arXiv） | 旧 v1 提交日 | 采用的首个可核公开公告日（UTC） | 状态 |
|---|---|---|---|---|
| 17 | `2026-09-28-mathagent`（2609.34460） | 09-28 | **2026-09-29**（cs.AI） | ADOPTED |
| 18 | `2026-09-27-break-judges`（2609.33773） | 09-27 | **2026-09-29**（cs.AI） | ADOPTED |
| 20 | `2026-09-26-jepa-lean-search`（2609.32908） | 09-26 | 09-29 与 09-30 均有 `v1/new` | UNRESOLVED |
| 21 | `2026-09-26-oracleladder`（2609.32235） | 09-26 | 09-29 与 09-30 均有 `v1/new` | UNRESOLVED |
| 22 | `2026-09-26-compassplay`（2609.32228） | 09-26 | 09-29 与 09-30 均有 `v1/new` | UNRESOLVED |
| 23 | `2026-09-25-choir`（2609.31903） | 09-25 | **2026-09-29**（cs.AI） | ADOPTED |
| 24 | `2026-09-24-proofgap`（2609.29296） | 09-24 | **2026-09-25**（cs.PL） | ADOPTED |
| 25 | `2026-09-23-order-sensitive-representations`（2609.28442） | 09-23 | **2026-09-24**（cs.LG） | ADOPTED |
| 26 | `2026-09-23-interesting-mathematics`（2609.28603） | 09-23 | **2026-09-25**（cs.LG） | ADOPTED |

## 限域采证方法

使用固定 [`ehijano/rss_fetch@e597e5120c034115fda2049d72812f2da7f99f3a`](https://github.com/ehijano/rss_fetch/tree/e597e5120c034115fda2049d72812f2da7f99f3a) 的第三方历史镜像；其中是保留的 **arXiv 原始 RSS XML 发布者字段**，不是当年现场重新发起的原始 arXiv HTTP 请求。原始 `rss_data/<primary>/<date>_<primary>.xml` 文件部分超过 GitHub Contents API 的内联文本阈值，之前 Batch42 将其合理归为 **TECHNICAL BLOCKED**。这次通过**现有 GitHub 连接器只读操作**，先请求源文件的 **Git blob SHA**，再以 `fetch_blob` 按 SHA 完整取回约 0.02–3.26 MB 的原 XML；无权限提升、未创建持久 MCP 或更改其他仓库。

对 **12 份完整历史 XML** 逐条查验原始发布者的文章标题、编号 URL、`description` 中 `arXiv:...v1 Announce Type: new`、`oai:arXiv.org:...v1` GUID、第一分类、`arxiv:announce_type=new` 和带 `-0400` 时区的 `pubDate`。所有固定来源 URL、SHA-1 Git blob 哈希、体积、目标对应关系和 9 条决策均写入 [固定证据回执](evidence/arxiv-clocked-batch43.json)。镜像的 Git commit 时间**不是**该论文的公告时刻；RSS 的 `00:00:00 -0400` 是公告日期元数据，**不支持秒级公开时刻**。

单一同题名/v1/new 证据的六条采用 **day-only** `paper-release/arxiv-announcement`。这表示本批可核的**论文公告日**，不认证绝对最早公开数学主张、不代替首次证明作者或独立 Lean 正确性。相同类型条目在两份历史源 XML 显示 9/29、9/30 的三条则**保留二者**：不能把 `min(date)`、channel 文件名、惯常 20:00 ET、RSS 零时、Git 采集时间或 cross-list/replace 解释为优先级裁决。先寻找源流更新/重发机制及同期原始记录再重访。

## 数据与队列核对

数据修改仅针对九条既有 `selected.jsonl` 新闻：九条摘要添加旧 `publishedAt` 为 **v1 提交而非公示时刻**的说明；六条追加 day-only `chronology.milestone`（`eventKind=paper-release`、`evidenceKind=arxiv-announcement`、固定官方 RSS 源 URL）。**不添加** `at` 或 `earliestVerifiedPublic`。保留全部新闻 ID、原 `publishedAt` 兼容值、`discoveredAt`、permalink、原始来源、分类与评分；另外 **341 条**记录完全不变。数据结构、UI、运行时、调度、Secrets、权限均不触碰。数学结果/证明是否成立不属于此时间审计。

冻结总计 **98** 条 = **14** 条已采用补充 chronology + **12** 条已查证但仍待核（含本次 3 条源日期冲突） + **0** 条技术性阻塞 + **72** 条尚未检查。因此 **仍缺 chronology 84 条**，与未检查的 72 条不是同一数字。原 Batch42 四条技术受阻被分为两条采用和两条源日期冲突，均不再标技术阻塞。下一条未检查 ID：`2026-09-21-permuformer`。Issue #127（GenLimitLib 与 Zenodo v3）仍独立未解。

## 审查与验收条件

本审计与日报 PR 分离，限九条新闻、本文、固定回执和聚焦测试。必须满足真实 Hosted `content:check`、`build:static`、时间线回归、CodeQL、分支保护及无未解决审查线程后才执行 Squash Merge。不得凭脚本自检、来源镜像或此前历史检查宣称现行 CI 或 Pages 已成功。
