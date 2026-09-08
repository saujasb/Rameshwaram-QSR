---
source_file: "client/src/lib/api/client.ts"
type: "code"
community: "Ramesh Chat Widget"
location: "L34"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_Chat_Widget
---

# apiDelete()

## Connections
- [[apiclient.ts]] - `contains` [EXTRACTED]
- [[apisales.ts]] - `imports` [EXTRACTED]
- [[createEntityHooks.ts]] - `imports` [EXTRACTED]
- [[handle()]] - `calls` [EXTRACTED]
- [[useDeleteImportBatch()]] - `calls` [EXTRACTED]
- [[useRemove()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/client.ts` **(starting line 34):**
```typescript
export function apiDelete(path: string): Promise<void> {
  return fetch(`${BASE}${path}`, { method: "DELETE" }).then((res) => handle<void>(res));
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_Chat_Widget