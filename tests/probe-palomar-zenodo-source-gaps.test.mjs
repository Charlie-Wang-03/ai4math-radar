import test from "node:test";
import assert from "node:assert/strict";
import {TARGETS,investigate,investigateAll} from "../scripts/probe-palomar-zenodo-source-gaps.mjs";
const palomar={id:"PALOMAR-2026-08-31-000013",version:2,
 title:"Lean formalization toward Bugeaud Problem 10.61",
 registered_at:"2026-09-06T08:00:00Z",first_registered_on:"2026-08-31"};
const zenodo={id:23450488,metadata:{title:"A proof of the Arad–Herzog conjecture",
 publication_date:"2026-10-19"},created:"2026-10-18T22:00:00Z",
 updated:"2026-10-20T10:00:00Z"};
const datacite={data:{type:"dois",id:"10.5281/zenodo.23450488",
 attributes:{doi:"10.5281/zenodo.23450488",url:"https://zenodo.org/records/23450488",
 titles:[{title:"A proof of the Arad–Herzog conjecture"}],state:"findable",
 created:"2026-10-19T08:15:00Z",registered:"2026-10-19T08:16:00Z",
 published:"2026-10-19T08:16:00Z",publicationYear:2026,version:"3"}}};
const fake=async (url,opts)=>{
 assert.equal(opts.redirect,"error");
 assert.ok(["zenodo.org","data.palomar-registry.org","api.datacite.org"].includes(new URL(url).hostname));
 let data=url.includes("/versions/")?{entries:[{id:palomar.id,version:2,
 path:"entries/"+palomar.id+"-v2.json"}]}:url.includes("/entries/")?palomar:
 url.startsWith("https://api.datacite.org/")?datacite:zenodo;
 return {ok:true,status:200,arrayBuffer:async()=>Buffer.from(JSON.stringify(data))};
};
test("matched Palomar v2 registration time is candidate only; not v1 original",async()=>{
 const x=await investigate(TARGETS[0],fake);
 assert.equal(x.matched,true);assert.equal(x.version,2);
 assert.equal(x.registeredAt,"2026-09-06T08:00:00Z");
 assert.equal(x.firstRegisteredOn,"2026-08-31");
 assert.match(x.decision,/REQUIRES_EDITORIAL_REVIEW/);
});
test("Zenodo created and user-entered publication fields cannot certify public time",async()=>{
 const x=await investigate(TARGETS[1],fake);
 assert.equal(x.matched,true);
 assert.equal(x.created,"2026-10-18T22:00:00Z");
 assert.equal(x.publicationDate,"2026-10-19");
 assert.match(x.decision,/NO_ZENODO_CLOCK_PROMOTION/);
 assert.equal(x.datacite.doiMatched,true);
 assert.equal(x.datacite.registered,"2026-10-19T08:16:00Z");
 assert.equal(x.datacite.doiStatus,"findable");
});
test("specific version identity mismatch is not approved",async()=>{
 const bad=async(url,opts)=>url.includes("/entries/")
   ?{ok:true,status:200,arrayBuffer:async()=>Buffer.from(JSON.stringify({...palomar,version:1}))}
   :fake(url,opts);
 assert.equal((await investigate(TARGETS[0],bad)).matched,false);
});
test("only two literal predefined original source targets can be probed",async()=>{
 await assert.rejects(()=>investigate({...TARGETS[1],eventId:"foreign-record"},fake),/unknown fixed source/);
 const r=await investigateAll(TARGETS,fake);
 assert.equal(r.items.length,2);
 assert.equal(Object.hasOwn(r.items[0],"publishedAt"),false);
});
test("DataCite records with unrelated DOI or title are rejected for release metadata",async()=>{
 const bad=async(url,opts)=>url.startsWith("https://api.datacite.org/")
  ?{ok:true,status:200,arrayBuffer:async()=>Buffer.from(JSON.stringify({
    ...datacite,data:{...datacite.data,id:"10.5281/zenodo.99999999"}
  }))}
  :fake(url,opts);
 const result=await investigate(TARGETS[1],bad);
 assert.equal(result.datacite.doiMatched,false);
 assert.equal(result.datacite.registered,null);
 assert.match(result.decision,/NO_ZENODO_CLOCK_PROMOTION/);
});
test("DataCite fallback survives Zenodo 403 without pretending DOI registration is public release",async()=>{
 const blocked=async(url,opts)=>url.startsWith("https://zenodo.org/")
  ?{ok:false,status:403,arrayBuffer:async()=>Buffer.from("forbidden")}
  :fake(url,opts);
 const result=await investigate(TARGETS[1],blocked);
 assert.equal(result.matched,false);
 assert.equal(result.status,403);
 assert.equal(result.datacite.doiMatched,true);
 assert.equal(result.datacite.registered,"2026-10-19T08:16:00Z");
 assert.match(result.decision,/NO_ZENODO_CLOCK_PROMOTION/);
});
