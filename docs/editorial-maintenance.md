# Editorial maintenance contract

This document defines the editorial rules for maintaining the canonical AI4Math Radar selected corpus under the active `static-chatgpt` profile.

It is intentionally narrower than a general news policy. The goal is to keep date attribution, duplicate handling, evidence strength and historical backfill decisions consistent across routine maintenance.

## 1. Canonical event date

Each selected record should use the earliest **publicly inspectable event that the record actually represents**.

Default priority:

1. canonical first public release;
2. canonical preprint submission;
3. official public confirmation or release note;
4. conference presentation only when no earlier public artifact exists;
5. secondary reporting never re-dates an earlier event.

Important distinctions:

- private or internal model-run date is not automatically a public event date;
- conference date does not replace an earlier preprint date;
- later press coverage does not create a new date for the original result;
- a later verification, generalization, benchmark result or publication may be a distinct event if it adds a materially new evidence state.

When a date-prefixed item ID is used, its `YYYY-MM-DD` prefix must match `publishedAt`.

## 2. Duplicate and follow-up policy

The unit of publication is an **event milestone**, not every page, article or mention about the same story.

Do not create a new selected record for:

- secondary coverage of an already-recorded event;
- a mirrored or republished copy of the same artifact;
- a later article that adds no new evidence, result or release milestone;
- the same benchmark result reported by multiple sources.

A follow-up may deserve a separate record when it creates a materially different milestone, for example:

- autonomous discovery → later human verification or mathematical generalization;
- conjectured proof → formal proof-assistant verification;
- benchmark launch → later model evaluation result;
- candidate result → independent replication or peer-reviewed publication;
- initial construction → later stronger theorem or substantially broader scope.

When in doubt, prefer one canonical story record plus a later milestone only when the evidence state or mathematical content genuinely changes.

## 3. Evidence-strength discipline

Editorial wording must never claim stronger verification than the available evidence supports.

Use the following ladder as an editorial reference:

- **L0 — model output / unreviewed claim**  
  A model or system produced a proof, construction, conjecture or result, but no substantive external checking is established.

- **L1 — author checked**  
  The human author or project team reports that they checked the mathematical argument or artifact.

- **L2 — expert reviewed**  
  Relevant domain experts have reviewed the result beyond the originating authors or system team.

- **L3 — deterministic computational certificate**  
  A finite witness, SAT/SMT/DRAT certificate, exact computation or other deterministic checker validates the stated computational claim.

- **L4 — proof-assistant kernel checked**  
  A proof term or formal artifact is accepted by Lean, Coq, Rocq, Isabelle or another trusted proof-assistant kernel.

- **L5 — independent replication / independent formal or mathematical review**  
  An unrelated party reproduces the result, validates the artifact, or independently checks the proof.

- **L6 — peer-reviewed or established community result**  
  The work has passed formal peer review or has otherwise reached a mature level of community acceptance.

This ladder is not a numeric score and is not stored in portable v1 yet. It is a writing and selection aid.

Important caveat:

```text
machine-checked proof
≠ faithful formalization of the intended informal statement
≠ historical priority
≠ mathematical significance
```

A kernel can validate the formal proposition presented to it; humans may still need to verify statement fidelity and provenance.

## 4. Selection and historical backfill

AI4Math Radar is selective, not exhaustive.

A maintenance window may legitimately produce:

```text
0 selected events
```

Do not lower the bar to make every day, month or half-year look populated.

Prefer events that materially contribute to one or more of:

- mathematical reasoning capability;
- theorem proving or formal mathematics;
- mathematical discovery or open-problem progress;
- evaluation methodology and benchmark quality;
- verification infrastructure;
- durable AI4Math research tooling or ecosystem changes.

Usually exclude:

- broad model launches where mathematics is only a generic capability surface;
- ordinary benchmark score changes without a new method or research implication;
- secondary reporting that adds no new evidence;
- minor product/UI updates;
- papers outside AI × Mathematics merely because they use an LLM;
- speculative claims whose evidence cannot support a stable summary.

For historical backfill:

- use the same selection threshold as current maintenance;
- preserve the first-publication-date rule;
- do not reinterpret an old event using later evidence unless the record explicitly describes a later milestone;
- sparse historical periods are acceptable.

## 5. Maintenance workflow

For ordinary maintenance:

1. search recent or target-period public sources;
2. prefer primary papers, official project pages, repositories and institutional releases;
3. check the canonical corpus for duplicate IDs and duplicate stories;
4. identify the event milestone and canonical date;
5. assess AI4Math relevance and evidence strength;
6. write a portable-v1 record without overstating verification;
7. run `npm run content:check`;
8. build the static site;
9. submit a focused content PR.

The user does not need to make every editorial decision. Human approval is mainly required for disputed scope, policy changes, taxonomy changes or other substantive editorial-contract changes.

## 6. Scope changes

Changing this contract is different from adding ordinary content.

Open a focused PR when changing:

- canonical date rules;
- duplicate/follow-up policy;
- evidence-strength interpretation;
- selection threshold or domain boundary.

Do not silently change these rules inside a routine content PR.
