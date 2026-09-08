---
source_file: "client/src/main.tsx"
type: "code"
community: "App Shell & Bootstrap"
location: "L10"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/App_Shell__Bootstrap
---

# queryClient

## Connections
- [[main.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/main.tsx` **(starting line 10):**
```tsx
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 10_000, retry: 1 } },
});
```

#graphify/code #graphify/EXTRACTED #community/App_Shell__Bootstrap