import test from 'node:test';
import assert from 'node:assert/strict';
import {extractArxivItems,buildOaiUrl,inspectOaiXml,probeOai,runProbe}
  from '../scripts/probe-arxiv-chronology.mjs';

const item={id:'2026-04-21-lean-atlas-semantic-alignment',selected:true,
  links:{original:'https://arxiv.org/abs/2604.16347'},publishedAt:'2026-04-21T00:00:00.000Z'};
const xml='<?xml version="1.0"?><OAI-PMH><GetRecord><record><header>'+
  '<identifier>oai:arXiv.org:2604.16347</identifier><datestamp>2026-10-30</datestamp>'+
  '</header><metadata><arXivRaw><id>2604.16347</id><created>2026-03-16</created>'+
  '<version version="v1"><date>2026-03-16</date></version>'+
  '</arXivRaw></metadata></record></GetRecord></OAI-PMH>';

test('derive solely strict selected official arXiv day-only IDs',()=>{
  const candidates=[item,
    {...item,id:'malicious',links:{original:'https://arxiv.org.evil.invalid/abs/2604.16347'}},
    {...item,id:'nonselected',selected:false},
    {...item,id:'v2',links:{original:'https://arxiv.org/abs/2604.16347v2'}},
    {...item,id:'precise',publishedAtPrecision:'second'}];
  const found=extractArxivItems(candidates.map(JSON.stringify).join('\n'));
  assert.deepEqual(found.map(x=>x.eventId),[item.id]);
  assert.equal(found[0].arxivId,'2604.16347');
});
test('OAI host and input identity cannot be redirected through an ID',()=>{
  assert.equal(new URL(buildOaiUrl('2302.12433')).hostname,'oaipmh.arxiv.org');
  assert.throws(()=>buildOaiUrl('2302.12433&url=https://x'));
});
test('March submission and October OAI header are NOT April public announcement',()=>{
  const x=inspectOaiXml(xml,'2604.16347');
  assert.equal(x.matched,true);
  assert.equal(x.providerCreated,'2026-03-16');
  assert.equal(x.oaiHeaderDatestamp,'2026-10-30');
  assert.equal(x.firstPublicAnnouncementAt,null);
  assert.equal(x.approvedForPublishedAt,false);
  assert.equal(x.versions[0].version,'v1');
});
test('reject OAI identity mismatch and provider-side missing records',()=>{
  assert.equal(inspectOaiXml(xml,'2302.12433').matched,false);
  const bad=inspectOaiXml('<OAI-PMH><error code="idDoesNotExist">missing</error></OAI-PMH>','2604.16347');
  assert.equal(bad.matched,false);
  assert.equal(bad.errorCode,'idDoesNotExist');
});
test('read-only fetch rejects redirects and cannot promote date',async()=>{
  const x=extractArxivItems(JSON.stringify(item))[0];
  const result=await probeOai(x,async(url,options)=>{
    assert.equal(options.redirect,'error');
    assert.equal(new URL(url).hostname,'oaipmh.arxiv.org');
    return {ok:true,status:200,text:async()=>xml};
  });
  assert.equal(result.approvedForPublishedAt,false);
  const batch=await runProbe([x],async()=>({ok:true,status:200,text:async()=>xml}),0);
  assert.equal(batch.count,1);
  assert.equal(batch.matched,1);
  assert.equal(batch.probes[0].approvedForPublishedAt,false);
});
