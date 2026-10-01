# 编辑维护契约

本文档定义 `static-chatgpt` profile 下维护 AI4Math Radar canonical selected corpus 时应遵守的编辑规则。

它不是一般性的新闻政策，而是用于在日常维护中保持事件日期、重复与后续事件处理、证据强度和历史回填规则一致。

## 1. Canonical event date

每条精选记录应使用该记录实际代表的、**最早可公开检查的事件时间**。

默认优先级：

1. canonical first public release；
2. canonical preprint submission；
3. 官方公开确认或 release note；
4. 仅在没有更早公开 artifact 时使用 conference presentation；
5. 二次报道不得重新给更早事件定日期。

需要特别区分：

- 私有或内部 model-run 日期不自动成为公开事件日期；
- conference 日期不能替代更早的 preprint 日期；
- 后续媒体报道不会为原始结果生成新日期；
- 后续 verification、generalization、benchmark result 或 publication 如果产生了实质不同的 evidence state，可以成为独立事件。

如果 item ID 带 `YYYY-MM-DD` 前缀，该日期必须与 `publishedAt` 一致。

## 2. 重复与后续事件

发布单位是 **event milestone**，不是围绕同一故事出现的每一个页面、报道或提及。

以下情况不应新建 selected record：

- 已记录事件的二次报道；
- 同一 artifact 的镜像或转载；
- 没有增加新证据、新结果或新 release milestone 的后续文章；
- 多个来源对同一 benchmark result 的重复报道。

当后续事件形成实质不同的 milestone 时，可以单独记录，例如：

- autonomous discovery → 后续 human verification 或 mathematical generalization；
- conjectured proof → formal proof-assistant verification；
- benchmark launch → 后续 model evaluation result；
- candidate result → independent replication 或 peer-reviewed publication；
- initial construction → 更强 theorem 或明显更广的适用范围。

拿不准时，优先保留一个 canonical story record；只有 evidence state 或数学内容真正发生变化时，再增加后续 milestone。

## 3. 证据强度纪律

编辑措辞不得声称比现有证据更强的 verification。

可参考以下证据梯度：

- **L0 — model output / unreviewed claim**：模型或系统产生 proof、construction、conjecture 或 result，但尚无实质外部检查。
- **L1 — author checked**：作者或项目团队报告已检查数学论证或 artifact。
- **L2 — expert reviewed**：相关领域专家在原始作者或系统团队之外进行了审查。
- **L3 — deterministic computational certificate**：有限 witness、SAT/SMT/DRAT certificate、exact computation 或其他 deterministic checker 验证相应 computational claim。
- **L4 — proof-assistant kernel checked**：proof term 或 formal artifact 被 Lean、Coq、Rocq、Isabelle 等可信 proof-assistant kernel 接受。
- **L5 — independent replication / independent formal or mathematical review**：无关联第三方复现结果、验证 artifact 或独立检查 proof。
- **L6 — peer-reviewed or established community result**：工作已经通过正式 peer review，或达到成熟的 community acceptance。

这不是数值评分，目前也不写入 portable v1；它只是 selection 与写作辅助。

必须牢记：

```text
machine-checked proof
≠ faithful formalization of the intended informal statement
≠ historical priority
≠ mathematical significance
```

Kernel 能验证提交给它的 formal proposition；statement fidelity 与 provenance 仍可能需要人类检查。

## 4. Selection 与历史回填

AI4Math Radar 是精选型项目，不追求穷举。

一次维护窗口完全可能得到：

```text
0 selected events
```

不得为了让每天、每月或每半年看起来“有内容”而降低门槛。

优先考虑能实质贡献于以下方向的事件：

- mathematical reasoning capability；
- theorem proving 或 formal mathematics；
- mathematical discovery 或 open-problem progress；
- evaluation methodology 与 benchmark quality；
- verification infrastructure；
- 可长期复用的 AI4Math research tooling 或 ecosystem change。

通常排除：

- 数学只是通用 capability surface 的宽泛模型发布；
- 没有新方法或研究意义的普通 benchmark score 变化；
- 没有新证据的二次报道；
- 轻微产品/UI 更新；
- 仅因为使用了 LLM 就被归为 AI × Mathematics 的论文；
- 证据不足以支撑稳定摘要的 speculative claim。

历史回填应：

- 使用与当前维护相同的 selection threshold；
- 保持 first-publication-date rule；
- 除非记录本身描述的是后续 milestone，否则不要用后来证据重新解释旧事件；
- 接受稀疏的历史时间段。

## 5. 日常维护工作流

普通维护：

1. 搜索最近或目标时间段的公开 sources；
2. 优先 primary papers、official project pages、repositories 与 institutional releases；
3. 检查 canonical corpus 中的重复 ID 与重复故事；
4. 确认 event milestone 与 canonical date；
5. 判断 AI4Math relevance 与 evidence strength；
6. 写入不过度声称 verification 的 portable-v1 record；
7. 运行 `npm run content:check`；
8. 构建静态站点；
9. 提交 focused content PR。

用户无需逐条承担编辑判断。Human approval 主要用于 contested scope、policy change、taxonomy change 或其他实质性的 editorial-contract change。

## 6. Scope changes

修改本契约与添加普通内容是两类不同工作。

以下规则变化应使用独立 PR：

- canonical date rules；
- duplicate/follow-up policy；
- evidence-strength interpretation；
- selection threshold 或 domain boundary。

不要在普通 content PR 中悄悄修改这些规则。
