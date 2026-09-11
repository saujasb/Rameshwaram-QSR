---
source_file: "client/src/App.tsx"
type: "code"
community: "App Shell & Bootstrap"
location: "L5"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/App_Shell__Bootstrap
---

# App()

## Connections
- [[App.tsx]] - `contains` [EXTRACTED]
- [[main.tsx]] - `imports` [EXTRACTED]

## Source
**From** `client/src/App.tsx` **(starting line 5):**
```tsx
export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        {flatNavItems.map((item) => (
          <Route key={item.path} path={item.path} element={item.element} />
        ))}
      </Route>
    </Routes>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/App_Shell__Bootstrap