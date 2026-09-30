# Railway 正式平台部署

本文描述 AI4Math Radar 的正式 Railway 拓扑。它与 `railway-calibration-bootstrap.md` 的 collection-only 冷启动不同：这里准备完整站点，但**是否打开真实模型处理和公开发布，仍以 P2-B 的真实 calibration 结果为 gate**。

## 1. 服务拓扑

推荐同一个 Railway project / environment 中使用四个 service：

```text
                 public HTTPS
                     │
                   web
                     │ private HTTP
                     ▼
                    api
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
       Postgres               worker
                                │
                         public RSS / Atom
                         + configured LLM
```

安全边界：

- 只有 `web` 需要 Public Networking；
- `api` 不生成 public domain，web 通过 Railway private network 调用；
- `worker` 不生成 public domain；
- Postgres 不需要 public TCP proxy；
- 浏览器永远不能直接访问 Railway private network。

## 2. 三个应用 service 都连接同一个 GitHub 仓库

Repository：

```text
Charlie-Wang-03/ai4math-radar
```

Build 使用仓库根目录的 `Dockerfile`。

三个应用 service 都可以配置：

### Pre-deploy command

```bash
node scripts/migrate.ts && node scripts/seed.ts
```

`scripts/migrate.ts` 会在每个 migration 事务内获取 PostgreSQL advisory lock，并在锁内重新检查 `schema_migrations`，因此多个 service 同时部署不会重复应用同一个 migration。seed 使用 upsert / conflict-safe 写入，可以重复执行。

## 3. API service

### Start command

```bash
node apps/api/src/main.ts
```

### Variables

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
API_HOST=0.0.0.0
API_PORT=3001
PORT=3001
SITE_URL=https://<web-public-domain>
AIHOT_ENVIRONMENT=production

SESSION_SECRET=<random-secret>
IMG_PROXY_SIGN_SECRET=<random-secret>
ADMIN_PASSWORD=<at-least-12-characters>
```

建议：

- `SESSION_SECRET` 与 `IMG_PROXY_SIGN_SECRET` 使用不同随机值；
- 不要把这些值写进 GitHub；
- Railway service variables 中保存 secrets。

### Healthcheck

```text
/api/health
```

该 endpoint 会执行数据库 `SELECT 1`，因此同时验证 API 进程和 Postgres 连接。

不要给 API service 生成 public domain。

## 4. Worker service

### Start command

```bash
node apps/worker/src/main.ts
```

### 基础变量

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
SITE_URL=https://<web-public-domain>
AIHOT_ENVIRONMENT=production
IMG_PROXY_SIGN_SECRET=<same-value-as-api>

COLLECT_ENABLED=true
```

### Calibration 阶段

在真实 gold set 和 baseline 尚未完成时：

```env
MODEL_CALLS_ENABLED=false
COLLECTION_ONLY=true
```

这样只采集、抽取正文，不进入 editorial model pipeline。

### 正式模型阶段

只有在 development calibration 完成并冻结模型 / prompt 方案后再切换：

```env
MODEL_CALLS_ENABLED=true
COLLECTION_ONLY=false

LLM_BASE_URL=<provider-compatible-endpoint>
LLM_API_KEY=<secret>
LLM_MODEL=<calibrated-model>
```

需要时再添加 capability-specific model variables。不要在 baseline 之前把某个模型写成“AI4Math Radar 推荐模型”。

Worker 不需要 public domain。

## 5. Web service

### Start command

```bash
node apps/web/server.ts
```

### Variables

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
API_BASE_URL=http://${{api.RAILWAY_PRIVATE_DOMAIN}}:3001
WEB_HOST=0.0.0.0
SITE_URL=https://<web-public-domain>
TRUST_PROXY=true
AIHOT_ENVIRONMENT=production
```

Railway 会给 web 注入 `PORT`；当前 web server 会优先读取 `WEB_PORT`，其次读取 `PORT`，因此不要把 `WEB_PORT` 固定成与 Railway 不一致的值。

为 web 生成 Railway public domain。拿到域名后，把三个应用 service 的 `SITE_URL` 都更新为：

```text
https://<web-public-domain>
```

如果后续绑定自定义域名，再统一更新 `SITE_URL`。

### Healthcheck

正式部署可使用：

```text
/
```

它验证 web SSR 能正常响应；上线验收仍应额外检查 `/api/health`、`/robots.txt`、`/sitemap.xml`、RSS、MCP 与 admin 登录。

## 6. Postgres

使用 Railway PostgreSQL service，应用通过：

```text
${{Postgres.DATABASE_URL}}
```

连接。

不要为正常运行开启 public TCP proxy。

正式积累 corpus 前至少启用 Railway volume backup。建议同时保留仓库已有的 S3-compatible `DB_BACKUP_STORE_*` 作为跨项目 / 跨平台备份路径（如果你需要更强灾备）。

## 7. Autodeploy

可以让 api / worker / web 都跟随 `main` 自动部署。

由于：

- migration 已并发串行化；
- seed 可重复执行；
- pre-deploy failure 会阻止新 deployment 进入运行态；

因此不需要人工维护“先 api、再 worker、再 web”的固定发版顺序。

对高风险 migration 或模型行为变化，仍建议先在单独环境验证，再 promote 到 production。

## 8. 正式部署前 secrets checklist

必须有：

```text
Postgres.DATABASE_URL
SESSION_SECRET
IMG_PROXY_SIGN_SECRET
ADMIN_PASSWORD
```

正式模型处理开启后再增加：

```text
LLM_BASE_URL
LLM_API_KEY
LLM_MODEL
```

默认不要配置：

```text
SOCIALDATA_API_KEY
DAJIALA_KEY
JINA_API_KEY
FEISHU_*
DB_BACKUP_STORE_*
```

除非对应功能确实启用。

## 9. Public launch gate

“Railway 部署成功”不等于“AI4Math Radar 已完成 production calibration”。

对外宣告为正式研究情报站前，至少还应满足：

1. collection-only 环境积累足够真实 corpus；
2. 导出并完成人工 gold 标注；
3. development selection baseline 已运行；
4. prompt / model / threshold 根据 development 固定；
5. holdout 只运行一次最终验证，不用于继续调参；
6. relation judgement 至少有真实 AI4Math pairwise gold；
7. production model budget 已设置；
8. Terms / Privacy 无模板占位符；
9. Postgres backup 已启用；
10. smoke test 与 API health 全部通过。

未通过这些 gate 时，可以部署基础设施并采集 corpus，但 README 和站点不得声称阈值或模型已经经过 production calibration。

## 10. 上线后验收

### Infrastructure

- web public domain 返回 200；
- `GET /api/health` 返回 `ok: true`、`db: "ok"`；
- api / worker 无 public domain；
- worker heartbeat 正常；
- Postgres backup 已配置。

### Public surface

运行：

```bash
node scripts/smoke.ts --base https://<web-public-domain>
```

并人工检查：

- 首页与 About 为 AI4Math Radar 品牌；
- 使用规则 / 隐私说明不是模板占位页；
- 日报 / 周报报头使用当前 `SITE.subject`；
- `robots.txt`、`sitemap.xml`、`llms.txt` 正常；
- RSS / API / MCP 链接都使用正确 `SITE_URL`。

### Calibration mode

如果仍处于 corpus accumulation：

```text
COLLECTION_ONLY=true
MODEL_CALLS_ENABLED=false
```

确认文章持续进入数据库、正文抽取正常、没有 model receipts，也没有 analysis retry storm。

### Production model mode

开启模型后：

- budget breaker 已配置；
- receipt 正常记录；
- prefilter / score / understand / structure 有实际调用；
- 错误率和 token/cost 在可接受范围；
- 不使用 holdout 持续调参。
