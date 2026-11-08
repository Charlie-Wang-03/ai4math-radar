import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const items = readFileSync(new URL("portable/content/selected.jsonl", root), "utf8").trim().split(/\r?\n/).map((x: string) => JSON.parse(x));
const receipt = JSON.parse(readFileSync(new URL("docs/audits/evidence/arxiv-clocked-batch48.json", root), "utf8"));
const frozen = readFileSync(new URL("docs/audits/evidence/issue151-clocked-arxiv-baseline.tsv", root), "utf8").trim().split(/\r?\n/).slice(1).map((x: string) => x.split("\t")[0]);

test("Batch48 frozen rows and day-only chronology preserve legacy links", () => {
  assert.equal(frozen.length, 98);
  assert.deepEqual(receipt.decisions.map((d: {id: string}) => d.id), frozen.slice(46, 51));
  assert.ok(items.length >= 402);
  assert.equal(new Set(items.map((x: {id: string}) => x.id)).size, items.length);
  assert.equal(receipt.decisions.length, 5);
  for (const d of receipt.decisions) {
    const x = items.find((z: {id:string}) => z.id === d.id);
    assert.ok(x);
    assert.equal(x.publishedAt, d.legacyPublishedAt);
    assert.equal(x.links.original, "https://arxiv.org/abs/" + d.arxivId);
    assert.match(x.summary, /旧 publishedAt 是 arXiv v1 提交时刻/);
    assert.deepEqual(x.chronology, {eventKind:"paper-release",milestone:{
      date:d.adoptedDate,precision:"day",evidenceKind:"arxiv-announcement",
      evidenceUrl:"https://rss.arxiv.org/rss/"+d.cat
    }});
    assert.equal(Object.hasOwn(x.chronology.milestone,"at"),false);
    assert.equal(Object.hasOwn(x.chronology,"earliestVerifiedPublic"),false);
    const o=d.observation;
    assert.equal(o.link,x.links.original);
    assert.equal(o.versionGuid,"oai:arXiv.org:"+d.arxivId+"v1");
    assert.equal(o.primaryCategory,d.cat);
    assert.equal(o.announceType,"new");
    assert.ok(o.pubDate.includes(d.adoptedDate.slice(8,10)+" Sep 2026"));
    assert.match(o.gitBlobSha1,/^[a-f0-9]{40}$/);
  }
});

test("Batch48 pinned evidence hashes and cumulative counts", () => {
  assert.equal(receipt.sourceArchive.commit,"e597e5120c034115fda2049d72812f2da7f99f3a");
  assert.equal(receipt.sources.length,15);
  assert.ok(receipt.sources.every((s: {gitBlobSha1:string;completeRead:boolean;fixedCopy:string}) =>
    /^[a-f0-9]{40}$/.test(s.gitBlobSha1) && s.completeRead && s.fixedCopy.includes("ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/")));
  const c=receipt.counts;
  assert.deepEqual([c.frozenCandidates,c.newFirstTimeChecked,c.newlyAdopted,c.totalAdopted,c.totalReviewedHeld,c.totalTechnicalBlocked,c.notYetReviewed,c.withoutSupplementalChronology],[98,5,5,34,17,0,47,64]);
  assert.equal(c.totalAdopted+c.totalReviewedHeld+c.totalTechnicalBlocked+c.notYetReviewed,98);
});
