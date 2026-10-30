import test from "node:test";
import assert from "node:assert/strict";
import {TARGETS,investigate,investigateAll} from "../scripts/probe-palomar-zenodo-source-gaps.mjs";
const palomar={id:"PALOMAR-2026-08-31-000013",version:2,
 title:"Lean formalization toward Bugeaud Problem 10.61",
 registered_at:"2026-09-06T08:00:00Z",first_registered_on:"2026-08-31"};
const zenodo={id:23450488,metadata:{title:"A proof of the Arad–Herzog conjecture",
 publication_date:"2026-10-19"},created:"2026-10-18T22:00:00Z",
 updated:"2026-10-20T10:00:00Z"};
const fake=async (url,opts)=>{
 assert.equal(opts.redirect,"error");
 assert.ok(["zenodo.org","data.palomar-registry.org"].includes(new URL(url).hostname));
 let data=url.includes("/versions/")?{entries:[{id:palomar.id,version:2,
 path:"entries/"+palomar.id+"-v2.json"}]}:url.includes("/entries/")?palomar:zenodo;
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