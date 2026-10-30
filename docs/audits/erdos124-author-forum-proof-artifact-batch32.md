# Batch 32 — Erdős #124 original author forum disclosure and exact proof-artifact identity

Checked 2026-10-31. Canonical story: `2025-11-29-aristotle-erdos124`.

## Identity-matched evidence

**Original contemporary public report.** The [first-party Erdős Problems author discussion history](https://www.erdosproblems.com/forum/user/BorisAlexeev?all_posts=1) lists a **BorisAlexeev comment about Problem #124 at “22:44 on 29 Nov 2025”**, stating that a version had been autoformalized in Lean by Harmonic Aristotle from an original Formal Conjectures statement and giving a **Type-check it online** link. That is the exact *author announcing a particular Lean-checked version*, not a blanket settlement of all historically different formulations of Erdős #124. A related [canonical #124 forum page](https://www.erdosproblems.com/forum/thread/124?order=oldest) retains the context and replies. Some independent fetches return HTTP 403; public first-party search render is still available. The forum **does not expose a reliably verified UTC timezone** for its 22:44 display: do not assert that 22:44 is UTC.

**Original independently inspectable proof artifact.** The same author, with Git commit name **Boris Alexeev**, added the matching `ErdosProblems/Erdos124.md`, `src/v4.24.0/ErdosProblems/Erdos124.lean` and README link in [commit `ef4bce912a4098eac267f6370b0d30030cb10d62`](https://github.com/plby/lean-proofs/commit/ef4bce912a4098eac267f6370b0d30030cb10d62), commit author/committer fields **2025-11-29T22:27:20Z** (UTC). The [original README at that commit](https://github.com/plby/lean-proofs/blob/ef4bce912a4098eac267f6370b0d30030cb10d62/README.md) links to #124; the original [Erdos124.md](https://github.com/plby/lean-proofs/blob/ef4bce912a4098eac267f6370b0d30030cb10d62/ErdosProblems/Erdos124.md) links the same forum and a Lean-live check URL; the original Lean file names Harmonic Aristotle and describes the statement fidelity limitation. This is a **distinct item-specific author-generated provenance artifact from the same reported calendar day**, not just an arbitrary repo creation timestamp. The repository existed since Nov23, so repo creation is not used as the event time.

**Important publication-time limit.** A Git **authored/committed timestamp** alone does not prove when its commit was first publicly pushed; the forum's 22:44 has an unproven timezone. They nonetheless provide two separately documented **Nov 29 calendar-day labels for the same exact author/result/event**, with an independently normalized UTC date for the original Git record. Consequently this batch records only the **calendar-day author forum *report* milestone**, not the earliest public GitHub push, no exact time-of-day, and no claim that the forum has been independently proven to display UTC. If the repository's initial public visibility or the forum's timezone must be proved for a UTC-exact event, continue that separate investigation. This day-level editorial promotion is weaker than platform-exact or globally earliest-public certification.

## Scientific scope

Later [Boris Alexeev's Nov30 follow-up](https://www.erdosproblems.com/forum/user/BorisAlexeev?all_posts=1) and Thomas Bloom's discussion distinguish **a weaker version allowing the units digit / omitting a necessary gcd condition** from the original BEGL96 open conjecture. This is a public-claim and statement-fidelity case; this timestamp audit **does not assert mathematical validity of the original open problem**, independently execute Lean, or equate the original Formal Conjectures statement with the harder historical conjecture.

## Decision — UTC date not yet authenticated

**DO NOT PROMOTE** the candidate 2025-11-29 forum date to a structured `chronology.milestone` in this batch. Under [temporal contract v1](../editorial-temporal-contract-v1.md) and the [current static detail renderer](../../scripts/build-static-chatgpt.ts), `chronology.milestone.date` is explicitly an independently verified **UTC calendar day**. The forum display lacks a certified timezone, and the author/committer Git timestamp does not establish the GitHub public push time. Despite excellent item identity corroboration, the data contract requires stronger source-time proof.

Retain `UNRESOLVED_FORUM_TIMEZONE_AND_PUBLIC_EVENT_DATE` for this record, while recognizing Nov29 as a **source-displayed date** and the same day's original Git commit as supporting the claim and document identity. Distinguish these from a publicly announced UTC event.

A future source-backed data PR may promote a precise source-calendar date only after establishing the site timezone, an authenticated UTC `dateCreated` / original comment timestamp, or an independently verified public push or social post with its own event timestamp. Do not guess it from the 22:44 display.

## Acceptance

- This PR adds this audit document **only**. The attempted optional chronology edit was explicitly reverted after review identified the UTC-date semantic problem. All 314 stories, 96 legacy date-only fields, and original IDs and source links remain unchanged.
- Check that the branch's `portable/content/selected.jsonl` is byte-identical to the base `main`, and that CI and review discussions are resolved before merging a documentation-only research PR.
- The true unresolved count stays **4**, including this case. A no-change outcome is correct when required primary-source evidence is unavailable.
