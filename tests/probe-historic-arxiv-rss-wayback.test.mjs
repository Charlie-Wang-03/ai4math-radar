import test from "node:test";
import assert from "node:assert/strict";
import {TARGETS,inspectTarget,inspectRssItem,inspectAll} from "../scripts/probe-historic-arxiv-rss-wayback.mjs";

// Synthetic parser fixtures, NOT recovered historical paper announcements.
const id="2609.36663";
const rss=(type="new",version="v1")=>'<rss version="2.0" xmlns:arxiv="http://arxiv.org/schemas/atom"><channel><item>'+
  '<title>GenLimitLib: A Formal Library for Language Generation in the Limit</title>'+
  '<link>https://arxiv.org/abs/'+id+'</link>'+
  '<description>arXiv:'+id+version+' Announce Type: '+type+' Abstract: Original</description>'+
  '<pubDate>Wed, 30 Sep 2026 00:00:00 -0400</pubDate>'+
  '<arxiv:announce_type>'+type+'</arxiv:announce_type></item></channel></rss>';
const legacy='<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://purl.org/rss/1.0/" xmlns:dc="http://purl.org/dc/elements/1.1/">'+
  '<channel><dc:date>2023-06-05T00:00:00Z</dc:date></channel><item rdf:about="http://arxiv.org/abs/2306.01694">'+
  '<title>Evaluating Language Models for Mathematics through Interactions. (arXiv:2306.01694v1 [cs.LG])</title>'+
  '<link> http://arxiv.org/abs/2306.01694 </link><description>Working paper abstract</description></item></rdf:RDF>';
const header=["timestamp","original","statuscode"];
const rowFor=t=>[t===TARGETS[0]?"20260930040300":"20230605040000",t.source,"200"];
function fake(xml,{status=200,index,seen=[]}={}){
  return async(url,opts)=>{
    assert.equal(opts.redirect,"error");seen.push(url);
    const u=new URL(url),isIndex=u.pathname==="/cdx/search/cdx";
    const target=u.searchParams.get("from")==="20230602"?TARGETS[1]:TARGETS[0];
    return new Response(isIndex?JSON.stringify(index??[header,rowFor(target)]):xml,{status});
  };
}
test("only exact ID, unambiguous v1 and explicit modern new announcement qualify",()=>{
  assert.equal(inspectRssItem(rss(),id)[0].eligibleNewV1,true);
  assert.equal(inspectRssItem(rss("cross"),id)[0].eligibleNewV1,false);
  assert.equal(inspectRssItem(rss("replace","v2"),id)[0].eligibleNewV1,false);
  assert.equal(inspectRssItem(rss(),"2609.36664").length,0);
});
test("archived publisher date is candidate-only and not the capture clock",async()=>{
  const x=await inspectTarget(TARGETS[0],fake(rss()));
  assert.equal(x.decision,"CANDIDATE_ORIGINAL_NEW_RSS_REQUIRES_EDITORIAL_REVIEW");
  assert.equal(x.candidates[0].matches[0].utcDate,"2026-09-30");
  assert.equal(x.candidates[0].captureAt,"20260930040300");
  assert.equal(Object.hasOwn(x,"publishedAt"),false);
});
test("HTTP errors and empty archive coverage are different unresolved reasons",async()=>{
  const denied=await inspectTarget(TARGETS[0],fake("forbidden",{status:403}));
  assert.equal(denied.reason,"CDX_HTTP_ERROR");assert.equal(denied.indexStatus,403);
  const empty=await inspectTarget(TARGETS[0],fake(rss(),{index:[]}));
  assert.equal(empty.reason,"NO_CAPTURE_ROWS");assert.equal(empty.eligibleCaptureRows,0);
  const cross=await inspectTarget(TARGETS[0],fake(rss("cross")));
  assert.equal(cross.reason,"MATCHED_ARTICLE_BUT_ANNOUNCEMENT_UNVERIFIED");
  assert.match(cross.decision,/UNRESOLVED/);
});
test("fixed target definitions cannot be expanded by caller inputs",async()=>{
  await assert.rejects(()=>inspectTarget({...TARGETS[0],from:"20250101"},fake(rss())),/Only exact fixed/);
  await assert.rejects(()=>inspectTarget({...TARGETS[0],category:"cs.AI"},fake(rss())),/Only exact fixed/);
});
test("unreachable archive fails closed with explicit source errors",async()=>{
  const x=await inspectAll(async()=>{throw Error("blocked");});
  assert.equal(x.results.length,2);
  assert.ok(x.results.every(r=>r.decision.startsWith("UNRESOLVED")&&r.reason==="SOURCE_ERROR"));
});
test("2023 lookup uses original pre-2024 host and preserves captured HTTPS URL",async()=>{
  const x=await inspectTarget(TARGETS[1],fake(legacy));
  assert.equal(new URL(x.archiveQuery).searchParams.get("url"),"arxiv.org/rss/cs.LG");
  assert.equal(x.candidates[0].archiveUrl,"https://web.archive.org/web/20230605040000id_/https://arxiv.org/rss/cs.LG");
});
test("legacy RSS 1.0 matched paper is retained, not certified or called absent",async()=>{
  const x=await inspectTarget(TARGETS[1],fake(legacy)),m=x.candidates[0].matches[0];
  assert.equal(m.arxivId,"2306.01694");assert.equal(m.version,"2306.01694v1");
  assert.equal(m.sourceFormat,"legacy-rss");assert.equal(m.eligibleNewV1,false);
  assert.equal(m.utcDate,null); // channel dc:date is NOT this item's publication date
  assert.equal(m.announceType,null);
  assert.equal(x.reason,"MATCHED_ARTICLE_BUT_ANNOUNCEMENT_UNVERIFIED");
  assert.match(x.decision,/UNRESOLVED/);
});
test("CDX original HTTP scheme is preserved inside an HTTPS archive replay",async()=>{
  const seen=[],index=[header,["20230605040000","http://arxiv.org/rss/cs.LG","200"]];
  const x=await inspectTarget(TARGETS[1],fake(legacy,{index,seen}));
  assert.equal(x.candidates[0].archiveOriginal,"http://arxiv.org/rss/cs.LG");
  assert.equal(seen[1],"https://web.archive.org/web/20230605040000id_/http://arxiv.org/rss/cs.LG");
  assert.ok(seen.every(url=>new URL(url).protocol==="https:"));
});
test("wrong origin, category, query, credentials and lookalike hosts are rejected",async()=>{
  for(const original of ["https://evil.example/rss/cs.LG","https://arxiv.org.evil.example/rss/cs.LG",
    "https://arxiv.org/rss/cs.LO","https://arxiv.org/rss/cs.LG?x=1",
    "https://user:pass@arxiv.org/rss/cs.LG","https://rss.arxiv.org/rss/cs.LG"]){
    const seen=[],index=[header,["20230605040000",original,"200"]];
    const x=await inspectTarget(TARGETS[1],fake(legacy,{index,seen}));
    assert.equal(x.reason,"NO_ELIGIBLE_CAPTURE_ROWS");assert.equal(x.rejectedIndexRows,1);
    assert.equal(seen.length,1);
  }
});
test("missing timezone and invalid civil dates cannot become UTC-day candidates",()=>{
  for(const date of ["Wed, 30 Sep 2026 00:00:00","30 Sep 2026","Mon, 30 Feb 2026 00:00:00 +0000",
    "Wed, 30 Sep 2026 25:00:00 +0000","Wed, 30 Sep 2026 00:00:00 +1260"]){
    const m=inspectRssItem(rss().replace("Wed, 30 Sep 2026 00:00:00 -0400",date),id)[0];
    assert.equal(m.utcDate,null);assert.equal(m.eligibleNewV1,false);
  }
});
test("explicit timezone conversion respects UTC date rollover",()=>{
  const xml=rss().replace("Wed, 30 Sep 2026 00:00:00 -0400","Wed, 30 Sep 2026 00:30:00 +0800");
  assert.equal(inspectRssItem(xml,id)[0].utcDate,"2026-09-29");
});
test("conflicting type, article identity or version fails closed",()=>{
  const conflict=rss("cross").replace("<arxiv:announce_type>cross","<arxiv:announce_type>new");
  assert.equal(inspectRssItem(conflict,id)[0].eligibleNewV1,false);
  for(const guid of ["oai:arXiv.org:2609.36664v1","oai:arXiv.org:2609.36663v2"]){
    const xml=rss().replace("</item>","<guid>"+guid+"</guid></item>");
    const m=inspectRssItem(xml,id)[0];assert.equal(m.identityConflict,true);assert.equal(m.eligibleNewV1,false);
  }
});
test("item dates outside target window cannot be promoted",async()=>{
  const xml=rss().replace("Wed, 30 Sep 2026 00:00:00 -0400","Tue, 30 Sep 2025 00:00:00 -0400");
  const x=await inspectTarget(TARGETS[0],fake(xml));
  assert.match(x.decision,/UNRESOLVED/);
  assert.ok(x.candidates[0].matches[0].validationReasons.includes("ITEM_DATE_OUTSIDE_TARGET_WINDOW"));
});
test("malformed CDX cannot be reported as empty archive coverage",async()=>{
  for(const index of [{},[["unexpected","columns"]]]){
    const x=await inspectTarget(TARGETS[0],fake(rss(),{index}));
    assert.equal(x.reason,"SOURCE_ERROR");assert.match(x.decision,/UNRESOLVED/);
  }
});
test("streaming byte cap cancels before buffering unlimited source bytes",async()=>{
  let cancelled=false;
  const stream=new ReadableStream({pull(c){c.enqueue(new Uint8Array(200001));},cancel(){cancelled=true;}});
  const x=await inspectTarget(TARGETS[0],async()=>new Response(stream));
  assert.equal(x.reason,"SOURCE_ERROR");assert.match(x.error,/response byte limit/);assert.equal(cancelled,true);
});
test("a replay read failure is not an article absence",async()=>{
  const base=fake(rss());
  const x=await inspectTarget(TARGETS[0],async(url,opts)=>new URL(url).pathname==="/cdx/search/cdx"?
    base(url,opts):new Response("denied",{status:403}));
  assert.equal(x.reason,"CAPTURE_READ_ERRORS_WITHOUT_MATCH");
});
test("at most three capture bodies are replayed",async()=>{
  const index=[header,...["29","30"].flatMap(day=>["01","05","09"].map(hour=>["202609"+day+hour+"0000",TARGETS[0].source,"200"]))];
  const x=await inspectTarget(TARGETS[0],fake(rss(),{index}));
  assert.equal(x.eligibleCaptureRows,6);assert.equal(x.candidates.length,3);
});

test("HTML and truncated XML cannot be called a readable feed without this paper",async()=>{
  for(const xml of ["<html>service error</html>",rss().replace("</item>",""),rss().replace("</rss>","")]){
    const x=await inspectTarget(TARGETS[0],fake(xml));
    assert.equal(x.reason,"CAPTURE_READ_ERRORS_WITHOUT_MATCH");
    assert.match(x.decision,/UNRESOLVED/);
  }
});
