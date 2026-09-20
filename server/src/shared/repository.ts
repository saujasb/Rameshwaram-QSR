import { randomUUID } from "node:crypto";
import { getSupabase } from "../db/client.js";
import type { BaseRecord } from "../../../shared-types/entities.js";

export interface Repository<T extends BaseRecord> {
  list(): Promise<T[]>;
  get(id: string): Promise<T | undefined>;
  create(data: Omit<T, keyof BaseRecord>): Promise<T>;
  update(id: string, patch: Partial<Omit<T, keyof BaseRecord>>): Promise<T | undefined>;
  remove(id: string): Promise<boolean>;
}

/**
 * Every generic-CRUD table is shaped {id, json (jsonb), createdAt, updatedAt}
 * -- the full record lives in `json`, and createdAt/updatedAt/id are mirrored
 * into real columns so ORDER BY / WHERE id = ? stay simple index lookups
 * rather than jsonb comparisons. This matches the schema already provisioned
 * in Supabase (verified via information_schema during the Phase 1 audit) --
 * no DDL runs here, unlike the old SQLite ensureTable() on every import.
 */
export function createRepository<T extends BaseRecord>(tableName: string): Repository<T> {
  return {
    async list() {
      const { data, error } = await getSupabase()
        .from(tableName)
        .select("json")
        .order("createdAt", { ascending: false });
      if (error) throw new Error(`[${tableName}] list failed: ${error.message}`);
      return (data ?? []).map((row: { json: T }) => row.json);
    },

    async get(id) {
      const { data, error } = await getSupabase().from(tableName).select("json").eq("id", id).maybeSingle();
      if (error) throw new Error(`[${tableName}] get failed: ${error.message}`);
      return (data as { json: T } | null)?.json ?? undefined;
    },

    async create(data) {
      const now = new Date().toISOString();
      const record = { ...data, id: randomUUID(), createdAt: now, updatedAt: now } as T;
      const { error } = await getSupabase()
        .from(tableName)
        .insert({ id: record.id, json: record, createdAt: record.createdAt, updatedAt: record.updatedAt });
      if (error) throw new Error(`[${tableName}] create failed: ${error.message}`);
      return record;
    },

    async update(id, patch) {
      const { data: existingRow, error: getError } = await getSupabase()
        .from(tableName)
        .select("json")
        .eq("id", id)
        .maybeSingle();
      if (getError) throw new Error(`[${tableName}] update (read) failed: ${getError.message}`);
      if (!existingRow) return undefined;

      const existing = (existingRow as { json: T }).json;
      const now = new Date().toISOString();
      const updated = { ...existing, ...patch, id, updatedAt: now } as T;
      const { error } = await getSupabase().from(tableName).update({ json: updated, updatedAt: now }).eq("id", id);
      if (error) throw new Error(`[${tableName}] update (write) failed: ${error.message}`);
      return updated;
    },

    async remove(id) {
      const { data, error } = await getSupabase().from(tableName).delete().eq("id", id).select("id");
      if (error) throw new Error(`[${tableName}] remove failed: ${error.message}`);
      return (data ?? []).length > 0;
    },
  };
}
