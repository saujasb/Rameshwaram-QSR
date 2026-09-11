---
source_file: "client/src/lib/api/client.ts"
type: "code"
community: "Ramesh Chat Widget"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_Chat_Widget
---

# api/client.ts

## Connections
- [[GlobalSearch.tsx]] - `imports_from` [EXTRACTED]
- [[InventoryDetailModal.tsx]] - `imports_from` [EXTRACTED]
- [[apiactionCenter.ts]] - `imports_from` [EXTRACTED]
- [[apianalytics.ts]] - `imports_from` [EXTRACTED]
- [[apidatasets.ts]] - `imports_from` [EXTRACTED]
- [[apiintelligence.ts]] - `imports_from` [EXTRACTED]
- [[apiproviderOrders.ts]] - `imports_from` [EXTRACTED]
- [[apiramesh.ts]] - `imports_from` [EXTRACTED]
- [[apisales.ts]] - `imports_from` [EXTRACTED]
- [[apiDelete()]] - `contains` [EXTRACTED]
- [[apiGet()]] - `contains` [EXTRACTED]
- [[apiPost()]] - `contains` [EXTRACTED]
- [[apiPut()]] - `contains` [EXTRACTED]
- [[createEntityHooks.ts]] - `imports_from` [EXTRACTED]
- [[handle()]] - `contains` [EXTRACTED]
- [[system.ts]] - `imports_from` [EXTRACTED]

## Source
**From** `client/src/lib/api/client.ts` **(starting line 1):**
```typescript
// In dev, Vite's proxy forwards "/api" to the local server (see vite.config.ts).
// In production, set VITE_API_BASE_URL to the deployed server's URL (e.g. https://your-service.onrender.com/api).
const BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

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