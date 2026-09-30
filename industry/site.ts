// AI4Math Radar 的公开站点身份。
// 领域 taxonomy、信源和精选标准仍处于 P1 设计阶段；这里仅建立不误导用户的公开基线。

export const SITE = {
  name: "AI4Math Radar",
  subject: "AI4Math",
  homeTitle: "AI4Math Radar — AI for Mathematics 研究动态",
  description: "面向 AI for Mathematics 的开源研究情报项目。当前正在完成领域信源、分类体系与精选标准的校准。",
  tagline: "追踪 AI × Mathematics 的重要进展",
  locale: "zh-CN",
  defaultUrl: "http://localhost:3000",
  /** MCP 工具名前缀属于外部兼容面，首版即冻结。 */
  mcpPrefix: "ai4math",
  contactEmail: null as string | null,
  footerNote: "基于 AIHOT 开源框架构建",
  icp: null as string | null,
  organization: {
    name: "AI4Math Radar",
    founder: null as null | { name: string; url?: string; description?: string },
  },
  crawlerName: "AI4MathRadarBot",
} as const;

export const ABOUT = {
  kicker: `关于 ${SITE.name}`,
  headline: ["AI × Mathematics 的进展不断出现，", "重要的变化，需要被可靠地筛出来。"] as [string, string],
  lead: `${SITE.name} 正在建设面向 AI for Mathematics 的公开研究情报管线。当前仓库处于早期领域适配阶段，信源、分类与精选标准尚未完成生产校准。`,
  steps: {
    collect: "从公开的一手研究来源、项目与可信二手来源采集材料，并保留原始出处。",
    store: "对材料判重并归档，把围绕同一具体事件的多篇报道组织到一起。",
    select: "使用可审计的模型判断流程进行预筛、独立评分与结构化理解；领域标准将在公开评测集上校准。",
    publish: "通过网页、RSS、公开 API 与 MCP 提供一致的公开读取层；日报与周期报告将在领域适配完成后启用。",
  },
  maker: null as null | {
    name: string;
    greeting: string[];
    avatarSourceId?: string | null;
    wechat?: { title: string; note: string };
    feishu?: { title: string; note: string };
  },
  copyright: `${SITE.name} 是聚合摘要和阅读索引，原文版权归各来源所有。如果你是来源方，希望更正、下架或调整展示方式，可以通过`,
} as const;

export function withSubject(noun: string): string {
  return /[A-Za-z0-9]$/.test(SITE.subject) ? `${SITE.subject} ${noun}` : `${SITE.subject}${noun}`;
}
