# Issue #151｜Batch53 arXiv 历史时间证据核验（冻结清单 72–76）

执行日期：**2026-11-13 UTC**。已先完成 2026-11-12 UTC 新闻日报 [PR #177](https://github.com/Charlie-Wang-03/ai4math-radar/pull/177)，Squash Merge `d00e9d46994c53b7067b6f3b7225ec7913e1013d`，再基于其最新 `main` 创建本独立审计分支。冻结基准共 98 条；Issue #127 的 GenLimitLib 与 Zenodo v3 不在本队列。

## 本批五项

| 冻结行 | 新闻 ID | 原 v1 提交时间 UTC（保留） | 主分类 arXiv 公告日 UTC | 状态 |
| --- | --- | --- | --- | --- |
| 72 | `2026-03-04-math-concepts-multiagent` | 03-04 19:13:36 | **2026-03-06**，cs.AI | ADOPTED_DAY_ONLY |
| 73 | `2026-02-10-aletheia-autonomous-math-research` | 02-10 18:50:15 | **v2/new** 02-12，非 v1/new | UNRESOLVED_VERSION_MISMATCH |
| 74 | `2026-01-24-theoremforge` | 01-24 06:28:11 | **2026-01-27**，cs.AI | ADOPTED_DAY_ONLY |
| 75 | `2026-01-20-numina-lean-agent` | 01-20 14:51:45 | 未检到 v1/new | UNRESOLVED |
| 76 | `2025-12-19-seed-prover-15` | 12-19 06:19:55 | **2025-12-22**，cs.CL | ADOPTED_DAY_ONLY |

## 固定公开时间证据

使用 [`ehijano/rss_fetch@e597e5120c034115fda2049d72812f2da7f99f3a`](https://github.com/ehijano/rss_fetch/tree/e597e5120c034115fda2049d72812f2da7f99f3a) 的固定原始 arXiv RSS 发布者字段重放，**全文读取 49 份不同类别/日期 XML 快照**（多目标共享路径去重），以论文 ID、v1 原题名、v1 GUID、主分类、`announce_type=new`、条目 `pubDate` 同时一致为采用条件。

- **数学概念多智能体（2603.04528）**：[cs.AI/2026-03-06](https://github.com/ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/rss_data/cs.AI/2026-03-06_cs.AI.xml)，Git Blob `fc7e6ed2fd1608949cde7e7752802d216b9e4446`；`oai:arXiv.org:2603.04528v1`，`new`，原始 `pubDate=Fri, 06 Mar 2026 00:00:00 -0500` → 03-06 日级。
- **TheoremForge（2601.17332）**：[cs.AI/2026-01-27](https://github.com/ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/rss_data/cs.AI/2026-01-27_cs.AI.xml)，Blob `cdff6e4f18b8d1b8d2cefb8d4f70560a2200b464`；`oai:arXiv.org:2601.17332v1`，`new`，`pubDate=Tue, 27 Jan 2026 00:00:00 -0500` → 01-27。
- **Seed-Prover 1.5（2512.17260）**：[cs.CL/2025-12-22](https://github.com/ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/rss_data/cs.CL/2025-12-22_cs.CL.xml)，Blob `e2cc33a29ad173da191fcd95b46ac794642e5fd4`；`oai:arXiv.org:2512.17260v1`，`new`，`pubDate=Mon, 22 Dec 2025 00:00:00 -0500` → 12-22。

三项来源均只证实发布者给出的**日级**公告时间，RSS 规范化午夜和重放 GitHub 文件提交时间不证明真实公开秒数。因此只添加 `precision=day` 的 `chronology.milestone`，不写 `at` / `earliestVerifiedPublic`，不修改 `publishedAt`。

## 两项未决与证据边界

- **Aletheia（2602.10177）**：在 [cs.LG/2026-02-12](https://github.com/ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/rss_data/cs.LG/2026-02-12_cs.LG.xml) 恢复主分类 `new`，但条目 GUID 为 **v2**（Blob `06a4ac4849d61caa54884ba439cc061ccbe06cc1`），并非要求的 v1/new。同日 [cs.AI](https://github.com/ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/rss_data/cs.AI/2026-02-12_cs.AI.xml)（Blob `6aed0c7dfe2240bfeb38e73700d9b800ca203a0d`）仅为 **v2/cross**，随后为 replace。不能借 v2/new 推断 v1 首次可访问事件；保留 **UNRESOLVED**，等待固定 v1 首次公开证据。
- **Numina-Lean-Agent（2601.14027）**：检查 cs.AI 与 cs.LG 在 01-20–24、01-26 的同期快照（含大量非空原始 RSS），均未找到匹配 v1/new；保留 **UNRESOLVED**，后续寻找 arXiv 原始公告列表或作者同期固定版本通知。档案未命中不等于论文未公开。

此批核实的是 **公开时间来源**，不构成对任何 arXiv 论文结果或 Lean kernel 的数学核验。

## 数据约束和待验收

仅修改 `portable/content/selected.jsonl` 中上述三条的 `chronology`，保留 461 条中的另 **458 条字节不变**，旧 ID、`publishedAt`、permalink、评分、来源与摘要全部保持。添加本说明与固定证据 JSON，不涉及 schema、运行时、UI、权限、Secrets 或其他仓库。

冻结队列重算：**98** 总项，**50** 已补 chronology，**26** 已查未决，**0** 技术 BLOCKED，**22** 尚未检查；**48** 仍缺 chronology（=26+22）。下一条 `2025-10-29-rlmeval`。仅在所有必需 Hosted CI、CodeQL 和审查线程通过后才允许 Squash Merge；本文档不提前声明成功。
