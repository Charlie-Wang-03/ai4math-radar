# Issue #151｜Batch48 arXiv 公告时间证据核验（冻结行 47–51）

执行日期：2026-11-08 UTC。先合并 2026-11-07 日报 PR #166（Merge Commit `830e308db0292899798af8ac2d09953dbd7b59bd`，新增 14 条，388 → 402），再从已核验的 main 独立建本审计分支。

| 冻结行 | 新闻 ID | 旧 v1 提交时刻（UTC；保留 publishedAt） | 已确认主分类首次 v1/new 公告日（UTC） | 原始类别 |
| --- | --- | --- | --- | --- |
| 47 | `2026-09-07-complex-grothendieck-odin` | `2026-09-07T03:46:43.000Z` | **2026-09-09** | `math.FA` |
| 48 | `2026-09-05-erdos-1040-gpt6-astra` | `2026-09-05T12:11:52.000Z` | **2026-09-09** | `math.CA` |
| 49 | `2026-09-03-autographforge` | `2026-09-03T07:35:29.000Z` | **2026-09-04** | `cs.AI` |
| 50 | `2026-09-02-trautman-chatgpt-counterexample` | `2026-09-02T22:29:48.000Z` | **2026-09-04** | `math.CV` |
| 51 | `2026-09-02-daykin-frankl-gpt56` | `2026-09-02T18:59:51.000Z` | **2026-09-04** | `math.CO` |

## 原始证据与信任边界

通过第三方固定历史 RSS 镜像 `ehijano/rss_fetch@e597e5120c034115fda2049d72812f2da7f99f3a` 的 Git Blob **全文只读**核对 15 份同类别、前后相邻日期 XML，五篇分别唯一匹配论文链接、完整标题、`oai:arXiv.org:<id>v1` GUID、主分类、`announce_type=new` 和发布者 `pubDate`。各条的完整标题原始字节（包括 Erdős 的 TeX 转义）、来源 Git Blob SHA-1、邻日阴性快照和完整固定 URL 见 [Batch48 JSON 回执](evidence/arxiv-clocked-batch48.json)。

五项采用的是发布者**原始来源声明的公告日**，不是 RSS 标准化 `00:00:00 -0400` 所对应的真实发布秒数。镜像自身 Git Commit 时间不是论文公告时刻。arXiv 的原文 `Submission history [v1]` 时分秒与原 `publishedAt` 相同，并不足以验证其为 public-announcement clock。本审计不以 arXiv 工作日惯例推断时间，也未将 cross-list/replacement 冒充原主分类 new。

对于 Odin、Erdős #1040、Trautman、Daykin–Frankl 等重大证明主张，时间公告证据**绝不构成**独立数学审查、计算证书复核或 Lean kernel 证明。AutoGraphForge 论文的 pipeline 是否完全跑通亦没有在本审计中重新验证。

## 改动与累积状态

保持所有旧 ID、原 `publishedAt`、永久链接、原始链接、分类、评分与归属不变，仅向五条既有记录追加日级 `chronology.milestone`（`precision=day`、**没有** `at` 或 `earliestVerifiedPublic`），并在摘要明确原时刻为 v1 提交。冻结数据行以外及其它 **397 行**逐字不变。无全站时间线/运行时/UI/API/schema 更改。

累计冻结 98 条：**34 已补 chronology + 17 已查仍未决 + 0 技术阻塞 + 47 未检查**；**64 仍缺 chronology**。下一条：`2026-09-02-qma2-qma-chatgpt`。Issue #127 两项独立难点未混入上述计数。

仅在实际 Hosted `content:check`、`build:static`、回归测试、所有适用 CI/CodeQL 以及审查线程全部完成后，才可 Squash Merge。