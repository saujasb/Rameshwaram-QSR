---
source_file: "client/vite.config.ts"
type: "code"
community: "Vite Config"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Vite_Config
---

# vite.config.ts

## Source
**Full file:** `client/vite.config.ts`
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@shared": fileURLToPath(new URL("../shared-types", import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:4300",
        changeOrigin: true,
      },
    },
  },
});
```

#graphify/code #graphify/EXTRACTED #community/Vite_Config