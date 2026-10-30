# Batch 20 — UW Math AI Lab Fall 2026 project period and mutable roster

## Original first-party evidence

- [Fall 2026 projects](https://ai.math.uw.edu/projects/fall-2026/) explicitly states **September 30 – December 11** as the project period; this proves the **start date of the academic project cohort**, *not* an hour/minute or the initial webpage publication.
- [Official Math AI Lab homepage](https://ai.math.uw.edu/) and [quarterly project index](https://ai.math.uw.edu/projects/) as inspected **2026-10-30** report **14 projects and 61 students** in Fall 2026. The previously selected headline and summary said **15**, without an immutable initial roster snapshot.
- Because the current roster is editable, do not assert that precisely 14 (or 15) were listed **on September 30**. The revised summary explicitly scopes 14/61 to the observation date, and removes a fixed project count from the headline.

## Canonical change

One existing row: `2026-09-30-uw-math-ai-fall`. Add:
```json
{
  "eventKind": "other",
  "milestone": {
    "date": "2026-09-30",
    "precision": "day",
    "evidenceKind": "original-research-page",
    "evidenceUrl": "https://ai.math.uw.edu/projects/fall-2026/"
  }
}
```
into optional `chronology` and clarify title, summary and editorial reason to avoid date-event vs first-web-publication confusion. Leave original `publishedAt`, stable ID, URL, score and selected flag untouched. The same temporal contract #104 applies.

## Result and non-claims

- Before this correction, **24** selected date-only records lacked a source-backed optional chronology.
- If no concurrent daily content additions, this narrowly scoped source-backed cohort-start milestone brings that count to **23**; number of legacy date-only records stays **97**, since there is no verified clock.
- This source audit does not establish the exact publication time of any individual research project, mathematical proof verification, or the immutable initial project roster.
- Require hosted content, static chronology regression, Docker/Check tests, and review resolution before merging.
