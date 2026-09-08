---
source_file: "server/src/shared/repository.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L13"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# createRepository()

## Connections
- [[attendancerepository.ts]] - `imports` [EXTRACTED]
- [[complaintsrepository.ts]] - `imports` [EXTRACTED]
- [[ensureTable()]] - `calls` [EXTRACTED]
- [[expensesrepository.ts]] - `imports` [EXTRACTED]
- [[inventory-movementsrepository.ts]] - `imports` [EXTRACTED]
- [[inventoryrepository.ts]] - `imports` [EXTRACTED]
- [[maintenancerepository.ts]] - `imports` [EXTRACTED]
- [[ordersrepository.ts]] - `imports` [EXTRACTED]
- [[purchasesrepository.ts]] - `imports` [EXTRACTED]
- [[sharedrepository.ts]] - `contains` [EXTRACTED]
- [[staffrepository.ts]] - `imports` [EXTRACTED]
- [[suppliersrepository.ts]] - `imports` [EXTRACTED]
- [[tasksrepository.ts]] - `imports` [EXTRACTED]
- [[wastagerepository.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/shared/repository.ts` **(starting line 13):**
```typescript
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
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend