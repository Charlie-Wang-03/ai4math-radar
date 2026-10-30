# Batch 22 — aiXiv Bugeaud 10.61 Palomar version-2 registered_at

## Public machine evidence

- aiXiv original news link: [Lean formalization toward Bugeaud Problem 10.61](https://aixiv.online/abs/2609.01723). The source states **published September 6 on Palomar**, **indexed September 16 on aiXiv**, and links the specific proof registration **`PALOMAR-2026-08-31-000013&version=2`**.
- [Read-only provider probe #41040182902](https://github.com/Charlie-Wang-03/ai4math-radar/actions/runs/41040182902), artifact candidate record from [PR #130](https://github.com/Charlie-Wang-03/ai4math-radar/pull/130): exact immutable [Palomar version index](https://data.palomar-registry.org/versions/PALOMAR-2026-08-31-000013.json), followed by [registered v2 JSON](https://data.palomar-registry.org/entries/PALOMAR-2026-08-31-000013-v2.json), both 200 JSON.
- Official child **ID `PALOMAR-2026-08-31-000013`, version 2**, exact matching **title `Lean formalization toward Bugeaud Problem 10.61`**, `registered_at=2026-09-06T08:42:06Z`. This is a **specific public proof-registry version-2 release moment**. `first_registered_on=2026-08-31` refers to original v1 ID and is not the selected version's release time.
- The source record was already discovered on October 1, after the Sept6 public version2 registration, so no publication/discovery invariant violated. No claim that AI actually resolved the general Bugeaud problem or that the informal math is faithful to the checked Lean artifact; this is a pure chronology audit.

## Canonical mutation

Existing story `2026-09-06-bugeaud-10-61-ai-formalization`:

```json
{
  "publishedAt": "2026-09-06T08:42:06.000Z",
  "publishedAtPrecision": "second",
  "chronology": {
    "eventKind": "registry-release",
    "milestone": {
      "date": "2026-09-06",
      "precision": "second",
      "at": "2026-09-06T08:42:06.000Z",
      "evidenceKind": "proof-registry",
      "evidenceUrl": "https://data.palomar-registry.org/entries/PALOMAR-2026-08-31-000013-v2.json"
    }
  }
}
```

Historical permalink, ID, original aiXiv URL, title, summary, score, reasoning and all other items preserved. This is not retroactive aiXiv indexing time. **314** stories preserved; legacy date-only count **97 → 96**; since this story previously had no chronology, missing source-provenance entries **23 → 22** if no concurrent daily additions.

## Other research target hold

The same [source-gap probe](https://github.com/Charlie-Wang-03/ai4math-radar/pull/130) queried exact Zenodo record 23450488 for Arad–Herzog and received **HTTP 403**. No public release timestamp can be independently established from that response. Keep it **UNRESOLVED** and do not promote Zenodo draft `created` or author-controlled `publication_date` to a clock.

Acceptance: hosted content integrity, timezone static build/regression, full Check/Docker, reviewed PR and no unresolved threads. Do not claim theorem validity or complete formal verification.
