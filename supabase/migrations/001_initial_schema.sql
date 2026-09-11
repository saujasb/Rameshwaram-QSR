-- ============================================================================
-- 001_initial_schema.sql
--
-- Stage 1 of the Render/Netlify/SQLite -> Vercel/Supabase migration.
--
-- Purpose: create the Postgres schema that mirrors, table-for-table and
-- column-for-column, the SQLite schema currently produced at runtime by:
--   - server/src/shared/repository.ts        (ensureTable, generic JSON tables)
--   - server/src/entities/sales/db.ts        (ensureSalesTables)
--   - server/src/entities/datasets/db.ts     (ensureDatasetTables)
--   - server/src/entities/provider-orders/db.ts (ensureProviderOrderTables)
--
-- Scope of this file: SCHEMA ONLY.
--   - No data is copied or seeded here (production data migration is a
--     separate, later step that reads the live Render disk).
--   - No application code is changed by this file.
--   - No destructive statements (no DROP TABLE / DROP DATABASE / TRUNCATE).
--   - Statements are written to be idempotent (CREATE TABLE IF NOT EXISTS /
--     CREATE INDEX IF NOT EXISTS) so this file can be re-run safely.
--
-- Column-naming note: every camelCase column name from the SQLite DDL is
-- preserved exactly and double-quoted here. Postgres folds unquoted
-- identifiers to lowercase, so `createdAt` would silently become `createdat`
-- without quoting -- that would break a later 1:1 code port. All camelCase
-- identifiers are quoted for this reason; lowercase, no-case-ambiguity
-- identifiers (id, key, value, status, provider, ok, error, ...) are left
-- unquoted, matching normal Postgres style, since folding does not affect them.
--
-- Type-translation notes (see "ASSUMPTIONS" at the bottom of this file for
-- the full reasoning):
--   - SQLite TEXT                -> Postgres TEXT
--   - SQLite INTEGER (counts)    -> Postgres INTEGER
--   - SQLite REAL                -> Postgres DOUBLE PRECISION
--   - SQLite INTEGER used as a boolean flag (0/1) -> kept as Postgres INTEGER,
--     NOT converted to native boolean. The application currently writes
--     literal 1/0 and reads with JS `Boolean(x)`; converting to a native
--     Postgres boolean column now, before the repository code is rewritten,
--     would silently break inserts (Postgres does not implicitly cast
--     integer 1/0 to boolean) for no schema benefit at this stage. This is a
--     candidate to revisit once the repository layer itself is rewritten for
--     Postgres (Stage 2+), not part of this schema-only migration.
--   - Columns whose SQLite value is an already-JSON.stringify'd string
--     (every column ending in `...Json`) are kept as TEXT, not JSONB. The
--     application currently does `JSON.parse(row.xJson)` on read and
--     `JSON.stringify(...)` on write; a JSONB column would make node-postgres
--     return an already-parsed object, breaking that contract. This is a
--     candidate for a real JSONB column in a later stage, once the
--     repository code that reads/writes it is rewritten in the same change.
--   - Every date/time value that SQLite stored as a TEXT ISO-8601 string
--     (createdAt/updatedAt/receivedAt/providerCreatedAt/businessDate/etc.)
--     in the three CUSTOM-SQL tables (sales_*, dataset_*, provider_*) is kept
--     as TEXT here, matching the literal SQLite DDL. Only the four generic
--     JSON-blob tables' createdAt/updatedAt columns use TIMESTAMPTZ, per the
--     explicit schema spec for those tables. See ASSUMPTIONS for why this
--     split exists.
-- ============================================================================


-- ============================================================================
-- SECTION 1 -- Generic JSON-blob tables
--
-- Shape mirrors server/src/shared/repository.ts's ensureTable(): every
-- record is stored whole as JSON, with id/createdAt/updatedAt broken out as
-- real columns for ordering and lookup. `json` uses JSONB (not the plain
-- TEXT the SQLite version used) per the explicit Stage 1 spec, since here the
-- repository rewrite that must accompany this (Stage 2) is already known to
-- naturally do `JSON.stringify`/`JSON.parse` at the boundary either way, and
-- JSONB is the correct native Postgres representation for "store this JS
-- object" with no additional query-shape requirements.
--
-- IMPORTANT: three of these tables use a real SQL table name that differs
-- from their module/directory name in the codebase. Table names below are
-- the actual literal strings passed to createRepository(...), verified
-- against each entity's repository.ts:
--   - "inventory"           module -> actual table "inventory_items"
--   - "maintenance"         module -> actual table "maintenance_issues"
--   - "orders"              module -> actual table "manual_orders"
-- All other generic tables use their module name unchanged.
-- ============================================================================

CREATE TABLE IF NOT EXISTS wastage (
  id          TEXT PRIMARY KEY,
  "json"      JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
  id          TEXT PRIMARY KEY,
  "json"      JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL
);

-- module: inventory
CREATE TABLE IF NOT EXISTS inventory_items (
  id          TEXT PRIMARY KEY,
  "json"      JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL
);

-- module: inventory-movements
CREATE TABLE IF NOT EXISTS inventory_movements (
  id          TEXT PRIMARY KEY,
  "json"      JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS suppliers (
  id          TEXT PRIMARY KEY,
  "json"      JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS purchases (
  id          TEXT PRIMARY KEY,
  "json"      JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL
);

-- module: maintenance
CREATE TABLE IF NOT EXISTS maintenance_issues (
  id          TEXT PRIMARY KEY,
  "json"      JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS complaints (
  id          TEXT PRIMARY KEY,
  "json"      JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS staff (
  id          TEXT PRIMARY KEY,
  "json"      JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS attendance (
  id          TEXT PRIMARY KEY,
  "json"      JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS expenses (
  id          TEXT PRIMARY KEY,
  "json"      JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL
);

-- module: orders (manual order entries -- distinct from provider_orders below)
CREATE TABLE IF NOT EXISTS manual_orders (
  id          TEXT PRIMARY KEY,
  "json"      JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL
);


-- ============================================================================
-- SECTION 2 -- Sales tables
--
-- Mirrors server/src/entities/sales/db.ts ensureSalesTables(). Note that in
-- the current application, getSalesSummary()/listLineItems() have been
-- re-pointed to read from dataset_records (Section 3) instead of
-- sales_line_items; sales_line_items and sales_import_batches remain the
-- tables actually written to by the sales import pipeline and are preserved
-- here unchanged, including the legacy-migration relationship described in
-- Section 3's comments.
-- ============================================================================

CREATE TABLE IF NOT EXISTS sales_import_batches (
  id                          TEXT PRIMARY KEY,
  "fileName"                  TEXT NOT NULL,
  channel                     TEXT NOT NULL,
  "businessDate"               TEXT NOT NULL,
  "recordsFound"               INTEGER NOT NULL,
  "recordsInserted"            INTEGER NOT NULL,
  "recordsUpdated"             INTEGER NOT NULL,
  "duplicatesSkipped"          INTEGER NOT NULL,
  "parsingErrorsJson"          TEXT NOT NULL,
  "validationStatus"           TEXT NOT NULL,
  "validationExpectedQuantity" DOUBLE PRECISION,
  "validationExpectedAmount"   DOUBLE PRECISION,
  "validationActualQuantity"   DOUBLE PRECISION NOT NULL,
  "validationActualAmount"     DOUBLE PRECISION NOT NULL,
  "validationNotesJson"        TEXT NOT NULL,
  -- boolean flag kept as INTEGER (0/1) -- see type-translation note at top of file
  "hasHourlyData"              INTEGER NOT NULL DEFAULT 0,
  "createdAt"                  TEXT NOT NULL,
  "updatedAt"                  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sales_import_batches_business_date
  ON sales_import_batches ("businessDate");

CREATE TABLE IF NOT EXISTS sales_line_items (
  id                     TEXT PRIMARY KEY,
  "importBatchId"        TEXT NOT NULL,
  channel                TEXT NOT NULL,
  category               TEXT NOT NULL,
  "itemName"             TEXT NOT NULL,
  "itemNameKey"          TEXT NOT NULL,
  quantity               DOUBLE PRECISION NOT NULL,
  amount                 DOUBLE PRECISION NOT NULL,
  "calendarDate"         TEXT NOT NULL,
  "businessDate"         TEXT NOT NULL,
  "businessDayStart"     TEXT NOT NULL,
  "businessDayEnd"       TEXT NOT NULL,
  "transactionTimestamp" TEXT,
  "transactionTime"      TEXT,
  fingerprint            TEXT NOT NULL UNIQUE,
  "createdAt"            TEXT NOT NULL,
  "updatedAt"            TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sales_line_items_business_date
  ON sales_line_items ("businessDate");

CREATE INDEX IF NOT EXISTS idx_sales_line_items_import_batch
  ON sales_line_items ("importBatchId");

-- Single-row-per-key settings table (currently just the daily sales target).
CREATE TABLE IF NOT EXISTS sales_settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,
  "updatedAt" TEXT NOT NULL
);


-- ============================================================================
-- SECTION 3 -- Unified dataset tables
--
-- Mirrors server/src/entities/datasets/db.ts ensureDatasetTables(). This is
-- the real analytics backbone: dataset_records holds every imported
-- sales/production/wastage row from any source (PDF or Excel), and
-- dataset_import_batches tracks each import run.
--
-- NOTE ON THE LEGACY MIGRATION: the SQLite code runs a one-time,
-- idempotency-checked copy of rows from sales_line_items into dataset_records
-- on every process boot (migrateLegacySalesLineItems() in db.ts). That is a
-- DATA migration, not a schema migration, and is intentionally NOT
-- reproduced here -- it belongs in the separate data-migration step that
-- copies the live Render SQLite data into Supabase, run exactly once, not as
-- code that re-runs on every Postgres connection/cold start.
-- ============================================================================

CREATE TABLE IF NOT EXISTS dataset_records (
  id                     TEXT PRIMARY KEY,
  "datasetType"          TEXT NOT NULL,
  "rawTimestamp"         TEXT,
  "transactionDate"      TEXT,
  "businessDate"         TEXT NOT NULL,
  "businessDayStartHour" INTEGER NOT NULL,
  hour                   INTEGER,
  shift                  TEXT,
  product                TEXT NOT NULL,
  "productKey"           TEXT NOT NULL,
  category               TEXT,
  outlet                 TEXT,
  channel                TEXT,
  quantity               DOUBLE PRECISION NOT NULL,
  "salesValue"           DOUBLE PRECISION,
  reason                 TEXT,
  "importBatchId"        TEXT NOT NULL,
  "sourceFile"           TEXT NOT NULL,
  "sourceType"           TEXT NOT NULL,
  "sourceSheet"          TEXT,
  "sourcePage"           INTEGER,
  "sourceRow"            INTEGER,
  fingerprint            TEXT NOT NULL UNIQUE,
  "flagsJson"            TEXT NOT NULL,
  "createdAt"            TEXT NOT NULL,
  "updatedAt"            TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_dr_business_date
  ON dataset_records ("businessDate");

CREATE INDEX IF NOT EXISTS idx_dr_type_date
  ON dataset_records ("datasetType", "businessDate");

CREATE INDEX IF NOT EXISTS idx_dr_product
  ON dataset_records ("productKey");

CREATE INDEX IF NOT EXISTS idx_dr_batch
  ON dataset_records ("importBatchId");

CREATE TABLE IF NOT EXISTS dataset_import_batches (
  id                     TEXT PRIMARY KEY,
  "fileName"             TEXT NOT NULL,
  "fileSizeBytes"        INTEGER NOT NULL,
  "sourceType"           TEXT NOT NULL,
  "fileHash"             TEXT NOT NULL,
  "datasetTypesJson"     TEXT NOT NULL,
  status                 TEXT NOT NULL,
  "businessDateFrom"     TEXT,
  "businessDateTo"       TEXT,
  "recordsFound"         INTEGER NOT NULL,
  "recordsInserted"      INTEGER NOT NULL,
  "recordsUpdated"       INTEGER NOT NULL,
  "duplicatesSkipped"    INTEGER NOT NULL,
  "recordsRejected"      INTEGER NOT NULL,
  "qualityJson"          TEXT NOT NULL,
  "sheetsJson"           TEXT NOT NULL,
  "rejectedRowsJson"     TEXT NOT NULL,
  "reconciliationJson"   TEXT,
  "businessDayStartHour" INTEGER NOT NULL,
  "createdAt"            TEXT NOT NULL
  -- No "updatedAt" column: the SQLite DDL for dataset_import_batches does not
  -- define one (batches are write-once), matching insertImportBatch() in
  -- server/src/entities/datasets/repository.ts, which never sets one.
);

CREATE INDEX IF NOT EXISTS idx_dib_created
  ON dataset_import_batches ("createdAt" DESC);

-- Single-row-per-key settings table (currently just the business-day-start
-- hour). Distinct from sales_settings above -- both exist independently in
-- the source code and are preserved as separate tables here.
CREATE TABLE IF NOT EXISTS app_settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,
  "updatedAt" TEXT NOT NULL
);


-- ============================================================================
-- SECTION 4 -- Provider orders (Petpooja / GoSelfServe integration)
--
-- Mirrors server/src/entities/provider-orders/db.ts ensureProviderOrderTables()
-- exactly. This is the most externally-visible surface of the system
-- (inbound webhooks from two live providers) so schema fidelity here matters
-- most: every column, the UNIQUE constraint, and all three provider_orders
-- indexes plus the one provider_webhook_events index are preserved exactly.
-- ============================================================================

CREATE TABLE IF NOT EXISTS provider_orders (
  id                       TEXT PRIMARY KEY,
  provider                 TEXT NOT NULL,
  "providerOrderId"        TEXT NOT NULL,
  "providerInvoiceId"      TEXT NOT NULL,
  "restaurantId"           TEXT NOT NULL,
  "restaurantName"         TEXT NOT NULL,
  status                   TEXT NOT NULL,
  "orderType"              TEXT NOT NULL,
  "orderFrom"              TEXT NOT NULL,
  "orderFromLabel"         TEXT NOT NULL,
  "subOrderType"           TEXT NOT NULL,
  "paymentType"            TEXT NOT NULL,
  "tableNo"                TEXT NOT NULL,
  "noOfPersons"            INTEGER NOT NULL,
  "customerName"           TEXT NOT NULL,
  "customerPhone"          TEXT NOT NULL,
  "coreTotal"              DOUBLE PRECISION NOT NULL,
  "taxTotal"               DOUBLE PRECISION NOT NULL,
  "discountTotal"          DOUBLE PRECISION NOT NULL,
  "packagingCharge"        DOUBLE PRECISION NOT NULL,
  "serviceCharge"          DOUBLE PRECISION NOT NULL,
  "deliveryCharges"        DOUBLE PRECISION NOT NULL,
  "roundOff"               DOUBLE PRECISION NOT NULL,
  "totalAmount"            DOUBLE PRECISION NOT NULL,
  comment                  TEXT NOT NULL,
  biller                   TEXT NOT NULL,
  assignee                 TEXT NOT NULL,
  "tokenNo"                TEXT NOT NULL,
  "itemCount"              INTEGER NOT NULL,
  -- ...Json columns hold pre-serialized JSON strings (JSON.parse'd by the
  -- app on read) -- kept as TEXT, not JSONB. See type-translation note above.
  "itemsJson"              TEXT NOT NULL,
  "taxesJson"              TEXT NOT NULL,
  "discountsJson"          TEXT NOT NULL,
  "partPaymentsJson"       TEXT NOT NULL,
  "rawPayloadJson"         TEXT NOT NULL,
  "providerCreatedAt"      TEXT NOT NULL,
  "receivedAt"             TEXT NOT NULL,
  "goselfserveSyncStatus"  TEXT NOT NULL DEFAULT 'pending',
  "goselfserveSyncError"   TEXT,
  "goselfserveSyncedAt"    TEXT,
  "createdAt"              TEXT NOT NULL,
  "updatedAt"              TEXT NOT NULL,
  CONSTRAINT provider_orders_provider_providerorderid_key UNIQUE (provider, "providerOrderId")
);

CREATE INDEX IF NOT EXISTS idx_provider_orders_status
  ON provider_orders (status);

CREATE INDEX IF NOT EXISTS idx_provider_orders_received_at
  ON provider_orders ("receivedAt");

CREATE INDEX IF NOT EXISTS idx_provider_orders_provider
  ON provider_orders (provider);

-- Audit trail of every inbound webhook call, independent of whether it
-- parsed into a provider_orders row -- lets the team see rejected/duplicate/
-- error deliveries without needing the provider to resend anything.
CREATE TABLE IF NOT EXISTS provider_webhook_events (
  id                TEXT PRIMARY KEY,
  provider          TEXT NOT NULL,
  "receivedAt"      TEXT NOT NULL,
  -- boolean flags kept as INTEGER (0/1) -- see type-translation note at top of file
  ok                INTEGER NOT NULL,
  "httpStatus"      INTEGER NOT NULL,
  "providerOrderId" TEXT,
  duplicate         INTEGER NOT NULL DEFAULT 0,
  error             TEXT,
  "bodyJson"        TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_provider_webhook_events_received_at
  ON provider_webhook_events ("receivedAt");


-- ============================================================================
-- SECTION 5 -- Row Level Security (lock-down default, no policies yet)
--
-- Supabase exposes every table in the `public` schema over PostgREST to the
-- `anon`/`authenticated` API roles by default. None of these tables have any
-- policies defined yet because Stage 1 is schema-only and no access model
-- (auth, tenancy, roles) has been designed for this app. Enabling RLS with
-- zero policies makes every table deny-all for the PostgREST API roles --
-- i.e. the safe default -- without blocking anything: the Express backend in
-- later stages is expected to connect with the Postgres service-role
-- connection string (or the `service_role` key), which bypasses RLS
-- entirely, exactly like better-sqlite3 has unrestricted access to app.db
-- today. This statement is additive/idempotent (ALTER ... ENABLE ROW LEVEL
-- SECURITY is a no-op if already enabled) and does not affect the
-- service-role/direct-connection access path used by the current
-- application design.
-- ============================================================================

ALTER TABLE wastage ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE manual_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_import_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE dataset_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE dataset_import_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_webhook_events ENABLE ROW LEVEL SECURITY;


-- ============================================================================
-- ASSUMPTIONS -- see the chat response accompanying this migration for the
-- full write-up. Summary of every judgment call made in this file:
--
-- 1. Real table names vs. module names: "inventory" -> inventory_items,
--    "maintenance" -> maintenance_issues, "orders" -> manual_orders. Verified
--    directly against each entity's repository.ts createRepository(...) call
--    rather than assumed from directory names.
-- 2. INTEGER boolean/flag columns (hasHourlyData, ok, duplicate) kept as
--    INTEGER, not converted to native Postgres boolean, to avoid an implicit
--    insert-time type break before the repository code is rewritten.
-- 3. All "...Json" TEXT columns kept as TEXT, not JSONB, for the same reason
--    (the app's JSON.parse/JSON.stringify contract must move in the same
--    change as the column type, which is a Stage 2+ concern).
-- 4. Date/time columns kept as TEXT in the three custom-SQL table groups
--    (sales_*, dataset_*, provider_*), matching the literal SQLite DDL,
--    since businessDate in particular is compared with plain string
--    operators (>=, <=) throughout the existing repository code and an
--    early type change here is not needed for a schema-fidelity migration.
--    Only the four generic-table timestamp columns use TIMESTAMPTZ, which
--    was an explicit requirement for that table shape specifically.
-- 5. RLS is enabled (Section 5) with zero policies, i.e. deny-all for the
--    PostgREST anon/authenticated roles, since no auth/tenancy model exists
--    for this app yet. The backend is expected to connect with a
--    service-role/direct connection (bypassing RLS), matching today's
--    unrestricted better-sqlite3 access. Real policies are a Stage 2+
--    concern once an access model is decided.
-- 6. This migration deliberately DIVERGES from several generic Supabase/
--    Postgres schema best practices, on purpose, because requirement #1 of
--    this Stage 1 task ("preserve existing table/column names and types
--    wherever possible so the later code migration is mechanical") takes
--    priority over general schema-design guidance for this specific
--    fidelity-focused migration:
--      - camelCase, double-quoted identifiers are used instead of the
--        generally-recommended lowercase snake_case, because the existing
--        repository code references these exact JS-object/column names.
--      - TEXT primary keys (app-generated via randomUUID()) are kept instead
--        of bigint identity/UUIDv7, since the application already generates
--        and depends on these IDs; changing PK strategy is a data-model
--        change, not a dialect translation.
--      - Monetary/quantity columns use DOUBLE PRECISION (an exact mirror of
--        SQLite's REAL, both IEEE-754 float8) rather than NUMERIC, because
--        NUMERIC's exact decimal arithmetic can produce different SUM()
--        results than the current SQLite-float-based aggregates -- a
--        real behavioural change this migration is explicitly required not
--        to introduce. NUMERIC for money is a legitimate improvement to
--        consider once the repository/aggregation code is being rewritten
--        anyway (Stage 2+), not as a silent side effect of a schema port.
--    These are flagged here explicitly so the tradeoff is a visible,
--    reversible decision rather than an silent deviation.
-- ============================================================================
