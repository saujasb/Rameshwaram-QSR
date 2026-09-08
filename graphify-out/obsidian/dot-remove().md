---
source_file: "server/src/shared/repository.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L10"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# .remove()

## Connections
- [[Repository]] - `method` [EXTRACTED]

## Source
**From** `server/src/shared/repository.ts` **(starting line 10):**
```typescript
  remove(id: string): boolean;
}

export function createRepository<T extends BaseRecord>(tableName: string): Repository<T> {
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend