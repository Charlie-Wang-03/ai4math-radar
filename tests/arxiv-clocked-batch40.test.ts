import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

type Moment = { date: string; precision: string; evidenceKind: string; evidenceUrl: string; at?: string };
type News = { id: string; publishedAt: string; summary: string; links: { original: string; aihot: string }; chronology?: { eventKind: string; milestone: Moment; earliestVerifiedPublic?: unknown } };
type AuditRow = { id: string; arxivId: string; sourceUrl: string; storedAt: string; observedV1SubmittedAt: string; observedLabel: string; status: string; adoptedDate: string | null };
type Match = { arxivId: string; guid: string; announceType: string; descriptionVersion: string; descriptionType: string; utcDate: string; sourcePubDate: string; sourceCategory: string; sourceSha256: string; archivePath: string };
const root = new URL("../", import.meta.url);
const entries: News[] = readFileSync(new URL("portable/content/selected.jsonl", root), "utf8").trim().split(/\r?\n/).map((line) => JSON.parse(line) as News);
const receipt: { inventorySha256: string; counts: Record<string, number>; items: AuditRow[]; originalMatches: Match[]; renderedArchive: { limitation: string } } = JSON.parse(readFileSync(new URL("docs/audits/evidence/arxiv-clocked-batch40.json", root), "utf8"));
const manifest = readFileSync(new URL("docs/audits/evidence/issue151-clocked-arxiv-baseline.tsv", root));
function item(id: string): News {
  const found = entries.filter((x) => x.id === id);
  assert.equal(found.length, 1);
  return found[0]!;
}

test("Issue151 inventory is the immutable 98-item baseline, not all future daily entries", () => {
  assert.equal(createHash("sha256").update(manifest).digest("hex"), receipt.inventorySha256);
  const rows = manifest.toString("utf8").trim().split("\n").slice(1).map((x) => x.split("\t"));
  assert.equal(rows.length, 98);
  assert.equal(new Set(rows.map((x) => x[0])).size, 98);
  assert.deepEqual(rows.slice(0, 8).map((x) => x[0]), receipt.items.map((x) => x.id));
  assert.ok(rows.every((x) => x.length === 3 && !/T00:00:00(?:\.000)?Z$/.test(x[1]!) && x[2]!.startsWith("https://arxiv.org/abs/")));
});

test("Batch40 preserves all eight legacy seconds, identities and primary links", () => {
  for (const row of receipt.items) {
    const current = item(row.id);
    assert.equal(current.publishedAt, row.storedAt);
    assert.equal(current.links.original, row.sourceUrl);
    assert.ok(current.links.aihot.endsWith(`/items/${row.id}/`));
    assert.equal(row.observedV1SubmittedAt, row.storedAt);
    assert.equal(row.observedLabel, "Submission history [v1]");
  }
});

test("h-bases uses only an original new-announcement day, never RSS midnight as an instant", () => {
  const current = item("2026-10-14-aristotle-postage-stamp-h-bases");
  assert.deepEqual(current.chronology, { eventKind: "paper-release", milestone: { date: "2026-10-15", precision: "day", evidenceKind: "arxiv-announcement", evidenceUrl: "https://rss.arxiv.org/rss/math.CO" } });
  assert.equal(Object.hasOwn(current.chronology!.milestone, "at"), false);
  assert.equal(Object.hasOwn(current.chronology!, "earliestVerifiedPublic"), false);
  const matches = receipt.originalMatches.filter((x) => x.arxivId === "2610.19470");
  assert.equal(matches.length, 1);
  const source = matches[0]!;
  assert.equal(source.guid, "oai:arXiv.org:2610.19470v1");
  assert.equal(source.descriptionVersion, "2610.19470v1");
  assert.equal(source.announceType, "new");
  assert.equal(source.descriptionType, "new");
  assert.equal(source.sourceCategory, "math.CO");
  assert.equal(source.utcDate, "2026-10-15");
  assert.equal(source.sourcePubDate, "Thu, 15 Oct 2026 00:00:00 -0400");
  assert.match(source.sourceSha256, /^[a-f0-9]{64}$/);
});

test("conflicting original new dates are retained rather than reduced to min(date)", () => {
  for (const id of ["2610.17331", "2610.18301"]) {
    const dates = new Set(receipt.originalMatches.filter((x) => x.arxivId === id).map((x) => x.utcDate));
    assert.deepEqual([...dates].sort(), ["2026-10-14", "2026-10-15"]);
    const row = receipt.items.find((x) => x.arxivId === id)!;
    assert.equal(row.status, "HELD_CONFLICTING_NEW_DATES");
    assert.equal(row.adoptedDate, null);
    assert.match(item(row.id).summary, /日期冲突尚未解决/);
  }
  const ineq = receipt.items.find((x) => x.arxivId === "2610.20681")!;
  assert.equal(ineq.adoptedDate, null);
  assert.match(item(ineq.id).summary, /10 月 16 日和 10 月 17 日/);
});

test("rendered-only source text is not silently treated as a UTC timestamp", () => {
  assert.match(receipt.renderedArchive.limitation, /omits a timezone/);
  const held = receipt.items.filter((x) => x.status === "HELD_RENDERED_ONLY_NO_ORIGINAL_UTC_DATE");
  assert.equal(held.length, 4);
  for (const row of held) {
    assert.equal(row.adoptedDate, null);
    assert.match(item(row.id).summary, /首次 arXiv 公告日期仍待核/);
  }
});

test("public summaries identify submission clocks without certifying original discovery", () => {
  for (const row of receipt.items) {
    assert.match(item(row.id).summary, /对应 arXiv v1 提交时刻，不是已核实的公开公告时刻/);
    assert.match(item(row.id).summary, /原有 ID 与兼容时间保持不变/);
  }
  assert.doesNotMatch(item("2026-10-14-aristotle-postage-stamp-h-bases").summary, /于 10 月 14 日发布/);
  assert.doesNotMatch(item("2026-10-13-annalschallenge").summary, /于 10 月 13 日发布/);
  assert.match(item("2026-10-14-aristotle-postage-stamp-h-bases").summary, /不将该论文公告视为 Aristotle 原始发现或证明工件首次公开/);
});

test("reviewed, adopted, held and not-yet-reviewed counts are separate", () => {
  assert.equal(receipt.items.length, 8);
  assert.equal(receipt.items.filter((x) => x.adoptedDate !== null).length, 1);
  assert.equal(receipt.counts.reviewed, 8);
  assert.equal(receipt.counts.held, 7);
  assert.equal(receipt.counts.notYetReviewed, 90);
  assert.equal(receipt.counts.remainingWithoutChronology, 97);
  assert.equal(receipt.counts.reviewed! + receipt.counts.notYetReviewed!, receipt.counts.baselineCandidates);
});
