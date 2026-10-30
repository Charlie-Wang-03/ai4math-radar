import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validatePortableV1Item } from "../scripts/portable-v1-core.ts";

const rows = readFileSync("portable/content/selected.jsonl","utf8")
  .trim().split(/\r?\n/).map((line)=>JSON.parse(line));
const base = rows.find((row)=>row.links.original==="https://arxiv.org/abs/2610.34389");
if(!base?.chronology?.milestone)throw Error("Batch 13 official dated announcement fixture missing");
function candidate(evidenceUrl: string, evidenceKind="arxiv-announcement") {
  return {...base,chronology:{...base.chronology,
    milestone:{...base.chronology.milestone,evidenceUrl,evidenceKind}}};
}
test("official day-list source may support date-only chronology without rewriting immutable legacy id",()=>{
  const item=validatePortableV1Item(candidate("https://arxiv.org/list/math.AC/recent?show=2000&skip=0"));
  assert.equal(item.chronology!.milestone.date,"2026-10-27");
  assert.equal(item.chronology!.milestone.precision,"day");
  assert.equal(item.publishedAt,"2026-10-25T00:00:00.000Z");
});
test("an arXiv abs page alone is NOT arxiv-announcement evidence",()=>{
  assert.throws(()=>validatePortableV1Item(candidate("https://arxiv.org/abs/2610.34389")),/official dated listing or announcement feed/);
});
test("third-party/host spoofing, non-HTTPS and ordinary search API are rejected",()=>{
  for(const url of ["https://arxiv.org.attacker.invalid/list/math.AC/recent",
    "http://arxiv.org/list/math.AC/recent","https://arxiv.org/search/?query=...",
    "https://arxiv.org/list/math.AC/2026-10",
    "https://export.arxiv.org/api/query?id_list=2610.34389"])
    assert.throws(()=>validatePortableV1Item(candidate(url)),/official dated listing or announcement feed/);
});
test("first-party announcement feed shape accepted but feed still requires independent content review",()=>{
  const item=validatePortableV1Item(candidate("https://rss.arxiv.org/atom/math.AC"));
  assert.equal(item.chronology!.milestone.evidenceKind,"arxiv-announcement");
});
test("same source shape rule applies to earliestVerifiedPublic",()=>{
  const prior={...base.chronology.milestone,date:"2026-10-26",evidenceUrl:"https://arxiv.org/abs/2610.34389"};
  const item={...base,chronology:{...base.chronology,earliestVerifiedPublic:prior}};
  assert.throws(()=>validatePortableV1Item(item),/official dated listing or announcement feed/);
});
