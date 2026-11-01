import test from 'node:test';
import assert from 'node:assert/strict';
import {gzipSync} from 'node:zlib';
import {ARCHIVE,DOIS,matchEvent,inspectDoi,probeArchive,probeDoi,probeAll} from '../scripts/probe-author-public-evidence.mjs';
// Synthetic fixtures. These tests are not historical-publication evidence.
function event(){return {id:'synthetic',type:'PullRequestEvent',public:true,
  repo:{id:643507916,name:'collinskatie/checkmate'},actor:{id:19373539,login:'albertqjiang'},
  created_at:'2023-06-05T12:39:48Z',payload:{action:'opened',number:1,pull_request:{
    number:1,html_url:'https://github.com/collinskatie/checkmate/pull/1',user:{login:'albertqjiang'},
    created_at:'2023-06-05T12:39:48Z'}}};}
const compressed=e=>gzipSync(JSON.stringify(e)+'\n');
const archive=(bytes,status=200)=>async(url,options)=>{
  assert.equal(url,ARCHIVE);assert.equal(options.redirect,'error');return new Response(bytes,{status});};
function doi(){return {data:{type:'dois',id:DOIS[0],attributes:{doi:DOIS[0],url:'https://zenodo.org/records/23450488',
  titles:[{title:'A proof of the Arad–Herzog conjecture'}],version:'3',dates:[{date:'2026-10-19',dateType:'Issued'}]}}};}
test('exact public author PR match is restricted to code collaboration',()=>{
  const m=matchEvent(event());assert.equal(m.identityMatched,true);assert.match(m.scope,/NOT_FIRST_ARXIV/);
});
test('private, wrong actor, wrong clock and wrong PR URL cannot qualify',()=>{
  for(const mutate of [e=>e.public=false,e=>e.actor.id=1,e=>e.created_at='2023-06-06T12:39:48Z',
    e=>e.payload.pull_request.html_url='https://example.org/pull/1']){
    const e=event();mutate(e);assert.equal(matchEvent(e).identityMatched,false);
  }
});
test('unrelated repositories and PR numbers are ignored',()=>{
  const e=event();e.repo.name='different/repo';assert.equal(matchEvent(e),null);
  e.repo.name='collinskatie/checkmate';e.payload.number=2;assert.equal(matchEvent(e),null);
});
test('complete bounded gzip stream yields candidate with source digest',async()=>{
  const r=await probeArchive(archive(compressed(event())));
  assert.equal(r.complete,true);assert.equal(r.matches.length,1);assert.equal(r.linesRead,1);
  assert.match(r.archiveSha256,/^[a-f0-9]{64}$/);assert.match(r.decision,/VERIFIED_ARCHIVED/);
  assert.equal(Object.hasOwn(r,'publishedAt'),false);
});
test('missing hour and HTTP denial are not historical non-publication',async()=>{
  const r=await probeArchive(archive(compressed({}),404));assert.equal(r.reason,'HTTP_ERROR');assert.equal(r.complete,false);
  const s=await probeArchive(archive(compressed({})));assert.equal(s.reason,'NO_MATCH_IN_THIS_HOUR');
});
test('truncated gzip remains unresolved even if a partial match was seen',async()=>{
  const bytes=compressed(event());const r=await probeArchive(archive(bytes.subarray(0,bytes.length-6)));
  assert.equal(r.complete,false);assert.equal(r.reason,'SOURCE_ERROR');assert.match(r.decision,/UNRESOLVED/);
});
test('malformed JSON and oversized line fail closed',async()=>{
  for(const bytes of [gzipSync('broken\n'),gzipSync('a'.repeat(8*1024*1024+1))]){
    const r=await probeArchive(archive(bytes));assert.equal(r.reason,'SOURCE_ERROR');assert.equal(r.complete,false);
  }
});
test('exact DOI identity preserves Issued metadata without upgrading it',()=>{
  const r=inspectDoi(doi(),DOIS[0]);assert.equal(r.matched,true);assert.equal(r.metadata.version,'3');
  assert.equal(r.metadata.dates[0].dateType,'Issued');assert.match(r.decision,/NO_MANUSCRIPT/);
});
test('swapped DOI and hostile landing origin are rejected',()=>{
  const d=doi();d.data.id=DOIS[1];assert.equal(inspectDoi(d,DOIS[0]).matched,false);
  d.data.id=DOIS[0];d.data.attributes.url='https://zenodo.org.evil.example/records/23450488';
  assert.equal(inspectDoi(d,DOIS[0]).matched,false);
});
test('only approved metadata requests; stream limit enforced',async()=>{
  await assert.rejects(()=>probeDoi('10.1/unapproved'),/Unapproved/);
  const r=await probeDoi(DOIS[0],async()=>new Response('a'.repeat(1300001)));
  assert.equal(r.reason,'SOURCE_ERROR');assert.match(r.error,/byte limit/);
});
test('version metadata failure does not prevent the independent archive probe',async()=>{
  const r=await probeAll(async(url,options)=>{
    if(url===ARCHIVE)return archive(compressed(event()))(url,options);
    return new Response('denied',{status:403});
  });
  assert.equal(r.zenodoVersions.every(v=>v.matched===false),true);assert.equal(r.checkmate.complete,true);
});
