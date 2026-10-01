# Deployment profiles

[简体中文](deployment-profiles.zh-CN.md)

AI4Math Radar deliberately keeps deployment as a replaceable runtime concern.

The AI4Math domain pack, prompts, taxonomy, evaluation assets and portable public-content contract should remain usable across all profiles.

## Profiles

| Profile | Canonical store | Compute | Hosting | Best for |
|---|---|---|---|---|
| `static-chatgpt` | Git | ChatGPT | GitHub Pages | Lowest cost and maintenance; human-approved research curation |
| `github-automation` | Git | GitHub Actions | GitHub Pages | Scheduled validation/build and optional light collection without a persistent server |
| `native-aihot` | PostgreSQL | AIHOT worker | Container/PaaS | Continuous autonomous ingestion, queues, API, MCP, admin and receipts |

The machine-readable description lives in `deployment/profiles.json`.

## Stable layers

These should not depend on the deployment profile:

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

Changing deployment profile must not silently change the editorial standard.

## Interchange contract

The portability boundary is the existing **Public API v1 selected-item payload**, not a second static-only content schema.

The portable item shape is therefore the same shape emitted by the native endpoint:

```text
GET /api/v1/selected/snapshot
```

A portable repository snapshot stores one v1 item per JSONL line. A native deployment can export the same shape. A GitHub-native workflow can author or update the same shape directly.

This gives us a reversible path:

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

The second arrow is intentionally an interface, not an automatic database import today. We should add an importer only if we actually switch from a static canonical store back to native.

## Profile A — static-chatgpt

Canonical state lives in Git.

ChatGPT performs:

- source discovery;
- evidence review;
- deduplication;
- selection;
- event-relation judgement;
- structured updates;
- report drafting.

GitHub provides:

- version control;
- review / rollback;
- CI validation;
- Pages hosting.

This profile does not attempt to emulate pg-boss, live admin, live REST API or a remote MCP server.

Static equivalents may include:

- `selected.jsonl`;
- generated JSON indexes;
- RSS generated during build;
- `llms.txt`;
- a static website.

## Profile B — github-automation

Git remains canonical, but GitHub Actions may additionally run:

- schema validation;
- site build;
- scheduled RSS fetches;
- deterministic transforms;
- static report generation;
- optional LLM calls if the maintainer later chooses to configure an API key.

Do not force an LLM API key into this profile. It must remain valid as a zero-paid-model workflow where ChatGPT performs the editorial work.

## Profile C — native-aihot

This is the inherited production runtime:

- PostgreSQL;
- API;
- worker / pg-boss;
- web;
- receipts;
- budget breaker;
- continuous collection;
- event grouping;
- live REST API;
- remote MCP;
- admin console.

Use this profile when autonomous ingestion and runtime interfaces justify the operational cost.

## Switching rules

### Static → Native

Do not reconstruct editorial decisions from rendered HTML.

Use the portable JSONL files as the migration source. Preserve stable item ids and original source URLs where possible.

A database importer is deliberately deferred until a real switch requires it; implementing one now would be speculative code.

### Native → Static

Use `scripts/export-portable-v1.ts` against the running public API v1 selected snapshot. The export is independent of direct PostgreSQL access.

### GitHub Automation → Static ChatGPT

Disable scheduled mutation workflows. The Git repository remains canonical, so no data migration is required.

### Static ChatGPT → GitHub Automation

Enable validation/build/scheduled workflows without changing the content format.

## Capability loss is explicit

A lower-cost profile may intentionally lose capabilities.

Examples:

- GitHub Pages cannot run the current Fastify API server;
- static hosting cannot expose the existing remote MCP endpoint;
- no persistent worker means no minute-level collection;
- no PostgreSQL means no pg-boss queue or database-backed admin console.

These are accepted product trade-offs, not defects.

## Decision rule

Prefer the lightest profile that satisfies the current product need.

Move upward only when a concrete requirement appears:

```text
static-chatgpt
      ↓ recurring unattended work becomes valuable
github-automation
      ↓ persistent queues / live API / MCP / admin become valuable
native-aihot
```

Do not move upward merely because the repository already contains the native infrastructure.
