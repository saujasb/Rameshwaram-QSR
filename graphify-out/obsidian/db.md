---
source_file: "server/src/db/client.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L10"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# db

## Connections
- [[datasetsdb.ts]] - `imports` [EXTRACTED]
- [[datasetsrepository.ts]] - `imports` [EXTRACTED]
- [[dbclient.ts]] - `contains` [EXTRACTED]
- [[provider-ordersdb.ts]] - `imports` [EXTRACTED]
- [[provider-ordersrepository.ts]] - `imports` [EXTRACTED]
- [[salesdb.ts]] - `imports` [EXTRACTED]
- [[salesrepository.ts]] - `imports` [EXTRACTED]
- [[sharedrepository.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/db/client.ts` **(starting line 10):**
```typescript
export const db = new Database(join(dataDir, "app.db"));
db.pragma("journal_mode = WAL");

export function ensureTable(tableName: string): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id TEXT PRIMARY KEY,
      json TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);
}
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend