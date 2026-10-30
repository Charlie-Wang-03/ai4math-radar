# Batch 24 — original-source dates for independent AI4Math blogs and adjacent backlog (2026-10-30)

## Scope and publication-time standard

A read-only targeted investigation of six unresolved entries in [Issue #127](https://github.com/Charlie-Wang-03/ai4math-radar/issues/127), followed by two narrow source-matched content promotions.

The public legacy `publishedAt: ...T00:00:00.000Z` is a **calendar-day placeholder** and is **not evidence that publication happened at midnight UTC**. Preserve old IDs, URLs and historical sort behavior under [temporal contract v1](../editorial-temporal-contract-v1.md). Date-only sources must not be silently promoted to second precision, and a local display time without a stated time zone must not be converted into an invented UTC instant.

Checked on 2026-10-30. This research concerns publication metadata only, not proof correctness.

## Two newly source-backed dates

**`2026-10-09-human-ai-mathematics-kls` — verified author-dated public project post, day precision only.**

- First-party [Nicolas Brosse blog index](https://nbrosse.github.io/blog.html) explicitly lists **Oct 9, 2026**, exact title **“AI agents on the KLS conjecture: a search mathematicians can trust and join”** and the matching Human–AI Mathematics/KLS description.
- The corresponding [original article](https://nbrosse.github.io/posts/human-ai-mathematics/human-ai-mathematics.html) is the Radar item's existing `links.original`. Matching the author, exact headline and index article ensures the indexed date refers to the same work.
- The blog **does not expose a verified UTC publication clock**; no 00:00 timestamp, timezone inference or cross-platform earliest-public priority is asserted.
- Add optional `chronology.milestone` with date **2026-10-09**, precision **day**, `eventKind: other` and `evidenceKind: original-research-page` using the author's dated blog index as direct date evidence.
- Preserve the news title, original link, historical ID, `publishedAt`, `discoveredAt`, score, summary and every other record.

**`2026-08-12-hadamard-668-claude` — verified Epoch first-party status announcement, day precision only.**

- [Epoch AI's FrontierMath: Open Problems changelog](https://epoch.ai/frontiermath/open-problems) states explicitly under **2026-08-12** that it marked the **Hadamard matrix of order 668 problem** as solved by AI after a report from an Anthropic researcher crediting three humans and Claude. The entry says the attribution was **provisional**, dependent on later information about contribution to core mathematical ideas.
- This exactly matches the **Epoch status decision** explicitly reported in the Radar item's summary and the original research claim. It is **not** a timestamp of Levent Alpöge's first public X announcement, not proof of when a GitHub reconstruction became public and not a mathematical correctness certificate.
- Add a date-only `chronology.milestone` for this dated Epoch announcement, with `eventKind` and `evidenceKind` both `institution-announcement`. The later September 16 human+AI classification-policy revision is a different event and must not be substituted for August 12.
- No precise public UTC HH:mm:ss was obtained. Keep the original GitHub link, news identity, legacy `publishedAt` and all attribution caveats unchanged.

## Four investigated records not promoted

| Item | Original evidence | What is and is not established | Result |
| --- | --- | --- | --- |
| `2025-11-29-aristotle-erdos124` | [Erdős Problems #124 forum](https://www.erdosproblems.com/forum/thread/124?order=oldest), also [Boris Alexeev post history](https://www.erdosproblems.com/forum/user/BorisAlexeev?all_posts=1) | Search-indexed original discussion shows **“BorisAlexeev — 22:44 on 29 Nov 2025”**, with matching Aristotle/Lean and problem-formulation discussion. However **timezone is not stated**, and first-party page fetch returned HTTP 403 during independent read, so **UTC day and public clock remain uncertified**. Do not turn `22:44` into UTC or certify first-public priority. | `UNRESOLVED_TIMEZONE_AND_PRIMARY_FETCH` |
| `2026-09-14-nivat-gpt6-lean` | [Boon Suan Ho's original repository](https://github.com/boonsuan/nivat) and [formalization manifest](https://github.com/boonsuan/nivat/blob/main/formalization.yaml) | GitHub repository API gives `created_at = 2026-09-14T01:41:58Z`, **not proof that its claimed result was already public then**; README says an update on Sep 14, but does not establish a source-clocked first public proof disclosure. The maintainer names Palomar version 1 as a separate registration event; do not swap a registration clock into a repo announcement. | `UNRESOLVED_FIRST_PUBLIC_EVENT` |
| `2026-07-mathliblemma` | [Original PMLR article](https://proceedings.mlr.press/v306/liu26ez.html) | Proceedings bibliography identifies the ICML **July 6–11** conference window, not an item-specific paper first-public timestamp or July 6 article release. | `UNRESOLVED_ARTICLE_PUBLICATION_DAY` |
| `2023-12-15-lean-copilot` | [Original NeurIPS MATH-AI workshop schedule](https://mathai2023.github.io/schedule/) and [original workshop paper](https://mathai2023.github.io/papers/4.pdf) | Workshop is demonstrably **Friday, Dec 15, 2023 (CST)**, but program does **not specifically assign this paper a Dec 15 talk slot**. The paper itself being a workshop paper does not certify a first-public paper date or talk. An unrelated Lean Together 2024 talk is not substitute evidence. | `UNRESOLVED_PAPER_OR_TALK_EVENT` |

## Acceptance conditions

1. This PR changes exactly **two** `selected.jsonl` lines, adding date-only optional chronology; no historical permalink or legacy date modification.
2. The four adjacent cases above remain unresolved with explicit evidence limitations; no guessed clock or misleading claim.
3. Run content/static validations and GitHub-hosted required checks; review and resolve comments before merge.
4. After merge update [Issue #127](https://github.com/Charlie-Wang-03/ai4math-radar/issues/127): original no-chronology backlog **21 → 19** out of 314, conditional on no concurrent unrelated content edits. The unchanged count of legacy midnight date-only fields is **96**.
