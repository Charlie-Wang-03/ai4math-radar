# Batch 26 — Nivat Lean proof author-dated source milestone (2026-10-30)

## Claim and exact event identity

**Record:** `2026-09-14-nivat-gpt6-lean`, original [boonsuan/nivat](https://github.com/boonsuan/nivat).

This record covers the **author sharing a complete Lean 4 formalization and describing its AI generation** in his source repository. It does not certify that GPT-6 Pro's claimed proof actually resolves the mathematical conjecture, that an independent mathematician digested the argument, or that the public GitHub repository was visible to unauthenticated readers at the instant its first commit was authored.

## Source audit and chronology constraints

- [Immutable 2026-09-14 author README revision](https://github.com/boonsuan/nivat/blob/b67c6250b477282004317354c01cd8a03591dc8f/README.md) explicitly states **"Update (14 September 2026)"**, reports the exact Nivat proof/formalization claim and says **"I am sharing the material"**. That same revision already links a **matching Palomar v1 entry** `PALOMAR-2026-09-14-000003` and describes mechanical verification plus automated editorial review. This combines **the author's own date annotation** with claim-matched public artifact content. It is stronger than using the repo's bare creation clock as a disclosure timestamp.
- The GitHub commit API places that particular README revision at **2026-09-14T05:12:43Z**; GitHub repository creation is **2026-09-14T01:41:58Z**, and the initial full Lean proof commit has a recorded committer time **2026-09-14T01:44:33Z**. None of these metadata moments is independently established as the **first GitHub public visibility** moment, so none is promoted to `chronology.milestone.at`.
- Independent [LeanPool project metadata](https://github.com/LeanPool/lean-pool/blob/main/LeanPool/projects/nivat-conjecture.yaml) names this exact GitHub source, exact Palomar ID and an `announcement_date: '2026-09-14T04:54:56Z'`, with an external Palomar entry URL. This is **corroborating downstream metadata**, not a firsthand Palomar release API field checked here. Do not claim an exact 04:54:56Z official registration time solely from this field.
- Some original auxiliary [`docs/PALOMAR.md`](https://github.com/boonsuan/nivat/blob/main/docs/PALOMAR.md) and [`STATUS.md`](https://github.com/boonsuan/nivat/blob/main/STATUS.md) still describe **pre-registration preparation**. These may be stale documents from earlier in the same day, and do not override the later dated author README, but this inconsistency prohibits certification of detailed Palomar verification status/time without registry's own version-specific source.
- The [Terence Tao-hosted Bryna Kra guest essay](https://terrytao.wordpress.com/2026/09/13/deep-theorems-were-scarce-and-difficult-and-so-became-an-effective-mechanism-to-identify-deep-thought-ai-has-broken-this-system/) discussed the Nivat problem before this author's commit, but it is **not evidence of a prior public release of the same author's Lean artifact** and should not be conflated with his own claimed proof.

## Canonical edit

Add only:

```json
{
  "chronology": {
    "eventKind": "proof-artifact-release",
    "milestone": {
      "date": "2026-09-14",
      "precision": "day",
      "evidenceKind": "original-research-page",
      "evidenceUrl": "https://github.com/boonsuan/nivat/blob/b67c6250b477282004317354c01cd8a03591dc8f/README.md"
    }
  }
}
```

The verified event is **the author's explicitly dated source-sharing statement**, **not** a proven earliest-public absolute timestamp and **not** a claim to registry first-release second precision. No `earliestVerifiedPublic` field is populated. Keep all immutable IDs, old `publishedAt`, original source URL, headline, summary, mathematical caution and other records unchanged.

## Review criteria

- Only one news row modified; 314 records and 96 original day-only timestamps preserved.
- Hosted `check`, `docker` and security scans must pass before squash merge.
- If merged against the Batch 25 main without unrelated changes, remaining unverified date-only records decline from **12 → 11**. Continue the separately unresolved Palomar exact-time and GitHub public-visibility questions; their absence does not negate an author's own dated post.
