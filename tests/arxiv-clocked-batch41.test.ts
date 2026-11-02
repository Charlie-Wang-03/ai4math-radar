import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

type Moment = { date: string; precision: string; evidenceKind: string; evidenceUrl: string; at?: string };
type News = { id: string; originalTitle: string; publishedAt: string; summary: string; links: { original: string; aihot: string }; chronology?: { eventKind: string; milestone: Moment; earliestVerifiedPublic?: unknown } };
type Row = { id: string; arxivId: string; sourceUrl: string; originalTitle: string; storedAt: string; observedV1SubmittedAt: string; observedLabel: string; primaryCategory: string; status: string; adoptedDate: string | null };
type Match = { arxivId: string; title: string; version: string; guid: string; announceType: string; descriptionType: string; sourcePubDate: string; utcDate: string; sourceCategory: string; sourceIndex: number; lines: number[] };
type Source = { kind: string; path: string; complete: boolean; httpStatus: number; bytes: number; sha256: string };
const root = new URL("../", import.meta.url);
const entries: News[] = readFileSync(new URL("portable/content/selected.jsonl", root), "utf8").trim().split(/\r?\n/).map((line) => JSON.parse(line) as News);
const receipt: { inventorySha256: string; counts: Record<string, number>; items: Row[]; originalMatches: Match[]; sourceReceipts: Source[]; renderedMatches: Array<{ timezoneVerified: boolean }> } = JSON.parse(readFileSync(new URL("docs/audits/evidence/arxiv-clocked-batch41.json", root), "utf8"));
function item(id: string): News {
  const found = entries.filter((x) => x.id === id);
  assert.equal(found.length, 1);
  return found[0]!;
}
const expected: Record<string, string> = {
  "2610.15483": "2026-10-14", "2610.12234": "2026-10-09",
  "2610.05367": "2026-10-06", "2610.05322": "2026-10-06",
  "2610.01799": "2026-10-02", "2610.00885": "2026-10-02",
};

test("Batch41 is rows 9-16 of the immutable Issue151 baseline", () => {
  const manifest = readFileSync(new URL("docs/audits/evidence/issue151-clocked-arxiv-baseline.tsv", root));
  assert.equal(createHash("sha256").update(manifest).digest("hex"), receipt.inventorySha256);
  const rows = manifest.toString("utf8").trim().split("\n").slice(1).map((line) => line.split("\t"));
  assert.equal(rows.length, 98);
  assert.deepEqual(rows.slice(8, 16).map((x) => x[0]), receipt.items.map((x) => x.id));
});

test("all eight legacy submission clocks, identities and original titles remain stable", () => {
  for (const row of receipt.items) {
    const current = item(row.id);
    assert.equal(current.publishedAt, row.storedAt);
    assert.equal(row.observedV1SubmittedAt, row.storedAt);
    assert.equal(row.observedLabel, "Submission history [v1]");
    assert.equal(current.links.original, row.sourceUrl);
    assert.ok(current.links.aihot.endsWith(`/items/${row.id}/`));
    assert.equal(current.originalTitle, row.originalTitle);
  }
});

test("six adopted days require matching primary-category v1 new evidence", () => {
  const adopted = receipt.items.filter((row) => row.adoptedDate !== null);
  assert.equal(adopted.length, 6);
  for (const row of adopted) {
    assert.equal(row.adoptedDate, expected[row.arxivId]);
    assert.deepEqual(item(row.id).chronology, { eventKind: "paper-release", milestone: { date: row.adoptedDate, precision: "day", evidenceKind: "arxiv-announcement", evidenceUrl: `https://rss.arxiv.org/rss/${row.primaryCategory}` } });
    const matches = receipt.originalMatches.filter((m) => m.arxivId === row.arxivId && m.sourceCategory === row.primaryCategory && m.announceType === "new");
    assert.ok(matches.length > 0);
    assert.deepEqual([...new Set(matches.map((m) => m.utcDate))], [row.adoptedDate]);
    for (const match of matches) {
      assert.equal(match.version, "1");
      assert.equal(match.guid, `oai:arXiv.org:${row.arxivId}v1`);
      assert.equal(match.descriptionType, "new");
      assert.equal(match.title, row.originalTitle);
      assert.match(match.sourcePubDate, / -0400$/);
      assert.equal(new Date(match.sourcePubDate).toISOString().slice(0, 10), row.adoptedDate);
      assert.equal(receipt.sourceReceipts[match.sourceIndex]!.kind, "xml");
    }
    assert.equal(Object.hasOwn(item(row.id).chronology!.milestone, "at"), false);
    assert.equal(Object.hasOwn(item(row.id).chronology!, "earliestVerifiedPublic"), false);
  }
});

test("SO-RSI conflicting new dates remain unresolved, not min(date)", () => {
  const row = receipt.items.find((r) => r.arxivId === "2610.05701")!;
  const matches = receipt.originalMatches.filter((m) => m.arxivId === row.arxivId && m.announceType === "new");
  assert.deepEqual([...new Set(matches.map((m) => m.utcDate))].sort(), ["2026-10-06", "2026-10-07"]);
  assert.equal(row.status, "HELD_CONFLICTING_NEW_DATES");
  assert.equal(row.adoptedDate, null);
  assert.equal(item(row.id).chronology, undefined);
  assert.match(item(row.id).summary, /日期冲突尚未解决/);
});

test("SCOPE's later replacement cannot stand in for its missing v1 announcement", () => {
  const row = receipt.items.find((r) => r.arxivId === "2610.08319")!;
  assert.equal(row.status, "HELD_NO_MATCHED_V1_NEW");
  assert.equal(row.adoptedDate, null);
  assert.equal(receipt.originalMatches.filter((m) => m.arxivId === row.arxivId && m.announceType === "new").length, 0);
  assert.equal(item(row.id).chronology, undefined);
  assert.match(item(row.id).summary, /v2\/replace 记录不能替代 v1 首次公告/);
});

test("revisions, cross-listings and v1 research content stay distinct", () => {
  const cross = receipt.originalMatches.filter((m) => m.arxivId === "2610.05367" && m.announceType === "cross");
  assert.deepEqual([...new Set(cross.map((m) => m.utcDate))].sort(), ["2026-10-06", "2026-10-07"]);
  const revised = receipt.originalMatches.filter((m) => m.arxivId === "2610.12234" && m.announceType === "replace");
  assert.equal(revised[0]!.version, "2");
  assert.equal(revised[0]!.utcDate, "2026-10-14");
  const quasi = item("2026-10-08-quasi-riemann-ai-assisted-improvement");
  assert.match(quasi.originalTitle, /^Slightly improved/);
  assert.match(quasi.summary, /0\.874957069799/);
  assert.match(quasi.summary, /不借用后续 v2 修订日期或结果/);
});

test("all eight summaries disclose submission-clock semantics and preserve scope", () => {
  for (const row of receipt.items) {
    assert.match(item(row.id).summary, /对应 arXiv v1 提交时刻，不是已核实的公开公告时刻/);
    assert.match(item(row.id).summary, /原有 ID 与兼容时间保持不变/);
  }
  const banks = item("2026-10-11-banks-landau-siegel-explicit");
  assert.doesNotMatch(banks.summary, /于 10 月 11 日发布/);
  assert.match(banks.summary, /不用于确定 OpenAI 原始证明主张的首次公开时间/);
});

test("bounded source receipts retain failed-to-match coverage and explicit provenance", () => {
  assert.equal(receipt.sourceReceipts.length, 36);
  assert.equal(receipt.sourceReceipts.reduce((sum, s) => sum + s.bytes, 0), 17158545);
  for (const s of receipt.sourceReceipts) {
    assert.equal(s.complete, true); assert.equal(s.httpStatus, 200);
    assert.match(s.sha256, /^[a-f0-9]{64}$/);
    assert.match(s.path, /^(rss_data|feed-entries)\//);
  }
  for (const m of receipt.originalMatches) {
    assert.ok(m.sourceIndex >= 0 && m.sourceIndex < receipt.sourceReceipts.length);
    assert.ok(m.lines[0]! > 0 && m.lines[1]! >= m.lines[0]!);
  }
  assert.ok(receipt.renderedMatches.every((m) => m.timezoneVerified === false));
});

test("cumulative reviewed and adopted counts do not hide held cases", () => {
  const c = receipt.counts;
  assert.equal(c.thisBatchReviewed, 8); assert.equal(c.thisBatchAdopted, 6); assert.equal(c.thisBatchHeld, 2);
  assert.equal(c.reviewed, 16); assert.equal(c.adopted, 7); assert.equal(c.held, 9); assert.equal(c.notYetReviewed, 82);
  assert.equal(c.reviewed! + c.notYetReviewed!, c.baselineCandidates);
  assert.equal(c.adopted! + c.held!, c.reviewed);
  assert.equal(c.held! + c.notYetReviewed!, c.remainingWithoutChronology);
  assert.equal(c.remainingWithoutChronology, 91);
});
