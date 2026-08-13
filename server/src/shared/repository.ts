import { randomUUID } from "node:crypto";
import { db, ensureTable } from "../db/client.js";
import type { BaseRecord } from "../../../shared-types/entities.js";

export interface Repository<T extends BaseRecord> {
  list(): T[];
  get(id: string): T | undefined;
  create(data: Omit<T, keyof BaseRecord>): T;
  update(id: string, patch: Partial<Omit<T, keyof BaseRecord>>): T | undefined;
  remove(id: string): boolean;
}

export function createRepository<T extends BaseRecord>(tableName: string): Repository<T> {
  ensureTable(tableName);

  const listStmt = db.prepare(`SELECT json FROM ${tableName} ORDER BY createdAt DESC`);
  const getStmt = db.prepare(`SELECT json FROM ${tableName} WHERE id = ?`);
  const insertStmt = db.prepare(
    `INSERT INTO ${tableName} (id, json, createdAt, updatedAt) VALUES (?, ?, ?, ?)`
  );
  const updateStmt = db.prepare(
    `UPDATE ${tableName} SET json = ?, updatedAt = ? WHERE id = ?`
  );
  const deleteStmt = db.prepare(`DELETE FROM ${tableName} WHERE id = ?`);

  return {
    list() {
      return listStmt.all().map((row: any) => JSON.parse(row.json));
    },
    get(id) {
      const row = getStmt.get(id) as { json: string } | undefined;
      return row ? JSON.parse(row.json) : undefined;
    },
    create(data) {
      const now = new Date().toISOString();
      const record = { ...data, id: randomUUID(), createdAt: now, updatedAt: now } as T;
      insertStmt.run(record.id, JSON.stringify(record), record.createdAt, record.updatedAt);
      return record;
    },
    update(id, patch) {
      const row = getStmt.get(id) as { json: string } | undefined;
      if (!row) return undefined;
      const existing = JSON.parse(row.json);
      const now = new Date().toISOString();
      const updated = { ...existing, ...patch, id, updatedAt: now };
      updateStmt.run(JSON.stringify(updated), now, id);
      return updated;
    },
    remove(id) {
      return deleteStmt.run(id).changes > 0;
    },
  };
}
