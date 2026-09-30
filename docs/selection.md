# 精选与校准

## 一条资料怎么变成精选

1. **收进来**：同一网址、同一内容只留一份。只有标题或订阅摘要的，先抓原文页面再判断。
2. **预筛**（`prefilter.md`）：这是不是本行业的事。宽进，只拦明显无关的：`BLOCK` 的资料不出现在任何公开页面；`PASS` 和拿不准的 `UNKNOWN` 继续往下走。
3. **评分**（`selection-score.md`）：同一份评分标准独立打两次分（0–100）。**两次之和 ≥ 2 × 门槛**就入选，门槛按信源分级不同。页面上显示的分数是两次的平均（向下取整）。
4. **写标题摘要**：入选的和差一点入选的（平均分高于 `understandFloor`），按 `content-understanding.md` 写中文标题、答案先行的摘要、推荐理由和标签；其余的按 `summarize-*.md` 写简短的标题摘要，进“全部动态”。
5. **结构化**（`structure.md`）：分类、标签、主体公司、事实（谁、做了什么、对什么），和评分同时进行。主题页和事件归组靠它。
6. **归组**（`group-*.md`）：不同来源报道的同一件事归成一个事件，事件页有综述（`story-digest.md`），“热门”按事件排。入选的资料要等归组完成（最多 3 分钟）才出现在精选里，避免同一件事先冒出好几条。
7. **日报、周报、月报**（`report-*.md`）：每天 08:00 出日报（前一天 08:00 到当天 08:00 的精选候选），每周一 10:00 出上周周报，每月 1 日 10:30 出上月月报。资料进入站点后若跨过刊期边界才确定精选公开时间，便归入下一期候选池；截止前已确定公开时间、但仍在提交的发布事务，取稿会等它提交后再读取，避免漏过前后两期。最终刊载仍受同一事实去重和版面容量限制。

每一步的提示词都在 `industry/prompts/`，改提示词不用改代码。提示词的版本就是它内容的哈希：改了提示词，之后的新资料按新版判断，已经判过的不会重算。

## 门槛：`industry/selection.ts`

```ts
export const SELECTION = {
  thresholds: { T1: 60, T1_5: 65, T2: 76 },   // 两次评分的平均至少要到这个数
  understandFloor: 50,                        // 平均分高于它的未入选资料，也按入选的写法写
};
```

官方一手信源（T1）门槛低一些，媒体和个人（T2）门槛高一些：同样一件事，官方原文更值得先看。没有门槛的分级（`EXCLUDE_MP`）不参与精选。

这组数是 AIHOT 在 AI 领域一直在用的门槛，偏严：宁可少选几条，也不让噪声进精选。换了行业、改了评分标准，一定要按下面的办法重新校准。

## 校准

### 1. 从真实 collected corpus 导出候选

部署并实际采集一段时间后，先从数据库导出 source-balanced 的真实候选：

```bash
node --env-file=.env scripts/export-selection-candidates.ts \
  --out .data/gold-candidates.jsonl \
  --n 160 \
  --days 90 \
  --seed 7 \
  --holdout 20
```

导出器只读取 `editorial` 信源中已有正文的真实文章，不修改生产数据库；同一个 seed 会稳定得到同样的 source 内排序和 development / holdout 分配。为了避免高频源淹没样本，它按 source round-robin 抽样。

导出文件初始把所有 `gold.decision` 标成 `either`，明确表示**尚未标注**。这不是一个可用于报告模型性能的 gold set。逐条人工或受控标注后，把明确案例改成 `select` / `reject`，真正两可的案例才保留 `either`。同时把初始的 `samplingStratum: "source:..."` 按内容边界改成更有分析价值的 strata。

如果数据库还没有足够真实文章，先完成实际采集；不要用 synthetic examples 或模板数据替代真实 baseline。

#### 低成本 collection-only 冷启动

如果目标只是先积累真实 corpus、尚未准备开始付费模型调用，可以临时设置：

```env
COLLECT_ENABLED=true
MODEL_CALLS_ENABLED=false
COLLECTION_ONLY=true
```

然后正常启动 worker。RSS/Atom 信源仍会抓取并落库，正文抽取会继续运行；`COLLECTION_ONLY=true` 会阻止 editorial analysis 入队并暂停未处理文章 sweeper，避免 `MODEL_CALLS_ENABLED=false` 导致重复失败/重试。积累到足够文章后运行上面的 exporter。准备正式 baseline 时先设 `COLLECTION_ONLY=false`、配置模型，再运行 `node --env-file=.env scripts/enqueue-analysis.ts --all`。这个模式只用于构建 calibration corpus，不代表生产站已经完成内容处理。

### 2. 准备 gold set

从 AI4Math Radar 的实际信源里挑 120–200 条资料，一条一条标“该选 / 不该选”，存成 `.data/gold.jsonl`（`.data/` 不进 Git）。每行一条：

```json
{"caseId":"law-001","material":{"title":"原文标题","originalTitle":null,"publishedAt":"2026-10-01T09:00:00+08:00","sourceName":"信源名称","bodyZh":null,"bodyOriginal":"正文……"},"sourceFacts":{"sourceKind":"rss","sourceTier":"T1","firstParty":true,"language":"zh"},"samplingContext":{"benchmarkSplit":"development","samplingStratum":"regulation"},"gold":{"decision":"select"}}
```

| 字段 | 说明 |
|---|---|
| `caseId` | 唯一编号 |
| `material` | 标题、原标题、发布时间、信源名、正文（中文正文放 `bodyZh`，原文放 `bodyOriginal`，有一个就行） |
| `sourceFacts` | 信源类型、分级、是否一手、语言。分级决定用哪个门槛 |
| `samplingContext` | 可选。`benchmarkSplit` 分开发集和留出集，`samplingStratum` 是你自己的分组（比如“新规”“判决”“营销”），看错在哪一类 |
| `gold.decision` | `select` 该选，`reject` 不该选，`either` 两可（不计入准确率） |

`industry/gold.example.jsonl` 提供 AI4Math 领域的 synthetic 示例，只用于说明 schema 和边界类型，不能作为真实模型性能证据。

几条建议：

- 多放**难例**：差一点就该选、差一点就不该选的。一眼就能判断的放太多，准确率会虚高。AI4Math 至少覆盖 `verified-result`、`benchmark-noise`、`math-discovery`、`pure-math`、`formal-infrastructure`、`evaluation-failure` 等边界。
- 建议约 70%–80% 做 `development`、20%–30% 做 `holdout`。分出一部分做**留出集**（`benchmarkSplit: "holdout"`），调提示词只看开发集，最后再用留出集检查一遍，免得把提示词调成只会做这几道题。
- 标注的人最好就是以后读这个站的人，或者和他们口味一致的人。真实校准集保存在 `.data/`，默认不提交仓库；公开仓库只保留 synthetic schema examples。

### 3. 跑评测

```bash
node --env-file=.env scripts/eval-selection.ts --gold .data/gold.jsonl --split development --label "第一版评分标准"
```

对每条样本跑一遍预筛和两次评分，输出：

- 准确率、查准率（选出来的有多少是对的）、查全率（该选的有多少选上了）；
- 门槛从 40 到 90 每隔 2 分，各自会得到什么结果；
- 判错的条目，完整报告写到 `.data/eval/`，同时导入后台 SelectBench。

常用参数：`--models default,deepseek-flash` 同批比较几个模型，`--n 200` 最多抽多少条，`--split holdout` 只跑留出集。同样的输入和提示词再跑不会重复调用模型（有回执复用），只有改过的部分才会产生新调用。

### 4. 看错例，改标准，再跑

在后台 SelectBench 里逐条看判错的资料和模型给的理由：

- 该选没选上，多半是评分标准里没说清它为什么重要：在 `selection-score.md` 里把这类价值写进“必须正常评价”的部分，给出例子。
- 不该选却选上了，多半是噪声没压住：写进“必须压住”的部分。
- 整体偏松或偏紧，而判错的条目分数都贴着门槛，再调 `industry/selection.ts` 的门槛。

先改标准，再动门槛：门槛只能整体移动，解决不了“哪一类判错了”。每改一次跑一遍，SelectBench 里能看到每一版的对比。

## 换模型

后台“模型与评测”页能看到每一步当前用哪个模型、近期的成功率、耗时和 token 用量，也能直接切换（只影响之后的新任务）。换评分模型之前，先用 `--models` 在同一批样本上比一比。
