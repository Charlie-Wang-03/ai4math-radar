import test from "node:test";
import assert from "node:assert/strict";
import { balancedCandidateSample, candidateToGoldRow, deterministicKey, splitFor } from "../scripts/export-selection-candidates-core.ts";
import { parseSelectionGoldJsonl } from "../scripts/eval-selection-core.ts";

const rows = [
  { articleId: "a1", sourceId: "a" },
  { articleId: "a2", sourceId: "a" },
  { articleId: "a3", sourceId: "a" },
  { articleId: "b1", sourceId: "b" },
  { articleId: "b2", sourceId: "b" },
  { articleId: "c1", sourceId: "c" },
];

test("candidate sampling is deterministic and source-balanced before exhausting sparse sources", () => {
  const one = balancedCandidateSample(rows, 5, 7).map((x) => x.articleId);
  const two = balancedCandidateSample(rows, 5, 7).map((x) => x.articleId);
  assert.deepEqual(one, two);
  assert.equal(one.length, 5);

  const sources = one.map((id) => rows.find((row) => row.articleId === id)!.sourceId);
  assert.deepEqual(new Set(sources.slice(0, 3)), new Set(["a", "b", "c"]));
});

test("candidate sampling returns the available pool when n is larger than the corpus", () => {
  const sampled = balancedCandidateSample(rows, 99, 3);
  assert.equal(sampled.length, rows.length);
  assert.equal(new Set(sampled.map((x) => x.articleId)).size, rows.length);
});

test("development/holdout assignment is stable for a fixed seed", () => {
  const ids = Array.from({ length: 100 }, (_, i) => "item-" + i);
  const first = ids.map((id) => splitFor(id, 7, 20));
  const second = ids.map((id) => splitFor(id, 7, 20));
  assert.deepEqual(first, second);
  assert.ok(first.includes("development"));
  assert.ok(first.includes("holdout"));
});

test("hash keys and split percentages validate inputs", () => {
  assert.equal(deterministicKey("x", 1), deterministicKey("x", 1));
  assert.throws(() => balancedCandidateSample(rows, 0, 7), /positive integer/);
  assert.throws(() => splitFor("x", 7, -1), /0 to 100/);
  assert.throws(() => splitFor("x", 7, 101), /0 to 100/);
});

test("exported candidate rows are valid selection-gold rows and remain explicitly unlabeled", () => {
  const gold = candidateToGoldRow({
    articleId: "real-1",
    sourceId: "rss-openai-news",
    title: "Example theorem-proving result",
    publishedAt: new Date("2026-09-30T00:00:00Z"),
    bodyText: "A real collected article body.",
    excerpt: null,
    language: "en",
    sourceName: "OpenAI News",
    sourceKind: "rss",
    tier: "T1",
    firstParty: true,
  }, 7, 20);
  const [parsed] = parseSelectionGoldJsonl(JSON.stringify(gold));
  assert.equal(parsed!.caseId, "real-real-1");
  assert.equal(parsed!.gold.decision, "either");
  assert.match(parsed!.samplingContext!.samplingStratum!, /^source:/);
});
