---
source_file: "client/src/lib/api/client.ts"
type: "code"
community: "Ramesh Chat Widget"
location: "L18"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_Chat_Widget
---

# apiPost()

## Connections
- [[apiclient.ts]] - `contains` [EXTRACTED]
- [[apiramesh.ts]] - `imports` [EXTRACTED]
- [[createEntityHooks.ts]] - `imports` [EXTRACTED]
- [[handle()]] - `calls` [EXTRACTED]
- [[useAction()]] - `calls` [EXTRACTED]
- [[useAskRamesh()]] - `calls` [EXTRACTED]
- [[useCreate()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/client.ts` **(starting line 18):**
```typescript
export function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  }).then((res) => handle<T>(res));
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_Chat_Widget