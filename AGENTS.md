# 给 Agent 的说明

这是 **AI4Math Radar**：一个面向 AI for Mathematics / Mathematical AI 的开源研究情报项目，基于 AIHOT 开源框架派生。当前处于早期领域适配阶段。

## 当前优先级

当前工作重点是把通用 AIHOT pipeline 适配为可审计的 AI4Math domain package，而不是扩张功能。

优先顺序：

1. 项目身份、公开协作面和 provenance 保持清晰；
2. 在 `industry/` 中建立 AI4Math taxonomy、sources、prompts 与 selection policy；
3. 用明确标注的 gold data 校准 selection 与 event relation；
4. 只有出现真实产品需求时，才修改通用核心代码。

## 默认不要做

除非 Issue 已经证明必要性，不要主动加入或重构：

- Agent orchestration；
- RAG / PDF ingestion；
- citation graph / knowledge graph；
- theorem prover / Lean integration；
- 新的外部数据服务；
- 新 API；
- database schema；
- grouping algorithm；
- UI 大改；
- `@aihot/*` workspace namespace；
- Docker / database 内部的 AIHOT 技术命名。

这些内部命名属于继承实现，不是 AI4Math Radar 的公开品牌。

## 行业适配面

AI4Math 相关改动优先限制在：

- `industry/site.ts`
- `industry/taxonomy.ts`
- `industry/topics.json`
- `industry/sources.json`
- `industry/selection.ts`
- `industry/features.ts`
- `industry/prompts/`
- `industry/brand/`
- `industry/pages/`

修改 taxonomy 后，若测试中仍使用 AI 示例分类、标签或实体，只替换对应 fixture；不要为了让测试通过而删掉行为测试。

## 架构不变量

继续遵守上游框架的核心约束：

- 前端只通过 HTTP 读取 API，不直接访问数据库或密钥；
- 页面读取不触发模型调用，模型调用只发生在 worker；
- 所有公开出口统一从 `packages/backend/src/publication/` 读取；
- 付费请求必须经过 receipt 与 budget breaker；
- 开发和测试时保持外部采集、模型调用和推送安全阀关闭；
- 测试不得依赖真实外部付费服务；
- 数据库迁移只允许向后兼容的增量；
- 不提交 `.env`、密钥、Cookie、生产数据或 `.data/`。

## 领域原则

AI4Math Radar 的目标是 AI 与数学的交叉研究情报，不是普通 AI 新闻站，也不是通用数学新闻站。

领域标准应通过具体样本和 evaluation 资产表达。不要凭直觉直接修改 selection threshold；先建立或更新 gold set，再运行相应评测。

## 验证

代码改动至少执行与改动范围对应的检查：

```bash
npm run typecheck
DATABASE_URL=postgres://127.0.0.1:5432/ai4math_ci node scripts/migrate.ts
DATABASE_URL=postgres://127.0.0.1:5432/ai4math_ci npm test
npm run build -w @aihot/web
node --test apps/web/tests/*.test.ts
```

运行中的站点再执行：

```bash
node scripts/smoke.ts --base http://localhost:3000
```

若只修改文档或静态配置，按实际影响选择验证，不为了形式增加无关测试。

## 双语公开文档

`README.md` 与 `README.zh-CN.md` 是一等公开入口；修改项目定位、当前 profile、公开能力边界或使用方式时，应在同一 PR 中检查两者事实一致。

`docs/editorial-maintenance.md` / `docs/editorial-maintenance.zh-CN.md` 与 `docs/deployment-profiles.md` / `docs/deployment-profiles.zh-CN.md` 也应保持规则层面的语义一致。不要机械逐句翻译，但不得让两个语言版本形成不同政策。

## 开源协作

一次改动解决一个清楚的问题。大幅修改架构、产品行为、domain ontology 或引入新的长期依赖前先开 Issue。所有提交应能解释、验证和维护。
