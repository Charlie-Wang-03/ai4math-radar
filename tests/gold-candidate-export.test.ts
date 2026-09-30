import test from "node:test";
import assert from "node:assert/strict";
import { balancedCandidateSample, deterministicKey, splitFor } from "../scripts/export-selection-candidates-core.ts";

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
