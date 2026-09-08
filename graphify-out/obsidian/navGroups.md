---
source_file: "client/src/routes.tsx"
type: "code"
community: "App Shell & Bootstrap"
location: "L40"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/App_Shell__Bootstrap
---

# navGroups

## Connections
- [[AppShell.tsx]] - `imports` [EXTRACTED]
- [[routes.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/routes.tsx` **(starting line 40):**
```tsx
export const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { path: "/", label: "Dashboard", element: <DashboardPage />, icon: "⌂" },
      { path: "/intelligence", label: "Intelligence", element: <IntelligencePage />, icon: "◈" },
      { path: "/action-center", label: "Action Center", element: <ActionCenterPage />, icon: "⚑" },
    ],
  },
```

#graphify/code #graphify/EXTRACTED #community/App_Shell__Bootstrap