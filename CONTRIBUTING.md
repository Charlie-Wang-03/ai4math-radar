# 参与贡献

AI4Math Radar 从早期开发阶段即公开，欢迎参与，但当前会主动控制 scope，避免在领域模型尚未稳定时积累难以维护的架构。

## 当前欢迎的贡献

优先欢迎：

- 可复现的基础设施 Bug；
- 文档、链接和配置错误；
- 有稳定公开地址与来源说明的 AI4Math 信源建议；
- 基于具体正反例的 taxonomy / selection policy 建议；
- 针对已确认行为的 deterministic tests；
- 能同时服务通用框架或明确 AI4Math 场景的小范围可靠性改进。

## 当前不建议直接实现

以下方向请先开 Issue 说明问题、场景、最小方案和验证方法，不要直接提交大型 PR：

- 新 Agent 系统；
- RAG / PDF pipeline；
- citation graph / knowledge graph；
- theorem prover / Lean 集成；
- 新的长期外部服务依赖；
- 大规模 UI 重构；
- database schema 改造；
- grouping algorithm 重写；
- 全仓库 package namespace 或 AIHOT 内部技术命名重命名。

## 提交前

1. 从最新 `main` 创建独立分支。
2. 阅读 [AGENTS.md](AGENTS.md) 和相关 `docs/`。
3. 一次 PR 只解决一个明确问题，不夹带 speculative refactor。
4. 不提交 `.env`、密钥、管理员密码、Cookie、生产数据、未授权素材或含敏感信息的日志。
5. AI4Math domain policy 的修改要给出具体样本或 evaluation 依据；不要只凭主观偏好调整阈值。

## 验证

代码改动按影响范围运行：

```bash
npm run typecheck
DATABASE_URL=postgres://127.0.0.1:5432/ai4math_ci node scripts/migrate.ts
DATABASE_URL=postgres://127.0.0.1:5432/ai4math_ci npm test
npm run build -w @aihot/web
node --test apps/web/tests/*.test.ts
```

运行站点后可追加：

```bash
node scripts/smoke.ts --base http://localhost:3000
```

测试应使用独立测试库，并保持外部采集、真实模型调用和付费服务关闭。

## Issue 与 PR

- 普通 Bug、明确功能需求和领域设计问题：使用本仓库 Issues。
- 较大的架构或产品方向：Issue first。
- 安全问题：按 [SECURITY.md](SECURITY.md) 私下报告，不要公开披露可利用细节。

PR 请说明：

- 问题是什么；
- 为什么当前仓库确实存在这个问题；
- 修改范围；
- 验证方法与实际结果；
- 明确未做什么。

## 许可证与来源

本项目基于 AIHOT 开源框架派生。继承代码沿用 [MIT License](LICENSE)，原始版权和第三方素材说明见 [NOTICE](NOTICE)。提交代码即表示你有权按仓库许可证提供这些改动。
