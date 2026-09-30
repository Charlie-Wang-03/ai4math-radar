export type SelectionDecision = "select" | "reject" | "either";

export interface SelectionGoldRow {
  caseId: string;
  material: {
    title: string;
    originalTitle: string | null;
    publishedAt: string | null;
    sourceName: string;
    bodyZh: string | null;
    bodyOriginal: string | null;
  };
  sourceFacts: {
    sourceKind: string;
    sourceTier?: string;
    firstParty?: boolean;
    language?: string | null;
  };
  samplingContext?: {
    benchmarkSplit?: string;
    samplingStratum?: string;
  };
  gold: { decision: SelectionDecision };
}

function record(value: unknown, line: number, field: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`line ${line}: ${field} must be an object`);
  }
  return value as Record<string, unknown>;
}

function requiredString(obj: Record<string, unknown>, key: string, line: number, field = key): string {
  const value = obj[key];
  if (typeof value !== "string" || !value.trim()) throw new Error(`line ${line}: ${field} must be a non-empty string`);
  return value;
}

function optionalString(obj: Record<string, unknown>, key: string, line: number): string | null {
  const value = obj[key];
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") throw new Error(`line ${line}: ${key} must be a string or null`);
  return value;
}

function decision(value: unknown, line: number): SelectionDecision {
  if (value !== "select" && value !== "reject" && value !== "either") {
    throw new Error(`line ${line}: gold.decision must be select, reject, or either`);
  }
  return value;
}

export function parseSelectionGoldJsonl(text: string): SelectionGoldRow[] {
  const rows: SelectionGoldRow[] = [];
  const ids = new Set<string>();
  for (const [index, raw] of text.split(/\r?\n/).entries()) {
    const line = index + 1;
    if (!raw.trim() || raw.trim().startsWith("//")) continue;
    let value: unknown;
    try {
      value = JSON.parse(raw);
    } catch (error) {
      throw new Error(`line ${line}: invalid JSON: ${String(error)}`);
    }
    const obj = record(value, line, "row");
    const caseId = requiredString(obj, "caseId", line);
    if (ids.has(caseId)) throw new Error(`line ${line}: duplicate caseId ${caseId}`);
    ids.add(caseId);

    const material = record(obj.material, line, "material");
    const sourceFacts = record(obj.sourceFacts, line, "sourceFacts");
    const gold = record(obj.gold, line, "gold");
    const sampling = obj.samplingContext === undefined
      ? undefined
      : record(obj.samplingContext, line, "samplingContext");

    const publishedAt = optionalString(material, "publishedAt", line);
    if (publishedAt && Number.isNaN(new Date(publishedAt).getTime())) {
      throw new Error(`line ${line}: material.publishedAt is not a valid date`);
    }
    if (sourceFacts.firstParty !== undefined && typeof sourceFacts.firstParty !== "boolean") {
      throw new Error(`line ${line}: sourceFacts.firstParty must be a boolean`);
    }

    const bodyZh = optionalString(material, "bodyZh", line);
    const bodyOriginal = optionalString(material, "bodyOriginal", line);
    if (!bodyZh && !bodyOriginal) {
      throw new Error(`line ${line}: material must include bodyZh or bodyOriginal`);
    }

    rows.push({
      caseId,
      material: {
        title: requiredString(material, "title", line, "material.title"),
        originalTitle: optionalString(material, "originalTitle", line),
        publishedAt,
        sourceName: requiredString(material, "sourceName", line, "material.sourceName"),
        bodyZh,
        bodyOriginal,
      },
      sourceFacts: {
        sourceKind: requiredString(sourceFacts, "sourceKind", line, "sourceFacts.sourceKind"),
        ...(optionalString(sourceFacts, "sourceTier", line) ? { sourceTier: optionalString(sourceFacts, "sourceTier", line)! } : {}),
        ...(sourceFacts.firstParty !== undefined ? { firstParty: sourceFacts.firstParty as boolean } : {}),
        ...(sourceFacts.language !== undefined ? { language: optionalString(sourceFacts, "language", line) } : {}),
      },
      ...(sampling ? {
        samplingContext: {
          ...(optionalString(sampling, "benchmarkSplit", line) ? { benchmarkSplit: optionalString(sampling, "benchmarkSplit", line)! } : {}),
          ...(optionalString(sampling, "samplingStratum", line) ? { samplingStratum: optionalString(sampling, "samplingStratum", line)! } : {}),
        },
      } : {}),
      gold: { decision: decision(gold.decision, line) },
    });
  }
  return rows;
}

function rng(seed: number) {
  let state = seed >>> 0;
  return () => ((state = (state * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

export function sampleSelectionGold(
  rows: SelectionGoldRow[],
  opts: { split?: string; n?: number; seed?: number } = {},
): SelectionGoldRow[] {
  const split = opts.split ?? "all";
  const n = opts.n ?? rows.length;
  const rand = rng(opts.seed ?? 7);
  const pool = split === "all" ? rows : rows.filter((row) => row.samplingContext?.benchmarkSplit === split);
  return pool
    .map((row) => ({ row, key: rand() }))
    .sort((a, b) => a.key - b.key)
    .slice(0, Math.max(0, n))
    .map(({ row }) => row);
}
