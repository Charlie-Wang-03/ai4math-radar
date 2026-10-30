/** Read-only official arXiv OAI metadata probe.
 * OAI datestamp is the last metadata modification, NOT first public announcement.
 * Version/created dates can denote submissions. No automatic editorial mutation.
 */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {dirname} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {setTimeout as delay} from 'node:timers/promises';

const ID=/^\d{4}\.\d{4,5}$/;
const OAI='https://oaipmh.arxiv.org/oai';

export function extractArxivItems(jsonl) {
  if(typeof jsonl!=='string')throw new TypeError('canonical JSONL required');
  const out=[];
  for(const line of jsonl.split(/\r?\n/).filter(Boolean)){
    const item=JSON.parse(line);
    if(item.selected!==true||!item.links?.original||!item.publishedAt)continue;
    const u=new URL(item.links.original);
    const m=u.protocol==='https:'&&u.hostname==='arxiv.org'&&!u.search&&!u.hash
      ?u.pathname.match(/^\/abs\/(\d{4}\.\d{4,5})(?:v1)?\/?$/):null;
    if(!m||!ID.test(m[1]))continue;
    const dayOnly=item.publishedAtPrecision==='day'||(
      !item.publishedAtPrecision&&/^\d{4}-\d{2}-\d{2}T00:00:00(?:\.0+)?Z$/.test(item.publishedAt));
    if(!dayOnly)continue;
    out.push({eventId:item.id,arxivId:m[1],sourceUrl:item.links.original,
      historicalUtcDay:item.publishedAt.slice(0,10)});
  }
  return out;
}
export function buildOaiUrl(id) {
  if(!ID.test(id))throw new Error('invalid arXiv ID');
  const u=new URL(OAI);
  u.searchParams.set('verb','GetRecord');
  u.searchParams.set('identifier','oai:arXiv.org:'+id);
  u.searchParams.set('metadataPrefix','arXivRaw');
  return u.href;
}
function tag(block,name) {
  const rx=new RegExp('<(?:[\\w.-]+:)?'+name+'(?:\\s[^>]*)?>([\\s\\S]*?)<\\/(?:[\\w.-]+:)?'+name+'\\s*>','i');
  return (block.match(rx)?.[1]??'').trim().replace(/<[^>]*>/g,'').slice(0,300);
}
export function inspectOaiXml(xml, expectedId) {
  if(typeof xml!=='string'||!ID.test(expectedId))throw new Error('invalid arguments');
  const err=xml.match(/<error\s+code="([^"]+)"[^>]*>([\s\S]*?)<\/error>/i);
  if(err)return {matched:false,errorCode:err[1],errorMessage:err[2].slice(0,140)};
  const header=xml.match(/<header(?:\s[^>]*)?>([\s\S]*?)<\/header>/i)?.[1]??'';
  const actual=tag(header,'identifier');
  if(actual!=='oai:arXiv.org:'+expectedId)
    return {matched:false,error:'OAI header mismatch',actual};
  const metadata=xml.match(/<metadata(?:\s[^>]*)?>([\s\S]*?)<\/metadata>/i)?.[1]??'';
  if(!metadata)return {matched:false,error:'metadata missing'};
  const metadataId=tag(metadata,'id');
  if(metadataId&&metadataId!==expectedId)
    return {matched:false,error:'metadata identifier mismatch',metadataId};
  const versions=[...metadata.matchAll(/<(?:[\w.-]+:)?version\b([^>]*)>([\s\S]*?)<\/(?:[\w.-]+:)?version\s*>/gi)]
    .slice(0,12).map(x=>({version:x[1].match(/\bversion=["']([^"']+)["']/i)?.[1]||tag(x[2],'version')||null,
      date:tag(x[2],'date')||null}));
  return {matched:true,identifier:actual,metadataId:metadataId||null,
    oaiHeaderDatestamp:tag(header,'datestamp')||null,
    providerCreated:tag(metadata,'created')||null,
    providerUpdated:tag(metadata,'updated')||null,
    versions,
    firstPublicAnnouncementAt:null,approvedForPublishedAt:false,
    dateSemantics:'OAI header datestamp reflects metadata modification; created and version date are NOT first public announcement.'};
}
export async function probeOai(item,fetcher=fetch) {
  const url=buildOaiUrl(item.arxivId);
  const u=new URL(url);
  if(u.hostname!=='oaipmh.arxiv.org'||u.protocol!=='https:'||u.pathname!=='/oai')
    throw new Error('host rejected');
  try{
    const r=await fetcher(url,{redirect:'error',headers:{Accept:'application/xml, text/xml'},
      signal:AbortSignal.timeout(15000)});
    const body=await r.text();
    if(body.length>1200000)throw new Error('oversized response');
    return {...item,endpoint:url,httpStatus:r.status,
      responseSha256:createHash('sha256').update(body).digest('hex'),
      responseBytes:body.length,...(r.ok?inspectOaiXml(body,item.arxivId):{matched:false,error:'HTTP '+r.status}),
      approvedForPublishedAt:false};
  }catch(e){
    return {...item,endpoint:url,matched:false,error:String(e).slice(0,200),
      approvedForPublishedAt:false};
  }
}
export async function runProbe(items,fetcher=fetch,spacingMs=3300) {
  const probes=[];
  for(let i=0;i<items.length;i++){
    if(i>0&&spacingMs>0)await delay(spacingMs);
    probes.push(await probeOai(items[i],fetcher));
  }
  return {schemaVersion:1,type:'OAI_METADATA_NOT_PUBLIC_ANNOUNCEMENT',
    generatedAt:new Date().toISOString(),count:items.length,
    matched:probes.filter(p=>p.matched).length,
    rules:'Never change publishedAt or chronology from OAI header datestamp, created, version history or inferred arXiv 20:00 ET schedule.',
    docs:['https://info.arxiv.org/help/oa/index.html',
      'https://info.arxiv.org/help/api/user-manual.html',
      'https://info.arxiv.org/help/availability.html'],
    probes};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href) {
  const path=process.argv[2]||'evidence/arxiv-oai-candidates.json';
  const items=extractArxivItems(readFileSync('portable/content/selected.jsonl','utf8'));
  const result=await runProbe(items);
  mkdirSync(dirname(path),{recursive:true});
  writeFileSync(path,JSON.stringify(result,null,2)+'\n');
  console.log('ARXIV_OAI_PROBE='+JSON.stringify({count:result.count,matched:result.matched,output:path}));
  for(const x of result.probes)console.log('ARXIV_OAI_ITEM='+JSON.stringify({
    eventId:x.eventId,matched:x.matched,created:x.providerCreated,
    lastModified:x.oaiHeaderDatestamp,error:x.error}));
}
