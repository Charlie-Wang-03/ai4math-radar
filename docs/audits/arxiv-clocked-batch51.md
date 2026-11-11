# Issue #151｜Batch51 arXiv 主分类首次 v1/new 日期核验（冻结行 62–66）

执行日期：**2026-11-11 UTC**。先确认 **2026-11-10 UTC 新闻 PR #172** 已合并为 `1e20d56d26d5e6d4ddc0d53562145c39a7a76acc`，再从最新 `main` 创建独立审计分支。冻结清单共 98 条。

| 冻结行 | 新闻 ID | 原存精确钟点的语义 | 匹配的原始 RSS v1/new 公告日（仅日级） | 结果 |
| --- | --- | --- | --- | --- |
| 62 | `2026-06-09-moonshine-conjecture-agent` | arXiv v1 提交 06-09T12:50:56Z | **2026-06-10**，cs.AI | ADOPTED_DAY_ONLY |
| 63 | `2026-06-04-llm-lean-formalization-eval` | arXiv v1 提交 06-04T02:59:39Z | **2026-06-05 与 06-06 冲突**，cs.AI | UNRESOLVED |
| 64 | `2026-05-21-alphaproof-nexus-open-research` | arXiv v1 提交 05-21T17:24:57Z | **2026-05-23**，cs.AI | ADOPTED_DAY_ONLY |
| 65 | `2026-05-07-deepmind-ai-co-mathematician` | arXiv v1 提交 05-07T17:56:32Z | 未找到 v1/new；找到 05-14 的 v2/replace | UNRESOLVED |
| 66 | `2026-04-27-qed-open-problems-multiagent` | arXiv v1 提交 04-27T04:10:02Z | 未找到 v1/new；找到 05-01 的 v2/replace | UNRESOLVED |

## 原始时间证据

从固定的 [ehijano/rss_fetch@e597e5120c034115fda2049d72812f2da7f99f3a](https://github.com/ehijano/rss_fetch/tree/e597e5120c034115fda2049d72812f2da7f99f3a) 只读读取完整 **26 份 cs.AI XML 快照**。该第三方仓库只作为**原始 arXiv RSS 发布者字段的重放容器**；其文件名日期、Git blob 创建或抓取时间不是论文首次公开时刻。逐文件 Git Blob SHA、匹配原始标题、论文 ID、v1 GUID、主分类、`announce_type` 及 `pubDate` 载于 [Batch51 固定证据回执](evidence/arxiv-clocked-batch51.json)。

- **Moonshine（2606.10806）**：06-09 和 06-10 两份快照均引用同一 Git blob `ed0e3e1e...`，论文编号、完整题名、`oai:arXiv.org:2606.10806v1`、`cs.AI`、`new` 与发布者 `Wed, 10 Jun 2026 00:00:00 -0400` 一致；采用 **2026-06-10 日级**。
- **AlphaProof Nexus（2605.22763）**：05-22 和 05-23 两份快照均引用同一 Git blob `c1d5e093...`，相同六字段匹配，发布者 `Sat, 23 May 2026 00:00:00 -0400`；采用 **2026-05-23 日级**。这是论文公告日，不涉及把其后新版作为首次公开。
- **Lean 评测（2606.05632）**：06-04/05 快照的相同 v1/new 项标记 `Fri, 05 Jun 2026 00:00:00 -0400`，而 06-06 快照的相同论文编号、题名、GUID、主分类与 v1/new 标记却显示 `Sat, 06 Jun 2026 00:00:00 -0400`。**不能使用 min(date) 或 RSS 文件名消除冲突**；保留 UNRESOLVED，后续需独立的官方日期归档或证明源回放差异原因。
- **AI co-mathematician（2605.06651）**：05-07 至 05-13 七份快照未取得 v1/new。05-13 文件中 05-14 的 `v2/replace` 不能替代首次 v1/new。
- **QED（2604.24021）**：04-26 至 05-02 七份快照未取得 v1/new；04-30/05-01 文件中 05-01 的 `v2/replace` 同样不能借用。

仅 RSS 中已经确认的日级日期被采纳，**不将 XML 规范化零时写入 `at`**，也不设置缺乏独立证明的 `earliestVerifiedPublic`。本批只核验公开时间证据，不声称核实论文数学证明、模型能力、Lean 工件或发表优先权。

## 修改边界、计数与验收

日报先合并后，规范化语料 **435 条**。本审计只对上述两条确认记录添加 `chronology.milestone`；保留历史 `publishedAt`、新闻 ID、原始链接、permalink、分数和其他既有语义；其余 **433 条记录字节保持不变**。附加本说明与证据回执，不更改 UI、运行时、内容 schema、调度、Secrets 或仓库权限。

冻结队列重新核算：**98 总项 = 44 已补 chronology + 22 已检查未决 + 32 尚未检查**，共 **54 条仍缺 chronology**，本批技术性 BLOCKED 为 0。下一项：`2026-04-25-e8-sphere-packing-gauss`；Issue #127 两条独立证据难题不计入此队列。

**合并条件**：目标 PR 的全部必需 GitHub Hosted CI（content/static、Docker、CodeQL 等）、审查线程和分支保护实查通过后才能 Squash Merge。此文档不构成 CI 通过或未来部署的证明。
