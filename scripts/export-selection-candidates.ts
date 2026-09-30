// Exports a deterministic, source-balanced set of real collected articles for AI4Math selection labeling.
// The output is valid selection-gold JSONL with gold.decision="either" as an explicit unlabeled placeholder.
// Usage:
//   node --env-file=.env scripts/export-selection-candidates.ts --out .data/gold-candidates.jsonl
//     [--n 160] [--days 90] [--seed 7] [--holdout 20]
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { REPO_ROOT } from "@aihot/backend/config";
import { closeDb, sql } from "@aihot/backend/db";
import { balancedCandidateSample, candidateToGoldRow, splitFor } from "./export-selection-candidates-core.ts";

const { values } = parseArgs({
  options: {
    out: { type: "string", default: ".data/gold-candidates.jsonl" },
    n: { type: "string", default: "160" },
    days: { type: "string", default: "90" },
    seed: { type: "string", default: "7" },
    holdout: { type: "string", default: "20" },
  },
});

function positiveInt(value: string, name: string): number {
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) throw new Error(`--${name} must be a positive integer`);
  return n;
}

const n = positiveInt(values.n!, "n");
const days = positiveInt(values.days!, "days");
const seed = Number(values.seed);
const holdout = Number(values.holdout);
if (!Number.isInteger(seed)) throw new Error("--seed must be an integer");
if (!Number.isInteger(holdout) || holdout < 0 || holdout > 100) throw new Error("--holdout must be an integer from 0 to 100");

interface DbRow {
  article_id: string;
  title: string;
  published_at: Date | null;
  body_text: string | null;
  excerpt: string | null;
  language: string | null;
  source_id: string;
  source_name: string;
  source_kind: string;
  tier: string;
  first_party: boolean;
  discovered_at: Date;
}

try {
  const rows = await sql<DbRow[]>`
    SELECT
      a.id AS article_id,
      a.title,
      a.published_at,
      a.body_text,
      a.excerpt,
      a.language,
      a.discovered_at,
      s.id AS source_id,
      s.name AS source_name,
      s.kind AS source_kind,
      s.tier,
      s.first_party
    FROM articles a
    JOIN sources s ON s.id = a.source_id
    WHERE s.participation_mode = 'editorial'
      AND a.discovered_at >= now() - make_interval(days => ${days})
      AND a.body_status IN ('ok', 'unconfirmed')
      AND (nullif(trim(a.body_text), '') IS NOT NULL OR nullif(trim(a.excerpt), '') IS NOT NULL)
    ORDER BY a.discovered_at DESC, a.id
    LIMIT 5000
  `;

  const sampled = balancedCandidateSample(
    rows.map((row) => ({ ...row, articleId: row.article_id, sourceId: row.source_id })),
    n,
    seed,
  );
  if (!sampled.length) throw new Error("no eligible real articles found; collect content before exporting calibration candidates");

  const lines = sampled.map((row) => JSON.stringify(candidateToGoldRow({
    articleId: row.article_id,
    sourceId: row.source_id,
    title: row.title,
    publishedAt: row.published_at,
    bodyText: row.body_text,
    excerpt: row.excerpt,
    language: row.language,
    sourceName: row.source_name,
    sourceKind: row.source_kind,
    tier: row.tier,
    firstParty: row.first_party,
  }, seed, holdout)));

  const out = path.resolve(REPO_ROOT, values.out!);
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, lines.join("\n") + "\n");

  const splitCounts = sampled.reduce((acc, row) => {
    const split = splitFor(row.article_id, seed, holdout);
    acc[split] = (acc[split] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const sourceCounts = sampled.reduce((acc, row) => {
    acc[row.source_id] = (acc[row.source_id] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log(JSON.stringify({
    out,
    requested: n,
    exported: sampled.length,
    candidatePool: rows.length,
    days,
    seed,
    holdoutPercent: holdout,
    splitCounts,
    sourceCounts,
    unlabeledDecision: "either",
  }, null, 2));
} finally {
  await closeDb();
}
