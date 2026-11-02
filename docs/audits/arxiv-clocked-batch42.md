# Batch 42｜arXiv 带秒旧时间核验（冻结清单第 17–21 条）

执行日期：**2026-11-02 UTC**。关联 [Issue #151](https://github.com/Charlie-Wang-03/ai4math-radar/issues/151)；冻结清单 `docs/audits/evidence/issue151-clocked-arxiv-baseline.tsv`，始终与 [Issue #127](https://github.com/Charlie-Wang-03/ai4math-radar/issues/127) 的两项独立难点分离。

## 结果及范围

| 冻结行 | ID / arXiv | 状态 | 依据或限制 |
| --- | --- | --- | --- |
| 17 | `2026-09-28-mathagent` / `2609.34460` | **TECHNICAL BLOCKED** | cs.AI 9/28 原始 RSS 镜像未见该 ID；9/29、9/30 大于当前连接器单文件读取上限，不能据此确定公告日。 |
| 18 | `2026-09-27-break-judges` / `2609.33773` | **TECHNICAL BLOCKED** | 同上；不能以 arXiv v1 提交时刻或网页“发布”标签替代 `new`。 |
| 19 | `2026-09-27-riemann-zeros-distinct` / `2609.33043` | **ADOPTED** | math.NT 的原始 RSS 条目拷贝精确匹配题名、编号、v1 GUID、`new`，公告日期为 **2026-09-29**，日精度。 |
| 20 | `2026-09-26-jepa-lean-search` / `2609.32908` | **TECHNICAL BLOCKED** | cs.LG 9/28 读取成功未见 ID；9/29、9/30 大文件读取失败，无可采用的公告日。 |
| 21 | `2026-09-26-oracleladder` / `2609.32235` | **TECHNICAL BLOCKED** | cs.CL 9/28 读取成功未见 ID；9/29、9/30 大文件读取失败，无可采用的公告日。 |

所有 source paths、三份成功读取的 math.NT 原始 XML 的 Git blob SHA-1、元数据、受阻项目及累计计数均在 [固定回执](evidence/arxiv-clocked-batch42.json)。固定第三方历史镜像：`ehijano/rss_fetch@e597e5120c034115fda2049d72812f2da7f99f3a`。镜像 Git 提交时间、采集文件名、arXiv RSS 标准化零时均非真实公告瞬间；它是对历史发布者 RSS 内容的重放载体，不是历史时刻新直连的 arXiv 回复。

## 唯一证据充分的采用：2609.33043v1

arXiv [原始论文页](https://arxiv.org/abs/2609.33043) 将 `2026-09-27T00:19:21Z` 标为 **Submission history [v1]**，并另列 v2 更新，不能把这一个带秒时刻称为公开时刻。

冻结的 [math.NT 原 RSS XML 第 236–249 行](https://github.com/ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/rss_data/math.NT/2026-09-29_math.NT.xml#L236-L249) 包含：
- 逐字匹配的标题 `More than 83.69% of the zeros of the Riemann zeta function are distinct`；
- `https://arxiv.org/abs/2609.33043`，`oai:arXiv.org:2609.33043v1`，description 的 `arXiv:2609.33043v1 Announce Type: new`；
- 主分类 `math.NT`，`arxiv:announce_type=new`，`pubDate=Tue, 29 Sep 2026 00:00:00 -0400`。

同源相邻 **9/28、9/30 math.NT** 镜像完整读出，无同 ID 的其他 `new` 日期（仅针对本次限域快照，不能证明绝对全球最早公开）。因此仅采用 `chronology.eventKind=paper-release` 与 `milestone.date=2026-09-29, precision=day, evidenceKind=arxiv-announcement`；**不添加 `at`，也不推断 `earliestVerifiedPublic`**。RSS 00:00 是标准化日期表达，不是论文当天真实可访问的 04:00 UTC 精确时刻。原新闻 ID、`publishedAt`、permalink、原链接、评分不变；摘要增加该界限解释。论文的 Riemann ζ 零点结果或 Lean 定理是否正确，不属于此次时间采证结论。

## 技术受阻四条、审计进度与后继

对 cs.AI、cs.LG、cs.CL 的历史原 RSS 9/28 文件，限定读取成功且未匹配；9/29 和 9/30 的对应原始 XML 由于连接器报告 `file may be too large`，**并未读全，绝不标成“无公告”或日期冲突**。下一可复现路径：限额分块采集或 Hosted 只读快照检索、哈希证据回执，必要时核对其他同源 `new` 日期；禁止从镜像缺席或提交时间推断日子。本批不建立持续基础设施，也不修改其四条新闻。

冻结 98 条在本批后：已采用补充 chronology **8**；前批已核查仍待证据 **9**；本批技术阻塞 **4**；尚未启动检查 **77**；总缺 chronology **90**（9 + 4 + 77）。下一条未触及 ID：`2026-09-26-compassplay`。#127 的两条难点仍独立未解。新增日常新闻数据的 341 条基线不因上述 98 条冻结样本变化而重新定义候选集合。

## 验收

此审计 PR 单独提交；理论上仅一条旧新闻摘要与可选 chronology 变化、其余记录逐字节保留。新增文档、证据回执及聚焦回归测试。不更改 `publishedAt`、历史永久链接、运行时/UI、调度、Secrets、证据强度定义或 schema。由 GitHub 托管检查与审查确认；未在本执行环境声称本地完整 `npm` 测试已运行。
