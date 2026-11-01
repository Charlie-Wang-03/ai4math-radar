/** Fixed-source research only. Never writes the canonical news catalog. */
import {createHash} from 'node:crypto';
import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname} from 'node:path';
import {pathToFileURL} from 'node:url';
import {Readable, Transform} from 'node:stream';
import {pipeline} from 'node:stream/promises';
import {createGunzip} from 'node:zlib';

export const ARCHIVE='https://data.gharchive.org/2023-06-05-12.json.gz';
export const DOIS=Object.freeze(['10.5281/zenodo.23450488','10.5281/zenodo.23475012']);
const URLS=new Set([ARCHIVE,...DOIS.map(x=>'https://api.datacite.org/dois/'+x)]);
const REPO='collinskatie/checkmate';
const LIMITS={compressed:256*1024*1024,expanded:2*1024*1024*1024,line:8*1024*1024,json:1300000};

async function request(url,fetcher){
  if(!URLS.has(url))throw Error('Unapproved fixed evidence URL');
  return fetcher(url,{redirect:'error',signal:AbortSignal.timeout(90000),
    headers:{Accept:url===ARCHIVE?'application/gzip':'application/json'}});
}
export function matchEvent(e){
  const p=e?.payload?.pull_request;
  if(e?.repo?.name!==REPO||e?.repo?.id!==643507916||e?.type!=='PullRequestEvent'||
     e?.payload?.number!==1)return null;
  const identity=e.public===true&&e.actor?.login==='albertqjiang'&&e.actor?.id===19373539&&
    p?.html_url==='https://github.com/collinskatie/checkmate/pull/1'&&p?.number===1&&
    p?.user?.login==='albertqjiang'&&p?.created_at==='2023-06-05T12:39:48Z'&&
    /^2023-06-05T12:[0-5]\d:[0-5]\dZ$/.test(e.created_at||'')&&
    ['opened','closed'].includes(e.payload.action);
  return {eventId:e.id,identityMatched:identity,
    scope:'PUBLIC_SOURCE_CODE_COLLABORATION_NOT_FIRST_ARXIV_ANNOUNCEMENT',event:e};
}
function limiter(max,onChunk){
  let count=0;
  return new Transform({transform(chunk,_encoding,callback){
    count+=chunk.length;
    if(count>max){callback(Error('Evidence response exceeded fixed byte limit'));return;}
    onChunk?.(chunk);callback(null,chunk);
  }});
}
export async function probeArchive(fetcher=fetch){
  const result={url:ARCHIVE,complete:false,matches:[],
    decision:'UNRESOLVED_PUBLIC_CODE_EVENT',reason:'NOT_COMPLETED'};
  try{
    const resp=await request(ARCHIVE,fetcher);result.status=resp.status;
    if(!resp.ok){await resp.body?.cancel();result.reason='HTTP_ERROR';return result;}
    if(!resp.body)throw Error('Missing archive stream');
    const hash=createHash('sha256');let compressed=0,expanded=0,lines=0;
    await pipeline(Readable.fromWeb(resp.body),limiter(LIMITS.compressed,c=>{compressed+=c.length;hash.update(c);}),
      createGunzip(),limiter(LIMITS.expanded,c=>{expanded+=c.length;}),async function(source){
        const decoder=new TextDecoder('utf-8',{fatal:true});let carry='';
        function inspect(line){
          if(Buffer.byteLength(line)>LIMITS.line)throw Error('Oversized event line');
          if(!line.trim())return;lines++;
          const event=JSON.parse(line);const match=matchEvent(event);
          if(match){if(result.matches.length>=20)throw Error('Unexpected excess matching events');result.matches.push(match);}
        }
        for await(const chunk of source){
          carry+=decoder.decode(chunk,{stream:true});
          let pos;
          while((pos=carry.indexOf('\n'))>=0){inspect(carry.slice(0,pos));carry=carry.slice(pos+1);}
          if(Buffer.byteLength(carry)>LIMITS.line)throw Error('Oversized unterminated event line');
        }
        carry+=decoder.decode();if(carry)inspect(carry);
      });
    Object.assign(result,{complete:true,compressedBytes:compressed,expandedBytes:expanded,
      archiveSha256:hash.digest('hex'),linesRead:lines});
    if(result.matches.some(x=>x.identityMatched)){
      result.decision='VERIFIED_ARCHIVED_PUBLIC_CODE_EVENT_REQUIRES_EDITORIAL_REVIEW';
      result.reason='EXACT_PUBLIC_AUTHOR_PR_EVENT';
    }else result.reason=result.matches.length?'EVENT_IDENTITY_NOT_ESTABLISHED':'NO_MATCH_IN_THIS_HOUR';
  }catch(error){result.reason='SOURCE_ERROR';result.error=String(error).slice(0,300);}
  return result;
}
export function inspectDoi(data,doi){
  if(!DOIS.includes(doi))throw Error('Unapproved DOI');
  const a=data?.data?.attributes,record=doi.split('.').at(-1);
  let landing=false;
  try{const u=new URL(a?.url);landing=u.protocol==='https:'&&u.hostname==='zenodo.org'&&
    !u.username&&!u.password&&!u.port&&!u.search&&!u.hash&&
    ['/records/'+record,'/record/'+record,'/doi/'+doi].includes(u.pathname);}catch{}
  const matched=data?.data?.type==='dois'&&data.data.id?.toLowerCase()===doi&&a?.doi?.toLowerCase()===doi&&
    landing&&a?.titles?.some(x=>/arad/i.test(x.title||'')&&/herzog/i.test(x.title||''));
  return {doi,matched,metadata:matched?Object.fromEntries(
    ['doi','titles','creators','url','state','version','created','registered','published','updated',
     'publicationYear','dates','relatedIdentifiers'].map(k=>[k,a[k]??null])):null,
    decision:'NO_MANUSCRIPT_PUBLICATION_CLOCK_PROMOTION_FROM_DOI_METADATA'};
}
export async function probeDoi(doi,fetcher=fetch){
  if(!DOIS.includes(doi))throw Error('Unapproved DOI');
  const url='https://api.datacite.org/dois/'+doi;
  try{
    const resp=await request(url,fetcher);
    if(!resp.ok){await resp.body?.cancel();return {url,status:resp.status,matched:false,reason:'HTTP_ERROR'};}
    if(!resp.body)throw Error('Missing metadata stream');
    const chunks=[];
    await pipeline(Readable.fromWeb(resp.body),limiter(LIMITS.json),async function(source){
      for await(const c of source)chunks.push(c);
    });
    const body=Buffer.concat(chunks);
    return {url,status:resp.status,bytes:body.length,sha256:createHash('sha256').update(body).digest('hex'),
      ...inspectDoi(JSON.parse(body.toString('utf8')),doi)};
  }catch(error){return {url,matched:false,reason:'SOURCE_ERROR',error:String(error).slice(0,300)};}
}
export async function probeAll(fetcher=fetch){
  const versions=[];
  for(const doi of DOIS)versions.push(await probeDoi(doi,fetcher));
  return {kind:'AUTHOR_PUBLIC_EVENT_AND_VERSION_METADATA_RESEARCH_ONLY',checkedAt:new Date().toISOString(),
    zenodoVersions:versions,checkmate:await probeArchive(fetcher),
    rule:'Public code collaboration is not first arXiv announcement. DOI registration is not manuscript publication. No news writes.'};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  const out='evidence/author-public-evidence.json',report=await probeAll();
  mkdirSync(dirname(out),{recursive:true});writeFileSync(out,JSON.stringify(report,null,2)+'\n');
  for(const v of report.zenodoVersions)console.log('VERSION_EVIDENCE='+JSON.stringify(v));
  const a=report.checkmate;
  console.log('CHECKMATE_PUBLIC_EVENT='+JSON.stringify({...a,matches:a.matches.map(x=>({
    eventId:x.eventId,identityMatched:x.identityMatched,scope:x.scope,type:x.event.type,
    public:x.event.public,createdAt:x.event.created_at,action:x.event.payload.action,
    prCreatedAt:x.event.payload.pull_request?.created_at,prUrl:x.event.payload.pull_request?.html_url}))}));
  console.log('AUTHOR_EVIDENCE_OUTPUT='+out);
}
