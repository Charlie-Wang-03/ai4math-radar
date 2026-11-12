# Issue #151｜Batch52 arXiv 旧时间证据核验（冻结行 67–71）

执行日期：**2026-11-12 UTC**。按任务优先级先合并 2026-11-11 UTC 每日新闻 [PR #175](https://github.com/Charlie-Wang-03/ai4math-radar/pull/175)，Squash Merge `030aca52a5b59163828f91bd9f94cb594bc8ba28`，再以最新 `main` 为基线建立此独立审计分支。冻结清单 [Issue #151](https://github.com/Charlie-Wang-03/ai4math-radar/issues/151) 共 98 条；[Issue #127](https://github.com/Charlie-Wang-03/ai4math-radar/issues/127) 两项独立疑难不混入计数。

## 本批五条结果

| 冻结行 | 新闻 ID | 旧 `publishedAt` 原始含义 | 核实的主分类 v1/new 日期（UTC，**仅日级**） | 结果 |
| --- | --- | --- | --- | --- |
| 67 | `2026-04-25-e8-sphere-packing-gauss` | 2026-04-25 23:27:10Z，arXiv v1 提交 | **2026-04-28**，math.MG | ADOPTED_DAY_ONLY |
| 68 | `2026-04-17-discover-prove-hard-mode` | 2026-04-17 08:40:48Z，arXiv v1 提交 | **2026-04-20**，cs.AI | ADOPTED_DAY_ONLY |
| 69 | `2026-03-27-formalproofbench` | 2026-03-27 21:14:53Z，arXiv v1 提交 | 未能核实，cs.AI | UNRESOLVED |
| 70 | `2026-03-20-opus46-rocq-putnam` | 2026-03-20 18:25:42Z，arXiv v1 提交 | 未能核实，cs.LG | UNRESOLVED |
| 71 | `2026-03-05-gemini-cosmic-string-discovery` | 2026-03-05 02:15:04Z，arXiv v1 提交 | **2026-03-06**，cs.AI | ADOPTED_DAY_ONLY |

## 固定原始发布者 RSS 证据

使用公开 [ehijano/rss_fetch@`e597e5120c034115fda2049d72812f2da7f99f3a`](https://github.com/ehijano/rss_fetch/tree/e597e5120c034115fda2049d72812f2da7f99f3a) 中固定版本的 **34 份不同分类/日期 XML 快照**，通过 GitHub 只读接口全文采集并在文件级固定 Git Blob SHA-1。该第三方 GitHub 仓库是**原 arXiv RSS 发布者字段的重放载体**，不是 arXiv 原始现场抓包。镜像文件名、Git commit 时间与 RSS 规范化的午夜时刻均**不构成首次公开的精确秒数**。每份 XML 路径、40 位 Git Blob SHA、固定 URL、对五条记录的核验结果归档在 [Batch52 证据 JSON](evidence/arxiv-clocked-batch52.json)。

### 三项获得 v1/new 匹配

- **维数 8 球堆积形式化（2604.23468）**：`math.MG/2026-04-27_math.MG.xml`（Blob `4284ec808030464d7346304d000e031ed5737cb9`）包含 `link=https://arxiv.org/abs/2604.23468`，v1 旧题名 *A Milestone in Formalization: The Sphere Packing Problem in Dimension 8*，GUID `oai:arXiv.org:2604.23468v1`、主分类 `math.MG`、`announce_type=new`，发布者 `pubDate=Tue, 28 Apr 2026 00:00:00 -0400`。**采纳 4 月 28 日**。4 月 28 日快照则为 v2/replace 与 4 月 29 日 pubDate，不能当 v1 首次公告。当前 arXiv 页面更名为 *Progress in Formalizing Sphere Packing in Dimension 8*，旧题名与新版不同不应造成版本误配。
- **Discover and Prove（2604.15839）**：`cs.AI/2026-04-20_cs.AI.xml`（Blob `6639a6caaa03a6aafacf440f875849a01b00a0e6`）匹配论文 ID、完整 v1 标题、GUID `oai:arXiv.org:2604.15839v1`、主分类 `cs.AI`、`announce_type=new`、`pubDate=Mon, 20 Apr 2026 00:00:00 -0400`。**采纳 4 月 20 日**；与 v1 提交日 4 月 17 日分离。
- **Gemini 宇宙弦解析发现（2603.04735）**：`cs.AI/2026-03-06_cs.AI.xml`（Blob `fc7e6ed2fd1608949cde7e7752802d216b9e4446`）匹配完整 v1 标题、`oai:arXiv.org:2603.04735v1`、`cs.AI`、`new`、`pubDate=Fri, 06 Mar 2026 00:00:00 -0500`。**采纳 3 月 6 日**；与 v1 提交日 3 月 5 日分离。

以上仅采用**发布者声明的 UTC 日级公告时间**，并保留全部来源版本、GUID、主分类。由于第三方档案重放与 RSS 定义的日历时刻不是实际发布秒级证据，因此只写 `precision=day`，不写 `at`，不凭此设置 `earliestVerifiedPublic`。也未独立核验任何数学定理或 Lean/Rocq kernel。

### 两项仍未解决

- **FormalProofBench（2603.26996）**：检查 `cs.AI` 2026-03-27–04-04 的九份固定快照，包含非空大文件，但均未匹配标题/版本/主分类一致的 v1/new；部分为零字节或只有 feed 框架。**UNRESOLVED**，不把周五 v1 提交时钟当公布时钟。下一路径：arXiv 同期 `cs.AI` original new 日级公告列表、独立保留的首次报告或作者同期可核验公告。
- **Opus 4.6 + Rocq Putnam（2603.20405）**：检查 `cs.LG` 2026-03-20–28 的九份固定快照，未检出匹配 v1/new；其他类别可能存在 cross-list，但不能借 cross 日期证明主分类首次公告。**UNRESOLVED**。下一路径：arXiv `cs.LG` 原始 new listing 或固定作者原始公开页，`cs.LO` 交叉列表须单独标记其性质。

“限定历史快照未命中”不意味着公开时刻不存在；不能对上述两项估算 20:00 ET 或取 `min(date)`。

## 数据边界与回归验收

只为三条已核实记录在 `portable/content/selected.jsonl` 中**追加** `chronology.milestone`：

`eventKind=paper-release`，`precision=day`，`evidenceKind=arxiv-announcement`，对应官方 RSS 类别的 `evidenceUrl`。

保留旧 ID、`publishedAt`、原始 URL、permalink、评分、标题、摘要等兼容字段；**445/448 其他 JSONL 行字节不变**。另添加本审计文档与固定 JSON 证据回执，不改变 schema、UI、运行时、调度、Secrets、权限或其他仓库。

**冻结队列重新计算**：总数 **98**，已补 chronology **47**（原 44 +3），已查未决 **24**（原 22 +2），技术性阻塞 **0**，未检查 **27**（原 32 -5），仍缺 chronology **51**（24 +27）。下一条 `2026-03-04-math-concepts-multiagent`。

只有托管 CI、内容解析、静态构建、Docker、CodeQL、时间线回归与审查线程全部符合分支要求后，才可执行 Squash Merge；本文件不预先声称它们已成功。合并后 Issue #151 应附上最终审计回执。
