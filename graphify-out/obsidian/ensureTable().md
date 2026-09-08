---
source_file: "server/src/db/client.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L13"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# ensureTable()

## Connections
- [[createRepository()]] - `calls` [EXTRACTED]
- [[dbclient.ts]] - `contains` [EXTRACTED]
- [[sharedrepository.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/db/client.ts` **(starting line 13):**
```typescript
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