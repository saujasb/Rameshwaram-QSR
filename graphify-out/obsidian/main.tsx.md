---
source_file: "client/src/main.tsx"
type: "code"
community: "App Shell & Bootstrap"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/App_Shell__Bootstrap
---

# main.tsx

## Connections
- [[App()]] - `imports` [EXTRACTED]
- [[App.tsx]] - `imports_from` [EXTRACTED]
- [[queryClient]] - `contains` [EXTRACTED]

## Source
**Full file:** `client/src/main.tsx`
```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/layout.css";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 10_000, retry: 1 } },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
```

#graphify/code #graphify/EXTRACTED #community/App_Shell__Bootstrap