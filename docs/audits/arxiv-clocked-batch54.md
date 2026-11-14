# Issue #151｜Batch54 arXiv 历史公告日证据（冻结清单 77–81）

执行日期 **2026-11-14 UTC**。先完成 2026-11-13 UTC 日报 [PR #179](https://github.com/Charlie-Wang-03/ai4math-radar/pull/179)，新增 18 条至 **479**，Squash Merge `1dcad59633a2a9998efe7ef1d1c351cf51479a38`；随后从重新读取的最新 `main` 独立审计。

| 冻结行 | 新闻 ID | v1 提交日期（旧兼容值保持） | 主分类 v1/new 发布者 `pubDate` UTC 日 | 决议 |
|---|---|---|---|---|
| 77 | `2025-10-29-rlmeval` | 2025-10-29 | **2025-10-30**（cs.CL） | ADOPTED_DAY_ONLY |
| 78 | `2025-10-11-gpt5-provers-verifiers` | 2025-10-11 | **2025-10-16**（cs.CL） | ADOPTED_DAY_ONLY |
| 79 | `2025-10-01-aristotle` | 2025-10-01 | 未获得 v1/new | UNRESOLVED |
| 80 | `2025-09-16-conjecturing-proving-loop` | 2025-09-16 | **2025-09-19**（cs.LG） | ADOPTED_DAY_ONLY |
| 81 | `2025-06-24-prover-agent` | 2025-06-24 | **2025-06-26**（cs.AI） | ADOPTED_DAY_ONLY |

## 固定原始公告证据

采用固定的 [历史 RSS 镜像 e597e5120c034115fda2049d72812f2da7f99f3a](https://github.com/ehijano/rss_fetch/tree/e597e5120c034115fda2049d72812f2da7f99f3a)，**完整读取 37 份分类/日期 XML**，检查每条原始发布者 `link`、标题、v1 GUID、主分类、`announce_type=new` 与 `pubDate`。四条采用依据：

- **2025-10-29-rlmeval**：cs.CL 的 [固定 RSS XML](https://github.com/ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/rss_data/cs.CL/2025-10-29_cs.CL.xml)，Git Blob `04298303c206d2b26a7056c87fa4b71798bc0993`；`oai:arXiv.org:2510.25427v1`、`new`、`pubDate=Thu, 30 Oct 2025 00:00:00 -0400` → **2025-10-30**（UTC 日级）。
- **2025-10-11-gpt5-provers-verifiers**：cs.CL 的 [固定 RSS XML](https://github.com/ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/rss_data/cs.CL/2025-10-15_cs.CL.xml)，Git Blob `c9b1ccdd64f07bd0b927a97fd9ed4af7133856dc`；`oai:arXiv.org:2510.12829v1`、`new`、`pubDate=Thu, 16 Oct 2025 00:00:00 -0400` → **2025-10-16**（UTC 日级）。
- **2025-09-16-conjecturing-proving-loop**：cs.LG 的 [固定 RSS XML](https://github.com/ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/rss_data/cs.LG/2025-09-18_cs.LG.xml)，Git Blob `656cf8b9ed59b9af3050a6897a6d152ea16e87b4`；`oai:arXiv.org:2509.14274v1`、`new`、`pubDate=Fri, 19 Sep 2025 00:00:00 -0400` → **2025-09-19**（UTC 日级）。
- **2025-06-24-prover-agent**：cs.AI 的 [固定 RSS XML](https://github.com/ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/rss_data/cs.AI/2025-06-25_cs.AI.xml)，Git Blob `eb1e561e020a3d608dc4bfc160b38c6a7e08827a`；`oai:arXiv.org:2506.19923v1`、`new`、`pubDate=Thu, 26 Jun 2025 00:00:00 -0400` → **2025-06-26**（UTC 日级）。

本批特别注意**镜像路径日期并不总等于发布者条目日期**：RLMEval 的 10 月 29 日文件标注 10 月 30 日；GPT-5 研究的 10 月 15 日文件标注 10 月 16 日；CPL 的 9 月 18 日文件标注 9 月 19 日；Prover Agent 的 6 月 25 日文件标注 6 月 26 日。因此只能采用条目声明的 UTC 公告**日**，不把归档文件名、镜像提交时刻、RSS 标准化零时当作实际公开秒数。

## 唯一未决

**Aristotle**（arXiv:2510.01346，主分类 cs.AI）检查 2025-10-01 至 10-14 的 14 份固定 cs.AI XML（含部分空档与零字节）。没有找到论文 v1 GUID 与主分类 `new` 完整匹配的原始条目。该负结果只表明当前这条历史重放链未恢复足够的证据，**不能断言论文没有公告**，也不能以 10 月 1 日提交时刻、后续 v2 或通常公告惯例推断其首次公开日。后续应尝试第一方固定日期公告列表或作者同期直接 v1 公开声明，有新证据再重访。

## 数据与审查边界

仅在四条既有新闻中追加 `chronology.milestone` 的 `eventKind=paper-release`、`precision=day`、`evidenceKind=arxiv-announcement` 和官方 RSS 类别 URL；不加 `at` 或 `earliestVerifiedPublic`。原有 `id`、`publishedAt`、永久链接、来源、摘要及评分均不变，另外 **475** 条 JSONL 记录字节不变，全部 479 个 ID 唯一。没有执行数学证明、Lean kernel 或不相关仓库的写操作。

固定路径、观测字段和未决再采证路径详见 [Batch54 JSON 回执](evidence/arxiv-clocked-batch54.json)。批次完成后的冻结队列应为：98 条中 54 条已有 chronology、27 条已检查未决、17 条尚未核、0 技术 BLOCKED、44 条仍缺 chronology；下一条 `2025-04-30-deepseek-prover-v2`。以上统计须以最终合并后 main 为准。**只有 Hosted CI、CodeQL、审查线程实际验收完成才允许 Squash Merge。**
