# Batch 44｜Issue #151 旧 arXiv 提交时刻核对（冻结第 27–31 条）

核验：**2026-11-04 UTC**；原 `main@401db9549864651ab66af5c948ff963a0ca535ed` 为每日新闻 [PR #158](https://github.com/Charlie-Wang-03/ai4math-radar/pull/158) 合并后状态。本审计独立提交。

| 冻结序号 | 新闻 ID / arXiv | 原 submittedAt (`publishedAt`) | 核实 v1/new 公告日 | 审计结论 |
| --- | --- | --- | --- | --- |
| 27 | `2026-09-21-permuformer` / 2609.25438 | 2026-09-21T21:48:39Z | 未找到原始公告 | UNRESOLVED |
| 28 | `2026-09-21-lean-pool` / 2609.25199 | 2026-09-21T17:57:30Z | **2026-09-24**（cs.AI） | ADOPTED_DAY_ONLY |
| 29 | `2026-09-21-endless-exam` / 2609.24555 | 2026-09-21T13:19:36Z | 未找到 v1/new；仅见 09-29 v2/replace | UNRESOLVED |
| 30 | `2026-09-19-self-organizing-agent-teams` / 2609.22682 | 2026-09-19T01:27:40Z | 未找到原始公告 | UNRESOLVED |
| 31 | `2026-09-17-strong-secretary-linear-matroids` / 2609.20797 | 2026-09-17T17:54:37Z | **2026-09-18**（cs.DS） | ADOPTED_DAY_ONLY |

## 一手字段与镜像限制

只读核验历史 [`ehijano/rss_fetch@e597e5120c034115fda2049d72812f2da7f99f3a`](https://github.com/ehijano/rss_fetch/tree/e597e5120c034115fda2049d72812f2da7f99f3a) 的原 arXiv RSS XML；镜像是**第三方对发布者原始数据的留存**，不等于 2026 年重新获取的原站原始 HTTP 响应。Lean Pool 在 09-23、09-24 两份副本重复出现相同 `oai:arXiv.org:2609.25199v1`、`Announce Type: new`、`<category>cs.AI</category>` 与 `pubDate=Thu, 24 Sep 2026 00:00:00 -0400`。Strong Secretary 在 09-17、09-18 两份副本中重复出现相同 `v1/new`、`cs.DS` 与 `pubDate=Fri, 18 Sep 2026 00:00:00 -0400`。不同文件的重复并**非日期冲突**。Endless Exam 仅捕捉到 09-29 cs.AI 的 `v2/replace`，不得替代 v1/new。另三项只依据有界快照未命中，均未认证首次公告或绝对最早公开日。

来源固定 Git commit、12 个原始源路径 / SHA-1 和逐项目观测写入 [永久证据回执](evidence/arxiv-clocked-batch44.json)。**RSS 标准化 00:00:00 -0400 不是论文真实公开秒，镜像 Git commit/采集时刻也不是论文公开秒**。只采用日精度 `chronology.milestone`，不添加 `at` 或 `earliestVerifiedPublic`。原 ID、`publishedAt`、永久链接、原始 URL、类别与得分均保持，修改的恰为五条既有摘要和其中两条的可选 chronology；其余 **354 条旧 JSONL 行原字节不变**。本审计**不**验证论文证明、专家审查或机器证明真实性。

## 队列累计状态

冻结 98 = 已采用补充 chronology **16** + 已检查未决 **15** + 技术性阻塞 **0** + 从未检查 **67**；仍缺 chronology **82**。下一条 `2026-09-17-hjo-conjecture-axiomprover`。Issue #127 的 GenLimitLib 和 Zenodo v3 仍另计。

本 PR 仅修改 `selected.jsonl` 五行和新增审计文档、固定回执、回归测试。必须完成 GitHub Hosted CI（`content:check`、`build:static`、安全检查）、Review 后才能 Squash Merge。