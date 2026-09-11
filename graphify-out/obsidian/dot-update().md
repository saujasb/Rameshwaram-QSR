---
source_file: "server/src/shared/repository.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L9"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# .update()

## Connections
- [[BaseRecord]] - `references` [EXTRACTED]
- [[Repository]] - `method` [EXTRACTED]

## Source
**From** `server/src/shared/repository.ts` **(starting line 9):**
```typescript
  update(id: string, patch: Partial<Omit<T, keyof BaseRecord>>): T | undefined;
  remove(id: string): boolean;
}

export function createRepository<T extends BaseRecord>(tableName: string): Repository<T> {
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend