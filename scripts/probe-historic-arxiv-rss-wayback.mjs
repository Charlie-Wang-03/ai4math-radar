/**
 * Read-only historical arXiv RSS archive probe. NO canonical news writes.
 * CDX capture time is not a paper-publication instant.
 */
import {createHash} from "node:crypto";
import {readFileSync, mkdirSync, writeFileSync} from "node:fs";
import {dirname} from "node:path";
import {pathToFileURL} from "node:url";

export const TARGETS=Object.freeze([
  Object.freeze({eventId:"2026-09-29-genlimitlib",arxivId:"2609.36663",
    category:"cs.LG",from:"20260929",to:"20261003",
    source:"https://rss.arxiv.org/rss/cs.LG"}),
  Object.freeze({eventId:"2023-06-02-checkmate",arxivId:"2306.01694",
    category:"cs.LG",from:"20230602",to:"20230609",
    source:"https://export.arxiv.org/rss/cs.LG"})
]);
const MAX_CDX_BYTES=400000;
const MAX_XML_BYTES=4400000;
const MAX_REPLAYS=3;

async function boundedGet(url,limit,fetcher=fetch){
  const u=new URL(url);
  if(u.protocol!=="https:"||u.hostname!=="web.archive.org"||
     !(u.pathname==="/cdx/search/cdx"||/^\/web\/\d{14}id_\/https:\/\/(?:rss|export)\.arxiv\.org\/rss\/cs\.LG$/.test(u.pathname)))
    throw Error("Unapproved Wayback lookup URL");
  const response=await fetcher(url,{redirect:"error",headers:{Accept:"application/json, application/xml, text/xml"},
    signal:AbortSignal.timeout(12000)});
  const bytes=Buffer.from(await response.arrayBuffer());
  if(bytes.length>limit)throw Error("Exceeded fixed response byte limit");
  return {ok:response.ok,status:response.status,body:new TextDecoder().decode(bytes),
    bytes:bytes.length,digest:createHash("sha256").update(bytes).digest("hex")};
}
export function inspectRssItem(xml,id){
  if(!/^\d{4}\.\d{4,5}$/.test(id))throw Error("Invalid arXiv identifier");
  const found=[];
  const articleLink=new RegExp("<link>https?://(?:www\\.)?arxiv\\.org/abs/"+id.replace(".","\\.")+"(?:v1)?</link>","i");
  for(const m of xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)){
    const item=m[1];
    if(!articleLink.test(item))continue;
    const version=(item.match(/arXiv:(\d{4}\.\d{4,5}v\d+)\s+Announce Type:/i)||[])[1]||null;
    const type=(item.match(/<arxiv:announce_type>\s*([^<]+)\s*<\/arxiv:announce_type>/i)||[])[1]
       ||(item.match(/Announce Type:\s*([a-z-]+)/i)||[])[1]||null;
    const rawDate=(item.match(/<pubDate>([^<]+)<\/pubDate>/i)||[])[1]||null;
    const parsed=rawDate?Date.parse(rawDate):NaN;
    const title=(item.match(/<title>([\s\S]*?)<\/title>/i)||[])[1]?.trim()||null;
    found.push({arxivId:id,version,announceType:type?.trim().toLowerCase()||null,
      sourcePubDate:rawDate,utcDate:Number.isFinite(parsed)?new Date(parsed).toISOString().slice(0,10):null,
      title,eligibleNewV1:version===id+"v1"&&type?.trim().toLowerCase()==="new"&&Number.isFinite(parsed)});
  }
  return found;
}
function cdxUrl(t){
  const q=new URLSearchParams({url:new URL(t.source).hostname+"/rss/"+t.category,
    from:t.from,to:t.to,output:"json",filter:"statuscode:200",
    fl:"timestamp,original,statuscode",collapse:"timestamp:8",limit:"12"});
  return "https://web.archive.org/cdx/search/cdx?"+q.toString();
}
export async function inspectTarget(t,fetcher=fetch){
  const approved=TARGETS.find(x=>x.eventId===t.eventId);
  if(!approved||JSON.stringify(t)!==JSON.stringify(approved))
    throw Error("Only exact fixed target parameters allowed");
  const result={eventId:t.eventId,arxivId:t.arxivId,category:t.category,
    archiveQuery:cdxUrl(t),primarySource:t.source,candidates:[],
    decision:"UNRESOLVED_HISTORIC_ORIGINAL_NEW_FEED"};
  try{
    const index=await boundedGet(result.archiveQuery,MAX_CDX_BYTES,fetcher);
    result.indexStatus=index.status;result.indexDigest=index.digest;
    if(!index.ok)return result;
    const records=JSON.parse(index.body);
    if(!Array.isArray(records))return result;
    const rows=records.slice(1).filter(x=>Array.isArray(x)&&
      /^\d{14}$/.test(x[0])&&x[0].slice(0,8)>=t.from&&x[0].slice(0,8)<=t.to&&x[2]==="200");
    for(const row of rows.slice(0,MAX_REPLAYS)){
      const stamp=row[0],url="https://web.archive.org/web/"+stamp+"id_/"+t.source;
      try{
        const resp=await boundedGet(url,MAX_XML_BYTES,fetcher);
        const matches=resp.ok?inspectRssItem(resp.body,t.arxivId):[];
        result.candidates.push({captureAt:stamp,archiveUrl:url,httpStatus:resp.status,
          digest:resp.digest,bytes:resp.bytes,matches});
      }catch(error){
        result.candidates.push({captureAt:stamp,archiveUrl:url,error:String(error).slice(0,240)});
      }
    }
    if(result.candidates.some(x=>x.matches?.some(m=>m.eligibleNewV1)))
      result.decision="CANDIDATE_ORIGINAL_NEW_RSS_REQUIRES_EDITORIAL_REVIEW";
  }catch(error){result.error=String(error).slice(0,260);}
  return result;
}
export async function inspectAll(fetcher=fetch){
  const results=[];
  for(const t of TARGETS)results.push(await inspectTarget(t,fetcher));
  return {kind:"HISTORIC_ARCHIVED_ORIGINAL_ARXIV_RSS_RESEARCH_ONLY",
    checkedAt:new Date().toISOString(),results,
    guarantee:"Neither submission clock nor Wayback capture time is automatically promoted."};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  const ids=new Set(readFileSync("portable/content/selected.jsonl","utf8")
    .trim().split(/\r?\n/).map(x=>JSON.parse(x).id));
  if(TARGETS.some(t=>!ids.has(t.eventId)))throw Error("Canonical source IDs missing");
  const dest=process.argv[2]||"evidence/arxiv-historic-cdx.json";
  const data=await inspectAll();
  mkdirSync(dirname(dest),{recursive:true});
  writeFileSync(dest,JSON.stringify(data,null,2)+"\n");
  for(const x of data.results)console.log("HISTORIC_RSS_ITEM="+JSON.stringify(x));
  console.log("HISTORIC_RSS_SUMMARY="+JSON.stringify({output:dest,
    candidates:data.results.reduce((s,x)=>s+x.candidates.length,0)}));
}
