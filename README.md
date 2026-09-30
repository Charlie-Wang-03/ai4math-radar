# AI4Math Radar

> **Status: early development.** The repository is public from the beginning, but the AI4Math domain package is still being designed and calibrated. Do not treat the current template sources, taxonomy, prompts, or thresholds as production-ready AI4Math policy.

AI4Math Radar is an open-source research-intelligence project for **AI for Mathematics / Mathematical AI**. It aims to continuously collect public research signals, filter and structure them with language models, group multiple reports about the same event, and expose the resulting research feed through a website, RSS, API and MCP.

The project is independently maintained and is derived from the [AIHOT](https://github.com/KKKKhazix/AIHOT) open-source framework. It is **not an official AIHOT project**.

## Current scope

The first development milestone is deliberately narrow:

- establish an independent public project identity and collaboration surface;
- design an AI4Math-specific taxonomy, source policy and selection rubric;
- maintain a small, high-precision AI4Math source pack and expand it only with evidence;
- calibrate selection and event-relation judgments with user-supplied gold data;
- preserve AIHOT's existing production infrastructure unless a concrete AI4Math requirement proves a change is necessary.

The current codebase already provides the reusable infrastructure for ingestion, deduplication, model calls, event grouping, reports, PostgreSQL persistence, background jobs, budget controls, public API, RSS and MCP.

## Planned AI4Math coverage

The V1 domain design will focus on the intersection of AI and mathematics, including areas such as:

- mathematical reasoning models;
- automated theorem proving and proof search;
- formal mathematics and autoformalization;
- AI-assisted mathematical discovery;
- benchmarks, datasets and evaluation;
- research tooling and infrastructure;
- major research programs and ecosystem developments.

Pure AI news and pure mathematics news are not automatically in scope. The domain boundary will be encoded in the public `industry/` configuration and evaluation assets.

## Architecture

The inherited pipeline is:

```text
sources
  → deduplication / extraction
  → broad-recall prefilter
  → independent scoring
  → structured understanding
  → event relation judgement / grouping
  → publication
  → web / RSS / API / MCP / reports
```

The stable architectural rules are documented in [docs/architecture.md](docs/architecture.md). AI4Math-specific configuration lives primarily under [industry/](industry/).

## Development status

| Area | Status |
|---|---|
| Independent project identity | Complete |
| Core AIHOT infrastructure | Inherited |
| AI4Math taxonomy | Initial V1 complete |
| AI4Math sources | Initial V1 source pack complete |
| AI4Math prompts / scoring rubric | Initial V1 complete; real calibration pending |
| Selection calibration set | Export tooling ready; real labels pending |
| Event-relation evaluation | Harness + AI4Math synthetic examples complete; real gold pending |
| Production deployment | Collection-only Railway bootstrap ready; runtime not yet provisioned |

## Contributing

Contributions are welcome, but the project is intentionally controlling scope while the domain model is still being established.

Good early contributions include:

- reproducible bugs in the inherited infrastructure;
- documentation corrections;
- concrete AI4Math source suggestions with stable public URLs and provenance;
- taxonomy or selection-policy proposals backed by specific examples;
- deterministic tests for agreed behavior.

Please avoid large architectural rewrites, speculative agents, RAG systems, citation graphs, knowledge graphs, theorem-prover integrations or new external services unless an Issue first establishes a concrete need.

See [CONTRIBUTING.md](CONTRIBUTING.md) and [AGENTS.md](AGENTS.md).

## Running the inherited framework

The project currently keeps AIHOT's runtime and package namespace to minimize unnecessary divergence.

Requirements:

- Node.js 24
- PostgreSQL 17
- Docker / Docker Compose for the containerized path

Development and deployment documentation lives under [docs/](docs/). The current runtime still intentionally retains internal `@aihot/*`, Docker and database technical names to minimize unnecessary divergence from the upstream framework; these are implementation details, not product branding.

## License and provenance

The inherited code is licensed under the MIT License. The original AIHOT copyright and license notice are preserved in [LICENSE](LICENSE), with additional provenance and third-party notices in [NOTICE](NOTICE).

AI4Math Radar uses its own project identity and does not use the AIHOT name or logo as its product brand.
