import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
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

// Use only canonical selected records and known provider APIs. Data and result IDs are
// descriptive, not URLs the caller may choose. No result automatically updates any news row.
export function deriveCanonicalProbes(text) {
  const records = text.split(/\r?\n/).filter(Boolean).map(line=>JSON.parse(line));
  const result=[];
  for(const item of records){
    if(!item.publishedAt || !/^\d{4}-\d{2}-\d{2}T00:00:00(?:\.0+)?Z$/.test(item.publishedAt)
       || item.publishedAtPrecision)continue;
    const original=new URL(item.links.original);
    let api=null,family=null;
    if(original.hostname==="hexagonmath.org"){
      const hit=original.pathname.match(/^\/(\d{4}\.\d{5})(?:v\d+)?\/?$/);
      if(hit){api="https://hexagonmath.org/api/v1/works/"+hit[1]+"v1";family="hexagon";}
    }else if(["terrytao.wordpress.com","xenaproject.wordpress.com"].includes(original.hostname)){
      const parts=original.pathname.split("/").filter(Boolean);
      if(parts.length===4&&/^\d{4}$/.test(parts[0])&&/^\d{2}$/.test(parts[1])
        &&/^\d{2}$/.test(parts[2])&&/^[a-z0-9-]+$/.test(parts[3])){
        api="https://public-api.wordpress.com/rest/v1.1/sites/"+original.hostname+"/posts/slug:"+parts[3];
        family="wordpress-com";
      }
    }else if(original.hostname==="palomar-registry.org"){
      const id=original.searchParams.get("id"),version=original.searchParams.get("version");
      if(id&&/^PALOMAR-\d{4}-\d{2}-\d{2}-\d{6}$/.test(id)&&/^\d+$/.test(version??"")){
        api="https://data.palomar-registry.org/versions/"+id+".json";family="palomar";
      }
    }
    if(api)result.push({id:item.id,family,url:api,sourceUrl:item.links.original,
      expectedUtcDay:item.publishedAt.slice(0,10)});
  }
  return result;
}

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
    let versionRecord=null;
    if(probe.family==="palomar"&&response.ok&&data&&Array.isArray(data.entries)){
      const expectedId=probe.url.match(/versions\/(PALOMAR-\d{4}-\d{2}-\d{2}-\d{6})\.json$/)?.[1];
      const expectedVersion=Number(probe.sourceUrl?.match(/[?&]version=(\d+)/)?.[1]);
      const selected=data.entries.find(e=>e.id===expectedId&&e.version===expectedVersion&&
        e.path===("entries/"+expectedId+"-v"+expectedVersion+".json"));
      if(selected){
        const childUrl="https://data.palomar-registry.org/"+selected.path;
        try{
          const child=await fetcher(childUrl,{redirect:"error",
            headers:{Accept:"application/json"},signal:AbortSignal.timeout(10000)});
          const raw=await child.text();
          const json=child.ok&&raw.length<1000000?JSON.parse(raw):null;
          versionRecord={url:childUrl,status:child.status,ok:child.ok,
            ...(json?{keys:Object.keys(json).slice(0,60),...inspectPublicJson(json),
             title:String(json.title??json.entry?.title??"").slice(0,170),
             id:json.id??json.entry?.id??null,
             version:json.version??json.entry?.version??null}: {})};
        }catch(error){versionRecord={url:childUrl,ok:false,error:String(error).slice(0,180)};}
      }
    }
    return {id:probe.id,family:probe.family,url:probe.url,status:response.status,
      ok:response.ok,contentType:response.headers.get("content-type")?.slice(0,100)??null,
      bytes:body.length,parsedJson:data!==null,
      ...(data!==null?inspectPublicJson(data):{keys:[],observations:[]}),
      ...(data!==null ? {identity:probe.family==="hexagon"
        ? {identifier:data?.work?.identifier??data?.work?.id??null,title:String(data?.work?.title??"").slice(0,160)}
        : probe.family==="wordpress-com"
        ? {url:data?.URL??null,slug:data?.slug??null,status:data?.status??null}
        : probe.family==="palomar"
        ? {versionIndexPreview:JSON.stringify(data?.entries?.slice?.(0,3)??data?.entries??[]).slice(0,850)}
        : null} : {}),
      ...(versionRecord?{versionRecord}:{}),ms:Date.now()-started};
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
  const fullScan=process.argv.includes("--canonical");
  const probes=fullScan ? deriveCanonicalProbes(readFileSync("portable/content/selected.jsonl","utf8")) : PROBES;
  const data=await probeAll(probes);
  mkdirSync(dirname(output),{recursive:true});
  writeFileSync(output,JSON.stringify(data,null,2)+"\n");
  console.log("TARGETED_PUBLICATION_PROBE_SUMMARY="+JSON.stringify({
    mode:fullScan?"canonical":"fixed",output,probes:data.probes.length,httpOk:data.probes.filter(x=>x.ok).length,
    jsonOk:data.probes.filter(x=>x.ok&&x.parsedJson).length,
    familyStats:Object.fromEntries([...new Set(data.probes.map(x=>x.family))].map(f=>[f,{
      count:data.probes.filter(x=>x.family===f).length,
      ok:data.probes.filter(x=>x.family===f&&x.ok).length
    }]))
  }));
  // Emit only short candidates, not full HTML, IDs, auth or editorial mutations.
  for(const x of data.probes)console.log("EVIDENCE_CANDIDATE="+JSON.stringify(x));
}
