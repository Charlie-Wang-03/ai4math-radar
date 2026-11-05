# Batch 45｜Issue #151 arXiv 投稿时刻与首次主分类公告审计（冻结行 32–36）

审计日期 **2026-11-05 UTC**；前置当日收录 PR #160 已合并，审计从最新 `main@d8621558c2cce359c70129288cf3d1165e2ad297` 独立分支执行。本次核验 5 条，采用 4 个可追溯日级主分类 `v1/new` 公告里程碑，保留 1 个未决项。冻结清单（98 条）见 `docs/audits/evidence/issue151-clocked-arxiv-baseline.tsv`。

| 冻结序号 | 新闻 ID / arXiv | 原 `publishedAt`（v1 投稿，不代表公开） | 首次匹配主分类 v1/new 公告日（UTC） | 结论 |
|---|---|---|---|---|
| 32 | `2026-09-17-hjo-conjecture-axiomprover` / 2609.20567 | Sep 17, 15:28:54Z | **Sep 18**，math.NT | ADOPTED_DAY_ONLY |
| 33 | `2026-09-17-formalflow-mipstar` / 2609.19814 | Sep 17, 07:26:49Z | **Sep 18**，quant-ph | ADOPTED_DAY_ONLY |
| 34 | `2026-09-17-talagrand-operator-cotype` / 2609.19731 | Sep 17, 05:42:08Z | **Sep 18**，math.PR | ADOPTED_DAY_ONLY |
| 35 | `2026-09-16-browning-sawin` / 2609.18879 | Sep 16, 16:14:25Z | 未确证 | **UNRESOLVED** |
| 36 | `2026-09-14-stellar-colosseum` / 2609.15983 | Sep 14, 17:58:55Z | **Sep 15**，cs.AI | ADOPTED_DAY_ONLY |

## 原始证据与语义

全部来源来自 `ehijano/rss_fetch@e597e5120c034115fda2049d72812f2da7f99f3a` 固定第三方 Git 档案，其 XML 项字段复刻 arXiv 发布者 RSS，不是本次在 2026-09 原地抓取的历史 HTTP 响应。**第三方 Git commit 与采集时间并非论文发布时间**。Git Blob SHA-1、来源路径、全量可读性、匹配的标题、v1 GUID、`announce_type`、主分类和 `pubDate`，参见 [Batch45 固定回执](evidence/arxiv-clocked-batch45.json)。

匹配项与采纳日源：

- HJO [原始 math.NT v1/new](https://github.com/ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/rss_data/math.NT/2026-09-18_math.NT.xml)：`oai:arXiv.org:2609.20567v1`、`math.NT`、`Fri, 18 Sep 2026 00:00:00 -0400`。math.AG 同期 `cross` 不替代首次主分类 `new`。
- FormalFlow [原始 quant-ph v1/new](https://github.com/ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/rss_data/quant-ph/2026-09-18_quant-ph.xml)：`oai:arXiv.org:2609.19814v1`、`quant-ph`、`Fri, 18 Sep 2026 00:00:00 -0400`。
- Talagrand [原始 math.PR v1/new](https://github.com/ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/rss_data/math.PR/2026-09-18_math.PR.xml)：`oai:arXiv.org:2609.19731v1`、`math.PR`、`Fri, 18 Sep 2026 00:00:00 -0400`。math.FA 复本为 `cross`。
- Stellar [原始 cs.AI v1/new](https://github.com/ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/rss_data/cs.AI/2026-09-15_cs.AI.xml)：`oai:arXiv.org:2609.15983v1`、`cs.AI`、`Tue, 15 Sep 2026 00:00:00 -0400`。此 XML 大于标准文本接口读取限制，采用固定 Git blob SHA `00de42a5149718d84e2c917b1904292014bba583` 全量只读解析。次日 cs.AI 另见 `v2/new` 项，cs.LG 是 `v2/replace-cross`，cs.CL 在 Sep15 是 `v1/cross`，均不得取代已匹配的 **v1/new Sep15** 公告日期；该平台条目存在版本与类型异常，已如实保留。

**Browning–Sawin**：有界检查 math.NT 主分类 Sep17/18/21/22 与 math.AG 交叉分类 Sep17/18/22/23 原始档案，无相符的 v1/new；状态保持 **UNRESOLVED_NO_MATCHING_V1_NEW**。该事实既不能证明论文未在其他日期公开，也不能用论文 v1 投稿 09-16 秒数宣称公开，不能根据惯例直接推断 09-17 或 09-18。下一次仅在找到新的可靠原站记录、固定主分类档案或另一种独立同期证据时复查，避免无意义重复请求。

## 兼容、证据边界与验收

四条采用的新增字段仅为 `chronology={eventKind:"paper-release", milestone:{date,precision:"day",evidenceKind:"arxiv-announcement",evidenceUrl:"https://rss.arxiv.org/rss/<primaryCategory>"}}`，不添加 `at` 或 `earliestVerifiedPublic`。五条摘要明确旧时刻属性。所有 **370 条**既有记录的 ID、`publishedAt`、原来源链接、永久链接、得分、排序属性不变；仅冻结清单对应的 **5 行**发生变化，其他 **365 行**原字节不变。RSS 内的标准化 `00:00:00 -0400` 用于标示**公告日**，绝非真正的公开时分秒。

本次是发布时间来源审查，**没有独立验证** HJO、MIP* = RE 形式化、Talagrand 反例或其他论文结论的数学正确性，不能将形式证书、AI 生成与专家审查混淆。Issue #127 两例（GenLimitLib / Zenodo v3）独立排队。

冻结队列累计：**98 = 20 已补 chronology + 16 已核查未决 + 0 技术受阻 + 62 尚未检查**。**仍缺 chronology 78**（与尚未检查 62 并非同一指标）。下一条：`2026-09-13-quantum-olympiad-geometry`。

提交到受保护 main 前要求 GitHub Hosted `content:check`、`build:static`、静态回归、安全检查、审查线程和 PR clean 全部确认。合并后核对 main、队列进度以及 Pages 部署，不以本地未执行的测试冒充已通过。
