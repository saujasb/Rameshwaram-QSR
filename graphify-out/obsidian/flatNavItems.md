---
source_file: "client/src/routes.tsx"
type: "code"
community: "App Shell & Bootstrap"
location: "L114"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/App_Shell__Bootstrap
---

# flatNavItems

## Connections
- [[App.tsx]] - `imports` [EXTRACTED]
- [[routes.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/routes.tsx` **(starting line 114):**
```tsx
export const flatNavItems: NavItem[] = navGroups.flatMap((g) => g.items);
```

#graphify/code #graphify/EXTRACTED #community/App_Shell__Bootstrap