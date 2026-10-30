# Batch 30 — MathlibLemma official PMLR *issued* date vs ICML conference event dates

Checked on **2026-10-31**. Canonical record: `2026-07-mathliblemma`.

## Primary publication authority

- The canonical article's [PMLR Volume 306 official page](https://proceedings.mlr.press/v306/liu26ez.html) identifies **MathlibLemma: Folklore Lemma Generation and Benchmark for Formal Mathematics** by Xinyu Liu et al., PMLR 306 pp. 79178–79197, 2026. The page's `BibTeX month = {06--11 Jul}` denotes the **ICML 2026 conference days**, not a per-article public publication or actual paper upload instant.
- The **same page's official “edit” link** points to its authoritative `mlresearch/v306` source Markdown, `_posts/2026-09-29-liu26ez.md`. [Commit-frozen PMLR source](https://github.com/mlresearch/v306/blob/e2f62b1c06cd7728ccfc85d460b1456e91c87fee/_posts/2026-09-29-liu26ez.md) identifies exact paper ID/title/authors and explicitly records:
  ```yaml
  id: liu26ez
  date: 2026-09-29
  issued:
    date-parts:
    - 2026
    - 9
    - 29
  container-title: Proceedings of the 43rd International Conference on Machine Learning
  volume: '306'
  ```
- The [first commit in the PMLR repository for exactly this source path](https://github.com/mlresearch/v306/commit/e2f62b1c06cd7728ccfc85d460b1456e91c87fee) is **2026-09-29T06:52:46Z**, message “Add l* paper posts.” This corroborates that the venue's **paper publication/source entry** had a Sept29 official-issued date; it is **not independent certification that the rendered PMLR website became externally reachable at that exact commit second**.
- There is also an earlier arXiv preprint [2602.02561](https://arxiv.org/abs/2602.02561), which is a **distinct first-preprint/version milestone**. This PR must not conflate that earlier distribution with PMLR's later venue-proceedings release; do not populate `earliestVerifiedPublic` without original-v1 dated announcement evidence.

## Decision and compatibility

Promote only the **PMLR official proceedings paper-issued calendar date** as the covered event:

```json
{
  "chronology": {
    "eventKind": "paper-release",
    "milestone": {
      "date": "2026-09-29",
      "precision": "day",
      "evidenceKind": "original-research-page",
      "evidenceUrl": "https://github.com/mlresearch/v306/blob/e2f62b1c06cd7728ccfc85d460b1456e91c87fee/_posts/2026-09-29-liu26ez.md"
    }
  }
}
```

**Not** `2026-07-06` as a paper-publication milestone. The old `id = 2026-07-mathliblemma`, `publishedAt = 2026-07-06T00:00:00.000Z` and existing permalink are held immutable under [temporal semantics v1](../editorial-temporal-contract-v1.md); their legacy days are a compatibility representation of the earlier July **conference**, not the PMLR official article-issued date. No new exact `at` time is inferred and feed sorting remains V1.

No proof-correctness claim, Mathlib acceptance independent recheck, or publishing priority is made by this source metadata audit.

## Acceptance criteria

- Exactly **one** `selected.jsonl` line changes, adding optional `chronology` only; old 314 stories and 96 legacy date-only `publishedAt` entries retained. Preserve title, summary, reason, score, original PMLR URL and all other story IDs.
- Require hosted `check`, `docker`, CodeQL and resolved reviews.
- Upon successful merge, unverified optional source milestone gaps in the existing 96 date-only records should fall **6 → 5**. Follow-up UI chronology should display the *event-level* PMLR Sept29 issued date separately from the legacy July archive/permalink.
