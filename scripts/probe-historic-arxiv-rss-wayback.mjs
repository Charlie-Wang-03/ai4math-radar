/**
 * Fixed-source, read-only historical arXiv RSS evidence probe.
 * A matched legacy item is evidence to inspect, NOT a certified first announcement.
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
    source:"https://arxiv.org/rss/cs.LG"})
]);
const MAX_CDX_BYTES=400000;
const MAX_XML_BYTES=4400000;
const MAX_REPLAYS=3;

async function boundedGet(url,limit,fetcher=fetch){
  const u=new URL(url);
  if(u.protocol!=="https:"||u.hostname!=="web.archive.org"||u.username||u.password||u.port||u.hash||
     !(u.pathname==="/cdx/search/cdx"||(!u.search&&/^\/web\/\d{14}id_\/https?:\/\/(?:rss\.arxiv\.org|arxiv\.org)\/rss\/cs\.LG$/.test(u.pathname))))
    throw Error("Unapproved Wayback lookup URL");
  const response=await fetcher(url,{redirect:"error",headers:{Accept:"application/json, application/xml, text/xml"},
    signal:AbortSignal.timeout(12000)});
  if(!response.body?.getReader)throw Error("Missing bounded response stream");
  const reader=response.body.getReader(),chunks=[];
  let size=0;
  try{
    for(;;){
      const {done,value}=await reader.read();
      if(done)break;
      size+=value.byteLength;
      if(size>limit){await reader.cancel();throw Error("Exceeded fixed response byte limit");}
      chunks.push(Buffer.from(value));
    }
  }finally{reader.releaseLock();}
  const bytes=Buffer.concat(chunks,size);
  return {ok:response.ok,status:response.status,body:new TextDecoder().decode(bytes),
    bytes:size,digest:createHash("sha256").update(bytes).digest("hex")};
}
function tag(xml,name){
  const raw=xml.match(new RegExp("<"+name+"\\b[^>]*>([\\s\\S]*?)</"+name+">","i"))?.[1];
  return raw?.trim().replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/,"$1").trim()||null;
}
// RFC-822/2822 RSS dates: no worker-local timezone defaults or calendar rollovers.
function rssUtcDate(raw){
  const m=raw?.match(/^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s*)?(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})\s+(\d{2}):(\d{2})(?::(\d{2}))?\s+(GMT|UTC|[+-]\d{4})$/i);
  if(!m)return null;
  const months=["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
  const day=Number(m[2]),month=months.indexOf(m[3].toLowerCase()),year=Number(m[4]);
  const hour=Number(m[5]),minute=Number(m[6]),second=Number(m[7]||0),zone=m[8].toUpperCase();
  const offset=/^[+-]/.test(zone)?(Number(zone.slice(1,3))*60+Number(zone.slice(3)))*(zone[0]==="-"?-1:1):0;
  if(year<1900||hour>23||minute>59||second>59||(/^[+-]/.test(zone)&&(Number(zone.slice(1,3))>23||Number(zone.slice(3))>59)))return null;
  const civil=new Date(Date.UTC(year,month,day,hour,minute,second));
  if(civil.getUTCFullYear()!==year||civil.getUTCMonth()!==month||civil.getUTCDate()!==day)return null;
  if(m[1]&&["sun","mon","tue","wed","thu","fri","sat"][civil.getUTCDay()]!==m[1].toLowerCase())return null;
  return new Date(civil.getTime()-offset*60000).toISOString().slice(0,10);
}
export function inspectRssItem(xml,id){
  if(!/^\d{4}\.\d{4,5}$/.test(id))throw Error("Invalid arXiv identifier");
  // Old default RSS 1.0 is explicitly documented by arXiv before January 2024.
  const legacy=/<(?:[\w.-]+:)?RDF\b/i.test(xml)||/<rss\b[^>]*version=["'](?:0\.91|1\.0)["']/i.test(xml);
  const sourceFormat=legacy?"legacy-rss":/<rss\b[^>]*version=["']2\.0["']/i.test(xml)?"rss-2.0":"unknown-rss";
  if(!/<rss\b[^>]*>[\s\S]*<\/rss\s*>/i.test(xml)&&
     !/<(?:[\w.-]+:)?RDF\b[^>]*>[\s\S]*<\/(?:[\w.-]+:)?RDF\s*>/i.test(xml))
    throw Error("Unrecognized or incomplete RSS document");
  if((xml.match(/<item\b[^>]*>/gi)||[]).length!==(xml.match(/<\/item\s*>/gi)||[]).length)
    throw Error("Incomplete RSS item");
  const found=[];
  for(const m of xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)){
    const item=m[1],link=tag(item,"link");
    let u;
    try{u=new URL(link);}catch{continue;}
    const path=u.pathname.match(/^\/abs\/(\d{4}\.\d{4,5})(v\d+)?$/);
    if(!["http:","https:"].includes(u.protocol)||!["arxiv.org","www.arxiv.org"].includes(u.hostname)||
       u.username||u.password||u.port||u.search||u.hash||path?.[1]!==id)continue;
    const title=tag(item,"title"),description=tag(item,"description")||"",guid=tag(item,"guid")||"";
    const modern=description.match(/^arXiv:(\d{4}\.\d{4,5}v\d+)\s+Announce Type:\s*([a-z-]+)/i);
    const versions=[modern?.[1],guid.match(/^oai:arXiv\.org:(\d{4}\.\d{4,5}v\d+)$/i)?.[1],
      title?.match(/\(arXiv:(\d{4}\.\d{4,5}v\d+)\s*\[/i)?.[1],path[2]?id+path[2]:null].filter(Boolean);
    const uniqueVersions=[...new Set(versions)];
    const identityConflict=uniqueVersions.length>1||uniqueVersions.some(v=>v.replace(/v\d+$/,"")!==id);
    const version=uniqueVersions.length===1?uniqueVersions[0]:null;
    const types=[tag(item,"arxiv:announce_type"),modern?.[2]].filter(Boolean).map(x=>x.toLowerCase());
    const uniqueTypes=[...new Set(types)],type=uniqueTypes.length===1?uniqueTypes[0]:null;
    const rawDate=tag(item,"pubDate"),utcDate=rssUtcDate(rawDate),reasons=[];
    if(legacy)reasons.push("LEGACY_FORMAT_REQUIRES_MANUAL_REVIEW");
    if(sourceFormat==="unknown-rss")reasons.push("UNVERIFIED_FEED_FORMAT");
    if(identityConflict)reasons.push("CONFLICTING_ARTICLE_ID_OR_VERSION");
    if(version!==id+"v1")reasons.push("NO_UNAMBIGUOUS_V1");
    if(uniqueTypes.length>1)reasons.push("CONFLICTING_ANNOUNCEMENT_TYPES");
    if(type!=="new")reasons.push(type?"NOT_NEW_ANNOUNCEMENT":"MISSING_ANNOUNCEMENT_TYPE");
    if(!utcDate)reasons.push("MISSING_OR_INVALID_EXPLICIT_TIMEZONE_DATE");
    found.push({arxivId:id,version,announceType:type,sourceFormat,sourcePubDate:rawDate,
      legacyItemDate:tag(item,"dc:date"),utcDate,title,identityConflict,
      eligibleNewV1:reasons.length===0,validationReasons:reasons});
  }
  return found;
}
function cdxUrl(t){
  const q=new URLSearchParams({url:new URL(t.source).hostname+"/rss/"+t.category,
    from:t.from,to:t.to,output:"json",filter:"statuscode:200",
    fl:"timestamp,original,statuscode",collapse:"timestamp:8",limit:"12"});
  return "https://web.archive.org/cdx/search/cdx?"+q.toString();
}
function matchingOriginal(original,t){
  try{
    const u=new URL(original),expected=new URL(t.source);
    return ["http:","https:"].includes(u.protocol)&&u.hostname===expected.hostname&&u.pathname===expected.pathname&&
      !u.username&&!u.password&&!u.port&&!u.search&&!u.hash&&original===u.href;
  }catch{return false;}
}
export async function inspectTarget(t,fetcher=fetch){
  const approved=TARGETS.find(x=>x.eventId===t.eventId);
  if(!approved||JSON.stringify(t)!==JSON.stringify(approved))throw Error("Only exact fixed target parameters allowed");
  const result={eventId:t.eventId,arxivId:t.arxivId,category:t.category,
    archiveQuery:cdxUrl(t),primarySource:t.source,candidates:[],
    decision:"UNRESOLVED_HISTORIC_ORIGINAL_NEW_FEED",reason:"SOURCE_LOOKUP_NOT_COMPLETED"};
  try{
    const index=await boundedGet(result.archiveQuery,MAX_CDX_BYTES,fetcher);
    result.indexStatus=index.status;result.indexDigest=index.digest;
    if(!index.ok){result.reason="CDX_HTTP_ERROR";return result;}
    const records=JSON.parse(index.body);
    if(!Array.isArray(records))throw Error("Invalid CDX array");
    if(records.length&&JSON.stringify(records[0])!==JSON.stringify(["timestamp","original","statuscode"]))throw Error("Invalid CDX column header");
    result.indexRowCount=Math.max(0,records.length-1);
    const rows=records.slice(1).filter(x=>Array.isArray(x)&&x.length===3&&
      /^\d{14}$/.test(x[0])&&x[0].slice(0,8)>=t.from&&x[0].slice(0,8)<=t.to&&x[2]==="200"&&matchingOriginal(x[1],t));
    result.eligibleCaptureRows=rows.length;
    result.rejectedIndexRows=result.indexRowCount-rows.length;
    result.reason=rows.length?"NO_MATCHING_ARTICLE_IN_READABLE_CAPTURES":result.indexRowCount?"NO_ELIGIBLE_CAPTURE_ROWS":"NO_CAPTURE_ROWS";
    for(const row of rows.slice(0,MAX_REPLAYS)){
      // Preserve CDX's actual original scheme. Outer transport remains HTTPS.
      const stamp=row[0],url="https://web.archive.org/web/"+stamp+"id_/"+row[1];
      try{
        const resp=await boundedGet(url,MAX_XML_BYTES,fetcher);
        const matches=resp.ok?inspectRssItem(resp.body,t.arxivId):[];
        for(const match of matches){
          const date=match.utcDate?.replaceAll("-","");
          if(date&&(date<t.from||date>t.to)){
            match.eligibleNewV1=false;match.validationReasons.push("ITEM_DATE_OUTSIDE_TARGET_WINDOW");
          }
        }
        result.candidates.push({captureAt:stamp,archiveOriginal:row[1],archiveUrl:url,httpStatus:resp.status,
          digest:resp.digest,bytes:resp.bytes,matches});
      }catch(error){result.candidates.push({captureAt:stamp,archiveOriginal:row[1],archiveUrl:url,error:String(error).slice(0,240)});}
    }
    if(result.candidates.some(x=>x.matches?.some(m=>m.eligibleNewV1))){
      result.decision="CANDIDATE_ORIGINAL_NEW_RSS_REQUIRES_EDITORIAL_REVIEW";
      result.reason="MATCHED_MODERN_NEW_V1_CANDIDATE";
    }else if(result.candidates.some(x=>x.matches?.length)){
      result.reason="MATCHED_ARTICLE_BUT_ANNOUNCEMENT_UNVERIFIED";
    }else if(result.candidates.some(x=>x.error||x.httpStatus!==200)){
      result.reason="CAPTURE_READ_ERRORS_WITHOUT_MATCH";
    }
  }catch(error){result.reason="SOURCE_ERROR";result.error=String(error).slice(0,260);}
  return result;
}
export async function inspectAll(fetcher=fetch){
  const results=[];
  for(const t of TARGETS)results.push(await inspectTarget(t,fetcher));
  return {kind:"HISTORIC_ARCHIVED_ORIGINAL_ARXIV_RSS_RESEARCH_ONLY",
    checkedAt:new Date().toISOString(),results,
    guarantee:"Neither submission clock, legacy channel date nor Wayback capture time is automatically promoted."};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  const entries=readFileSync("portable/content/selected.jsonl","utf8").trim().split(/\r?\n/).map(JSON.parse);
  const ids=new Set(entries.map(x=>x.id));
  if(TARGETS.some(t=>!ids.has(t.eventId)))throw Error("Canonical source IDs missing");
  const dest=process.argv[2]||"evidence/arxiv-historic-cdx.json";
  const data=await inspectAll();
  const midnight=entries.filter(x=>/T00:00:00(?:\.000)?Z$/.test(x.publishedAt||""));
  data.catalogSnapshot={records:entries.length,uniqueIds:ids.size,midnightTimestampCount:midnight.length,
    midnightWithoutChronology:midnight.filter(x=>!x.chronology).map(x=>x.id)};
  mkdirSync(dirname(dest),{recursive:true});
  writeFileSync(dest,JSON.stringify(data,null,2)+"\n");
  for(const x of data.results)console.log("HISTORIC_RSS_ITEM="+JSON.stringify(x));
  console.log("HISTORIC_RSS_SUMMARY="+JSON.stringify({output:dest,
    candidates:data.results.reduce((s,x)=>s+x.candidates.length,0),catalogSnapshot:data.catalogSnapshot}));
}
