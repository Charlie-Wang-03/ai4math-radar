# Static + ChatGPT 运行手册

当前 active profile：

```text
static-chatgpt
```

目标是以最低现金成本和最低运维负担运行 AI4Math Radar，同时保留未来切回 GitHub Automation 或 Native AIHOT 的接口。

## 1. 当前架构

```text
Internet
   ↓
ChatGPT
   ↓ evidence review / editorial judgement
GitHub repository
   ↓
portable/content/selected.jsonl
   ↓
scripts/build-static-chatgpt.ts
   ↓
GitHub Actions
   ↓
GitHub Pages
```

没有：

- PostgreSQL；
- 常驻 worker；
- Fastify API server；
- remote MCP server；
- LLM API key；
- 云服务器账单。

## 2. Canonical content

当前正式内容唯一 canonical store：

```text
portable/content/selected.jsonl
```

一行一个 Public API v1-compatible item。

空文件是合法状态。第一条真实内容出现之前，站点应显示“暂无已发布条目”，而不是导入 synthetic example。

`portable/example/selected.jsonl` 永远只是 contract 示例，不得作为正式内容构建输入。

## 3. 日常维护

用户可以直接对 ChatGPT 说：

> 进入 AI4Math Radar 日常维护，检查最近值得收录的 AI4Math 进展。

ChatGPT 默认负责：

1. 搜索公开互联网；
2. 优先读取论文、官方项目页、研究机构公告等一手来源；
3. 用 AI4Math prefilter 判断是否真正属于 AI × Mathematics；
4. 按 selection rubric 判断研究注意力价值；
5. 对可能重复的条目检查现有 canonical corpus；
6. 区分新事件、同一事件的后续验证与无关同主题事件；
7. 生成 portable v1 record；
8. 修改独立 branch；
9. 运行 CI；
10. 创建 PR。

默认不要求用户逐条做研究判断。

用户主要承担：

- 批准明显有争议的收录边界；
- 批准大规模 policy / taxonomy 改动；
- 决定是否合并 substantive workflow change。

对于普通日常内容维护，PR 仍提供 Git audit trail。

## 4. 每条记录最低证据要求

至少保存：

- 稳定 item id；
- 中文标题；
- 必要时原始标题；
- 忠实摘要；
- source name；
- original URL；
- published / discovered time；
- AI4Math category；
- score；
- selection reason。

对于数学结论，必须保持证据强度：

```text
model proposed a proof
≠ expert verified
≠ formally machine-verified
```

不得把机构宣传或模型输出升级为已确认数学事实。

## 5. Static build

本地或 CI：

```bash
npm run build:static
```

默认输出：

```text
static-dist/
├── index.html
├── items/
├── data/
│   ├── selected.json
│   └── selected.jsonl
├── feed.xml
├── llms.txt
├── robots.txt
├── sitemap.xml
├── terms/
└── privacy/
```

当前静态 presentation layer 以仓库现存 Native AIHOT Web 为 UI specification：保留 sidebar、category pills、search、日期时间轴、精选卡片、深浅主题与浏览器本地收藏；没有真实 hot/story contract 时不伪造热度榜或事件聚合。

构建过程：

- 只读取 Git 中的 canonical data；
- 不访问互联网；
- 不调用模型；
- 不读取数据库；
- deterministic except for generated timestamp metadata.

## 6. GitHub Pages

`.github/workflows/pages.yml` 在 `main` 上与静态内容有关的文件变化时自动：

1. checkout；
2. Node 24；
3. build static site；
4. smoke-check required files；
5. upload Pages artifact；
6. deploy to GitHub Pages。

Pages 站点预期地址：

```text
https://charlie-wang-03.github.io/ai4math-radar/
```

仓库第一次启用 Pages 时，GitHub 账户可能仍需要一次性确认 Pages source 为 GitHub Actions。之后普通内容更新无需人工部署。

## 7. 当前 profile 的能力边界

保留：

- 公开网站；
- JSON / JSONL；
- RSS；
- llms.txt；
- sitemap / robots；
- Git history / PR audit；
- ChatGPT research workflow；
- AI4Math taxonomy / prompts / evaluation assets。

暂不提供：

- live REST API；
- remote MCP server；
- admin console；
- minute-level continuous ingestion；
- pg-boss jobs；
- runtime receipts / budget breaker；
- database-backed event grouping。

这些是部署 profile 的差异，不代表未来不能恢复。

## 8. 切换到 GitHub Automation

当“每天都需要人工发起 ChatGPT 维护”开始成为明显负担时，可升级到：

```text
github-automation
```

届时优先自动化：

- scheduled RSS retrieval；
- deterministic validation；
- candidate queue generation；
- site build。

仍可让 ChatGPT 负责最终 evidence review，而不必立刻配置付费 LLM API。

## 9. 切回 Native AIHOT

当出现以下真实需求时再考虑：

- 希望无人值守持续采集；
- 需要 live API / MCP；
- 需要 admin console；
- 需要 receipts / budget breaker；
- 数据量明显不适合 Git review；
- 更新频率达到 GitHub + ChatGPT 工作流的明显上限。

届时：

1. portable JSONL 继续作为迁移输入；
2. 根据当时真实 corpus 实现 importer；
3. 恢复 PostgreSQL / worker / API / web；
4. 使用真实 calibration 数据重新确认 model / threshold。

不要因为 Native 代码已经存在就提前承担它的运维成本。

## 10. 成本

当前 profile 的新增基础设施现金成本目标：

```text
GitHub repository    ¥0
GitHub Pages         ¥0
GitHub Actions       公开仓库正常额度内 ¥0
PostgreSQL           不使用
Server               不使用
LLM API              不使用
Domain               暂不购买
```

ChatGPT 订阅属于用户已有工具成本，不计为本项目新增云基础设施成本。
