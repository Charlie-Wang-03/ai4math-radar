# AI4Math Radar publication-time audit — Batch 05 (Oct 10–16, 2026)

## Scope

- Baseline: `main@1d08f309553344b703cbfd663aeb3e6937b84373`; **294** canonical selected events, **174** legacy UTC-midnight day-precision events, **38** records with `chronology` before this PR.
- This reverse-chronological batch covers **all 13** day-only records in the UTC-calendar interval **October 10–16, 2026** (4 + 3 + 1 + 3 + 2). No date-only records on Oct 14 or Oct 12 in this baseline.
- Primary sources prioritized: two original WordPress blogs, authored Lean blog, Simons Foundation institutional release, Tsinghua official news report, Hexagon v1 version histories and Palomar immutable v1 registration records.
- **12** original records receive an evidence-backed optional `chronology.milestone` with UTC **day** precision only. One Palomar v2 record has unresolved version-specific publication date and is left unannotated.
- **0** new verified original publication clocks; **0** `publishedAt` or `publishedAtPrecision` changes. None of 13 is assigned a speculative `08:00` or a crawler time.
- Stable IDs, original claims, summary, score, original links, all other 281 rows and static feed ordering stay unchanged.

## Provenance rules

The precise meaning of every timestamp is material. The WordPress original article's date is not its RSS `pubDate`; a Palomar **mechanical verification** time is not the **public registration** time; an institutional event's **occurrence** is not the news article's **publishing** time; a Hexagon **v1** day is not a later **v2** clock. No mathematical or Lean statement was independently verified here.

The WordPress `/wp-json/wp/v2/posts?slug=...`, WordPress.com REST `date_gmt`, and RSS `pubDate` retrievals were attempted but not accessible with the available public reader. Palomar's current public web is JavaScript and its machine-readable static `recent.json` now covers recent entries; exact older version-specific `published_at` was not independently fetched. Exact unsupported timestamps therefore remain unresolved.

## Per-record audit

| # | Stable event ID | Primary source | Evidence / timestamp semantics | Verdict | Canonical mutation |
|---|---|---|---|---|---|
| 1 | `2026-10-16-sair-open-math-os` | [Primary record](https://terrytao.wordpress.com/2026/10/16/sair-open-math-os-released/) | Terence Tao original WordPress post; Oct 16 date visible; WordPress date_gmt/RSS pubDate inaccessible. | `DAY_MILESTONE_ONLY` | Add day-only chronology.milestone |
| 2 | `2026-10-16-formalize-all-mathematics` | [Primary record](https://xenaproject.wordpress.com/2026/10/16/how-to-formalize-all-of-mathematics/) | Xena primary WordPress post headed Posted on October 16; Tao independently linked on Oct16. No source timestamp for public HH:mm. | `DAY_MILESTONE_ONLY` | Add day-only chronology.milestone |
| 3 | `2026-10-16-markoff-almost-all-unique` | [Primary record](https://hexagonmath.org/2610.00281v2) | Hexagon 2610.00281 v1 and v2 both dated Oct16; exact initial acceptance clock unavailable; canonical link points to v2 while chronology milestone anchors v1. | `DAY_MILESTONE_ONLY / VERSION_AWARE` | Add day-only chronology.milestone |
| 4 | `2026-10-16-hales-linchpin-theorems` | [Primary record](https://hexagonmath.org/2610.00289v1) | Hales Hexagon 2610.00289 v1 dated Oct16; no public first-visible minute. Author's private AI production timing is not release time. | `DAY_MILESTONE_ONLY` | Add day-only chronology.milestone |
| 5 | `2026-10-15-simons-ai-math-initiative` | [Primary record](https://www.simonsfoundation.org/news/simons-foundation-launches-15m-effort-to-help-mathematicians-navigate-ai-era/) | Simons Foundation original article/press release indexed Oct15. First-party article has no proven HH:mm; refrain from using web crawler or syndication clock. | `DAY_MILESTONE_ONLY` | Add day-only chronology.milestone |
| 6 | `2026-10-15-lean-verified-kernels-ai-provenance` | [Primary record](https://leodemoura.github.io/blog/2026-10-15-lean-now-ships-with-verified-kernels/) | Leonardo de Moura primary authored blog dated 2026-10-15; third-party site submitting it Oct16 06:30:10 is syndication and not original first-public timestamp. | `DAY_MILESTONE_ONLY` | Add day-only chronology.milestone |
| 7 | `2026-10-15-subgaussian-support-palomar` | [Primary record](https://palomar-registry.org/entry?id=PALOMAR-2026-10-15-000001&version=1) | Palomar PALOMAR-2026-10-15-000001 v1 registered on Oct15. Mechanical verification result dated Oct14 09:42 UTC is **prior verification**, not registry publication. | `DAY_REGISTRY_ONLY / VERIFICATION_DISTINCT` | Add day-only chronology.milestone |
| 8 | `2026-10-13-unitary-weil-seven-eighths` | [Primary record](https://hexagonmath.org/2610.00216v1) | Hexagon 2610.00216 v1 dated Oct13. Author states earlier Oct8 related public Hecke draft and Oct12 Weil-group extension development; earlier Hecke draft has a different claim scope, so no claim-matched earliest-public time inferred. | `DAY_MILESTONE_ONLY / RELATED_EARLIER_WORK` | Add day-only chronology.milestone |
| 9 | `2026-10-11-zeta-density-39-over-17-palomar` | [Primary record](https://palomar-registry.org/entry?id=PALOMAR-2026-10-11-000010&version=1) | Palomar PALOMAR-2026-10-11-000010 v1 first registered Oct11; Oct9 07:51 UTC mechanical check timestamp is verification, not published_at. | `DAY_REGISTRY_ONLY / VERIFICATION_DISTINCT` | Add day-only chronology.milestone |
| 10 | `2026-10-11-dozz-ai-assisted-formalization` | [Primary record](https://palomar-registry.org/entry?id=PALOMAR-2026-10-11-000008&version=1) | Palomar PALOMAR-2026-10-11-000008 v1 first registered Oct11; Oct10 12:07 UTC mechanical verification timestamp is not public registry registration. | `DAY_REGISTRY_ONLY / VERIFICATION_DISTINCT` | Add day-only chronology.milestone |
| 11 | `2026-10-11-yau-math-ai-alliance` | [Primary record](https://www.tsinghua.edu.cn/info/1177/128669.htm) | Original Tsinghua University report explicitly dates formation ceremony **Oct11** but is published **Oct13 at 14:39:47 Asia/Shanghai** (06:39:47Z). Event time and news-release time are distinct; use event day, never assert ceremony held at news publication clock. | `DAY_EVENT_ONLY / LATER_ARTICLE_EXACT` | Add day-only chronology.milestone |
| 12 | `2026-10-10-nearly-minimax-variance-palomar` | [Primary record](https://palomar-registry.org/entry?id=PALOMAR-2026-10-10-000002&version=1) | Palomar PALOMAR-2026-10-10-000002 v1 page identifies October 10 first registration; no authoritative machine public timestamp retrieved. | `DAY_REGISTRY_ONLY` | Add day-only chronology.milestone |
| 13 | `2026-10-10-unit-distance-exponent-palomar-v2` | [Primary record](https://palomar-registry.org/entry?id=PALOMAR-2026-10-01-000018&version=2) | Palomar ID is PALOMAR-2026-10-01-000018; selected version **2**, which is distinct from first-registration date Oct1. Version-2 public registration clock and exact source-date could not be independently retrieved. Do not infer Oct10 time from identifier or reused v1 metadata. | `VERSION_DATE_UNVERIFIED / NO_DATA_EDIT` | No change |

## Specific date-semantics conflict

**Tsinghua University** [first-party article](https://www.tsinghua.edu.cn/info/1177/128669.htm): formation ceremony took place **Oct 11**; original university article was published **Oct 13 14:39:47 Asia/Shanghai** (Oct 13 06:39:47Z). The current event records the **Oct 11 alliance creation**, not the **Oct 13 institutional news article**. In this batch, `chronology.eventKind="other"` and milestone Oct11 are supported by the institutional article; the later exact article time is in this audit ledger only. The V1 schema's `earliestVerifiedPublic` describes *earlier* evidence and cannot safely encode a later separate press publication event, which should be represented by a future `relatedPublications[]` extension if needed.

## Remaining follow-ups

1. Read *origin-specific* WordPress `date_gmt`/`pubDate` and determine whether it denotes original public publication (not the edit time).
2. Retrieve version-specific Palomar v2 snapshot (`PALOMAR-2026-10-01-000018 v2`) and its immutable `published_at`; do not mistake October 1 (first registration) for October 10 (v2).
3. For the three Palomar v1 entries, seek immutable version record `published_at` if accessible, recording a **proof-registration** clock without implying that the theorem was first made public at that instant.
4. If the user wants the original **Oct13 Tsinghua press release** separately visible, design distinct event vs announcement metadata rather than overwriting the Oct11 public event with a news publication time.
5. Continue reverse chronology to October 9 and earlier, prioritizing original institutional pages and claim-matched GitHub Releases.
 
## Acceptance

- `npm run content:check`, `npm run build:static`, static regression tests and native checks green.
- Exact diff: 12 additive chronology objects + this audit document, 294 records and permalink URLs unchanged. No runtime/schema/UI migrations.
