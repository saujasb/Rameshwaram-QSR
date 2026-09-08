---
source_file: "client/src/lib/api/client.ts"
type: "code"
community: "Ramesh Chat Widget"
location: "L5"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_Chat_Widget
---

# handle()

## Connections
- [[apiclient.ts]] - `contains` [EXTRACTED]
- [[apiDelete()]] - `calls` [EXTRACTED]
- [[apiGet()]] - `calls` [EXTRACTED]
- [[apiPost()]] - `calls` [EXTRACTED]
- [[apiPut()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/client.ts` **(starting line 5):**
```typescript
async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error ?? `Request failed with ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_Chat_Widget