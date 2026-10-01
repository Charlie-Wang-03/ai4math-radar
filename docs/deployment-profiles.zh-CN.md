# 部署 Profiles

AI4Math Radar 有意把 deployment 作为可替换的 runtime concern。

AI4Math domain pack、prompts、taxonomy、evaluation assets 与 portable public-content contract 应在不同 deployment profile 之间保持可用。

## Profiles

| Profile | Canonical store | Compute | Hosting | 适用场景 |
|---|---|---|---|---|
| `static-chatgpt` | Git | ChatGPT | GitHub Pages | 最低现金成本与运维负担；human-approved research curation |
| `github-automation` | Git | GitHub Actions | GitHub Pages | 无常驻服务器的 scheduled validation/build 与可选轻量采集 |
| `native-aihot` | PostgreSQL | AIHOT worker | Container/PaaS | continuous autonomous ingestion、queues、API、MCP、admin 与 receipts |

机器可读描述位于 `deployment/profiles.json`。

## Stable layers

以下层不应依赖 deployment profile：

```text
industry/
  taxonomy
  topics
  prompts
  source policy

evaluation/
  selection gold
  relation gold
  metrics / calibration rules

portable contract
  public-api-v1 item payload
```

切换 deployment profile 不得静默改变 editorial standard。

## Interchange contract

Portability boundary 使用现有 **Public API v1 selected-item payload**，而不是再创建一个 static-only content schema。

因此 portable item 与 native endpoint：

```text
GET /api/v1/selected/snapshot
```

输出的 shape 保持一致。

Portable repository snapshot 每行存一个 v1 item。Native deployment 可以导出同一结构，GitHub-native workflow 也可以直接维护同一结构。

因此形成可逆路径：

```text
native-aihot
  PostgreSQL
     ↓ public API v1
portable JSONL
     ↓
GitHub / Pages

GitHub / ChatGPT
  portable JSONL
     ↓ future importer / seed adapter
native-aihot
```

第二个箭头目前只是 interface，不是现成的自动 database import。只有真正切回 native 时才实现 importer，避免 speculative code。

## Profile A — static-chatgpt

Canonical state 存在 Git 中。

ChatGPT 负责：

- source discovery；
- evidence review；
- deduplication；
- selection；
- event-relation judgement；
- structured updates；
- report drafting。

GitHub 提供：

- version control；
- review / rollback；
- CI validation；
- Pages hosting。

此 profile 不模拟 pg-boss、live admin、live REST API 或 remote MCP server。

静态等价物可包括：

- `selected.jsonl`
- generated JSON indexes
- build-time RSS
- `llms.txt`
- static website

## Profile B — github-automation

Git 仍是 canonical，但 GitHub Actions 可以额外承担：

- schema validation；
- site build；
- scheduled RSS fetch；
- deterministic transforms；
- static report generation；
- 如果维护者以后愿意配置 API key，可选择执行 LLM calls。

不要强制这个 profile 配置 LLM API key。它必须允许保持为 zero-paid-model workflow，由 ChatGPT 承担 editorial work。

## Profile C — native-aihot

这是继承的 production runtime：

- PostgreSQL
- API
- worker / pg-boss
- web
- receipts
- budget breaker
- continuous collection
- event grouping
- live REST API
- remote MCP
- admin console

只有当 autonomous ingestion 与 runtime interfaces 的价值足以抵消运维成本时才使用。

## 切换规则

### Static → Native

不要从 rendered HTML 反推 editorial decisions。

使用 portable JSONL 作为 migration source，并尽量保持 stable item ids 与 original source URLs。

Database importer 当前有意 deferred；只有真的切回 native 时再实现。

### Native → Static

对运行中的 Public API v1 selected snapshot 使用 `scripts/export-portable-v1.ts`。导出路径不依赖直接 PostgreSQL access。

### GitHub Automation → Static ChatGPT

关闭 scheduled mutation workflows。Git repository 仍是 canonical，因此无需 data migration。

### Static ChatGPT → GitHub Automation

启用 validation/build/scheduled workflows，不改变 content format。

## Capability loss 必须显式

更轻量的 profile 可以有意失去部分能力。

例如：

- GitHub Pages 无法运行当前 Fastify API server；
- static hosting 无法暴露现有 remote MCP endpoint；
- 无 persistent worker 就没有 minute-level collection；
- 无 PostgreSQL 就没有 pg-boss queue 或 database-backed admin console。

这些是接受的 product trade-off，不是 defect。

## Decision rule

优先选择满足当前产品需求的最轻 profile。

只有出现具体需求时才升级：

```text
static-chatgpt
      ↓ recurring unattended work becomes valuable
github-automation
      ↓ persistent queues / live API / MCP / admin become valuable
native-aihot
```

不要仅因为 repository 已经包含 native infrastructure 就提前启用更重的 profile。
