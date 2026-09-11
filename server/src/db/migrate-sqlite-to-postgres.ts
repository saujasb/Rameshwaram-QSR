/**
 * Stage 2: SQLite (production app.db) -> Supabase Postgres data migration tool.
 *
 * STANDALONE TOOL -- this file is never imported by the running application.
 * It is invoked directly via `tsx` (see the `migrate:*` npm scripts in
 * server/package.json) and is NOT part of the app's start/build/dev scripts.
 *
 * Safety properties (see the accompanying chat response for the full
 * write-up of how each is achieved):
 *   - The SQLite source is opened read-only (`{ readonly: true }` at the
 *     better-sqlite3 driver level -- this is an OS-level open flag, not just
 *     an application convention) and is NEVER written to.
 *   - No DROP / TRUNCATE / DELETE statement appears anywhere in this file.
 *     Every write is an INSERT ... ON CONFLICT DO NOTHING.
 *   - Every insert is preceded by an explicit read-and-compare step: rows
 *     that already exist in the destination with IDENTICAL content are
 *     skipped (idempotent re-run); rows that already exist with DIFFERENT
 *     content are treated as CONFLICTS and are never inserted, updated, or
 *     otherwise touched -- the existing Supabase row always wins by being
 *     left alone. There is no code path that overwrites a Supabase row.
 *   - Three modes: --mode=dry-run (zero writes, full report), --mode=migrate
 *     (writes, requires an extra confirmation flag), --mode=verify (zero
 *     writes, compares both sides after a migration).
 *   - Table/column names are never taken from user input; they come only
 *     from the hardcoded TABLES registry below, which is validated against
 *     a strict identifier pattern at startup. SQL is always built with
 *     parameterized values -- no data value is ever concatenated into SQL.
 *
 * Usage:
 *   DATABASE_URL=... SQLITE_PATH=... npm run migrate:dry-run --workspace=server
 *   DATABASE_URL=... SQLITE_PATH=... npm run migrate:verify --workspace=server
 *   DATABASE_URL=... SQLITE_PATH=... MIGRATE_CONFIRM=yes npm run migrate --workspace=server
 */

import Database, { type Database as BetterSqlite3Database } from "better-sqlite3";
import { Pool, type PoolClient } from "pg";
import { existsSync, mkdirSync, appendFileSync } from "node:fs";
import { dirname } from "node:path";

// ============================================================================
// Table registry -- the single source of truth for what this tool migrates.
//
// Column names are identical in SQLite and Postgres for every table (this is
// exactly what Stage 1's 001_initial_schema.sql was designed to guarantee),
// so each row here only needs to be listed once. `primaryKey` is always a
// single column for this schema (no composite primary keys exist).
// `uniqueKeys` lists additional unique constraints (beyond the primary key)
// that must also be checked before insert, per requirement to "use the
// existing primary keys/unique constraints appropriately".
// `jsonbColumn` names the one column (if any) that is JSONB in Postgres but
// stored as a JSON-serialized TEXT string in SQLite -- it needs a structural
// (parsed) comparison rather than a raw-text comparison, because Postgres's
// jsonb type does not guarantee byte-identical round-tripping of formatting
// (see https://www.postgresql.org/docs/current/datatype-json.html).
// ============================================================================

interface TableSpec {
  table: string;
  columns: string[];
  primaryKey: string;
  uniqueKeys?: string[][];
  jsonbColumn?: string;
}

const GENERIC_JSON_TABLES: string[] = [
  "wastage",
  "tasks",
  "inventory_items",
  "inventory_movements",
  "suppliers",
  "purchases",
  "maintenance_issues",
  "complaints",
  "staff",
  "attendance",
  "expenses",
  "manual_orders",
];

const TABLES: TableSpec[] = [
  ...GENERIC_JSON_TABLES.map(
    (table): TableSpec => ({
      table,
      columns: ["id", "json", "createdAt", "updatedAt"],
      primaryKey: "id",
      jsonbColumn: "json",
    })
  ),
  {
    table: "sales_import_batches",
    columns: [
      "id", "fileName", "channel", "businessDate", "recordsFound", "recordsInserted",
      "recordsUpdated", "duplicatesSkipped", "parsingErrorsJson", "validationStatus",
      "validationExpectedQuantity", "validationExpectedAmount", "validationActualQuantity",
      "validationActualAmount", "validationNotesJson", "hasHourlyData", "createdAt", "updatedAt",
    ],
    primaryKey: "id",
  },
  {
    table: "sales_line_items",
    columns: [
      "id", "importBatchId", "channel", "category", "itemName", "itemNameKey", "quantity",
      "amount", "calendarDate", "businessDate", "businessDayStart", "businessDayEnd",
      "transactionTimestamp", "transactionTime", "fingerprint", "createdAt", "updatedAt",
    ],
    primaryKey: "id",
    uniqueKeys: [["fingerprint"]],
  },
  {
    table: "sales_settings",
    columns: ["key", "value", "updatedAt"],
    primaryKey: "key",
  },
  {
    table: "dataset_records",
    columns: [
      "id", "datasetType", "rawTimestamp", "transactionDate", "businessDate",
      "businessDayStartHour", "hour", "shift", "product", "productKey", "category", "outlet",
      "channel", "quantity", "salesValue", "reason", "importBatchId", "sourceFile", "sourceType",
      "sourceSheet", "sourcePage", "sourceRow", "fingerprint", "flagsJson", "createdAt", "updatedAt",
    ],
    primaryKey: "id",
    uniqueKeys: [["fingerprint"]],
  },
  {
    table: "dataset_import_batches",
    columns: [
      "id", "fileName", "fileSizeBytes", "sourceType", "fileHash", "datasetTypesJson", "status",
      "businessDateFrom", "businessDateTo", "recordsFound", "recordsInserted", "recordsUpdated",
      "duplicatesSkipped", "recordsRejected", "qualityJson", "sheetsJson", "rejectedRowsJson",
      "reconciliationJson", "businessDayStartHour", "createdAt",
    ],
    primaryKey: "id",
  },
  {
    table: "app_settings",
    columns: ["key", "value", "updatedAt"],
    primaryKey: "key",
  },
  {
    table: "provider_orders",
    columns: [
      "id", "provider", "providerOrderId", "providerInvoiceId", "restaurantId", "restaurantName",
      "status", "orderType", "orderFrom", "orderFromLabel", "subOrderType", "paymentType",
      "tableNo", "noOfPersons", "customerName", "customerPhone", "coreTotal", "taxTotal",
      "discountTotal", "packagingCharge", "serviceCharge", "deliveryCharges", "roundOff",
      "totalAmount", "comment", "biller", "assignee", "tokenNo", "itemCount", "itemsJson",
      "taxesJson", "discountsJson", "partPaymentsJson", "rawPayloadJson", "providerCreatedAt",
      "receivedAt", "goselfserveSyncStatus", "goselfserveSyncError", "goselfserveSyncedAt",
      "createdAt", "updatedAt",
    ],
    primaryKey: "id",
    uniqueKeys: [["provider", "providerOrderId"]],
  },
  {
    table: "provider_webhook_events",
    columns: [
      "id", "provider", "receivedAt", "ok", "httpStatus", "providerOrderId", "duplicate",
      "error", "bodyJson",
    ],
    primaryKey: "id",
  },
];

// Fail fast if the registry itself ever contains an unsafe identifier. This
// is the SQL-injection guard for table/column names: they are NEVER taken
// from user input, only from this hardcoded list, and every entry is
// validated here before any SQL is built from it.
const SAFE_IDENTIFIER = /^[A-Za-z_][A-Za-z0-9_]*$/;
for (const spec of TABLES) {
  if (!SAFE_IDENTIFIER.test(spec.table)) {
    throw new Error(`Unsafe table identifier in registry: ${spec.table}`);
  }
  for (const col of spec.columns) {
    if (!SAFE_IDENTIFIER.test(col)) {
      throw new Error(`Unsafe column identifier in registry: ${spec.table}.${col}`);
    }
  }
}

function quoteIdent(name: string): string {
  if (!SAFE_IDENTIFIER.test(name)) {
    // Defense in depth: this should be unreachable given the startup check
    // above, but every function that builds SQL text re-validates anyway
    // rather than trusting a single choke point.
    throw new Error(`Refusing to build SQL with unsafe identifier: ${JSON.stringify(name)}`);
  }
  return `"${name}"`;
}

// ============================================================================
// CLI / environment parsing
// ============================================================================

type Mode = "dry-run" | "migrate" | "verify";

interface CliOptions {
  mode: Mode;
  sqlitePath: string;
  databaseUrl: string;
  batchSize: number;
  only: string[] | null;
  logFile: string | null;
  confirmed: boolean;
}

function parseArgs(argv: string[]): CliOptions {
  const args = new Map<string, string>();
  const flags = new Set<string>();
  for (const arg of argv) {
    const m = /^--([^=]+)=(.*)$/.exec(arg);
    if (m) {
      args.set(m[1], m[2]);
    } else if (arg.startsWith("--")) {
      flags.add(arg.slice(2));
    }
  }

  const mode = (args.get("mode") ?? process.env.MIGRATE_MODE ?? "") as Mode;
  if (mode !== "dry-run" && mode !== "migrate" && mode !== "verify") {
    throw new UsageError(
      `Missing or invalid --mode. Expected one of: dry-run | migrate | verify (got ${JSON.stringify(mode)}).`
    );
  }

  const sqlitePath = args.get("sqlite-path") ?? process.env.SQLITE_PATH ?? "";
  if (!sqlitePath) {
    throw new UsageError(
      "Missing SQLite source path. Pass --sqlite-path=<file> or set SQLITE_PATH=<file>. " +
        "This tool never assumes a default path -- production or local, it must always be explicit."
    );
  }
  if (!existsSync(sqlitePath)) {
    throw new UsageError(`SQLite file not found: ${sqlitePath}`);
  }

  const databaseUrl = args.get("database-url") ?? process.env.DATABASE_URL ?? "";
  if (!databaseUrl) {
    throw new UsageError("Missing Postgres connection string. Pass --database-url=<url> or set DATABASE_URL=<url>.");
  }

  const batchSizeArg = args.get("batch-size") ?? process.env.MIGRATE_BATCH_SIZE;
  const batchSize = batchSizeArg ? Number(batchSizeArg) : 500;
  if (!Number.isInteger(batchSize) || batchSize < 1) {
    throw new UsageError(`--batch-size must be a positive integer (got ${JSON.stringify(batchSizeArg)}).`);
  }

  const onlyArg = args.get("only");
  const only = onlyArg ? onlyArg.split(",").map((s) => s.trim()).filter(Boolean) : null;
  if (only) {
    const known = new Set(TABLES.map((t) => t.table));
    for (const t of only) {
      if (!known.has(t)) {
        throw new UsageError(`Unknown table in --only: ${t}. Known tables: ${[...known].join(", ")}`);
      }
    }
  }

  const logFile = args.get("log-file") ?? process.env.MIGRATE_LOG_FILE ?? null;

  // Extra confirmation gate for the one mode that writes. Deliberately not
  // just "the user typed --mode=migrate" -- a second, differently-shaped
  // flag/env var makes an accidental paste/rerun far less likely to write.
  const confirmed = flags.has("yes-i-am-sure") || process.env.MIGRATE_CONFIRM === "yes";

  return { mode, sqlitePath, databaseUrl, batchSize, only, logFile, confirmed };
}

class UsageError extends Error {}

// ============================================================================
// Logging
// ============================================================================

let logFilePath: string | null = null;

function log(line: string): void {
  const stamped = `[${new Date().toISOString()}] ${line}`;
  // eslint-disable-next-line no-console
  console.log(stamped);
  if (logFilePath) {
    appendFileSync(logFilePath, stamped + "\n", "utf8");
  }
}

function initLogFile(p: string | null): void {
  if (!p) return;
  mkdirSync(dirname(p), { recursive: true });
  logFilePath = p;
  log(`Logging to ${p} (in addition to stdout).`);
}

// ============================================================================
// Deep structural equality for JSON-shaped values (objects/arrays/primitives
// only -- exactly what JSON.parse ever produces, no need to handle
// Date/Map/Set/etc.). Used only to compare a JSONB column's already-parsed
// value (from node-postgres) against JSON.parse(sourceText) (from SQLite),
// since jsonb does not preserve exact text formatting.
// ============================================================================

function deepEqualJson(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null) return a === b;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    return a.every((v, i) => deepEqualJson(v, b[i]));
  }
  if (typeof a === "object" && typeof b === "object") {
    const aKeys = Object.keys(a as Record<string, unknown>);
    const bKeys = Object.keys(b as Record<string, unknown>);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every(
      (k) =>
        Object.prototype.hasOwnProperty.call(b, k) &&
        deepEqualJson((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k])
    );
  }
  return false;
}

/** Normalizes a value coming back from node-postgres for comparison against
 * the equivalent value coming back from better-sqlite3. The only type that
 * needs normalizing is `timestamptz`, which node-postgres parses into a JS
 * Date -- everything else (text, integer, double precision, jsonb-as-object)
 * already matches SQLite's native JS types (string/number/null/object). */
function normalizePgValue(v: unknown): unknown {
  if (v instanceof Date) return v.toISOString();
  return v;
}

function rowsEqual(spec: TableSpec, existingPgRow: Record<string, unknown>, sourceSqliteRow: Record<string, unknown>): boolean {
  for (const col of spec.columns) {
    const pgVal = normalizePgValue(existingPgRow[col]);
    const sqliteVal = sourceSqliteRow[col];

    if (spec.jsonbColumn === col) {
      const parsedSource = sqliteVal == null ? null : JSON.parse(String(sqliteVal));
      if (!deepEqualJson(pgVal, parsedSource)) return false;
      continue;
    }

    if (pgVal !== sqliteVal) return false;
  }
  return true;
}

// ============================================================================
// Per-table migration engine
// ============================================================================

interface TableResult {
  table: string;
  sourceExists: boolean;
  sqliteCount: number;
  pgCountBefore: number;
  toInsert: number;
  identicalSkipped: number;
  conflicts: Array<{ pk: string; reason: string; differingColumns?: string[] }>;
  actuallyInserted: number; // only meaningful in migrate mode
  legacyMigratedRowCount?: number; // dataset_records only, informational
}

function tableExistsInSqlite(sqliteDb: BetterSqlite3Database, table: string): boolean {
  const row = sqliteDb
    .prepare(`SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?`)
    .get(table) as { name: string } | undefined;
  return Boolean(row);
}

/**
 * Detects whether the source SQLite database's dataset_records table already
 * contains the one-time legacy copy that server/src/entities/datasets/db.ts's
 * migrateLegacySalesLineItems() performs on every app boot (copying
 * sales_line_items rows into dataset_records, tagged with
 * importBatchId LIKE 'legacy-%'). This is purely informational: this tool
 * copies dataset_records exactly as it exists in the source file, whatever
 * that is, and never re-derives or re-runs that legacy copy itself -- doing
 * so would risk inserting a second, differently-tagged copy of the same
 * historical sales rows into Postgres. Both dataset_records and
 * sales_line_items are migrated independently and verbatim; if the legacy
 * copy already ran in SQLite (which it will have, on any production
 * instance that has booted since that migration code shipped), its output
 * rows are just ordinary dataset_records rows by the time this tool sees them.
 */
function countLegacyMigratedRows(sqliteDb: BetterSqlite3Database): number {
  if (!tableExistsInSqlite(sqliteDb, "dataset_records")) return 0;
  const row = sqliteDb
    .prepare(
      `SELECT COUNT(*) as c FROM dataset_records
       WHERE sourceType = 'pdf' AND sourceSheet IS NULL AND importBatchId LIKE 'legacy-%'`
    )
    .get() as { c: number };
  return row.c;
}

function buildInsertSql(spec: TableSpec, rowCount: number, startParamIndex: number): { sql: string; nextParamIndex: number } {
  const colList = spec.columns.map(quoteIdent).join(", ");
  const valueTuples: string[] = [];
  let p = startParamIndex;
  for (let r = 0; r < rowCount; r++) {
    const placeholders = spec.columns.map(() => `$${p++}`);
    valueTuples.push(`(${placeholders.join(", ")})`);
  }
  // No conflict target is specified deliberately: `ON CONFLICT DO NOTHING`
  // with no target guards against a violation of ANY unique constraint on
  // the table (primary key or any secondary UNIQUE constraint), not just
  // the one this script already checked for in JS. This is a belt-and-
  // suspenders safety net against races (e.g. a concurrent run), not the
  // primary conflict-detection mechanism -- the primary mechanism is the
  // explicit pre-insert read-and-compare below, which is what lets this
  // tool distinguish "already migrated, identical" from "genuine conflict"
  // and report/fail on the latter instead of silently doing nothing.
  const sql = `INSERT INTO ${quoteIdent(spec.table)} (${colList}) VALUES ${valueTuples.join(", ")} ON CONFLICT DO NOTHING`;
  return { sql, nextParamIndex: p };
}

async function fetchExistingByPk(
  client: PoolClient,
  spec: TableSpec,
  pkValues: string[]
): Promise<Map<string, Record<string, unknown>>> {
  if (pkValues.length === 0) return new Map();
  const res = await client.query(
    `SELECT * FROM ${quoteIdent(spec.table)} WHERE ${quoteIdent(spec.primaryKey)} = ANY($1::text[])`,
    [pkValues]
  );
  const map = new Map<string, Record<string, unknown>>();
  for (const row of res.rows) {
    map.set(String(row[spec.primaryKey]), row);
  }
  return map;
}

/**
 * For each declared secondary unique key (e.g. sales_line_items.fingerprint,
 * provider_orders(provider, providerOrderId)), finds destination rows whose
 * unique-key value matches a candidate row's, keyed by that tuple's string
 * representation. Used to catch "different id, same natural key" conflicts
 * that a pure primary-key lookup would miss.
 */
// A NUL-free ASCII space cannot appear inside these plain identifier/value
// strings in any way that would make two different tuples collide when
// joined, but to be explicit and robust regardless, tuple keys always use a
// documented separator rather than a bare join("") -- ("ab","c") and
// ("a","bc") must never hash to the same map key.
const TUPLE_SEP = "\u0000";

function tupleKeyOf(uniqueCols: string[], row: Record<string, unknown>): string {
  return uniqueCols.map((c) => String(row[c])).join(TUPLE_SEP);
}

function uniqueMapKey(uniqueCols: string[], tupleKey: string): string {
  return `${uniqueCols.join(TUPLE_SEP)}::${tupleKey}`;
}

async function fetchExistingByUniqueKeys(
  client: PoolClient,
  spec: TableSpec,
  candidates: Record<string, unknown>[]
): Promise<Map<string, { pk: string }>> {
  const result = new Map<string, { pk: string }>();
  if (!spec.uniqueKeys || candidates.length === 0) return result;

  for (const uniqueCols of spec.uniqueKeys) {
    if (uniqueCols.length === 1) {
      const col = uniqueCols[0];
      const values = candidates.map((c) => String(c[col]));
      const res = await client.query(
        `SELECT ${quoteIdent(spec.primaryKey)} as pk, ${quoteIdent(col)} as v
         FROM ${quoteIdent(spec.table)} WHERE ${quoteIdent(col)} = ANY($1::text[])`,
        [values]
      );
      for (const row of res.rows) {
        result.set(uniqueMapKey(uniqueCols, String(row.v)), { pk: String(row.pk) });
      }
    } else {
      // Composite unique key (only provider_orders(provider, providerOrderId)
      // in this schema): one parameterized lookup per distinct candidate
      // tuple. Deliberately not a single batched query -- this only runs for
      // rows that already passed the primary-key filter (i.e. genuinely new
      // ids), which in practice is a small subset of any batch, and a plain
      // per-tuple query is far easier to verify correct than a multi-column
      // batch-IN construct for what is, here, always a 2-column key.
      const whereClause = uniqueCols.map((c, i) => `${quoteIdent(c)} = $${i + 1}`).join(" AND ");
      const seen = new Set<string>();
      for (const candidate of candidates) {
        const tupleKey = tupleKeyOf(uniqueCols, candidate);
        const mapKey = uniqueMapKey(uniqueCols, tupleKey);
        if (seen.has(mapKey)) continue;
        seen.add(mapKey);
        const values = uniqueCols.map((c) => candidate[c]);
        const res = await client.query(
          `SELECT ${quoteIdent(spec.primaryKey)} as pk FROM ${quoteIdent(spec.table)} WHERE ${whereClause} LIMIT 1`,
          values
        );
        if (res.rows.length > 0) {
          result.set(mapKey, { pk: String(res.rows[0].pk) });
        }
      }
    }
  }
  return result;
}

interface ProcessBatchOutcome {
  toInsert: Record<string, unknown>[];
  identicalSkipped: number;
  conflicts: Array<{ pk: string; reason: string; differingColumns?: string[] }>;
}

async function planBatch(
  client: PoolClient,
  spec: TableSpec,
  sourceRows: Record<string, unknown>[]
): Promise<ProcessBatchOutcome> {
  const pkValues = sourceRows.map((r) => String(r[spec.primaryKey]));
  const existingByPk = await fetchExistingByPk(client, spec, pkValues);

  const toInsert: Record<string, unknown>[] = [];
  const identicalPk = new Set<string>();
  const conflicts: Array<{ pk: string; reason: string; differingColumns?: string[] }> = [];

  const candidatesForUniqueCheck: Record<string, unknown>[] = [];

  for (const row of sourceRows) {
    const pk = String(row[spec.primaryKey]);
    const existing = existingByPk.get(pk);
    if (existing) {
      if (rowsEqual(spec, existing, row)) {
        identicalPk.add(pk);
      } else {
        const differingColumns = spec.columns.filter((c) => {
          const a = normalizePgValue(existing[c]);
          const b = row[c];
          if (spec.jsonbColumn === c) {
            const parsed = b == null ? null : JSON.parse(String(b));
            return !deepEqualJson(a, parsed);
          }
          return a !== b;
        });
        conflicts.push({ pk, reason: "primary key exists with different content", differingColumns });
      }
      continue;
    }
    candidatesForUniqueCheck.push(row);
  }

  if (spec.uniqueKeys && candidatesForUniqueCheck.length > 0) {
    const existingByUnique = await fetchExistingByUniqueKeys(client, spec, candidatesForUniqueCheck);
    for (const row of candidatesForUniqueCheck) {
      const pk = String(row[spec.primaryKey]);
      let conflicted = false;
      for (const uniqueCols of spec.uniqueKeys) {
        const hit = existingByUnique.get(uniqueMapKey(uniqueCols, tupleKeyOf(uniqueCols, row)));
        if (hit && hit.pk !== pk) {
          conflicts.push({
            pk,
            reason: `unique constraint (${uniqueCols.join(", ")}) already used by a different row (id=${hit.pk})`,
          });
          conflicted = true;
          break;
        }
      }
      if (!conflicted) toInsert.push(row);
    }
  } else {
    toInsert.push(...candidatesForUniqueCheck);
  }

  return { toInsert, identicalSkipped: identicalPk.size, conflicts };
}

function maxSafeBatchSize(requested: number, columnCount: number): number {
  // Postgres hard limit is 65535 bound parameters per statement. Stay well
  // under it so a wide table (provider_orders, 41 columns) can never come
  // close, regardless of the requested batch size.
  const paramCap = Math.floor(60000 / Math.max(1, columnCount));
  return Math.max(1, Math.min(requested, paramCap));
}

async function migrateOneTable(
  pool: Pool,
  sqliteDb: BetterSqlite3Database,
  spec: TableSpec,
  opts: { write: boolean; batchSize: number }
): Promise<TableResult> {
  const result: TableResult = {
    table: spec.table,
    sourceExists: true,
    sqliteCount: 0,
    pgCountBefore: 0,
    toInsert: 0,
    identicalSkipped: 0,
    conflicts: [],
    actuallyInserted: 0,
  };

  if (!tableExistsInSqlite(sqliteDb, spec.table)) {
    result.sourceExists = false;
    log(`  [skip] "${spec.table}" does not exist in the source SQLite file.`);
    return result;
  }

  const countRow = sqliteDb.prepare(`SELECT COUNT(*) as c FROM ${quoteIdent(spec.table)}`).get() as { c: number };
  result.sqliteCount = countRow.c;

  if (spec.table === "dataset_records") {
    result.legacyMigratedRowCount = countLegacyMigratedRows(sqliteDb);
  }

  const client = await pool.connect();
  try {
    const pgCountRes = await client.query(`SELECT COUNT(*)::int as c FROM ${quoteIdent(spec.table)}`);
    result.pgCountBefore = pgCountRes.rows[0].c;

    const batchSize = maxSafeBatchSize(opts.batchSize, spec.columns.length);
    const colList = spec.columns.map(quoteIdent).join(", ");
    const selectStmt = sqliteDb.prepare(
      `SELECT ${colList.replace(/"/g, "")} FROM ${spec.table} ORDER BY ${spec.primaryKey}`
    );
    // Note: better-sqlite3's own quoting rules differ slightly from
    // Postgres's, but since every identifier here is already validated
    // against SAFE_IDENTIFIER (plain [A-Za-z_][A-Za-z0-9_]*), it is valid
    // unquoted in both dialects -- quoting is stripped only for the SQLite
    // side above for readability; it changes nothing about safety, since
    // the identifiers are still restricted to the hardcoded, validated list.

    let batch: Record<string, unknown>[] = [];
    const flush = async () => {
      if (batch.length === 0) return;
      const plan = await planBatch(client, spec, batch);
      result.toInsert += plan.toInsert.length;
      result.identicalSkipped += plan.identicalSkipped;
      result.conflicts.push(...plan.conflicts);

      if (opts.write && plan.toInsert.length > 0) {
        await client.query("BEGIN");
        try {
          const { sql } = buildInsertSql(spec, plan.toInsert.length, 1);
          const params = plan.toInsert.flatMap((row) => spec.columns.map((c) => row[c]));
          const insertRes = await client.query(sql, params);
          result.actuallyInserted += insertRes.rowCount ?? 0;
          await client.query("COMMIT");
        } catch (err) {
          await client.query("ROLLBACK");
          throw err;
        }
      }
      batch = [];
    };

    for (const row of selectStmt.iterate() as IterableIterator<Record<string, unknown>>) {
      batch.push(row);
      if (batch.length >= batchSize) {
        await flush();
      }
    }
    await flush();
  } finally {
    client.release();
  }

  return result;
}

// ============================================================================
// Verify mode
// ============================================================================

interface VerifyExtra {
  label: string;
  sqlite: number;
  pg: number;
}

async function verifyOneTable(
  pool: Pool,
  sqliteDb: BetterSqlite3Database,
  spec: TableSpec
): Promise<{ table: string; sqliteCount: number; pgCount: number; missingInPg: string[]; extraInPg: string[]; extras: VerifyExtra[] }> {
  if (!tableExistsInSqlite(sqliteDb, spec.table)) {
    return { table: spec.table, sqliteCount: 0, pgCount: 0, missingInPg: [], extraInPg: [], extras: [] };
  }

  const sqliteIds = new Set<string>();
  for (const row of sqliteDb.prepare(`SELECT ${spec.primaryKey} as pk FROM ${spec.table}`).iterate() as IterableIterator<{ pk: string }>) {
    sqliteIds.add(String(row.pk));
  }

  const client = await pool.connect();
  let pgIds: Set<string>;
  const extras: VerifyExtra[] = [];
  try {
    const res = await client.query(`SELECT ${quoteIdent(spec.primaryKey)} as pk FROM ${quoteIdent(spec.table)}`);
    pgIds = new Set(res.rows.map((r) => String(r.pk)));

    if (spec.table === "provider_orders") {
      extras.push(...(await groupedCount(client, sqliteDb, spec.table, "provider")));
    }
    if (spec.table === "dataset_records") {
      extras.push(...(await groupedCount(client, sqliteDb, spec.table, "datasetType")));
    }
    if (spec.table === "provider_webhook_events") {
      extras.push(...(await groupedCount(client, sqliteDb, spec.table, "provider")));
    }
    if (spec.uniqueKeys) {
      for (const uniqueCols of spec.uniqueKeys) {
        if (uniqueCols.length !== 1) continue;
        const col = uniqueCols[0];
        const dupRow = await client.query(
          `SELECT COUNT(*)::int as total, COUNT(DISTINCT ${quoteIdent(col)})::int as distinct_count FROM ${quoteIdent(spec.table)}`
        );
        const { total, distinct_count } = dupRow.rows[0];
        extras.push({ label: `unique(${col}) duplicates in Supabase`, sqlite: 0, pg: total - distinct_count });
      }
    }
  } finally {
    client.release();
  }

  const missingInPg = [...sqliteIds].filter((id) => !pgIds.has(id));
  const extraInPg = [...pgIds].filter((id) => !sqliteIds.has(id));

  return { table: spec.table, sqliteCount: sqliteIds.size, pgCount: pgIds.size, missingInPg, extraInPg, extras };
}

async function groupedCount(
  client: PoolClient,
  sqliteDb: BetterSqlite3Database,
  table: string,
  column: string
): Promise<VerifyExtra[]> {
  const sqliteGroups = sqliteDb
    .prepare(`SELECT ${column} as g, COUNT(*) as c FROM ${table} GROUP BY ${column}`)
    .all() as { g: string; c: number }[];
  const pgRes = await client.query(
    `SELECT ${quoteIdent(column)} as g, COUNT(*)::int as c FROM ${quoteIdent(table)} GROUP BY ${quoteIdent(column)}`
  );
  const pgMap = new Map(pgRes.rows.map((r) => [String(r.g), r.c as number]));
  const labels = new Set<string>([...sqliteGroups.map((g) => String(g.g)), ...pgMap.keys()]);
  return [...labels].map((g) => ({
    label: `${table}.${column} = ${g}`,
    sqlite: sqliteGroups.find((s) => String(s.g) === g)?.c ?? 0,
    pg: pgMap.get(g) ?? 0,
  }));
}

// ============================================================================
// Reporting
// ============================================================================

function printTable(headers: string[], rows: string[][]): void {
  const widths = headers.map((h, i) => Math.max(h.length, ...rows.map((r) => (r[i] ?? "").length)));
  const line = (cells: string[]) => cells.map((c, i) => c.padEnd(widths[i])).join("  ");
  log(line(headers));
  log(line(widths.map((w) => "-".repeat(w))));
  for (const r of rows) log(line(r));
}

// ============================================================================
// Main
// ============================================================================

async function main(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2));
  initLogFile(opts.logFile);

  log(`Mode: ${opts.mode}`);
  log(`SQLite source: ${opts.sqlitePath} (opened read-only)`);
  log(`Postgres target: ${redactConnectionString(opts.databaseUrl)}`);

  if (opts.mode === "migrate" && !opts.confirmed) {
    throw new UsageError(
      "--mode=migrate requires an explicit confirmation. Re-run with --yes-i-am-sure " +
        "or MIGRATE_CONFIRM=yes once you have reviewed a --mode=dry-run report first. " +
        "This tool will not write to Supabase otherwise."
    );
  }

  const sqliteDb = new Database(opts.sqlitePath, { readonly: true, fileMustExist: true });
  const pool = new Pool({
    connectionString: opts.databaseUrl,
    ssl: resolveSsl(opts.databaseUrl),
  });

  try {
    // Fail fast on a bad connection string / unreachable database before
    // touching any table, with a clear error rather than a confusing
    // per-table failure.
    await pool.query("SELECT 1");

    const tablesToRun = opts.only ? TABLES.filter((t) => opts.only!.includes(t.table)) : TABLES;

    if (opts.mode === "verify") {
      await runVerify(pool, sqliteDb, tablesToRun);
      return;
    }

    // dry-run and migrate share the same engine; dry-run just passes write:false.
    log(opts.mode === "dry-run" ? "Running in DRY-RUN mode -- no writes will be made to Supabase." : "Running in MIGRATE mode -- writes ARE enabled.");
    const results: TableResult[] = [];
    for (const spec of tablesToRun) {
      log(`Processing "${spec.table}"...`);
      const result = await migrateOneTable(pool, sqliteDb, spec, {
        write: opts.mode === "migrate",
        batchSize: opts.batchSize,
      });
      results.push(result);
      log(
        `  sqlite=${result.sqliteCount} pg_before=${result.pgCountBefore} toInsert=${result.toInsert} ` +
          `identicalSkipped=${result.identicalSkipped} conflicts=${result.conflicts.length}` +
          (opts.mode === "migrate" ? ` actuallyInserted=${result.actuallyInserted}` : "")
      );
      if (result.legacyMigratedRowCount != null) {
        log(
          `  [info] source dataset_records contains ${result.legacyMigratedRowCount} rows already derived from ` +
            `sales_line_items by the app's own boot-time migrateLegacySalesLineItems() (importBatchId LIKE 'legacy-%'). ` +
            `These are copied as-is; this tool does not re-run that derivation.`
        );
      }
      if (result.conflicts.length > 0) {
        log(`  [CONFLICT] ${result.conflicts.length} row(s) in "${spec.table}" already exist in Supabase with DIFFERENT content and were NOT touched:`);
        for (const c of result.conflicts.slice(0, 20)) {
          log(`    - pk=${c.pk}: ${c.reason}${c.differingColumns ? ` (columns: ${c.differingColumns.join(", ")})` : ""}`);
        }
        if (result.conflicts.length > 20) log(`    ... and ${result.conflicts.length - 20} more.`);
      }
    }

    printSummary(results, opts.mode);

    const anyConflicts = results.some((r) => r.conflicts.length > 0);
    if (opts.mode === "dry-run" && anyConflicts) {
      log("DRY-RUN found conflicts that would block a clean migration. See CONFLICT lines above. Exiting with code 2.");
      process.exitCode = 2;
    } else if (opts.mode === "migrate" && anyConflicts) {
      log("MIGRATE completed but some rows were left untouched due to conflicts. Review them before re-running. Exiting with code 1.");
      process.exitCode = 1;
    }
  } finally {
    sqliteDb.close();
    await pool.end();
  }
}

async function runVerify(pool: Pool, sqliteDb: BetterSqlite3Database, tables: TableSpec[]): Promise<void> {
  log("Running in VERIFY mode -- read-only on both sides.");
  const rows: string[][] = [];
  let anyMismatch = false;

  for (const spec of tables) {
    const r = await verifyOneTable(pool, sqliteDb, spec);
    const match = r.sqliteCount === r.pgCount && r.missingInPg.length === 0 && r.extraInPg.length === 0;
    if (!match) anyMismatch = true;
    rows.push([spec.table, String(r.sqliteCount), String(r.pgCount), match ? "OK" : "MISMATCH"]);

    if (r.missingInPg.length > 0) {
      log(`  [MISSING] "${spec.table}": ${r.missingInPg.length} id(s) in SQLite not found in Supabase.`);
      log(`    sample: ${r.missingInPg.slice(0, 20).join(", ")}${r.missingInPg.length > 20 ? ", ..." : ""}`);
    }
    if (r.extraInPg.length > 0) {
      log(`  [EXTRA] "${spec.table}": ${r.extraInPg.length} id(s) in Supabase not present in SQLite source.`);
      log(`    sample: ${r.extraInPg.slice(0, 20).join(", ")}${r.extraInPg.length > 20 ? ", ..." : ""}`);
    }
    for (const extra of r.extras) {
      const flag = extra.sqlite !== extra.pg ? "  <-- mismatch" : "";
      log(`  [detail] ${extra.label}: sqlite=${extra.sqlite} supabase=${extra.pg}${flag}`);
    }
  }

  log("");
  printTable(["TABLE", "SQLITE", "SUPABASE", "MATCH?"], rows);

  process.exitCode = anyMismatch ? 1 : 0;
  log(anyMismatch ? "VERIFY found mismatches -- see details above." : "VERIFY passed: SQLite and Supabase agree on every table.");
}

function printSummary(results: TableResult[], mode: Mode): void {
  log("");
  log("=".repeat(78));
  log("MIGRATION REPORT");
  log("=".repeat(78));
  const headers =
    mode === "migrate"
      ? ["TABLE", "SQLITE", "SUPABASE", "TO INSERT", "INSERTED", "IDENTICAL", "CONFLICTS"]
      : ["TABLE", "SQLITE", "SUPABASE", "TO INSERT", "IDENTICAL", "CONFLICTS"];
  const rows = results.map((r) =>
    mode === "migrate"
      ? [r.table, String(r.sqliteCount), String(r.pgCountBefore), String(r.toInsert), String(r.actuallyInserted), String(r.identicalSkipped), String(r.conflicts.length)]
      : [r.table, String(r.sqliteCount), String(r.pgCountBefore), String(r.toInsert), String(r.identicalSkipped), String(r.conflicts.length)]
  );
  printTable(headers, rows);
}

/**
 * TLS is verified by default (Supabase's Postgres endpoints use publicly-
 * trusted certificates, so there is no reason to weaken verification against
 * them). `sslmode=disable` in the URL turns SSL off entirely (e.g. a local
 * plain-TCP Postgres for testing this script against a throwaway schema).
 * PGSSL_ALLOW_SELF_SIGNED=true is an explicit, separately-documented escape
 * hatch for testing against a local/self-signed Postgres only -- it must
 * never be set when DATABASE_URL points at Supabase.
 */
function resolveSsl(databaseUrl: string): boolean | { rejectUnauthorized: boolean } {
  if (databaseUrl.includes("sslmode=disable")) return false;
  if (process.env.PGSSL_ALLOW_SELF_SIGNED === "true") {
    return { rejectUnauthorized: false };
  }
  return { rejectUnauthorized: true };
}

function redactConnectionString(url: string): string {
  try {
    const u = new URL(url);
    if (u.password) u.password = "****";
    if (u.username) u.username = u.username ? "****" : u.username;
    return u.toString();
  } catch {
    return "(unparseable connection string, not logged)";
  }
}

main()
  .then(() => {
    if ((process.exitCode ?? 0) !== 0) {
      log(`Exiting with code ${process.exitCode}.`);
    }
  })
  .catch((err) => {
    if (err instanceof UsageError) {
      log(`Usage error: ${err.message}`);
    } else {
      log(`FATAL: ${err instanceof Error ? err.stack ?? err.message : String(err)}`);
    }
    process.exitCode = 1;
  });
