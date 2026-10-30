import test from "node:test";
import assert from "node:assert/strict";
import { inspectPublicJson, probeOne, PROBES, deriveCanonicalProbes } from "../scripts/probe-publication-evidence.mjs";

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

test("canonical probe generation is strict to supported sources and not release-clock inference", () => {
  const base = {selected:true,publishedAt:"2026-10-16T00:00:00.000Z",links:{original:"https://terrytao.wordpress.com/2026/10/16/sair-open-math-os-released/"}};
  const x=deriveCanonicalProbes([
    JSON.stringify({ ...base,id:"wordpress" }),
    JSON.stringify({ ...base,id:"hexagon",links:{original:"https://hexagonmath.org/2610.00460v2"} }),
    JSON.stringify({ ...base,id:"palomar",links:{original:"https://palomar-registry.org/entry?id=PALOMAR-2026-10-15-000001&version=1"} }),
    JSON.stringify({ ...base,id:"unknown",links:{original:"https://untrusted.example/fake"} }),
    JSON.stringify({ ...base,id:"already-precise",publishedAtPrecision:"minute" }),
    JSON.stringify({ ...base,id:"explicit-day",publishedAtPrecision:"day",links:{original:"https://hexagonmath.org/2610.00597v1"} }),
    JSON.stringify({ ...base,id:"explicit-day-palomar",publishedAtPrecision:"day",links:{original:"https://palomar-registry.org/entry?id=PALOMAR-2026-10-23-000012&version=2"} }),
    JSON.stringify({ ...base,id:"cross-day-exact",chronology:{milestone:{date:"2026-10-18",precision:"second",at:"2026-10-18T05:00:00.000Z"}},links:{original:"https://hexagonmath.org/2610.00534v1"} }),
    JSON.stringify({ ...base,id:"not-selected",selected:false,links:{original:"https://hexagonmath.org/2610.00655v1"} }),
  ].join("\n"));
  assert.deepEqual(x.map(p=>p.id),["wordpress","hexagon","palomar","explicit-day","explicit-day-palomar"]);
  assert.equal(x[0].family,"wordpress-com");
  assert.equal(x[1].url,"https://hexagonmath.org/api/v1/works/2610.00460v1");
  assert.equal(x[2].family,"palomar");
  assert.equal(x[3].url,"https://hexagonmath.org/api/v1/works/2610.00597v1");
  assert.equal(x[4].url,"https://data.palomar-registry.org/versions/PALOMAR-2026-10-23-000012.json");
});
