import { createHash } from "node:crypto";

export interface GoldCandidateSourceRow {
  articleId: string;
  sourceId: string;
}

function hashNumber(value: string): number {
  return Number.parseInt(createHash("sha256").update(value).digest("hex").slice(0, 8), 16) >>> 0;
}

export function deterministicKey(id: string, seed: number): number {
  return hashNumber(`${seed}:${id}`);
}

export function splitFor(id: string, seed: number, holdoutPercent = 20): "development" | "holdout" {
  if (!Number.isInteger(holdoutPercent) || holdoutPercent < 0 || holdoutPercent > 100) {
    throw new Error("holdoutPercent must be an integer from 0 to 100");
  }
  return deterministicKey(`split:${id}`, seed) % 100 < holdoutPercent ? "holdout" : "development";
}

export function balancedCandidateSample<T extends GoldCandidateSourceRow>(rows: T[], n: number, seed: number): T[] {
  if (!Number.isInteger(n) || n <= 0) throw new Error("n must be a positive integer");
  const groups = new Map<string, T[]>();
  for (const row of rows) {
    const list = groups.get(row.sourceId) ?? [];
    list.push(row);
    groups.set(row.sourceId, list);
  }
  for (const list of groups.values()) {
    list.sort((a, b) => deterministicKey(a.articleId, seed) - deterministicKey(b.articleId, seed) || a.articleId.localeCompare(b.articleId));
  }
  const sourceIds = [...groups.keys()].sort(
    (a, b) => deterministicKey(`source:${a}`, seed) - deterministicKey(`source:${b}`, seed) || a.localeCompare(b),
  );

  const out: T[] = [];
  let round = 0;
  while (out.length < n) {
    let added = false;
    for (const sourceId of sourceIds) {
      const row = groups.get(sourceId)?.[round];
      if (!row) continue;
      out.push(row);
      added = true;
      if (out.length === n) break;
    }
    if (!added) break;
    round++;
  }
  return out;
}

export interface GoldCandidateRecord extends GoldCandidateSourceRow {
  title: string;
  publishedAt: Date | null;
  bodyText: string | null;
  excerpt: string | null;
  language: string | null;
  sourceName: string;
  sourceKind: string;
  tier: string;
  firstParty: boolean;
}

export function candidateToGoldRow(row: GoldCandidateRecord, seed: number, holdoutPercent = 20) {
  return {
    caseId: `real-${row.articleId}`,
    material: {
      title: row.title,
      originalTitle: null,
      publishedAt: row.publishedAt?.toISOString() ?? null,
      sourceName: row.sourceName,
      bodyZh: null,
      bodyOriginal: row.bodyText?.trim() || row.excerpt?.trim() || null,
    },
    sourceFacts: {
      sourceKind: row.sourceKind,
      sourceTier: row.tier,
      firstParty: row.firstParty,
      language: row.language,
    },
    samplingContext: {
      benchmarkSplit: splitFor(row.articleId, seed, holdoutPercent),
      samplingStratum: `source:${row.sourceId}`,
    },
    gold: {
      decision: "either" as const,
    },
  };
}
