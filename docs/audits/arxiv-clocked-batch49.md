# Issue #151｜Batch49 arXiv v1/new 公告日期核验（冻结行 52–56）

执行日期：2026-11-09 UTC。已先完成并核验 2026-11-08 每日精选 [PR #168](https://github.com/Charlie-Wang-03/ai4math-radar/pull/168)，Squash Merge `7ef10968152ac54a2381c7695f13b2bb298fa215`，选入 7 条（402 → 409）。本批审计单独基于上述最新 main，不与日报并发修改 JSONL。

| 行 | 原新闻 ID | 原 `publishedAt`（v1 提交，不是已核实公开时刻） | 发布者 RSS 主分类 v1/new `pubDate` 日期（UTC） | 结论 |
| --- | --- | --- | --- | --- |
| 52 | `2026-09-02-qma2-qma-chatgpt` | 2026-09-02T17:50:05Z | **2026-09-03**，quant-ph | ADOPTED_DAY_ONLY |
| 53 | `2026-08-19-ytd-disproof-generative-ai` | 2026-08-19T17:19:43Z | **2026-08-21**，math.DG | ADOPTED_DAY_ONLY |
| 54 | `2026-08-08-petersen-coloring-counterexample` | 2026-08-08T07:32:39Z | **2026-08-12**，math.CO | ADOPTED_DAY_ONLY |
| 55 | `2026-08-06-inverse-generator-kreiss-ai` | 2026-08-06T17:01:43Z | **2026-08-07**，math.FA | ADOPTED_DAY_ONLY |
| 56 | `2026-08-05-schiffer-pompeiu-ai` | 2026-08-05T17:46:17Z | **未核实**，math.AP | UNRESOLVED |

## 原始证据、异常与信任边界

采用 [固定 Git 档案 `ehijano/rss_fetch@e597e5120c034115fda2049d72812f2da7f99f3a`](https://github.com/ehijano/rss_fetch/tree/e597e5120c034115fda2049d72812f2da7f99f3a) 中保留的 arXiv **发布者 RSS 条目**，只读检查 25 份特定日期与主分类 XML。记录完整 `Git Blob SHA-1`、条目的论文链接、原始 v1 标题、`oai:arXiv.org:<id>v1`、`category`、`arxiv:announce_type=new`、`pubDate`，见 [Batch49 固定证据回执](evidence/arxiv-clocked-batch49.json)。

特别强调：历史档案中有 **RSS 快照文件名日期与发布者条目的 `pubDate` 不同**，例如 `2026-08-20_math.DG.xml` 中论文 2608.19301 的条目声明 **Fri, 21 Aug 2026 00:00:00 -0400**；类似地，`math.CO/2026-08-11` 与 `08-12` 两份快照均标注论文 2608.10012 的 `pubDate` 为 **Wed, 12 Aug 2026 00:00:00 -0400**。采用的是**相符原始条目上明确的 publisher `pubDate` 日期**，不是镜像文件名、Git 提交日期、提交时刻、或假定的惯例公告钟点。不能以捕获文件日期 `min` 替换真实证据。

`2608.06272` 的 RSS v1 标题为 *A counterexample to the inverse generator problem and related questions*，当前 arXiv 页面后续修订显示 *A solution to the inverse generator problem and related questions*；按原始 v1 标题核验，没有把版本标题差异误当作新论文。

`2608.05114` Schiffer/Pompeiu 论文在 2026-08-05、06、07、08、10、11、12、13、14 的限定 `math.AP` 历史快照中未找到完全相符 `v1/new` 记录。该档案阴性结果**不证明没有首次公告，也不支持推断公告日**，因此不修改该新闻行，保留 `UNRESOLVED`。下一次仅在获得新的原始同期来源或其他可复现采证路径时继续。

本审计 **只核实论文主分类 v1/new 公告日期**；绝不将其等同数学结果的独立审稿、QMA 分离的无条件证明、YTD 反例的社区公认、SAT/DRAT 重跑或 Lean kernel 独立复现。

## 数据兼容、进度与验收

仅四条确认记录各追加日级 `chronology.milestone` 和一条简短日期澄清；旧 `id`、`publishedAt`、链接、评分、分类、permalink 等保留。没有填写没有证据的 `at` 或 `earliestVerifiedPublic`；包含 Schiffer 行在内的其余 **405 条记录字节不变**，409 条唯一 ID 不变。未改变 UI、API、schema、Secrets、调度或运行时。

冻结 98 条的累计状态：**38** 已补 chronology、**18** 已核查但未决、**0** 技术受阻、**42** 尚未检查；**60** 仍缺 chronology。下一条未检查：`2026-08-04-degree-diameter-gpt56`。Issue #127 的 GenLimitLib 和 Zenodo Arad–Herzog v3 是独立历史疑难项，不纳入本基准。

以实际 GitHub Hosted `content:check`、`build:static`、历史日期回归、全部适用 CI/CodeQL、无未解决审查线程作为 Squash Merge 的必要条件；CI 尚在运行时不得合并。
