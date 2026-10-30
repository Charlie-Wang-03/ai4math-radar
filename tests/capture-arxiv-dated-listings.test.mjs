import test from "node:test";
import assert from "node:assert/strict";
import {officialListingUrl,parseDatedListing,canonicalArxivIndex,captureOne,captureAll}
  from "../scripts/capture-arxiv-dated-listings.mjs";

const html=[
  "<html><h3>Wed, 28 Oct 2026 (showing 2 of 2 entries )</h3><dl>",
  '<dt><a href ="/abs/2610.37018" title="Abstract">arXiv:2610.37018</a></dt>',
  '<dt><a href ="/abs/2610.37125" title="Abstract">arXiv:2610.37125</a></dt></dl>',
  "<dd><a href=\"https://arxiv.org/abs/2610.99999\">unrelated cited prior work</a></dd>",
  "<h3>Tue, 27 Oct 2026 (showing 1 of 1 entries )</h3><dl>",
  '<dt><a href ="/abs/2610.34389" title="Abstract">arXiv:2610.34389</a></dt></dl></html>'
].join("");
test("official dated headers assign article ID to correct listing DAY only",()=>{
  const x=parseDatedListing(html);
  assert.deepEqual(x.map(y=>[y.date,y.ids]),[
    ["2026-10-28",["2610.37018","2610.37125"]],
    ["2026-10-27",["2610.34389"]]
  ]);
});
test("category and host cannot be supplied by an arbitrary URL",()=>{
  assert.equal(officialListingUrl("math.AC"),"https://arxiv.org/list/math.AC/recent?show=2000&skip=0");
  for(const c of ["math.AC.evil.invalid","http://arxiv.org/list/math.AC/recent","abc","math/../../"])
    assert.throws(()=>officialListingUrl(c),/not allowlisted/);
});
test("canonical index maps only selected first-party arXiv article IDs",()=>{
  const row=id=>JSON.stringify({id,selected:true,publishedAt:"2026-10-25T00:00:00.000Z",
    links:{original:"https://arxiv.org/abs/2610.34389"}});
  const index=canonicalArxivIndex([row("news"),JSON.stringify({id:"bad",selected:true,
    links:{original:"https://arxiv.org.attacker.invalid/abs/2610.34389"}}),
    JSON.stringify({id:"unselected",selected:false,links:{original:"https://arxiv.org/abs/2610.34389"}})].join("\n"));
  assert.equal(index.get("2610.34389").length,1);
  assert.equal(index.get("2610.34389")[0].eventId,"news");
});
test("capture is strictly read-only and does not certify first-public version",async()=>{
  const index=canonicalArxivIndex(JSON.stringify({id:"news",selected:true,
    publishedAt:"2026-10-25T00:00:00.000Z",links:{original:"https://arxiv.org/abs/2610.34389"}}));
  let calls=0;
  const mock=async(url,opts)=>{
    calls++;
    assert.equal(opts.redirect,"error");
    assert.equal(new URL(url).hostname,"arxiv.org");
    return {ok:true,status:200,text:async()=>html};
  };
  const snap=await captureOne("math.AC",mock);
  assert.equal(snap.ok,true);
  assert.equal(snap.groups[1].date,"2026-10-27");
  const all=await captureAll(["math.AC"],mock,0,index);
  assert.equal(all.ok,1);
  assert.equal(all.matchedNews.length,1);
  assert.equal(all.matchedNews[0].decision,"CANDIDATE_ONLY_VERIFY_FIRST_PUBLIC_V1_AND_CROSSLIST");
  assert.equal(calls,2);
});
