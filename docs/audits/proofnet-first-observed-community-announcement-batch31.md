# Batch 31 — ProofNet's first independently witnessed public community announcement

Checked 2026-10-31. Canonical Radar record: `2023-02-23-proofnet`, paper [arXiv 2302.12433](https://arxiv.org/abs/2302.12433).

## Original dated public announcement evidence

- The [Lean theorem proving community's archived original Zulip discussion](https://leanprover-community.github.io/archive/stream/219941-Machine-Learning-for-Theorem-Proving/topic/More.20papers.20on.20autoformalization.html) says, **Tyler Josephson (Feb 27, 2023 at 15:43): “ProofNet paper now on arXiv - nice work @Zhangir Azerbayev @Bartosz Piotrowski ...”**, exactly matching the article title/author list. Other participants immediately engage with the manuscript; **author Zhangir Azerbayev replies on Feb 27 at 20:15 and 20:23** about affiliations and a paper figure/typo.
- This is a date-stamped **original community public announcement and live author participation**, not a copy of an arXiv submission email. It establishes that the original paper was **available by Feb 27**. It does **not** establish whether arXiv first exposed the item Feb24, Feb27, or another time prior to this post, and it must not be labeled an authenticated original arXiv `new` feed announcement.
- [SciRate's original third-party listing](https://scirate.com/search?q=au%3ASchoelkopf_H+in%3Acs) independently displays the exact `2302.12433v1` article under **Feb27 2023**. This corroborates the community announcement date but is **not** substituted for a first-party arXiv feed. The historic monthly [arXiv cs.CL listing](https://arxiv.org/list/cs.CL/2023-02?show=2000&skip=0) confirms only February 2023 with no dated daily subgroup (see [Batch 15](arxiv-dated-listing-capture-batch-14.md)).
- The [arXiv abstract and submission history](https://arxiv.org/abs/2302.12433) dates **v1 submission Feb 24 at 03:28:46Z**, *after* the Radar immutable legacy ID's Feb23 prefix. This means the historical Feb23 **cannot** be represented as an arXiv public paper announcement day without a separate verified earlier disclosure. The canonical old `publishedAt: 2023-02-23T00:00:00.000Z` remains for URL/feed compatibility but is **not** promoted as publication evidence.
- Zulip post labels times without an explicitly certified UTC timezone in this research; the matched calendar **Feb27 date** is recorded at **day** precision. The shown 15:43 must not be converted into an unsupported UTC `at` moment. It is a public community announcement, not proof of absolute earliest platform availability.

## Canonical source-specific event and edit

The news reports the original **ProofNet benchmark paper public release**, so a dated original **community notice that the paper is publicly on arXiv** is an independently inspectable public milestone for this story, while the exact arXiv initial public announcement date remains an explicitly limited open question. Add:

```json
{
  "chronology": {
    "eventKind": "other",
    "milestone": {
      "date": "2023-02-27",
      "precision": "day",
      "evidenceKind": "other",
      "evidenceUrl": "https://leanprover-community.github.io/archive/stream/219941-Machine-Learning-for-Theorem-Proving/topic/More.20papers.20on.20autoformalization.html"
    }
  }
}
```

No `earliestVerifiedPublic` or `at` fields are asserted. No inference of earliest private author work, mathematical correctness, Lean statement fidelity, or community consensus is made.

## Compatibility and regression

- One additive chronology item only; **314** existing news stories, **96** legacy date-only timestamps, all old IDs, source links, scores, titles, original scientific claims preserved.
- The milestone's **Feb27 2023** is an independently witnessed **public community announcement**. The **Feb23** legacy permalink remains immutable, and Feb24 v1 submission clock is not used as a public announcement.
- Require hosted Check/Docker/CodeQL and resolved review discussions before merge. Conditional on unchanged `main`, missing source-specific chronology among legacy date-only records **5 → 4**.
