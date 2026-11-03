import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const data = readFileSync(new URL("portable/content/selected.jsonl", root), "utf8").trim().split(/\r?\n/).map(x => JSON.parse(x));
const evidence = JSON.parse(readFileSync(new URL("docs/audits/evidence/arxiv-clocked-batch43.json", root), "utf8"));
const findOne = (id: string) => { const xs = data.filter((x: {id: string}) => x.id === id); assert.equal(xs.length, 1); return xs[0]; };

test("Batch43 nine IDs in frozen Issue151 rows, no drift in legacy identifiers", () => {
  const lines = readFileSync(new URL("docs/audits/evidence/issue151-clocked-arxiv-baseline.tsv", root), "utf8").trim().split(/\r?\n/).slice(1);
  const frozen = lines.map(x => x.split("\t")[0]);
  assert.equal(frozen.length, 98);
  assert.equal(evidence.decisions.length, 9);
  assert.deepEqual(new Set(evidence.decisions.map((x: {id: string}) => x.id)).size, 9);
  assert.deepEqual(evidence.decisions.filter((x: {scope: string}) => x.scope === "new").map((x: {id: string}) => x.id), frozen.slice(21, 26));
  assert.equal(new Set(data.map((x: {id: string})=>x.id)).size, data.length);
  for (const d of evidence.decisions) {
    assert.ok(frozen.includes(d.id));
    const x = findOne(d.id);
    assert.equal(x.publishedAt, d.legacyPublishedAt);
    assert.equal(x.links.original, "https://arxiv.org/abs/" + d.arxivId);
    assert.match(x.summary, /旧 publishedAt 为 arXiv v1 提交时刻/);
  }
});

test("Six source-backed announcement days remain date-only and never invent a release clock", () => {
  const selected = evidence.decisions.filter((d: {status: string})=>d.status === "ADOPTED_DAY_ONLY");
  assert.equal(selected.length, 6);
  for (const d of selected) {
    const x = findOne(d.id);
    assert.deepEqual(x.chronology, {
      eventKind: "paper-release",
      milestone: {
        date: d.adoptedDate,
        precision: "day",
        evidenceKind: "arxiv-announcement",
        evidenceUrl: "https://rss.arxiv.org/rss/" + d.primaryCategory
      }
    });
    assert.equal(Object.hasOwn(x.chronology.milestone, "at"), false);
    assert.equal(Object.hasOwn(x.chronology, "earliestVerifiedPublic"), false);
    assert.deepEqual(d.observedDates, [d.adoptedDate]);
    for (const o of d.observations) {
      assert.equal(o.versionGuid, "oai:arXiv.org:" + d.arxivId + "v1");
      assert.equal(o.announceType, "new");
      assert.equal(o.primaryCategory, d.primaryCategory);
      assert.equal(new Date(o.pubDate).toISOString().slice(0,10), d.adoptedDate);
      assert.ok(o.fixedCopy.includes(evidence.sourceArchive.commit));
    }
  }
});

test("Three contradictory original v1/new dates are retained unresolved", () => {
  const withheld = evidence.decisions.filter((d: {status: string})=>d.status === "UNRESOLVED_CONFLICT_ORIGINAL_RSS");
  assert.equal(withheld.length, 3);
  for (const d of withheld) {
    assert.equal(findOne(d.id).chronology, undefined);
    assert.deepEqual(d.observedDates, ["2026-09-29","2026-09-30"]);
    assert.equal(d.observations.length, 2);
    assert.match(findOne(d.id).summary, /日期冲突尚未解决/);
    assert.notEqual(d.observations[0].gitBlobSha1, d.observations[1].gitBlobSha1);
  }
});

test("Immutable source receipts and 98-candidate queue counters remain internally consistent", () => {
  const c=evidence.counts;
  assert.equal(evidence.sources.length,12);
  assert.ok(evidence.sources.every((s: {gitBlobSha1:string, completeRead:boolean})=>s.completeRead && /^[a-f0-9]{40}$/.test(s.gitBlobSha1)));
  assert.equal(c.frozenCandidates,98);
  assert.equal(c.previousUniqueReviewed,21);
  assert.equal(c.newFirstTimeChecked,5);
  assert.equal(c.revisitedPreviousTechnicalBlocks,4);
  assert.equal(c.thisRunExamined,9);
  assert.equal(c.newlyAdopted,6);
  assert.equal(c.newlyHeldConflict,3);
  assert.equal(c.totalAdopted,14);
  assert.equal(c.totalReviewedHeld,12);
  assert.equal(c.totalTechnicalBlocked,0);
  assert.equal(c.notYetReviewed,72);
  assert.equal(c.withoutSupplementalChronology,84);
  assert.equal(c.totalAdopted+c.totalReviewedHeld+c.totalTechnicalBlocked+c.notYetReviewed,98);
  assert.equal(c.totalReviewedHeld+c.totalTechnicalBlocked+c.notYetReviewed,84);
  assert.equal(evidence.nextUnreviewed,"2026-09-21-permuformer");
});
