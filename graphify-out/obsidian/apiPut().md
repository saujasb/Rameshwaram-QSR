---
source_file: "client/src/lib/api/client.ts"
type: "code"
community: "Ramesh Chat Widget"
location: "L26"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_Chat_Widget
---

# apiPut()

## Connections
- [[apiclient.ts]] - `contains` [EXTRACTED]
- [[apidatasets.ts]] - `imports` [EXTRACTED]
- [[apisales.ts]] - `imports` [EXTRACTED]
- [[createEntityHooks.ts]] - `imports` [EXTRACTED]
- [[handle()]] - `calls` [EXTRACTED]
- [[useSetBusinessDayStartHour()]] - `calls` [EXTRACTED]
- [[useSetSalesTarget()]] - `calls` [EXTRACTED]
- [[useUpdate()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/client.ts` **(starting line 26):**
```typescript
export function apiPut<T>(path: string, body: unknown): Promise<T> {
  return fetch(`${BASE}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then((res) => handle<T>(res));
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_Chat_Widget