import test from "node:test";
import assert from "node:assert/strict";
import {mkdtempSync,readFileSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {gunzipSync} from "node:zlib";
import {archiveUrl,TARGETS,inspectArchive,inspectAll,archiveHistoricRaw}
  from "../scripts/probe-arxiv-historical-listings.mjs";

const page='<h3>Mon, 27 Feb 2023 (showing 1 of 1 entries)</h3><dl>'+
  '<dt><a href ="/abs/2302.12433" title="Abstract">arXiv:2302.12433</a></dt></dl>';
test("historical URLs are fixed allowlisted categories/months, not arbitrary",()=>{
  assert.equal(archiveUrl(TARGETS[0]),"https://arxiv.org/list/cs.CL/2023-02?show=2000&skip=0");
  assert.throws(()=>archiveUrl({...TARGETS[0],category:"cs.CL.attacker.invalid"}),/unapproved/);
});
test("exact ID under dated heading is only a candidate, not certified first-public event",async()=>{
  let called=0;
  const request=async(url,opts)=>{
    called++;
    assert.equal(opts.redirect,"error");
    assert.equal(new URL(url).hostname,"arxiv.org");
    return {ok:true,status:200,text:async()=>page};
  };
  const x=await inspectArchive(TARGETS[0],request);
  assert.equal(x.groupsFound,1);
  assert.equal(x.matches[0].day,"2023-02-27");
  assert.equal(x.matches[0].status,"CANDIDATE_ONLY_NOT_FIRST_PUBLIC_CERTIFICATION");
  const all=await inspectAll([TARGETS[0]],request);
  const dir=mkdtempSync(join(tmpdir(),"arxiv-history-"));
  try{
    assert.equal(archiveHistoricRaw(all,dir),1);
    assert.equal(gunzipSync(readFileSync(join(dir,"2302.12433-cs.CL.html.gz"))).toString(),page);
    assert.equal(all.results[0].rawEvidence.rawSha256,all.results[0].responseSha256);
    assert.equal(JSON.stringify(all).includes("<h3>"),false);
  }finally{rmSync(dir,{recursive:true,force:true});}
  assert.equal(called,2);
});
test("HTTP errors and missing IDs cannot manufacture publication dates",async()=>{
  const a=await inspectArchive(TARGETS[0],async()=>({ok:false,status:404,text:async()=>"Not Found"}));
  assert.equal(a.ok,false);assert.deepEqual(a.matches,[]);
  const b=await inspectArchive(TARGETS[0],async()=>({ok:true,status:200,
    text:async()=>'<h3>Mon, 27 Feb 2023</h3><dt><a href="/abs/2302.00001">x</a></dt>'}));
  assert.equal(b.ok,true);assert.deepEqual(b.matches,[]);
});
