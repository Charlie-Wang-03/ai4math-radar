import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const root = new URL("../", import.meta.url);
const news = readFileSync(new URL("portable/content/selected.jsonl", root), "utf8").trim().split(/\r?\n/).map(line=>JSON.parse(line));
const r = JSON.parse(readFileSync(new URL("docs/audits/evidence/arxiv-clocked-batch42.json", root), "utf8"));
const item = (id:string) => { const a=news.filter((x: {id:string})=>x.id===id); assert.equal(a.length,1); return a[0]!; };
test("Batch42 fixed five identities follow immutable Issue151 rows 17-21", () => {
 const rows=readFileSync(new URL("docs/audits/evidence/issue151-clocked-arxiv-baseline.tsv",root),"utf8").trim().split(/\r?\n/).slice(1).map(line=>line.split("\t"));
 assert.equal(rows.length,98); assert.deepEqual(rows.slice(16,21).map(x=>x[0]),r.rows.map((x:{id:string})=>x.id));
 assert.equal(new Set(news.map((x:{id:string})=>x.id)).size,news.length);
});
test("Zeta distinct zeros: v1 submission preserved and date-only announced RSS milestone",()=>{
 const x=item("2026-09-27-riemann-zeros-distinct");
 assert.equal(x.publishedAt,"2026-09-27T00:19:21.000Z");
 assert.equal(x.links.original,"https://arxiv.org/abs/2609.33043");
 assert.equal(x.originalTitle,r.adopted.originalTitle);
 assert.deepEqual(x.chronology,{eventKind:"paper-release",milestone:{date:"2026-09-29",precision:"day",evidenceKind:"arxiv-announcement",evidenceUrl:"https://rss.arxiv.org/rss/math.NT"}});
 assert.equal(Object.hasOwn(x.chronology.milestone,"at"),false);
 assert.equal(Object.hasOwn(x.chronology,"earliestVerifiedPublic"),false);
 assert.match(x.summary,/仅是 arXiv v1 提交时间/);
 assert.equal(r.adopted.v1Guid,"oai:arXiv.org:2609.33043v1");
 assert.equal(r.adopted.announceType,"new");
 assert.equal(new Date(r.adopted.pubDate).toISOString().slice(0,10),"2026-09-29");
 assert.equal(r.sourceReceipts.filter((s:{matchingIdCount:number})=>s.matchingIdCount===1).length,1);
});
test("Batch42 historical source-size blocks remain true as a snapshot and later Batch43 resolution is independently checked",()=>{
 const blocked=r.rows.filter((x:{status:string})=>x.status==="BLOCKED_SOURCE_FETCH_SIZE_LIMIT");
 assert.equal(blocked.length,4);
 const followup=JSON.parse(readFileSync(new URL("docs/audits/evidence/arxiv-clocked-batch43.json",root),"utf8"));
 for(const row of blocked){
  const d=followup.decisions.find((x:{id:string})=>x.id===row.id);
  assert.ok(d, "later reconciliation must explain this old block");
  if(d.status==="ADOPTED_DAY_ONLY")assert.equal(item(row.id).chronology?.milestone?.date,d.adoptedDate);
  else {assert.equal(d.status,"UNRESOLVED_CONFLICT_ORIGINAL_RSS"); assert.equal(item(row.id).chronology,undefined);}
  assert.ok(row.attempted.some((p:string)=>p.includes("2026-09-29")));
 }
 assert.deepEqual([r.counts.baselineCandidates,r.counts.previousReviewed,r.counts.newlyAttempted,r.counts.newlyAdopted,r.counts.newlyTechnicalBlocked,r.counts.totalAdopted,r.counts.priorReviewedHeld,r.counts.totalTechnicalBlocked,r.counts.notYetReviewed,r.counts.withoutSupplementalChronology],[98,16,5,1,4,8,9,4,77,90]);
 assert.equal(r.counts.totalAdopted+r.counts.priorReviewedHeld+r.counts.totalTechnicalBlocked+r.counts.notYetReviewed,98);
 assert.equal(r.counts.priorReviewedHeld+r.counts.totalTechnicalBlocked+r.counts.notYetReviewed,90);
 assert.equal(r.nextUnreviewed,"2026-09-26-compassplay");
});
