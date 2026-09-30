// AI4Math Radar 的领域分类体系。
// CATEGORIES 表示“这项工作属于哪个 AI × Mathematics 研究方向”；
// CATEGORY_TAGS 表示“这条材料以什么内容形态出现”。两者刻意分离。

export const CATEGORIES = [
  { key: "math-reasoning", label: "数学推理", section: "数学推理", guide: "非形式化或半形式化数学推理、研究级数学问题求解、数学 reasoning model 与推理方法" },
  { key: "theorem-proving", label: "定理证明", section: "定理证明与形式化", guide: "自动定理证明、proof search、proof agent、formal proof generation 与证明验证工作流" },
  { key: "formal-math", label: "形式化数学", section: "定理证明与形式化", guide: "autoformalization、Lean/Mathlib 等 proof assistant 生态、formal corpus 与机器可验证数学资产" },
  { key: "math-discovery", label: "数学发现", section: "数学发现", guide: "AI 辅助猜想生成、反例搜索、算法或构造发现、开放数学问题研究进展" },
  { key: "evaluation", label: "评测与数据", section: "评测与基础设施", guide: "AI4Math benchmark、dataset、verifier、expert evaluation、污染与评测方法研究" },
  { key: "ecosystem", label: "工具与生态", section: "评测与基础设施", guide: "AI4Math 工具、研究基础设施、研究计划、机构与社区生态变化" },
] as const;

export const ITEM_TYPES = [
  "model_release",
  "product_launch",
  "tool_or_prompt",
  "research_paper",
  "industry_event",
  "opinion_analysis",
  "tutorial_explainer",
] as const;

/** 每篇资料的第一个标签描述内容形态，而不是领域方向。 */
export const CATEGORY_TAGS = [
  "模型/系统",
  "工具/开源",
  "论文/研究",
  "评测/数据",
  "研究生态",
  "观点/解读",
  "教程/实践",
  "其他",
] as const;

export const TOPIC_TAGS = [
  "数学推理",
  "自动定理证明",
  "证明搜索",
  "形式化",
  "自动形式化",
  "数学发现",
  "猜想生成",
  "反例搜索",
  "验证",
  "几何推理",
  "代数",
  "组合数学",
  "数论",
  "理论计算机科学",
  "多智能体",
  "强化学习",
  "工具调用",
] as const;

export const ENTITY_TAGS = [
  "OpenAI",
  "Google DeepMind",
  "Lean",
  "Mathlib",
  "Microsoft Research",
  "Meta",
  "Anthropic",
  "Hugging Face",
  "arXiv",
] as const;

export const TAG_SYNONYMS: Readonly<Record<string, string>> = {
  模型: "模型/系统",
  系统: "模型/系统",
  "模型发布": "模型/系统",
  product: "工具/开源",
  产品: "工具/开源",
  工具: "工具/开源",
  开源: "工具/开源",
  仓库: "工具/开源",
  repo: "工具/开源",
  "open-source": "工具/开源",
  论文: "论文/研究",
  研究: "论文/研究",
  paper: "论文/研究",
  papers: "论文/研究",
  benchmark: "评测/数据",
  benchmarks: "评测/数据",
  评测: "评测/数据",
  基准: "评测/数据",
  数据集: "评测/数据",
  dataset: "评测/数据",
  生态: "研究生态",
  机构: "研究生态",
  计划: "研究生态",
  观点: "观点/解读",
  解读: "观点/解读",
  分析: "观点/解读",
  教程: "教程/实践",
  实践: "教程/实践",
  指南: "教程/实践",
  theorem_proving: "自动定理证明",
  "theorem proving": "自动定理证明",
  proof_search: "证明搜索",
  "proof search": "证明搜索",
  autoformalization: "自动形式化",
  formalization: "形式化",
  verification: "验证",
  verifier: "验证",
  "mathematical discovery": "数学发现",
  reasoning: "数学推理",
};

export const CATEGORY_BY_ITEM_TYPE: Readonly<Record<string, string>> = {
  model_release: "模型/系统",
  product_launch: "工具/开源",
  tool_or_prompt: "工具/开源",
  research_paper: "论文/研究",
  industry_event: "研究生态",
  opinion_analysis: "观点/解读",
  tutorial_explainer: "教程/实践",
};

export const ENTITIES: Record<string, { name: string; displayTag: string | null; aliases: string[] }> = {
  openai: { name: "OpenAI", displayTag: "OpenAI", aliases: ["OpenAI", "GPT", "o1", "o3", "o4", "Codex"] },
  deepmind: { name: "Google DeepMind", displayTag: "Google DeepMind", aliases: ["Google DeepMind", "DeepMind", "AlphaProof", "AlphaGeometry", "AlphaEvolve", "FunSearch"] },
  lean: { name: "Lean", displayTag: "Lean", aliases: ["Lean", "Lean 4", "Lean theorem prover"] },
  mathlib: { name: "Mathlib", displayTag: "Mathlib", aliases: ["Mathlib", "mathlib4", "Lean mathematical library"] },
  microsoft: { name: "Microsoft Research", displayTag: "Microsoft Research", aliases: ["Microsoft Research", "Microsoft", "MSR"] },
  meta: { name: "Meta", displayTag: "Meta", aliases: ["Meta", "Meta AI"] },
  anthropic: { name: "Anthropic", displayTag: "Anthropic", aliases: ["Anthropic", "Claude"] },
  "hugging-face": { name: "Hugging Face", displayTag: "Hugging Face", aliases: ["Hugging Face", "HuggingFace"] },
  arxiv: { name: "arXiv", displayTag: "arXiv", aliases: ["arXiv"] },
};

export const IDENTITY_LEXICON: ReadonlyArray<{ id: string; name: string; patterns: RegExp[] }> = [
  { id: "openai", name: "OpenAI", patterns: [/openai|chatgpt|\bgpt(?:-|\s)?[a-z0-9.]+|\bo[134](?:[-\s][a-z0-9.]+)?\b|\bcodex\b/i] },
  { id: "deepmind", name: "Google DeepMind", patterns: [/google\s*deepmind|\bdeepmind\b|alphaproof|alphageometry|alphaevolve|funsearch/i] },
  { id: "lean", name: "Lean", patterns: [/\blean(?:\s*4)?\b|lean theorem prover/i] },
  { id: "mathlib", name: "Mathlib", patterns: [/\bmathlib(?:4)?\b/i] },
  { id: "microsoft", name: "Microsoft Research", patterns: [/microsoft\s*research|\bmsr\b/i] },
  { id: "meta", name: "Meta", patterns: [/\bmeta(?:\s+ai)?\b/i] },
  { id: "anthropic", name: "Anthropic", patterns: [/anthropic|\bclaude\b/i] },
  { id: "hugging-face", name: "Hugging Face", patterns: [/hugging\s?face/i] },
  { id: "arxiv", name: "arXiv", patterns: [/\barxiv\b/i] },
];

/** 只列能够明确表明发布主体的官方域名；GitHub、arXiv 等托管域名不映射为主体。 */
export const PUBLISHER_DOMAINS: ReadonlyArray<{ entityId: string; domains: readonly string[] }> = [
  { entityId: "openai", domains: ["openai.com"] },
  { entityId: "deepmind", domains: ["deepmind.google"] },
  { entityId: "lean", domains: ["lean-lang.org"] },
  { entityId: "microsoft", domains: ["microsoft.com"] },
  { entityId: "meta", domains: ["ai.meta.com"] },
  { entityId: "anthropic", domains: ["anthropic.com"] },
  { entityId: "hugging-face", domains: ["huggingface.co"] },
];

export const IDENTITY_CONTEXT_ALIASES: ReadonlyArray<{ entityId: string; pattern: RegExp }> = [
  { entityId: "mathlib", pattern: /leanprover-community\/mathlib4?/i },
  { entityId: "lean", pattern: /leanprover\/lean4/i },
];
