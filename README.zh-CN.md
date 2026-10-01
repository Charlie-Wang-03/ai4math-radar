# AI4Math Radar

[English](README.md)

> **当前运行 profile：`static-chatgpt`。** GitHub 是 canonical content store，ChatGPT 负责证据审查与编辑维护，GitHub Pages 发布静态站点。完整的 Native AIHOT runtime 仍保留在仓库中，但当前不启用。

AI4Math Radar 是一个面向 **AI for Mathematics / Mathematical AI** 的开源研究情报项目。它的目标是持续收集公开研究信号，借助语言模型进行筛选与结构化处理，将同一事件的多来源报道进行归并，并通过网站、RSS、API 与 MCP 等出口提供研究信息。

本项目独立维护，基于 [AIHOT](https://github.com/KKKKhazix/AIHOT) 开源框架派生，**不是 AIHOT 官方项目**。

## 当前范围

首个开发阶段有意保持克制：

- 建立独立、清晰的公开项目身份与协作入口；
- 设计面向 AI4Math 的 taxonomy、source policy 与 selection rubric；
- 维护一个小而高精度的 AI4Math source pack，只在有证据时扩展；
- 使用用户提供的 gold data 校准 selection 与 event relation 判断；
- 除非出现明确的 AI4Math 产品需求，否则尽量保留 AIHOT 现有生产基础设施而不做无谓改造。

当前代码库已经保留可复用的 ingestion、deduplication、model calls、event grouping、reports、PostgreSQL persistence、background jobs、budget controls、public API、RSS 与 MCP 基础设施。

## 计划覆盖的 AI4Math 方向

V1 domain design 聚焦 AI 与数学的交叉，包括但不限于：

- 数学推理模型；
- 自动定理证明与 proof search；
- 形式化数学与 autoformalization；
- AI 辅助数学发现；
- benchmarks、datasets 与 evaluation；
- 研究工具与基础设施；
- 重要研究计划与生态发展。

纯 AI 新闻和纯数学新闻都不会自动进入范围。领域边界由公开的 `industry/` 配置与 evaluation assets 共同表达。

## 架构

继承的 AIHOT pipeline 为：

```text
sources
  → deduplication / extraction
  → broad-recall prefilter
  → independent scoring
  → structured understanding
  → event relation judgement / grouping
  → publication
  → web / RSS / API / MCP / reports
```

稳定的架构规则见 [docs/architecture.md](docs/architecture.md)。AI4Math 相关配置主要位于 [industry/](industry/)。

## 当前开发状态

| 模块 | 状态 |
|---|---|
| 独立项目身份 | 已完成 |
| AIHOT 核心基础设施 | 继承保留 |
| AI4Math taxonomy | V1 初版完成 |
| AI4Math sources | V1 source pack 初版完成 |
| AI4Math prompts / scoring rubric | V1 初版完成；真实 calibration 待继续 |
| Selection calibration set | 导出工具已就绪；真实 labels 待补充 |
| Event-relation evaluation | Harness + AI4Math synthetic examples 已完成；真实 gold 待补充 |
| 当前部署 | `static-chatgpt` — GitHub canonical data + GitHub Pages |

## 贡献

欢迎贡献，但在 domain model 尚未稳定时会主动控制 scope。

当前优先欢迎：

- 可复现的继承基础设施 Bug；
- 文档、链接和配置修正；
- 带稳定公开 URL 与 provenance 的 AI4Math source 建议；
- 基于具体正反例的 taxonomy / selection-policy 建议；
- 针对已确认行为的 deterministic tests。

在 Issue 尚未证明真实需求前，请避免直接提交大型架构改写、speculative agents、RAG、citation graph、knowledge graph、theorem-prover integration 或新的外部服务。

详见 [CONTRIBUTING.md](CONTRIBUTING.md) 与 [AGENTS.md](AGENTS.md)。

## 运行继承的 Native AIHOT 框架

项目当前保留 AIHOT runtime 与 package namespace，以避免无价值的 divergence。

要求：

- Node.js 24
- PostgreSQL 17
- Docker / Docker Compose（容器化路径）

开发与部署文档位于 [docs/](docs/)。部署采用 profile 模型：见 [deployment profiles](docs/deployment-profiles.md) 及其 [中文版本](docs/deployment-profiles.zh-CN.md)。

完整 Native Railway runtime 可参考 [collection-only calibration bootstrap](docs/railway-calibration-bootstrap.md) 与 [production runbook](docs/railway-production.md)。

当前 runtime 中的 `@aihot/*`、Docker 与 database 技术命名是继承实现细节，不代表 AI4Math Radar 的公开产品品牌。

## 当前静态运行方式

当前主路径是 `static-chatgpt`：

- canonical corpus：`portable/content/selected.jsonl`
- ChatGPT：source discovery、evidence review、deduplication、selection 与 structured update
- GitHub：version control、PR review、CI 与 rollback
- GitHub Pages：静态发布

详细运行方式见 [docs/static-chatgpt.md](docs/static-chatgpt.md)。

日常内容维护规则见 [Editorial maintenance contract](docs/editorial-maintenance.md) 及其 [中文版本](docs/editorial-maintenance.zh-CN.md)。

## 许可证与来源

继承代码采用 MIT License。原 AIHOT 的版权与许可声明保留在 [LICENSE](LICENSE)，额外 provenance 与 third-party notices 见 [NOTICE](NOTICE)。

AI4Math Radar 使用自己的项目身份，不将 AIHOT 名称或 Logo 作为本项目产品品牌。
