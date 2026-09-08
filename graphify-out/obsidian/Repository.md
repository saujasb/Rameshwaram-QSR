---
source_file: "server/src/shared/repository.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L5"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# Repository

## Connections
- [[dot-create()]] - `method` [EXTRACTED]
- [[dot-get()]] - `method` [EXTRACTED]
- [[dot-list()]] - `method` [EXTRACTED]
- [[dot-remove()]] - `method` [EXTRACTED]
- [[dot-update()]] - `method` [EXTRACTED]
- [[createCrudRouter.ts]] - `imports` [EXTRACTED]
- [[sharedrepository.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/shared/repository.ts` **(starting line 5):**
```typescript
export interface Repository<T extends BaseRecord> {
  list(): T[];
  get(id: string): T | undefined;
  create(data: Omit<T, keyof BaseRecord>): T;
  update(id: string, patch: Partial<Omit<T, keyof BaseRecord>>): T | undefined;
  remove(id: string): boolean;
}
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend