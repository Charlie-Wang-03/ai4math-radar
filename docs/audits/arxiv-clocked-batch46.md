# Issue #151｜Batch46 历史 arXiv 时刻审计（冻结行 37–41）

审查 UTC 日期：**2026-11-06**。此前先完成 11-05 日报 [PR #162](https://github.com/Charlie-Wang-03/ai4math-radar/pull/162) 并 Squash Merge `27df485da33ef7a710968c10a34713a337a342f6`。本审计在全新 main 上另设分支，只调整冻结队列五条目标记录和专用审计证据、说明、测试。

| 冻结行 | ID | 旧 publishedAt（arXiv v1 提交时刻） | 原始主分类公告证据 | 决策 |
|---|---|---|---|---|
| 37 | `2026-09-13-quantum-olympiad-geometry` | `2026-09-13T14:10:44.000Z` | quant-ph / 2026-09-15 / `v1/new` | **ADOPTED 2026-09-15（日级）** |
| 38 | `2026-09-12-conway-subprime-golden-ratio` | `2026-09-12T23:38:17.000Z` | math.NT / 2026-09-15 / `v1/new` | **ADOPTED 2026-09-15（日级）** |
| 39 | `2026-09-12-isogeny-equidistribution-astra` | `2026-09-12T06:09:30.000Z` | math.NT / 2026-09-15 / `v1/new` | **ADOPTED 2026-09-15（日级）** |
| 40 | `2026-09-12-four-arm-polyominoes-lean` | `2026-09-12T01:31:02.000Z` | math.CO / 2026-09-15 / `v1/new` | **ADOPTED 2026-09-15（日级）** |
| 41 | `2026-09-11-zgcm-1` | `2026-09-11T17:18:04.000Z` | cs.AI / 2026-09-15 与 2026-09-16 / `v1/new` | **UNRESOLVED（两组冲突日期）** |

## 固定来源及其证据边界

只读复核固定第三方 Git 镜像 `ehijano/rss_fetch@e597e5120c034115fda2049d72812f2da7f99f3a` 中 arXiv 发布者 RSS XML，使用对应 Git Blob SHA-1 并检查**编号、完整标题、版本 GUID、主分类、announce_type=new 和原始 pubDate**。详见 [Batch46 固定证据回执](evidence/arxiv-clocked-batch46.json)。共检查了 **12 份** Sep14–Sep16 分类源 XML（quant-ph、math.NT、math.CO、cs.AI），包含经 Git `fetch_blob` 完整读取的两份超大 cs.AI XML，并非靠搜索片段推断不存在。

四项无冲突的公告原始条目均有 `pubDate=Tue, 15 Sep 2026 00:00:00 -0400`，对应 **2026-09-15 UTC 日级公告**，但该标准化 00:00 并不是实际首次可访问秒数：
- quantum geometry / quant-ph / [固定 XML](https://github.com/ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/rss_data/quant-ph/2026-09-15_quant-ph.xml) / SHA `ee58bc112b1f677cb6f63d1b98706153fff01110`；Sep16 的 cs.AI `cross` 不替代 quant-ph `new`。
- Conway subprime / math.NT / [固定 XML](https://github.com/ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/rss_data/math.NT/2026-09-15_math.NT.xml) / SHA `06a2a96d1208e71716f4137d4f68e8d3e6f96a5d`（准确 SHA 以 JSON 回执为准）。
- isogeny equidistribution / math.NT / 同一固定 math.NT XML。
- four-arm polyominoes / math.CO / [固定 XML](https://github.com/ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/rss_data/math.CO/2026-09-15_math.CO.xml) / SHA `85af49428aa69911bf54a7e84a1ddb31468f4124`。

**ZGCM-1 冲突必须保持待核：** cs.AI 两份原始 RSS 文件将**相同论文 2609.13356、相同标题、相同 v1 GUID 和同一主分类 new**分别记作 **Sep15**（blob `00de42a5149718d84e2c917b1904292014bba583`）与 **Sep16**（blob `e8276fc3fae1f33bdf65e40e9fcf2f29c378c13a`）。本审计**不选择较早日期、不填 chronology**，避免将镜像冲突或原始投稿时刻误写成首次公告证书。下一次需寻找真正独立的同期原站公告、固定官方档案或可证公开时点。

## 数据限制、数学可信度和检查

四条仅增补日级 `chronology.milestone`，`eventKind=paper-release`、`evidenceKind=arxiv-announcement`、`evidenceUrl=https://rss.arxiv.org/rss/<primaryCategory>`。**无**虚构 `at` 或 `earliestVerifiedPublic`。五条摘要补充旧时间语义；全部旧 ID、publishedAt、永久链接、原始来源、分类、评分及其他属性不变。原数据 **376 行中 371 行逐字未改动，目标 5 行发生限定变化**。此项只核实日期证据，**不代表论文数学论证或 Lean 证明已独立验证**。归档镜像的 Git commit 时间、RSS 中的标准化午夜和旧投稿秒数均不能作为真实首次公开秒数。

冻结队列复算：**98 = 24 已补 chronology + 17 已查仍待核 + 0 技术 BLOCKED + 57 未检查**，**仍缺 chronology 74**；下一条 `2026-09-10-sullivan-no-wandering-domains-lean`。Issue #127 的 GenLimitLib 和 Zenodo Arad–Herzog v3 独立保留，不计入此队列。

合并只可在 GitHub Hosted content:check、静态构建、回归、安全检查和审查全部通过后执行 Squash Merge，不预先宣称验收成功。
