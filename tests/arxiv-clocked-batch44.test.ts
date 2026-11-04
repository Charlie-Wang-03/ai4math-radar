import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const root=new URL("../",import.meta.url);
const news=readFileSync(new URL("portable/content/selected.jsonl",root),"utf8").trim().split(/\r?\n/).map(JSON.parse);
const receipt=JSON.parse(readFileSync(new URL("docs/audits/evidence/arxiv-clocked-batch44.json",root),"utf8"));
const get=(id:string)=>{const xs=news.filter((x:{id:string})=>x.id===id);assert.equal(xs.length,1);return xs[0]!;};
test("Batch44 frozen 5 IDs and original compatibility",()=>{
 const frozen=readFileSync(new URL("docs/audits/evidence/issue151-clocked-arxiv-baseline.tsv",root),"utf8").trim().split(/\r?\n/).slice(1).map(s=>s.split("\t")[0]);
 assert.equal(frozen.length,98);assert.deepEqual(receipt.decisions.map((x:{id:string})=>x.id),frozen.slice(26,31));assert.equal(new Set(news.map((x:{id:string})=>x.id)).size,news.length);
 for(const d of receipt.decisions){const x=get(d.id);assert.equal(x.publishedAt,d.legacyPublishedAt);assert.equal(x.links.original,"https://arxiv.org/abs/"+d.arxivId);assert.match(x.summary,/旧 publishedAt 为 arXiv v1 提交时刻/);}
});
test("Adopt two day-only announcement milestones; three remain unresolved",()=>{
 const yes=receipt.decisions.filter((x:{status:string})=>x.status==="ADOPTED_DAY_ONLY");const no=receipt.decisions.filter((x:{status:string})=>x.status==="UNRESOLVED_NO_MATCHING_V1_NEW");assert.equal(yes.length,2);assert.equal(no.length,3);
 for(const d of yes){const x=get(d.id);assert.deepEqual(x.chronology,{eventKind:"paper-release",milestone:{date:d.adoptedDate,precision:"day",evidenceKind:"arxiv-announcement",evidenceUrl:"https://rss.arxiv.org/rss/"+d.primaryCategory}});assert.ok(!Object.hasOwn(x.chronology.milestone,"at"));assert.ok(!Object.hasOwn(x.chronology,"earliestVerifiedPublic"));assert.deepEqual(d.observedDates,[d.adoptedDate]);assert.ok(d.observations.some((o:{versionGuid:string,announceType:string,category:string})=>o.versionGuid==="oai:arXiv.org:"+d.arxivId+"v1"&&o.announceType==="new"&&o.category===d.primaryCategory));}
 for(const d of no){assert.equal(get(d.id).chronology,undefined);assert.deepEqual(d.observedDates,[]);assert.match(get(d.id).summary,/UNRESOLVED/);}
});
test("Fixed receipt hashes and issue queue arithmetic",()=>{
 assert.equal(receipt.sources.length,12);assert.ok(receipt.sources.every((s:{gitBlobSha1:string})=>/^[a-f0-9]{40}$/.test(s.gitBlobSha1)));
 const c=receipt.counts;assert.deepEqual([c.frozenCandidates,c.newFirstTimeChecked,c.newlyAdopted,c.newlyHeldNoV1,c.totalAdopted,c.totalReviewedHeld,c.totalTechnicalBlocked,c.notYetReviewed,c.withoutSupplementalChronology],[98,5,2,3,16,15,0,67,82]);assert.equal(c.totalAdopted+c.totalReviewedHeld+c.totalTechnicalBlocked+c.notYetReviewed,98);
 assert.equal(receipt.nextUnreviewed,"2026-09-17-hjo-conjecture-axiomprover");
});
