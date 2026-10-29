import test from "node:test";
import assert from "node:assert/strict";
import { inspectPublicJson, probeOne, PROBES } from "../scripts/probe-publication-evidence.mjs";

test("publication probe catalogs proposed times but never certifies or writes publishedAt", () => {
  const record = { id: 317, status: "publish", date: "2026-10-09T10:28:00",
    date_gmt: "2026-10-09T17:28:00", modified_gmt: "2026-10-12T12:00:00",
    title: { rendered: "What mathematicians should know" } };
  const out = inspectPublicJson([record]);
  assert.ok(out.observations.some(x=>x.field.endsWith("date_gmt") && x.value==="2026-10-09T17:28:00"));
  assert.ok(out.observations.some(x=>x.field.endsWith("modified_gmt")));
  assert.equal("publishedAt" in out,false);
  assert.equal("confirmed" in out,false);
});

test("never follow cross-host redirects for provider timestamp probes", async () => {
  const request=PROBES.find(x=>x.family==="wordpress");
  const result=await probeOne(request,async (_url,opts)=>{
    assert.equal(opts.redirect,"error");
    return {status:302,ok:false,headers:{get:()=> "text/html"},text:async()=>""};
  });
  assert.equal(result.ok,false);
  assert.equal(result.parsedJson,false);
});

test("hexagon and Palomar nested metadata are candidate evidence only", () => {
  const report=inspectPublicJson({
    work: { versions:[{version:1,accepted_at:"2026-10-22T11:04:31Z", submitted_at:"2026-10-21T18:03:12Z"}] },
    proof:{registration:{published_at:"2026-10-20T07:42:15Z"}}
  });
  assert.ok(report.observations.some(x=>x.field.includes("accepted_at")));
  assert.ok(report.observations.some(x=>x.field.includes("submitted_at")));
  assert.ok(report.observations.some(x=>x.field.includes("published_at")));
  assert.equal(report.observations.every(x=>!x.field.startsWith("publishedAt")),true);
});
