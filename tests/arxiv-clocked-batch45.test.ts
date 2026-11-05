import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const news = readFileSync(new URL("portable/content/selected.jsonl", root), "utf8").trim().split(/\r?\n/).map((x) => JSON.parse(x));
const receipt = JSON.parse(readFileSync(new URL("docs/audits/evidence/arxiv-clocked-batch45.json", root), "utf8"));
const get = (id: string) => {
  const xs = news.filter((x: { id: string }) => x.id === id);
  assert.equal(xs.length, 1);
  return xs[0]!;
};

test("Batch45 targets exactly frozen rows 32–36 and preserves legacy compatibility", () => {
  const frozen = readFileSync(new URL("docs/audits/evidence/issue151-clocked-arxiv-baseline.tsv", root), "utf8")
    .trim().split(/\r?\n/).slice(1).map((x) => x.split("\t")[0]);
  assert.equal(frozen.length, 98);
  assert.deepEqual(receipt.decisions.map((x: { id: string }) => x.id), frozen.slice(31, 36));
  assert.equal(new Set(news.map((x: { id: string }) => x.id)).size, news.length);
  for (const d of receipt.decisions) {
    const x = get(d.id);
    assert.equal(x.publishedAt, d.legacyPublishedAt);
    assert.equal(x.links.original, "https://arxiv.org/abs/" + d.arxivId);
    assert.match(x.summary, /旧 publishedAt 为 arXiv v1 提交时刻/);
  }
});

test("Four publisher-matched primary v1/new day milestones, one unresolved", () => {
  const yes = receipt.decisions.filter((x: { status: string }) => x.status === "ADOPTED_DAY_ONLY");
  const no = receipt.decisions.filter((x: { status: string }) => x.status === "UNRESOLVED_NO_MATCHING_V1_NEW");
  assert.equal(yes.length, 4);
  assert.equal(no.length, 1);
  for (const d of yes) {
    const x = get(d.id);
    assert.deepEqual(x.chronology, {
      eventKind: "paper-release",
      milestone: {
        date: d.adoptedDate,
        precision: "day",
        evidenceKind: "arxiv-announcement",
        evidenceUrl: "https://rss.arxiv.org/rss/" + d.primaryCategory,
      },
    });
    assert.equal(Object.hasOwn(x.chronology.milestone, "at"), false);
    assert.equal(Object.hasOwn(x.chronology, "earliestVerifiedPublic"), false);
    assert.deepEqual(d.observedDates, [d.adoptedDate]);
    assert.ok(d.observations.some((o: { versionGuid: string; announceType: string; category: string; pubDate: string }) =>
      o.versionGuid === "oai:arXiv.org:" + d.arxivId + "v1" &&
      o.announceType === "new" && o.category === d.primaryCategory && Boolean(o.pubDate)));
  }
  assert.equal(get(no[0].id).chronology, undefined);
  assert.match(get(no[0].id).summary, /UNRESOLVED/);
  assert.deepEqual(no[0].observedDates, []);
});

test("Pinned source receipts, restricted outcome and queue arithmetic", () => {
  assert.equal(receipt.sources.length, 16);
  for (const s of receipt.sources) {
    assert.match(s.gitBlobSha1, /^[0-9a-f]{40}$/);
    assert.equal(s.completeRead, true);
    assert.match(s.fixedCopy, /\/ehijano\/rss_fetch\/blob\/e597e5120c034115fda2049d72812f2da7f99f3a\//);
  }
  const c = receipt.counts;
  assert.deepEqual([
    c.frozenCandidates, c.newFirstTimeChecked, c.newlyAdopted, c.newlyHeldNoV1,
    c.totalAdopted, c.totalReviewedHeld, c.totalTechnicalBlocked,
    c.notYetReviewed, c.withoutSupplementalChronology,
  ], [98, 5, 4, 1, 20, 16, 0, 62, 78]);
  assert.equal(c.totalAdopted + c.totalReviewedHeld + c.totalTechnicalBlocked + c.notYetReviewed, 98);
  assert.equal(c.withoutSupplementalChronology, c.totalReviewedHeld + c.totalTechnicalBlocked + c.notYetReviewed);
  assert.equal(receipt.nextUnreviewed, "2026-09-13-quantum-olympiad-geometry");
  assert.equal(receipt.negativeCoverage.id, "2026-09-16-browning-sawin");
  assert.equal(receipt.additionalObservations.some((x: { versionGuid?: string; announceType: string }) =>
    x.versionGuid === "oai:arXiv.org:2609.15983v2" && x.announceType === "new"), true);
});
