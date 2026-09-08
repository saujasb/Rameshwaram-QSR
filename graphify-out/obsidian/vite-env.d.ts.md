---
source_file: "client/src/vite-env.d.ts"
type: "code"
community: "Vite Env Types"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Vite_Env_Types
---

# vite-env.d.ts

## Connections
- [[ImportMeta]] - `contains` [EXTRACTED]
- [[ImportMetaEnv]] - `contains` [EXTRACTED]

## Source
**Full file:** `client/src/vite-env.d.ts`
```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

#graphify/code #graphify/EXTRACTED #community/Vite_Env_Types