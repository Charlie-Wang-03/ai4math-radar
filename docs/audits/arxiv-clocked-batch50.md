# Issue #151｜Batch50 arXiv 首次主分类 v1/new 日期核验（冻结行 57–61）

执行日期：2026-11-10 UTC。先确认 **2026-11-09 每日精选 PR #170** 已合并为 ff9a047833a4fbc88c5e8c232a2f31f889b67b99，并据此新建独立审计分支。冻结基准共 98 项。

| 冻结行 | 新闻 ID | 提交时刻（旧 publishedAt，仅兼容） | arXiv 原始 RSS v1/new 公告日期（仅日级） | 结论 |
| --- | --- | --- | --- | --- |
| 57 | `2026-08-04-degree-diameter-gpt56` | 2026-08-04T17:30:09Z | **2026-08-05**，math.CO | ADOPTED_DAY_ONLY |
| 58 | `2026-07-28-kemeny-three-voters-gpt56` | 2026-07-28T10:20:56Z | **2026-07-29**，cs.GT | ADOPTED_DAY_ONLY |
| 59 | `2026-07-27-feige-conjecture-gpt56` | 2026-07-27T15:07:59Z | **2026-07-28**，math.PR | ADOPTED_DAY_ONLY |
| 60 | `2026-07-22-cerny-one-cluster-codex` | 2026-07-22T02:24:35Z | **2026-07-23**，cs.FL | ADOPTED_DAY_ONLY |
| 61 | `2026-07-21-chernoff-density-gpt56` | 2026-07-21T01:39:27Z | **未核实**，math.PR | UNRESOLVED |

## 可溯源证据与边界

原始公告字段保留于固定 [ehijano/rss_fetch@e597e5120c034115fda2049d72812f2da7f99f3a](https://github.com/ehijano/rss_fetch/tree/e597e5120c034115fda2049d72812f2da7f99f3a) 镜像。使用 GitHub 连接器按固定 Commit 完整读取 **19 份不重复 XML 快照**；每项采用新闻均完全匹配论文编号、原始 v1 标题、v1 GUID、主分类、`announce_type=new` 与原始 `pubDate`。逐个文件及 Git Blob SHA-1 见 [固定证据回执](evidence/arxiv-clocked-batch50.json)。**档案仓库提交时间不等于 arXiv 公开时间；RSS 规范化零时不证明精确公开秒数。**

Černý 论文的原始 RSS 出现在 2026-07-22 与 07-23 两份归档中，但条目均明确写 `Thu, 23 Jul 2026 00:00:00 -0400`；采用发布者声明的 **07-23 日期**，不是镜像捕获日期。未发现本轮其余三项在受检相邻快照中的矛盾公告日期。

Chernoff 论文 `2607.18619` 在限定的十份 **2026-07-21 至 07-30 math.PR** 快照中未出现匹配 v1/new；这是档案未命中，不能推断尚未公开或认定原提交钟点为公告时间。继续保持 **UNRESOLVED**，仅在获取新的原始同期证据或新的采证路径时重访。

该批只审核**日期证据**，不宣称独立验证 Bollobás、Feige、Černý 或 Chernoff 数学证明、Lean 工件或 AI 贡献声明。

## 兼容与验收

仅 4 条确认项目新增日级 `chronology.milestone`，**没有** `at` 或 `earliestVerifiedPublic`，未改旧 `publishedAt`、ID、来源 URL、permalink、评分。总数 420、唯一 ID 420；其他 **416 条字节保持不变**。无 UI、API、schema、权限或调度修改。

冻结队列累计 **42 已补 chronology / 19 已核查仍待核 / 0 技术受阻 / 37 未检查**，故 **56 仍缺 chronology**。下一项：`2026-06-09-moonshine-conjecture-agent`。Issue #127 的两项难题另行计数。

需要全部适用 GitHub Hosted CI、CodeQL 与审查线程完成后才能 Squash Merge；此文档本身不是 CI 成功证明。
