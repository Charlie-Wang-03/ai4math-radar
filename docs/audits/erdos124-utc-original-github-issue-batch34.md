# Batch 34 — UTC-grounded public cross-reference for Erdős #124

Checked 2026-10-31. News item: `2025-11-29-aristotle-erdos124`. This **supersedes the unverified UTC-day blocker** from [Batch 32](erdos124-author-forum-proof-artifact-batch32.md), without inventing a time for the original forum message.

## Exact independently timestamped public author action

1. [Google DeepMind Formal Conjectures Issue #1306](https://github.com/google-deepmind/formal-conjectures/issues/1306) is a **public GitHub issue created 2025-11-29T23:04:06Z** by **`plby`**, title **"Erdős problem 124 typo"**. GitHub API `created_at` is a public **issue creation** instant (unlike a Git commit authored/committed clock). Original GitHub [issue payload](https://api.github.com/repos/google-deepmind/formal-conjectures/issues/1306) explicitly identifies Erdős Problem #124, the mistaken equality vs inequality in its Lean statement, and **links the specific existing forum discussion anchor `https://www.erdosproblems.com/forum/thread/124#post-1892`**, discussing the subtle remaining statement mismatch.
2. The [original author’s GitHub proof commit](https://github.com/plby/lean-proofs/commit/ef4bce912a4098eac267f6370b0d30030cb10d62) has author/committer named **Boris Alexeev**, and contains the actual `Erdos124.lean`, author explanation `Erdos124.md`, and matching README link, authored 2025-11-29T22:27:20Z. **That is evidence of artifact identity and same-day recorded work, not public push time**.
3. The [original Erdős forum #124 report](https://www.erdosproblems.com/forum/thread/124?order=oldest) and the [author's forum post history](https://www.erdosproblems.com/forum/user/BorisAlexeev?all_posts=1) show the corresponding **29 Nov 2025 at 22:44** report, claiming the Aristotle-produced Lean proof and linking its checking artifacts. **The forum display timezone remains unverified.** A copy of the discussion's key content is preserved in [Batch 32 audit](erdos124-author-forum-proof-artifact-batch32.md).

The crucial new fact is **not** an inferred timezone conversion. Issue #1306 is itself a publicly inspectable, same-result public academic discussion from the author account at an exact UTC timestamp, and it already cites the original forum anchor. Therefore **2025-11-29 UTC** is an independently established day of *public author discussion/statement-fidelity report* about the same mathematical proof claim. Although the original forum report may have appeared earlier, its precise instant is not asserted. This resolves the UTC-day evidence requirement for a **matching public discussion milestone**, not the earliest release of the theorem-proof file globally.

## Narrow event identity and chronology

```json
{
  "chronology": {
    "eventKind": "other",
    "milestone": {
      "date": "2025-11-29",
      "precision": "day",
      "evidenceKind": "original-research-page",
      "evidenceUrl": "https://github.com/google-deepmind/formal-conjectures/issues/1306"
    }
  }
}
```

- `milestone.date` is the UTC calendar day of this **original, public GitHub issue**, not a UTC normalization of the forum display.
- `milestone.at` remains **absent**, because the issue's exact 23:04:06Z creation moment is *not* the original forum message time or a certified earliest public proof-artifact release. A timestamped cross-reference establishes a reliable day for the source-specific public evidence, not global priority.
- The later source assessment clarifies that Aristotle's claim concerns a **weaker/different formulation** while the original BEGL96 gcd-conditioned problem remains open; see [forum thread](https://www.erdosproblems.com/forum/thread/124?order=oldest). This is a provenance/date audit, not independent Lean build or statement-fidelity certification.

## Acceptance

- Add optional day-only chronology for **one existing record**; preserve immutable `id`, legacy `publishedAt`, original original source URL, title, summary, reason, category, score, all other 321 stories and source claims.
- Require content/static regression, hosted Check/Docker, CodeQL, review resolution and no unsupported timezone conversion before merge.
- If `main` remains otherwise unchanged, from **322 records**, **96 date-only legacy fields**, the missing optional chronology count should drop **4 → 3**.
