import { randomUUID } from "node:crypto";
import { query } from "../db/client.js";
import type { BaseRecord } from "../../../shared-types/entities.js";

export interface Repository<T extends BaseRecord> {
  list(): Promise<T[]>;
  get(id: string): Promise<T | undefined>;
  create(data: Omit<T, keyof BaseRecord>): Promise<T>;
  update(id: string, patch: Partial<Omit<T, keyof BaseRecord>>): Promise<T | undefined>;
  remove(id: string): Promise<boolean>;
}

const SAFE_TABLE_NAME = /^[A-Za-z_][A-Za-z0-9_]*$/;

/**
 * Generic JSON-blob repository backed by the 4-column
 * (id text primary key, "json" jsonb, "createdAt" timestamptz,
 * "updatedAt" timestamptz) table shape defined in
 * supabase/migrations/001_initial_schema.sql.
 *
 * `tableName` is always a hardcoded literal at the call site (see each
 * entity's own repository.ts, e.g. createRepository<WastageEntry>("wastage"))
 * -- never request/user input -- but is still validated here before being
 * interpolated into SQL, matching the identifier-safety discipline used
 * throughout the Stage 2 migration tooling.
 *
 * Stage 1 made "json" a real jsonb column (it was a plain TEXT blob under
 * SQLite). node-postgres serializes a plain JS object parameter to jsonb
 * automatically on write (see lib/utils.js's prepareValue/prepareObject:
 * any plain object becomes JSON.stringify(value)), and deserializes a jsonb
 * column straight back into a plain JS object on read via its default type
 * parser for OID 3802. There is therefore no manual JSON.stringify/
 * JSON.parse at this boundary anymore -- the public Repository behavior
 * (accepting/returning plain TypeScript objects, same field shapes) is
 * unchanged, only how it gets in and out of the database differs.
 */
export function createRepository<T extends BaseRecord>(tableName: string): Repository<T> {
  if (!SAFE_TABLE_NAME.test(tableName)) {
    throw new Error(`Unsafe table name passed to createRepository: ${tableName}`);
  }

  return {
    async list() {
      const { rows } = await query<{ json: T }>(`SELECT "json" FROM ${tableName} ORDER BY "createdAt" DESC`);
      return rows.map((row) => row.json);
    },

    async get(id) {
      const { rows } = await query<{ json: T }>(`SELECT "json" FROM ${tableName} WHERE id = $1`, [id]);
      return rows[0]?.json;
    },

    async create(data) {
      const now = new Date().toISOString();
      const record = { ...data, id: randomUUID(), createdAt: now, updatedAt: now } as T;
      await query(
        `INSERT INTO ${tableName} (id, "json", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4)`,
        [record.id, record, record.createdAt, record.updatedAt]
      );
      return record;
    },

    async update(id, patch) {
      const { rows } = await query<{ json: T }>(`SELECT "json" FROM ${tableName} WHERE id = $1`, [id]);
      const existing = rows[0]?.json;
      if (!existing) return undefined;
      const now = new Date().toISOString();
      const updated = { ...existing, ...patch, id, updatedAt: now } as T;
      await query(`UPDATE ${tableName} SET "json" = $1, "updatedAt" = $2 WHERE id = $3`, [updated, now, id]);
      return updated;
    },

    async remove(id) {
      const { rowCount } = await query(`DELETE FROM ${tableName} WHERE id = $1`, [id]);
      return rowCount > 0;
    },
  };
}
