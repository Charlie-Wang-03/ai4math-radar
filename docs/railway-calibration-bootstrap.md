# Railway：collection-only 校准冷启动

这个部署只用于在真实公开信源上积累 AI4Math corpus，为 `P2-B` 的人工 gold 标注和 baseline evaluation 提供数据。

它不是完整生产站。第一阶段只部署两个服务：

```text
Postgres
  ↑
worker
```

不部署 `web`、`api`，也不配置 LLM key。

## 为什么先这样部署

AI4Math Radar 的 selection / relation threshold 必须由真实 collected corpus 校准。公开仓库里的 synthetic examples 只用于 schema 和边界测试，不能作为性能证据。

collection-only 模式：

- 正常抓取 `industry/sources.json` 中的公开 RSS/Atom 信源；
- 正常落库并抽取正文；
- 不把 editorial article 放进模型 analysis queue；
- 不产生 LLM 费用；
- 文章保持可在之后统一送入分析的状态。

## 1. 创建 Railway project

在 Railway 中创建一个空 project，然后添加一个 PostgreSQL service。

Railway 的 Postgres service 会提供 `DATABASE_URL`。数据库默认通过 project private network 给同项目 service 使用，不需要公开 TCP access。

## 2. 添加 worker service

新建一个 service，并连接 GitHub repository：

```text
Charlie-Wang-03/ai4math-radar
```

构建方式使用仓库根目录现有 `Dockerfile`。

不要为这个 worker 生成 public domain。

### Pre-deploy command

```bash
node scripts/migrate.ts && node scripts/seed.ts
```

### Start command

```bash
node apps/worker/src/main.ts
```

## 3. Worker variables

最小变量：

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
COLLECT_ENABLED=true
MODEL_CALLS_ENABLED=false
COLLECTION_ONLY=true
AIHOT_ENVIRONMENT=calibration
IMG_PROXY_SIGN_SECRET=<random-secret-at-least-8-chars>
```

其中 `DATABASE_URL` 使用 Railway service reference variable；如果数据库 service 名称不是 `Postgres`，按实际 service name 修改引用。

当前阶段不需要：

```text
LLM_API_KEY
LLM_MODEL
ADMIN_PASSWORD
SESSION_SECRET
SITE_URL
```

也不要配置 SocialData、公众号、Jina 等付费 collector key。V1 source pack 当前全部是 RSS / Atom。

## 4. 验收 collection-only

部署后至少检查：

1. worker 持续运行，没有因为缺少 LLM key 退出；
2. `sources` 表已由 seed 导入 9 个 AI4Math V1 source；
3. `fetch_runs` 开始出现成功或可解释的失败记录；
4. `articles` 开始增加；
5. 有正文的文章最终达到 `body_status = 'ok'` 或 `unconfirmed`；
6. editorial article 保持 `processing_state = 'new'`，而不是因为模型关闭反复变成 failed/retrying；
7. 没有新增 model receipt。

## 5. 什么时候导出 gold candidates

不要刚启动就导出。先让各信源自然积累一段时间，使样本不只是首次 backfill。

当真实文章数量足够后，在能访问该 Railway Postgres 的运行环境执行：

```bash
node --env-file=.env scripts/export-selection-candidates.ts \
  --out .data/gold-candidates.jsonl \
  --n 160 \
  --days 90 \
  --seed 7 \
  --holdout 20
```

导出文件所有 row 默认：

```json
"gold": { "decision": "either" }
```

这表示尚未标注。逐条完成 gold 标注后，明确案例改成 `select` / `reject`；只有真正两可的样本保留 `either`。

## 6. 从 collection-only 切换到 baseline

完成真实 gold set 后：

1. 配置要比较的模型 provider / API key；
2. 设置：

```env
COLLECTION_ONLY=false
MODEL_CALLS_ENABLED=true
```

3. 对已经积累的文章如需进入站点正常处理，可运行：

```bash
node --env-file=.env scripts/enqueue-analysis.ts --all
```

4. baseline selection eval 使用 gold 文件单独运行：

```bash
node --env-file=.env scripts/eval-selection.ts \
  --gold .data/gold.jsonl \
  --split development \
  --label "AI4Math baseline"
```

先只看 development。只有 prompt / model / threshold 方案冻结后，再运行 holdout。

## 7. 不要做的事

- 不把 Railway 数据库公开到公网，除非确实需要临时外部连接；
- 不把 API key、数据库 URL 或导出的真实 corpus 提交到 Git；
- 不把 synthetic example 当成 baseline；
- 不在看过 holdout 结果后继续用 holdout 调 prompt；
- 不因为 production threshold 现在沿用模板值，就提前把它当成 AI4Math 校准结论。
