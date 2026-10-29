import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { pathToFileURL } from "node:url";

// Research-only evidence discovery. No writes to the canonical store, even if a
// provider returns a valid timestamp. Publication semantics require editorial review.
export const PROBES = [
  { id: "tao-lean-reliability", family: "wordpress", url: "https://terrytao.wordpress.com/wp-json/wp/v2/posts?slug=what-mathematicians-should-know-about-the-lean-theorem-proverquestions-of-reliability-and-ai" },
  { id: "tao-sair-open-math-os", family: "wordpress", url: "https://terrytao.wordpress.com/wp-json/wp/v2/posts?slug=sair-open-math-os-released" },
  { id: "tao-sair-open-math-model", family: "wordpress", url: "https://terrytao.wordpress.com/wp-json/wp/v2/posts?slug=sairs-open-math-model-initiative" },
  { id: "xena-formalize-all", family: "wordpress", url: "https://xenaproject.wordpress.com/wp-json/wp/v2/posts?slug=how-to-formalize-all-of-mathematics" },
  { id: "tao-sair-public-api", family: "wordpress-com", url: "https://public-api.wordpress.com/rest/v1.1/sites/terrytao.wordpress.com/posts/slug:sair-open-math-os-released" },
  { id: "hexagon-wormald", family: "hexagon", url: "https://hexagonmath.org/api/v1/works/2610.00460" },
  { id: "hexagon-wormald-v1", family: "hexagon", url: "https://hexagonmath.org/api/v1/works/2610.00460v1" },
  { id: "hexagon-hecke", family: "hexagon", url: "https://hexagonmath.org/api/v1/works/2610.00458" },
  { id: "hexagon-hales", family: "hexagon", url: "https://hexagonmath.org/api/v1/works/2610.00330" },
  { id: "hexagon-index", family: "hexagon", url: "https://hexagonmath.org/api/v1/works?limit=1" },
  { id: "palomar-subgaussian", family: "palomar", url: "https://data.palomar-registry.org/versions/PALOMAR-2026-10-15-000001.json" },
  { id: "palomar-unit-distance", family: "palomar", url: "https://data.palomar-registry.org/versions/PALOMAR-2026-10-01-000018.json" },
  { id: "palomar-recent", family: "palomar", url: "https://data.palomar-registry.org/recent.json" },
];

const HOSTS = new Set(["terrytao.wordpress.com","xenaproject.wordpress.com",
  "public-api.wordpress.com","hexagonmath.org","data.palomar-registry.org"]);
const TIME_FIELD = /(?:date|time|published|posted|created|updated|modified|released|announced|registered|accepted|submitted|version)/i;
const DATE_VALUE = /(?:\d{4}-\d{2}-\d{2}|\d{1,2}\s+[A-Za-z]+\s+\d{4})/;
export function inspectPublicJson(value, maxObservations=45) {
  const observations=[];
  const keys = value && typeof value==="object" && !Array.isArray(value)
    ? Object.keys(value).slice(0,65) : Array.isArray(value) ? ["<array>"] : [];
  function walk(cur,path,depth) {
    if(observations.length>=maxObservations||depth>5||cur===null||cur===undefined)return;
    if(Array.isArray(cur)){ for(let i=0;i<Math.min(2,cur.length);i++)walk(cur[i],path+"["+i+"]",depth+1);return; }
    if(typeof cur!=="object") return;
    for(const [key,v] of Object.entries(cur).slice(0,80)){
      if(observations.length>=maxObservations)break;
      const field=path ? path+"."+key : key;
      if(typeof v==="string" && TIME_FIELD.test(key) && DATE_VALUE.test(v)){
        observations.push({field,value:v.slice(0,150)});
      }else if((Array.isArray(v)||v&&typeof v==="object")&&depth<5)walk(v,field,depth+1);
    }
  }
  walk(value,"",0);
  return { keys, observations };
}
export async function probeOne(probe, fetcher=fetch) {
  const started=Date.now();
  const u=new URL(probe.url);
  if(u.protocol!=="https:"||!HOSTS.has(u.hostname))throw new Error("probe URL is not explicitly allowlisted");
  try{
    const response=await fetcher(probe.url,{redirect:"error",headers:{Accept:"application/json"},
      signal:AbortSignal.timeout(10000)});
    const body=await response.text();
    if(body.length>1400000)throw new Error("response too large");
    let data; try{data=JSON.parse(body)}catch{data=null}
    return {id:probe.id,family:probe.family,url:probe.url,status:response.status,
      ok:response.ok,contentType:response.headers.get("content-type")?.slice(0,100)??null,
      bytes:body.length,parsedJson:data!==null,
      ...(data!==null?inspectPublicJson(data):{keys:[],observations:[]}),
      ms:Date.now()-started};
  }catch(error){
    return {id:probe.id,family:probe.family,url:probe.url,ok:false,
      error:String(error).slice(0,220),ms:Date.now()-started};
  }
}
export async function probeAll(probes=PROBES,fetcher=fetch) {
  const records=[];
  for(let i=0;i<probes.length;i+=3)
    records.push(...await Promise.all(probes.slice(i,i+3).map(p=>probeOne(p,fetcher))));
  return {schemaVersion:1,type:"CANDIDATE_TIME_METADATA_NOT_VERIFIED",
    evidenceRule:"Never write publishedAt without source identity, first-public semantics, and timestamp precision review",
    generatedAt:new Date().toISOString(),probes:records};
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
  const output=process.argv[2]||"time-evidence-candidates.json";
  const data=await probeAll();
  mkdirSync(dirname(output),{recursive:true});
  writeFileSync(output,JSON.stringify(data,null,2)+"\n");
  console.log("TARGETED_PUBLICATION_PROBE_SUMMARY="+JSON.stringify({
    output,probes:data.probes.length,httpOk:data.probes.filter(x=>x.ok).length,
    jsonOk:data.probes.filter(x=>x.ok&&x.parsedJson).length,
    familyStats:Object.fromEntries([...new Set(data.probes.map(x=>x.family))].map(f=>[f,{
      count:data.probes.filter(x=>x.family===f).length,
      ok:data.probes.filter(x=>x.family===f&&x.ok).length
    }]))
  }));
  // Emit only short candidates, not full HTML, IDs, auth or editorial mutations.
  for(const x of data.probes)console.log("EVIDENCE_CANDIDATE="+JSON.stringify(x));
}
