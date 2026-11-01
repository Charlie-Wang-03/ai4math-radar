# Batch 37 — CheckMate public-code evidence and Zenodo v3/v4 date semantics

Checked 2026-11-01. Baseline `3129c7e6fa82866484e0885741663190bde936c7`: 334 news, 105 midnight-valued legacy dates, three without optional chronology. **This research PR does not change canonical news.**

## 1. CheckMate: a historical public author action is now established

The original [CheckMate PR #1](https://github.com/collinskatie/checkmate/pull/1) was opened by coauthor `albertqjiang` at **2023-06-05T12:39:48Z** and merged at **12:40:05Z**. The [README at that merge](https://github.com/collinskatie/checkmate/blob/ce3e52dacea64c8af92113d71f3e17548f1ec998/README.md) identifies CheckMate's interactive mathematical LLM evaluation platform and MathConverse data. It still has placeholder paper/citation links; do not claim this snapshot independently establishes the paper's arXiv announcement.

Current public visibility alone is insufficient: a PR can have been created while a repository was private. We therefore read the exact [2023-06-05 12:00–12:59 UTC GH Archive object](https://data.gharchive.org/2023-06-05-12.json.gz). [GH Archive's documentation](https://www.gharchive.org/) describes hourly preservation of GitHub's public Events API payloads. This is an independently retained copy of original GitHub event metadata, not an author commit clock.

**Complete real retrieval:** [Actions run 41305196578](https://github.com/Charlie-Wang-03/ai4math-radar/actions/runs/41305196578), head `8dd194a759fa4f81c6f3be16e93a975d4877234f`, checked `2026-11-01T12:10:32.510Z`.

| Original event | Event timestamp UTC | Action | Historical visibility |
| --- | --- | --- | --- |
| `29533246293` | `2023-06-05T12:39:49Z` | PR #1 opened | `public=true`; base repository `private=false` |
| `29533253947` | `2023-06-05T12:40:06Z` | PR #1 closed/merged | `public=true`; base repository `private=false` |

Both match repository ID **643507916**, `collinskatie/checkmate`, author ID **19373539**, `albertqjiang`, exact PR URL/number, PR creation timestamp and head `94420ab6895afd3ee76b80a08558a5682c647df6`. The archived merge event also matches commit `ce3e52dacea64c8af92113d71f3e17548f1ec998` and `merged_at=2023-06-05T12:40:05Z`.

The source returned HTTP 200; **209,174 event lines** were read through the end of the gzip stream, **105,161,911 compressed bytes / 819,266,223 expanded bytes**. Archive SHA-256: `8ff6279ce40a2dac7648f6083a51170e950ab6f1f0800168baaa554760620ee1`. The first attempt stopped at its 768 MiB expanded-byte cap despite seeing the two matches and correctly remained unresolved. The fixed same-hour replay was then permitted up to 2 GiB expanded / 256 MiB compressed, retaining streaming, 8 MiB line caps and the 90-second deadline. The second read completed; there was no expansion to other hours or repositories.

**Established:** CheckMate had a claim-matched, author-led **public source-code collaboration on June 5 UTC**. This supports a narrowly labelled project/source-code milestone for the existing news item, subject to a distinct reviewed content change.

**Not established:** the first arXiv `new` announcement, the absolute first public repository push, or June 2 as a public-release day. The small documentation PR is not itself a new research breakthrough. Do not create a duplicate news item or use its exact seconds as the platform's original launch time.

## 2. Zenodo: the earlier compact report omitted a material field

Real first-party DataCite responses for the two exact version DOIs returned HTTP 200, with matching DOI, author, title and Zenodo landing identity:

| Field | v3: `10.5281/zenodo.23450488` | v4: `10.5281/zenodo.23475012` |
| --- | --- | --- |
| `version` | `3` | `4` |
| `created = registered` | `2026-10-18T15:39:11.000Z` | `2026-10-19T13:20:29.000Z` |
| top-level `published` | `2026` | `2026` |
| `dates[dateType=Issued].date` | **`2026-10-19`** | **`2026-10-19`** |
| `state` | `findable` | `findable` |
| `IsVersionOf` | `10.5281/zenodo.23230155` | `10.5281/zenodo.23230155` |

The matching version relation demonstrates that the [accessible v4 page](https://zenodo.org/records/23475012), dated Oct19, is a later version of the same work, **not a substitute source for v3's actual first-public instant**.

**Correction to Batch 33's interpretation:** the compact probe retained only top-level `published`, which is year-only here, and omitted `dates`. The exact v3 raw response digest is still `792affe2243ff8253c898112a579cccb00a862bd8f1896bbdef499d166896804`, the same digest already reported in Batch 33. Thus an inference that this source supplied only a publication year was incomplete: its version-specific **Issued calendar date is October 19**. The present v4 response digest is `59b520958ea8290a541d51a417aa3bc2567572b76fa145bd41f56b4db5187e14`.

[DataCite's date-field documentation](https://support.datacite.org/docs/what-is-the-difference-between-the-created-and-registered-date-in-the-datacite-rest-api) distinguishes DOI creation/registration from bibliographic publication metadata; [its dateType schema](https://datacite-metadata-schema.readthedocs.io/en/4.7/appendices/appendix-1/dateType/) distinguishes Issued from Available. The current payload exposes `published=2026` despite a detailed Issued entry; preserve both observations rather than deriving one from the other. [Zenodo's publication-date guidance](https://help.zenodo.org/docs/deposit/describe-records/publication-date/) also permits dates of earlier publication elsewhere.

**Established:** October 19 is independently retrievable as **v3's source-declared Issued date**, not merely an uncited secondary article's date. The Oct18 DOI-registration event and Oct19 declared issue day are different types of date; their difference alone is not proof of an error.

**Still unresolved:** v3's first publicly accessible manuscript instant or independently grounded **UTC release day**. Issued contains no timezone/clock, so it must not be silently normalized into the site's UTC chronology contract. No proof-validity claim, v4 date substitution or automatic timestamp promotion.

## 3. Evidence preservation and acceptance

Actual output: [artifact 13083002720](https://github.com/Charlie-Wang-03/ai4math-radar/actions/runs/41305196578/artifacts/13083002720), ZIP SHA-256 `8bafb3dd7276fbafa1b851fe776b80b418fc99d12fc5a221dd49f81e8f7d80ec`; extracted JSON SHA-256 `86e7a8cea7325d03aa17c56332ae4959a0adc23bc22e3366bd0e3e92332bdaa0`. The downloaded ZIP digest was independently checked in the analysis runtime. Raw matching original event objects are retained in this artifact; the normalized permanent receipt is [batch37-author-public-evidence.json](evidence/batch37-author-public-evidence.json). The permanent receipt is a selected-field transcription, not a claim to preserve all source bytes.

11/11 local synthetic tests and the real hosted probe passed. Check/Docker/CodeQL and completed code review must also pass before merge. No paid services, credentials, new recurring tasks, persistent MCP, canonical data writes, or changes to existing RSS probes.

**Next editorial operation:** a separate minimal content PR may annotate the CheckMate item's **June5 public-code collaboration milestone**, explicitly distinguished from arXiv first announcement and preserving June2 legacy ID/date. Zenodo's source-declared date is now evidenced, but remains separate from verified UTC release. GenLimitLib still lacks the primary-category first-announcement evidence; the fresh copy of its derived JSON again retains `v1 Announce Type:new` without an original date. This research PR alone closes zero canonical chronology gaps.
