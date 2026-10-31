import test from "node:test";
import assert from "node:assert/strict";
import {TARGETS,inspectTarget,inspectRssItem,inspectAll} from "../scripts/probe-historic-arxiv-rss-wayback.mjs";

const id="2609.36663";
const rss=(type="new",version="v1")=>'<rss xmlns:arxiv="http://arxiv.org/schemas/atom"><channel><item>'+
  '<title>GenLimitLib: A Formal Library for Language Generation in the Limit</title>'+
  '<link>https://arxiv.org/abs/'+id+'</link>'+
  '<description>arXiv:'+id+version+' Announce Type: '+type+' Abstract: Original</description>'+
  '<pubDate>Wed, 30 Sep 2026 00:00:00 -0400</pubDate>'+
  '<arxiv:announce_type>'+type+'</arxiv:announce_type></item></channel></rss>';
const cdx=JSON.stringify([["timestamp","original","statuscode"],["20260930040300","https://rss.arxiv.org/rss/cs.LG","200"]]);
function fake(xml,type=200){
  return async (url,opts)=>{
    assert.equal(opts.redirect,"error");
    const isIndex=url.includes("/cdx/search/cdx");
    const payload=isIndex?cdx:xml;
    return {ok:type===200,status:type,
      arrayBuffer:async()=>Buffer.from(payload)};
  };
}
test("only the exact article ID, v1 and official new announcement qualify",()=>{
  assert.equal(inspectRssItem(rss(),id)[0].eligibleNewV1,true);
  assert.equal(inspectRssItem(rss("cross"),id)[0].eligibleNewV1,false);
  assert.equal(inspectRssItem(rss("replace","v2"),id)[0].eligibleNewV1,false);
  assert.equal(inspectRssItem(rss(),"2609.36664").length,0);
});
test("archived original publisher RSS date is candidate-only, never capture clock",async()=>{
  const x=await inspectTarget(TARGETS[0],fake(rss()));
  assert.equal(x.decision,"CANDIDATE_ORIGINAL_NEW_RSS_REQUIRES_EDITORIAL_REVIEW");
  assert.equal(x.candidates.length,1);
  assert.equal(x.candidates[0].matches[0].utcDate,"2026-09-30");
  assert.equal(x.candidates[0].captureAt,"20260930040300");
  assert.equal(Object.hasOwn(x,"publishedAt"),false);
});
test("status error and missing captures preserve unresolved verdict",async()=>{
  const x=await inspectTarget(TARGETS[0],fake("forbidden",403));
  assert.equal(x.indexStatus,403);
  assert.match(x.decision,/UNRESOLVED/);
  const y=await inspectTarget(TARGETS[0],fake(rss("cross")));
  assert.equal(y.candidates[0].matches[0].eligibleNewV1,false);
  assert.match(y.decision,/UNRESOLVED/);
});
test("only fixed original target requests; no arbitrary archive URL",async()=>{
  await assert.rejects(()=>inspectTarget({...TARGETS[0],from:"20250101"},fake(rss())),/Only exact fixed/);
  await assert.rejects(()=>inspectTarget({...TARGETS[0],category:"cs.AI"},fake(rss())),/Only exact fixed/);
});
test("all targets fail closed under an unreachable archive service",async()=>{
  const report=await inspectAll(async()=>{throw Error("blocked");});
  assert.equal(report.results.length,2);
  assert.ok(report.results.every(x=>x.decision.startsWith("UNRESOLVED")));
  assert.ok(report.results.every(x=>x.error?.includes("blocked")));
});
