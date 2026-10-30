/** Targeted, one-shot research: original historic arXiv monthly category lists.
 * A month alone cannot certify a public day. Only dated headings + matching article ID
 * can be retained as candidate public-list evidence. Never writes canonical news.
 */
import {createHash} from "node:crypto";
import {gzipSync} from "node:zlib";
import {mkdirSync,writeFileSync} from "node:fs";
import {dirname} from "node:path";
import {pathToFileURL} from "node:url";
import {parseDatedListing} from "./capture-arxiv-dated-listings.mjs";

export const TARGETS=Object.freeze([
  {eventId:"2023-02-23-proofnet",arxivId:"2302.12433",category:"cs.CL",month:"2023-02"},
  {eventId:"2026-04-21-lean-atlas-semantic-alignment",arxivId:"2604.16347",category:"cs.HC",month:"2026-04"}
]);
export function archiveUrl(t) {
  if(!TARGETS.some(x=>x.eventId===t.eventId&&x.arxivId===t.arxivId
    &&x.category===t.category&&x.month===t.month))
    throw Error("unapproved historical target");
  return "https://arxiv.org/list/"+t.category+"/"+t.month+"?show=2000&skip=0";
}
export async function inspectArchive(t,fetcher=fetch) {
  const url=archiveUrl(t);
  try{
    const r=await fetcher(url,{redirect:"error",headers:{Accept:"text/html"},signal:AbortSignal.timeout(15000)});
    const bytes=Buffer.from(await r.text(),"utf8");
    if(bytes.length>3800000)throw Error("oversized historical listing");
    const groups=r.ok?parseDatedListing(bytes.toString("utf8")):[];
    const matches=groups.filter(x=>x.ids.includes(t.arxivId)).map(x=>({
      day:x.date,heading:x.heading,arxivId:t.arxivId,
      status:"CANDIDATE_ONLY_NOT_FIRST_PUBLIC_CERTIFICATION"
    }));
    const result={...t,url,ok:r.ok,httpStatus:r.status,
      responseSha256:createHash("sha256").update(bytes).digest("hex"),
      bytes:bytes.length,groupsFound:groups.length,matches,
      ...(r.ok?{}:{error:"HTTP "+r.status})};
    if(r.ok)Object.defineProperty(result,"rawBytes",{value:bytes,enumerable:false});
    return result;
  }catch(e){
    return {...t,url,ok:false,error:String(e).slice(0,220),groupsFound:0,matches:[]};
  }
}
export async function inspectAll(targets=TARGETS,fetcher=fetch) {
  const results=[];
  for(const t of targets)results.push(await inspectArchive(t,fetcher));
  return {schemaVersion:1,kind:"HISTORIC_ARXIV_CATEGORY_LISTING_CANDIDATES_NOT_AUTOMATIC_CERTIFICATION",
    observedAt:new Date().toISOString(),
    note:"Monthly listing URL does not prove a public date. Require dated heading, matching ID and first-v1/crosslist check.",
    results};
}
export function archiveHistoricRaw(data,folder) {
  mkdirSync(folder,{recursive:true});
  let count=0;
  for(const r of data.results){
    if(!r.ok||!Buffer.isBuffer(r.rawBytes))continue;
    const safe=r.arxivId+"-"+r.category;
    if(!TARGETS.some(t=>t.arxivId===r.arxivId&&t.category===r.category))
      throw Error("unsafe archive filename");
    const gz=gzipSync(r.rawBytes,{level:9,mtime:0});
    writeFileSync(folder+"/"+safe+".html.gz",gz);
    r.rawEvidence={relativePath:"arxiv-historical-pages/"+safe+".html.gz",
      rawSha256:r.responseSha256,
      gzipSha256:createHash("sha256").update(gz).digest("hex"),
      gzipBytes:gz.length};
    count++;
  }
  return count;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  const output=process.argv[2]||"evidence/arxiv-historical.json";
  const result=await inspectAll();
  mkdirSync(dirname(output),{recursive:true});
  const archived=archiveHistoricRaw(result,dirname(output)+"/arxiv-historical-pages");
  writeFileSync(output,JSON.stringify(result,null,2)+"\n");
  console.log("HISTORIC_ARXIV_ARCHIVE_PROBE="+JSON.stringify({requests:result.results.length,
    ok:result.results.filter(x=>x.ok).length,archived,matched:result.results.reduce((n,x)=>n+x.matches.length,0)}));
  for(const row of result.results)console.log("HISTORIC_ARXIV_ITEM="+JSON.stringify({
    eventId:row.eventId,arxivId:row.arxivId,ok:row.ok,groupsFound:row.groupsFound,
    matches:row.matches,error:row.error}));
}
