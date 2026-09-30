import { tag } from "./setup.ts";
import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { config } from "@aihot/backend/config";
import { upsertMaterial } from "@aihot/backend/content/materials";
import { closeDb, sql } from "@aihot/backend/db";
import { processArticle, queueProcessing, sweepUnprocessed } from "@aihot/backend/jobs/content";

const T = tag();
const SOURCE = `test-collection-only-${T}`;
let articleId = "";

before(async () => {
  await sql`INSERT INTO sources (id, name, kind, tier, participation_mode, next_fetch_at)
            VALUES (${SOURCE}, 'Collection-only test', 'rss', 'T1', 'editorial', '2100-01-01')`;
  const created = await upsertMaterial({
    sourceId: SOURCE,
    url: `https://example.com/collection-only-${T}`,
    title: `Collection-only ${T}`,
    bodyText: "Collected body.",
    bodyStatus: "ok",
    via: "fetch",
    publishedAt: new Date(),
  });
  articleId = created.articleId;
});

after(async () => {
  config.collectionOnly = false;
  await sql`DELETE FROM articles WHERE source_id = ${SOURCE}`;
  await sql`DELETE FROM sources WHERE id = ${SOURCE}`;
  await closeDb();
});

test("collection-only mode keeps editorial articles unanalysed without queue churn", async () => {
  config.collectionOnly = true;

  const queued = await queueProcessing(articleId);
  assert.equal(queued, null);

  const [article] = await sql<{ state: string; queued_at: Date | null; error: string | null }[]>`
    SELECT processing_state AS state, processing_queued_at AS queued_at, processing_error AS error
    FROM articles WHERE id = ${articleId}`;
  assert.equal(article!.state, "new");
  assert.equal(article!.queued_at, null);
  assert.equal(article!.error, null);

  assert.deepEqual(await processArticle(articleId), { state: "collection-only" });
  assert.deepEqual(await sweepUnprocessed(), { enqueued: 0 });

  const jobs = await sql`SELECT id FROM pgboss.job WHERE data->>'articleId' = ${articleId}`;
  assert.equal(jobs.length, 0);
});
