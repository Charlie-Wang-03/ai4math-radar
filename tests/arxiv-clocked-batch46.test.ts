import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const all = readFileSync(new URL("portable/content/selected.jsonl", root), "utf8")
  .trim().split(/\r?\n/).map((x: string) => JSON.parse(x));
const receipt = JSON.parse(readFileSync(new URL("docs/audits/evidence/arxiv-clocked-batch46.json", root), "utf8"));
const frozen = readFileSync(new URL("docs/audits/evidence/issue151-clocked-arxiv-baseline.tsv", root), "utf8")
  .trim().split(/\r?\n/).slice(1).map((x: string) => x.split("\t")[0]);
const get = (id: string) => {
  const matches = all.filter((x: {id: string}) => x.id === id);
  assert.equal(matches.length, 1);
  return matches[0]!;
};

test("Batch46 targets exactly frozen rows 37–41; old compatibility and links remain", () => {
  assert.ok(all.length >= 376);
  assert.equal(new Set(all.map((x: {id: string}) => x.id)).size, all.length);
  assert.equal(frozen.length, 98);
  assert.deepEqual(receipt.decisions.map((x: {id: string}) => x.id), frozen.slice(36, 41));
  for (const d of receipt.decisions) {
    const x = get(d.id);
    assert.equal(x.publishedAt, d.legacy);
    assert.equal(x.links.original, "https://arxiv.org/abs/" + d.arxivId);
    assert.match(x.summary, /旧 publishedAt 是 arXiv v1 提交时刻/);
  }
});

test("Four day-only milestones, one source-conflicting original arXiv v1/new", () => {
  const yes = receipt.decisions.filter((x: {status: string}) => x.status === "ADOPTED_DAY_ONLY");
  const no = receipt.decisions.filter((x: {status: string}) => x.status === "UNRESOLVED_CONFLICTING_PRIMARY_V1_NEW");
  assert.equal(yes.length, 4);
  assert.equal(no.length, 1);
  for (const d of yes) {
    const x = get(d.id);
    assert.deepEqual(x.chronology, {
      eventKind: "paper-release",
      milestone: {
        date: "2026-09-15",
        precision: "day",
        evidenceKind: "arxiv-announcement",
        evidenceUrl: "https://rss.arxiv.org/rss/" + d.cat
      }
    });
    assert.equal(Object.hasOwn(x.chronology.milestone, "at"), false);
    assert.equal(Object.hasOwn(x.chronology, "earliestVerifiedPublic"), false);
    assert.deepEqual(d.observedDates, ["2026-09-15"]);
    assert.ok(d.observations.some((o: {versionGuid: string; announceType: string; category: string; pubDate: string}) =>
      o.versionGuid === "oai:arXiv.org:" + d.arxivId + "v1" &&
      o.announceType === "new" && o.category === d.cat && o.pubDate.includes("15 Sep 2026")));
  }
  const missing = get(no[0].id);
  // A subsequent, separately evidenced audit may legitimately resolve this historical conflict.
  if (missing.chronology === undefined) assert.match(missing.summary, /UNRESOLVED/);
  else assert.ok(missing.chronology.milestone?.evidenceUrl);
  assert.deepEqual(no[0].observedDates, ["2026-09-15", "2026-09-16"]);
  assert.equal(no[0].observations.length, 2);
  assert.ok(no[0].observations.every((o: {announceType: string; category: string; versionGuid: string}) =>
    o.announceType === "new" && o.category === "cs.AI" &&
    o.versionGuid === "oai:arXiv.org:2609.13356v1"));
});

test("Pinned historical sources, independent cross-list and cumulative queue", () => {
  assert.equal(receipt.sources.length, 12);
  for (const s of receipt.sources) {
    assert.match(s.gitBlobSha1, /^[0-9a-f]{40}$/);
    assert.equal(s.completeRead, true);
    assert.ok(s.fixedCopy.includes("ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/"));
  }
  assert.equal(receipt.additionalObservations.length, 1);
  assert.equal(receipt.additionalObservations[0].announceType, "cross");
  const c = receipt.counts;
  assert.deepEqual([
    c.frozenCandidates, c.newFirstTimeChecked, c.newlyAdopted, c.newlyHeldConflicting,
    c.totalAdopted, c.totalReviewedHeld, c.totalTechnicalBlocked, c.notYetReviewed,
    c.withoutSupplementalChronology
  ], [98, 5, 4, 1, 24, 17, 0, 57, 74]);
  assert.equal(c.totalAdopted + c.totalReviewedHeld + c.totalTechnicalBlocked + c.notYetReviewed, 98);
  assert.equal(c.totalReviewedHeld + c.totalTechnicalBlocked + c.notYetReviewed, c.withoutSupplementalChronology);
  assert.equal(receipt.nextUnreviewed, "2026-09-10-sullivan-no-wandering-domains-lean");
});
