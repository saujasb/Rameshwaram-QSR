// Stage 3: table creation is no longer performed by application code.
//
// provider_orders and provider_webhook_events (plus their indexes and the
// UNIQUE(provider, providerOrderId) constraint) are now owned entirely by
// supabase/migrations/001_initial_schema.sql. This file previously exported
// ensureProviderOrderTables(), which ran `CREATE TABLE IF NOT EXISTS ...`
// against the SQLite file on every boot; that call site
// (server/src/entities/provider-orders/repository.ts) has been removed
// along with it.
//
// Kept as an (intentionally empty) module rather than deleted so its
// removal is visible in the file tree and its git history stays attached to
// this path.
export {};
