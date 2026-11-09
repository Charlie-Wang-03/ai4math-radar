import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");
const items = read("portable/content/selected.jsonl").trim().split(/\r?\n/).map((s: string) => JSON.parse(s));
const receipt = JSON.parse(read("docs/audits/evidence/arxiv-clocked-batch49.json"));
const frozen = read("docs/audits/evidence/issue151-clocked-arxiv-baseline.tsv")
  .trim().split(/\r?\n/).slice(1).map((s: string) => s.split("\t")[0]);

test("Batch49 frozen rows 52–56 and legacy records", () => {
  assert.equal(frozen.length, 98);
  assert.deepEqual(receipt.decisions.map((d: {id:string}) => d.id), frozen.slice(51, 56));
  assert.equal(receipt.decisions.length, 5);
  assert.ok(items.length >= 409);
  assert.equal(new Set(items.map((i: {id:string}) => i.id)).size, items.length);

  for (const d of receipt.decisions) {
    const x = items.find((i: {id:string}) => i.id === d.id);
    assert.ok(x, d.id);
    assert.equal(x.publishedAt, d.publishedAt);
    assert.equal(x.links.original, "https://arxiv.org/abs/" + d.arxivId);
    if (d.status === "ADOPTED_DAY_ONLY") {
      assert.match(x.summary, /旧 publishedAt 是 arXiv v1 提交时刻/);
      assert.deepEqual(x.chronology, {
        eventKind: "paper-release",
        milestone: {
          date: d.adoptedDate,
          precision: "day",
          evidenceKind: "arxiv-announcement",
          evidenceUrl: "https://rss.arxiv.org/rss/" + d.cat,
        },
      });
      assert.equal(Object.hasOwn(x.chronology.milestone, "at"), false);
      assert.equal(Object.hasOwn(x.chronology, "earliestVerifiedPublic"), false);

      const o = d.observation;
      assert.equal(o.link, x.links.original);
      assert.equal(o.versionGuid, "oai:arXiv.org:" + d.arxivId + "v1");
      assert.equal(o.primaryCategory, d.cat);
      assert.equal(o.announceType, "new");
      assert.equal(new Date(o.pubDate).toISOString().slice(0, 10), d.adoptedDate);
      assert.match(o.gitBlobSha1, /^[a-f0-9]{40}$/);
      assert.ok(receipt.sources.some((s: {path:string;gitBlobSha1:string}) =>
        s.path === o.sourcePath && s.gitBlobSha1 === o.gitBlobSha1));
    } else {
      assert.equal(d.status, "UNRESOLVED_NOT_FOUND_IN_BOUNDED_PRIMARY_CATEGORY_SNAPSHOTS");
      assert.equal(Object.hasOwn(x, "chronology"), false);
      assert.equal(d.checkedDates.length, 9);
    }
  }
});

test("Batch49 source integrity, capture date is not publication date", () => {
  assert.equal(receipt.sourceArchive.commit, "e597e5120c034115fda2049d72812f2da7f99f3a");
  assert.equal(receipt.sources.length, 25);
  assert.ok(receipt.sources.every((s: {path:string;gitBlobSha1:string;completeRead:boolean;fixedCopy:string}) =>
    /^[a-f0-9]{40}$/.test(s.gitBlobSha1) && s.completeRead &&
    s.fixedCopy.includes("ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/") &&
    s.fixedCopy.endsWith(s.path)));
  const dg = receipt.decisions.find((d: {cat:string}) => d.cat === "math.DG");
  assert.equal(dg.sourceDate, "2026-08-20");
  assert.equal(dg.adoptedDate, "2026-08-21");
  const co = receipt.decisions.find((d: {cat:string}) => d.cat === "math.CO");
  assert.equal(co.sourceDate, "2026-08-11");
  assert.equal(co.adoptedDate, "2026-08-12");
  const c = receipt.counts;
  assert.deepEqual(
    [c.frozenCandidates,c.newFirstTimeChecked,c.newlyAdopted,c.newlyHeld,c.totalAdopted,
     c.totalReviewedHeld,c.totalTechnicalBlocked,c.notYetReviewed,c.withoutSupplementalChronology],
    [98,5,4,1,38,18,0,42,60]);
  assert.equal(c.totalAdopted + c.totalReviewedHeld + c.totalTechnicalBlocked + c.notYetReviewed,98);
});
