// Stage 3: table creation is no longer performed by application code.
//
// sales_import_batches, sales_line_items and sales_settings are now owned
// entirely by supabase/migrations/001_initial_schema.sql -- the application
// must never create or alter schema at startup (or at all). This file
// previously exported ensureSalesTables(), which ran
// `CREATE TABLE IF NOT EXISTS ...` against the SQLite file on every boot;
// that call site (server/src/entities/sales/repository.ts) has been removed
// along with it.
//
// Kept as an (intentionally empty) module rather than deleted so its
// removal is visible in the file tree and its git history stays attached to
// this path.
export {};
