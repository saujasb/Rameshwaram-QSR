---
source_file: "client/src/lib/api/system.ts"
type: "code"
community: "App Shell & Bootstrap"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/App_Shell__Bootstrap
---

# system.ts

## Connections
- [[AppShell.tsx]] - `imports_from` [EXTRACTED]
- [[apiclient.ts]] - `imports_from` [EXTRACTED]
- [[apiGet()]] - `imports` [EXTRACTED]
- [[useHealthCheck()]] - `contains` [EXTRACTED]

## Source
**Full file:** `client/src/lib/api/system.ts`
```typescript
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "./client";

/** Cheap connectivity probe for the "● Live" indicator in the app header. */
export function useHealthCheck() {
  return useQuery({
    queryKey: ["health"],
    queryFn: () => apiGet<{ ok: boolean }>("/health"),
    refetchInterval: 30000,
    retry: 1,
    staleTime: 15000,
  });
}
```

#graphify/code #graphify/EXTRACTED #community/App_Shell__Bootstrap