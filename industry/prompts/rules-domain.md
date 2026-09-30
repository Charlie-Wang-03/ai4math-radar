【AI4Math 领域写作与术语规则】

1. 核心术语
- AI for Mathematics / AI4Math：保留 AI4Math；需要解释时可写“AI for Mathematics（AI4Math）”。
- mathematical reasoning：数学推理。
- automated theorem proving / ATP：自动定理证明；ATP 可保留。
- proof search：证明搜索。
- proof assistant：证明助手 / proof assistant，首次出现可双写。
- formalization：形式化。
- autoformalization：自动形式化。
- formal proof：形式证明。
- verifier / verification：验证器 / 验证；涉及 Lean 等系统时明确“机器验证”或“形式验证”。
- conjecture：猜想。
- counterexample：反例。
- theorem：定理。
- lemma：引理。
- proof state / tactic / kernel：proof state、tactic、kernel 等 proof assistant 专有术语优先保留英文，必要时加中文解释。

2. 不混淆的概念
- model generated a proof / proposed a proof ≠ 已证明。
- expert-checked ≠ formally machine-verified。
- benchmark accuracy / pass rate ≠ 真实研究问题解决率。
- AIME、MATH、GSM8K 等 benchmark 表现 ≠ 自动等价于 research-level mathematics。
- autoformalization ≠ theorem proving：前者重点是把非形式化数学转换为形式语言，后者重点是寻找或生成证明。
- symbolic computation ≠ AI4Math；只有 AI 方法在核心任务中不可替代时才按 AI4Math 描述。

3. 专有名词与项目名
以下通常保留英文原文：
OpenAI、Google DeepMind、Lean、Lean 4、Mathlib、AlphaProof、AlphaGeometry、AlphaEvolve、FunSearch、Claude、GPT、Codex、arXiv。
论文、benchmark、dataset、模型和项目的正式名称原则上不擅自翻译。

4. 数学表达
- 公式、LaTeX、定理编号、变量名、代码、命令、URL 原样保留。
- 不把严格数学术语改成口语近义词。
- 不补写材料没有给出的证明正确性、定理状态、开放问题状态或优先权结论。

5. 证据措辞
按实际证据写：
- “作者声称 / 论文报告”用于未经独立验证的主张；
- “专家核验 / 独立复核”仅在材料明确说明时使用；
- “通过 Lean / 形式系统验证”仅在存在明确机器验证证据时使用；
- “解决开放问题”必须有足够材料支持，不能仅凭标题或机构宣传推断。

6. 通用技术缩写
LLM、RL、RLHF、DPO、SFT、CoT、MCTS、API、SDK、CLI、GPU、TPU、JSON、MCP 等缩写保留英文。Token、Transformer、embedding、fine-tuning 等按 AI/ML 通常用法处理，不译成无关含义。
