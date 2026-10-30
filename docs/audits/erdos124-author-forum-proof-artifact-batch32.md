# Batch 32 — Erdős #124 original author forum disclosure and exact proof-artifact identity

Checked 2026-10-31. Canonical story: `2025-11-29-aristotle-erdos124`.

## Identity-matched evidence

**Original contemporary public report.** The [first-party Erdős Problems author discussion history](https://www.erdosproblems.com/forum/user/BorisAlexeev?all_posts=1) lists a **BorisAlexeev comment about Problem #124 at “22:44 on 29 Nov 2025”**, stating that a version had been autoformalized in Lean by Harmonic Aristotle from an original Formal Conjectures statement and giving a **Type-check it online** link. That is the exact *author announcing a particular Lean-checked version*, not a blanket settlement of all historically different formulations of Erdős #124. A related [canonical #124 forum page](https://www.erdosproblems.com/forum/thread/124?order=oldest) retains the context and replies. Some independent fetches return HTTP 403; public first-party search render is still available. The forum **does not expose a reliably verified UTC timezone** for its 22:44 display: do not assert that 22:44 is UTC.

**Original independently inspectable proof artifact.** The same author, with Git commit name **Boris Alexeev**, added the matching `ErdosProblems/Erdos124.md`, `src/v4.24.0/ErdosProblems/Erdos124.lean` and README link in [commit `ef4bce912a4098eac267f6370b0d30030cb10d62`](https://github.com/plby/lean-proofs/commit/ef4bce912a4098eac267f6370b0d30030cb10d62), commit author/committer fields **2025-11-29T22:27:20Z** (UTC). The [original README at that commit](https://github.com/plby/lean-proofs/blob/ef4bce912a4098eac267f6370b0d30030cb10d62/README.md) links to #124; the original [Erdos124.md](https://github.com/plby/lean-proofs/blob/ef4bce912a4098eac267f6370b0d30030cb10d62/ErdosProblems/Erdos124.md) links the same forum and a Lean-live check URL; the original Lean file names Harmonic Aristotle and describes the statement fidelity limitation. This is a **distinct item-specific author-generated provenance artifact from the same reported calendar day**, not just an arbitrary repo creation timestamp. The repository existed since Nov23, so repo creation is not used as the event time.

**Important publication-time limit.** A Git **authored/committed timestamp** alone does not prove when its commit was first publicly pushed; the forum's 22:44 has an unproven timezone. They nonetheless provide two separately documented **Nov 29 calendar-day labels for the same exact author/result/event**, with an independently normalized UTC date for the original Git record. Consequently this batch records only the **calendar-day author forum *report* milestone**, not the earliest public GitHub push, no exact time-of-day, and no claim that the forum has been independently proven to display UTC. If the repository's initial public visibility or the forum's timezone must be proved for a UTC-exact event, continue that separate investigation. This day-level editorial promotion is weaker than platform-exact or globally earliest-public certification.

## Scientific scope

Later [Boris Alexeev's Nov30 follow-up](https://www.erdosproblems.com/forum/user/BorisAlexeev?all_posts=1) and Thomas Bloom's discussion distinguish **a weaker version allowing the units digit / omitting a necessary gcd condition** from the original BEGL96 open conjecture. This is a public-claim and statement-fidelity case; this timestamp audit **does not assert mathematical validity of the original open problem**, independently execute Lean, or equate the original Formal Conjectures statement with the harder historical conjecture.

## Canonical edit

Add optional **`chronology.milestone`** only:
```json
{
  "chronology": {
    "eventKind": "other",
    "milestone": {
      "date": "2025-11-29",
      "precision": "day",
      "evidenceKind": "original-research-page",
      "evidenceUrl": "https://www.erdosproblems.com/forum/user/BorisAlexeev?all_posts=1"
    }
  }
}
```
No `at` and no `earliestVerifiedPublic`, and the timezone of the displayed 22:44 is explicitly **UNVERIFIED**. The marker's event identity is the *original author's dated public report of the particular Lean-backed claim*, not a UTC-certified first proof-release instant. No immutable permalink, old `publishedAt`, source link, summary, score, original title or other news row changes.

## Acceptance

Review the exact Git commit file identities, first-party author-forum record and stated time-zone caveat. Require hosted Check, Docker, CodeQL and resolved comments before merge. If merged onto otherwise unchanged `main`, old 314 records and 96 date-only V1 timestamps remain, while **4 → 3** records lack optional source milestones.
