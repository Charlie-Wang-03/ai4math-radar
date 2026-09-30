import test from "node:test";
import assert from "node:assert/strict";
import { parseSelectionGoldJsonl, sampleSelectionGold } from "../scripts/eval-selection-core.ts";

const row = (caseId: string, decision: "select" | "reject" | "either", split = "development", stratum = "boundary") => ({
  caseId,
  material: {
    title: `Title ${caseId}`,
    originalTitle: null,
    publishedAt: "2026-09-30T00:00:00Z",
    sourceName: "Example",
    bodyZh: null,
    bodyOriginal: `Body ${caseId}`,
  },
  sourceFacts: { sourceKind: "rss", sourceTier: "T1", firstParty: true, language: "en" },
  samplingContext: { benchmarkSplit: split, samplingStratum: stratum },
  gold: { decision },
});

test("selection gold parser validates decisions, dates, bodies, and duplicate ids", () => {
  const parsed = parseSelectionGoldJsonl([
    "// comment",
    JSON.stringify(row("a", "select")),
    JSON.stringify(row("b", "reject", "holdout")),
    JSON.stringify(row("c", "either")),
  ].join("\n"));
  assert.equal(parsed.length, 3);
  assert.deepEqual(parsed.map((x) => x.gold.decision), ["select", "reject", "either"]);

  assert.throws(
    () => parseSelectionGoldJsonl([JSON.stringify(row("x", "select")), JSON.stringify(row("x", "reject"))].join("\n")),
    /duplicate caseId/,
  );
  assert.throws(
    () => parseSelectionGoldJsonl(JSON.stringify({ ...row("bad", "select"), gold: { decision: "maybe" } })),
    /gold\.decision/,
  );
  assert.throws(
    () => parseSelectionGoldJsonl(JSON.stringify({ ...row("date", "select"), material: { ...row("date", "select").material, publishedAt: "not-a-date" } })),
    /publishedAt/,
  );
  assert.throws(
    () => parseSelectionGoldJsonl(JSON.stringify({ ...row("body", "select"), material: { ...row("body", "select").material, bodyOriginal: null } })),
    /bodyZh or bodyOriginal/,
  );
});

test("selection gold sampling is deterministic and split-aware", () => {
  const rows = Array.from({ length: 12 }, (_, i) => row(
    `case-${i}`,
    i % 3 === 0 ? "select" : "reject",
    i < 8 ? "development" : "holdout",
    i % 2 ? "benchmark-noise" : "verified-result",
  ));
  const one = sampleSelectionGold(rows, { split: "development", n: 5, seed: 11 }).map((x) => x.caseId);
  const two = sampleSelectionGold(rows, { split: "development", n: 5, seed: 11 }).map((x) => x.caseId);
  const holdout = sampleSelectionGold(rows, { split: "holdout", n: 20, seed: 11 });

  assert.deepEqual(one, two);
  assert.equal(one.length, 5);
  assert.equal(holdout.length, 4);
  assert.ok(holdout.every((x) => x.samplingContext?.benchmarkSplit === "holdout"));
});
