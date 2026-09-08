---
source_file: "client/src/App.tsx"
type: "code"
community: "App Shell & Bootstrap"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/App_Shell__Bootstrap
---

# App.tsx

## Connections
- [[App()]] - `contains` [EXTRACTED]
- [[AppShell()]] - `imports` [EXTRACTED]
- [[AppShell.tsx]] - `imports_from` [EXTRACTED]
- [[flatNavItems]] - `imports` [EXTRACTED]
- [[main.tsx]] - `imports_from` [EXTRACTED]
- [[routes.tsx]] - `imports_from` [EXTRACTED]

## Source
**Full file:** `client/src/App.tsx`
```tsx
import { Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { flatNavItems } from "./routes";

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