/** Read-only, bounded capture of official arXiv dated daily listing evidence.
 * A dated category listing is not automatically proof of the first v1 announcement:
 * later revisions/crosslists can be present. No canonical write path exists here.
 */
import {createHash} from "node:crypto";
import {readFileSync,mkdirSync,writeFileSync} from "node:fs";
import {dirname} from "node:path";
import {pathToFileURL} from "node:url";
import {setTimeout as delay} from "node:timers/promises";

export const CATEGORIES=Object.freeze([
  "math.AC","cs.CC","cs.LG","cs.LO","math.NT","cs.AI","cs.DS","math.CO","cs.CL","math.AG"
]);
const MONTHS={Jan:"01",Feb:"02",Mar:"03",Apr:"04",May:"05",Jun:"06",Jul:"07",Aug:"08",
  Sep:"09",Oct:"10",Nov:"11",Dec:"12"};
const ARXIV_ID=/^\d{4}\.\d{4,5}$/;
const HEADING=/<h3\b[^>]*>\s*(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s*(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})\b[^<]*<\/h3>/gi;
const MAIN_DT=/<dt\b[^>]*>([\s\S]*?)<\/dt>/gi;
const MAIN_PAPER=/<a\b[^>]*\bhref\s*=\s*["']\/abs\/(\d{4}\.\d{4,5})(?:v\d+)?["'][^>]*>/i;

export function officialListingUrl(category) {
  if(!CATEGORIES.includes(category))throw new Error("arXiv category is not allowlisted");
  return "https://arxiv.org/list/"+category+"/recent?show=2000&skip=0";
}
export function parseDatedListing(html) {
  if(typeof html!=="string")throw new TypeError("HTML response must be text");
  const heads=[...html.matchAll(HEADING)];
  const groups=[];
  for(let i=0;i<heads.length;i++){
    const h=heads[i],start=h.index+h[0].length,end=i+1<heads.length?heads[i+1].index:html.length;
    const date=h[4]+"-"+MONTHS[h[3]]+"-"+h[2].padStart(2,"0");
    if(Number.isNaN(Date.parse(date+"T00:00:00Z")))continue;
    const ids=[...new Set([...html.slice(start,end).matchAll(MAIN_DT)]
      .map(m=>m[1].match(MAIN_PAPER)?.[1]??null)
      .filter(id=>typeof id==="string"&&ARXIV_ID.test(id)))];
    groups.push({date,heading:h[1]+", "+h[2]+" "+h[3]+" "+h[4],count:ids.length,ids});
  }
  return groups;
}
export function canonicalArxivIndex(jsonl) {
  const map=new Map();
  for(const line of jsonl.split(/\r?\n/).filter(Boolean)){
    const row=JSON.parse(line);
    if(!row.selected||typeof row.links?.original!=="string")continue;
    const hit=row.links.original.match(/^https:\/\/arxiv\.org\/abs\/(\d{4}\.\d{4,5})(?:v\d+)?\/?$/);
    if(!hit)continue;
    const hitId=hit[1];if(!map.has(hitId))map.set(hitId,[]);
    map.get(hitId).push({eventId:row.id,legacyDay:row.publishedAt?.slice(0,10)??null,
      chronologyDay:row.chronology?.milestone?.date??null});
  }
  return map;
}
export async function captureOne(category,fetcher=fetch) {
  const url=officialListingUrl(category);
  const u=new URL(url);
  if(u.protocol!=="https:"||u.hostname!=="arxiv.org"||!/^\/list\/[a-z.]+\/recent$/i.test(u.pathname))
    throw new Error("unapproved announcement endpoint");
  try{
    const res=await fetcher(url,{redirect:"error",headers:{Accept:"text/html"},
      signal:AbortSignal.timeout(15000)});
    const body=await res.text();
    if(body.length>3800000)throw new Error("large response rejected");
    return {category,url,status:res.status,ok:res.ok,
      sha256:createHash("sha256").update(body).digest("hex"),bytes:body.length,
      groups:res.ok?parseDatedListing(body):[],
      ...(res.ok?{}:{error:"HTTP "+res.status})};
  }catch(error){return {category,url,ok:false,error:String(error).slice(0,220),groups:[]};}
}
export async function captureAll(categories=CATEGORIES,fetcher=fetch,spacingMs=3300,
    canonical=canonicalArxivIndex(readFileSync("portable/content/selected.jsonl","utf8"))) {
  const snapshots=[];
  for(let i=0;i<categories.length;i++){
    if(i>0&&spacingMs>0)await delay(spacingMs);
    snapshots.push(await captureOne(categories[i],fetcher));
  }
  const matched=[];
  for(const entry of snapshots){
    if(!entry.ok)continue;
    for(const g of entry.groups){
      for(const id of g.ids){
        const stories=canonical.get(id);
        if(!stories)continue;
        for(const story of stories)matched.push({arxivId:id,category:entry.category,
          listingDay:g.date,sourceUrl:entry.url,sourceSha256:entry.sha256,...story,
          decision:"CANDIDATE_ONLY_VERIFY_FIRST_PUBLIC_V1_AND_CROSSLIST"});
      }
    }
  }
  return {schemaVersion:1,type:"ARXIV_OFFICIAL_DATED_LISTING_OBSERVATIONS_NOT_AUTOMATIC_PUBLICATION",
    generatedAt:new Date().toISOString(),providers:snapshots.length,
    ok:snapshots.filter(x=>x.ok).length,matchedNews:matched,
    rules:"News data is read-only; dated listing can include cross-lists and revisions. Verify paper v1 and event identity separately; no inferred precise clock.",
    snapshots};
}
export function hasUsableDatedListingEvidence(data) {
  return Array.isArray(data?.snapshots) && data.snapshots.some(snapshot =>
    snapshot.ok===true && Array.isArray(snapshot.groups) &&
    snapshot.groups.some(group => /^\\d{4}-\\d{2}-\\d{2}$/.test(group.date??"") &&
      Array.isArray(group.ids) && group.ids.length>0));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  const output=process.argv[2]||"evidence/arxiv-dated-listings.json";
  const data=await captureAll();
  mkdirSync(dirname(output),{recursive:true});
  writeFileSync(output,JSON.stringify(data,null,2)+"\n");
  console.log("OFFICIAL_ARXIV_LISTING_CAPTURE="+JSON.stringify({output,ok:data.ok,
    requested:data.providers,groupCount:data.snapshots.reduce((n,s)=>n+s.groups.length,0),
    matched:data.matchedNews.length}));
  for(const x of data.matchedNews)console.log("LISTING_CANDIDATE="+JSON.stringify(x));
  if(!hasUsableDatedListingEvidence(data)) {
    console.error("ARXIV_LISTING_CAPTURE_UNUSABLE: zero parsed article IDs under dated official listing groups");
    process.exitCode=1;
  }
}
