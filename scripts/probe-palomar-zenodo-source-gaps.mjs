/** Read-only fixed-target original-source audit. No automatic publishedAt changes.
 * Palomar registered_at = exact version public registry milestone.
 * Zenodo created/updated/publication_date and DataCite DOI registration != automatically first-public record release.
 */
import {readFileSync,mkdirSync,writeFileSync} from "node:fs";
import {dirname} from "node:path";
import {createHash} from "node:crypto";
import {pathToFileURL} from "node:url";

export const TARGETS=Object.freeze([
 {eventId:"2026-09-06-bugeaud-10-61-ai-formalization",provider:"palomar",
  source:"https://aixiv.online/abs/2609.01723",id:"PALOMAR-2026-08-31-000013",version:2,
  index:"https://data.palomar-registry.org/versions/PALOMAR-2026-08-31-000013.json"},
 {eventId:"2026-10-19-arad-herzog-conditional-ai-proof-claim",provider:"zenodo",
  source:"https://zenodo.org/records/23450488",recordId:23450488,
  url:"https://zenodo.org/api/records/23450488",
  dataciteUrl:"https://api.datacite.org/dois/10.5281/zenodo.23450488",
  doi:"10.5281/zenodo.23450488"}
]);
async function readJson(url,fetcher=fetch){
  const u=new URL(url);
  if(u.protocol!=="https:"||!["data.palomar-registry.org","zenodo.org","api.datacite.org"].includes(u.hostname))
    throw Error("unsafe original-source host");
  const resp=await fetcher(url,{redirect:"error",headers:{Accept:"application/json"},
    signal:AbortSignal.timeout(12000)});
  const bytes=Buffer.from(await resp.arrayBuffer());
  if(bytes.length>1300000)throw Error("oversized publisher response");
  let obj=null;
  try{obj=JSON.parse(new TextDecoder().decode(bytes));}catch{}
  return {ok:resp.ok,status:resp.status,obj,
    rawSha256:createHash("sha256").update(bytes).digest("hex"),bytes:bytes.length};
}
export async function investigate(t,fetcher=fetch){
  const approved=TARGETS.find(x=>x.eventId===t.eventId&&x.provider===t.provider);
  if(!approved||JSON.stringify(t)!==JSON.stringify(approved))
    throw Error("unknown fixed source target");
  try{
    if(t.provider==="palomar"){
      const index=await readJson(t.index,fetcher);
      const rows=index.obj?.entries;
      if(!index.ok||!Array.isArray(rows))return {eventId:t.eventId,provider:t.provider,matched:false,
        phase:"index",httpStatus:index.status,error:"missing version index"};
      const expected="entries/"+t.id+"-v"+t.version+".json";
      const entry=rows.find(x=>x.id===t.id&&x.version===t.version&&x.path===expected);
      if(!entry)return {eventId:t.eventId,provider:t.provider,matched:false,
        error:"exact version missing",indexDigest:index.rawSha256};
      const url="https://data.palomar-registry.org/"+expected;
      const child=await readJson(url,fetcher),data=child.obj;
      const matched=child.ok&&data?.id===t.id&&data?.version===t.version
        &&typeof data?.title==="string"&&typeof data?.registered_at==="string";
      return {eventId:t.eventId,provider:t.provider,matched,sourceUrl:t.source,
        indexUrl:t.index,indexDigest:index.rawSha256,url,childStatus:child.status,
        childDigest:child.rawSha256,id:data?.id,version:data?.version,title:data?.title,
        registeredAt:data?.registered_at,firstRegisteredOn:data?.first_registered_on,
        decision:matched?"CANDIDATE_EXACT_REGISTRY_VERSION_MILESTONE_REQUIRES_EDITORIAL_REVIEW":"UNRESOLVED_VERSION_IDENTITY"};
    }
    // The Zenodo origin may deny automated reads (HTTP 403). Probe the
    // independently published DOI registration record even in that case.
    // Neither created nor registered alone proves a version's first public instant.
    const zenodo=await readJson(t.url,fetcher).catch(e=>({ok:false,status:null,error:String(e).slice(0,180)}));
    const d=zenodo.obj;
    const matched=zenodo.ok&&String(d?.id)===String(t.recordId)&&
      typeof d?.metadata?.title==="string";
    const datacite=await readJson(t.dataciteUrl,fetcher).catch(e=>({ok:false,status:null,error:String(e).slice(0,180)}));
    const a=datacite.obj?.data?.attributes;
    const doiMatched=datacite.ok&&datacite.obj?.data?.type==="dois"
      &&String(datacite.obj?.data?.id||"").toLowerCase()===t.doi.toLowerCase()
      &&String(a?.doi||"").toLowerCase()===t.doi.toLowerCase()
      &&typeof a?.url==="string"&&a.url.includes(String(t.recordId))
      &&Array.isArray(a?.titles)&&a.titles.some(q=>
        /arad/i.test(String(q?.title||""))&&/herzog/i.test(String(q?.title||"")));
    return {eventId:t.eventId,provider:t.provider,matched,url:t.url,
      status:zenodo.status??null,error:zenodo.error??null,digest:zenodo.rawSha256,
      id:d?.id,title:d?.metadata?.title,created:d?.created,
      updated:d?.updated,publicationDate:d?.metadata?.publication_date,
      version:d?.metadata?.version,access:d?.access?.record,
      datacite:{url:t.dataciteUrl,status:datacite.status??null,
        error:datacite.error??null,digest:datacite.rawSha256,
        doiMatched,doi:doiMatched?a.doi:null,
        doiStatus:doiMatched?a.state:null,created:doiMatched?a.created:null,
        registered:doiMatched?a.registered:null,published:doiMatched?a.published:null,
        publicationYear:doiMatched?a.publicationYear:null,
        version:doiMatched?a.version:null,landingUrl:doiMatched?a.url:null},
      decision:"NO_ZENODO_CLOCK_PROMOTION_WITHOUT_EXPLICIT_PUBLIC_RELEASE_SEMANTICS"};
  }catch(error){return {eventId:t.eventId,provider:t.provider,matched:false,
    error:String(error).slice(0,240)};}
}
export async function investigateAll(targets=TARGETS,fetcher=fetch){
  const items=[];
  for(const t of targets)items.push(await investigate(t,fetcher));
  return {kind:"SOURCE_SPECIFIC_PUBLICATION_EVIDENCE_NOT_AUTOMATIC_CORRECTION",
    generatedAt:new Date().toISOString(),items,
    rule:"Never infer first-public release from repository creation, Zenodo draft creation/publication_date, or DataCite DOI registration time."};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  const output=process.argv[2]||"evidence/source-gaps.json";
  // Assert that the stories still exist in the canonical source before network.
  const ids=new Set(readFileSync("portable/content/selected.jsonl","utf8").trim().split("\n")
    .filter(Boolean).map(x=>JSON.parse(x).id));
  if(TARGETS.some(t=>!ids.has(t.eventId)))throw Error("selected source no longer contains target");
  const data=await investigateAll();
  mkdirSync(dirname(output),{recursive:true});
  writeFileSync(output,JSON.stringify(data,null,2)+"\n");
  for(const item of data.items)console.log("SOURCE_GAP_ITEM="+JSON.stringify(item));
  console.log("SOURCE_GAP_SUMMARY="+JSON.stringify({records:data.items.length,
    matched:data.items.filter(x=>x.matched).length,output}));
}