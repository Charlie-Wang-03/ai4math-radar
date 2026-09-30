// Applies database/migrations/*.sql in order, each in its own transaction.
// Concurrent-safe: every migration transaction takes the same PostgreSQL advisory lock and re-checks
// schema_migrations while holding it, so several services may run this script during one deploy.
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { REPO_ROOT } from "@aihot/backend/config";
import { closeDb, sql } from "@aihot/backend/db";

const dir = path.join(REPO_ROOT, "database/migrations");
const MIGRATION_LOCK = 913247101;

await sql`CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`;

let count = 0;
for (const file of readdirSync(dir).filter((name) => name.endsWith(".sql")).sort()) {
  const text = readFileSync(path.join(dir, file), "utf8");
  const applied = await sql.begin(async (tx) => {
    await tx`SELECT pg_advisory_xact_lock(${MIGRATION_LOCK})`;
    const [existing] = await tx<{ name: string }[]>`SELECT name FROM schema_migrations WHERE name = ${file}`;
    if (existing) return false;

    await tx.unsafe(text);
    await tx`INSERT INTO schema_migrations (name) VALUES (${file})`;
    return true;
  });
  if (applied) {
    console.log(`applied ${file}`);
    count += 1;
  }
}
console.log(count === 0 ? "database is up to date" : `${count} migration(s) applied`);
await closeDb();
