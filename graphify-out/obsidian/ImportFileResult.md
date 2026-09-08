---
source_file: "client/src/lib/api/datasets.ts"
type: "code"
community: "Data Explorer & Import UI"
location: "L77"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# ImportFileResult

## Connections
- [[ImportBatch]] - `references` [EXTRACTED]
- [[ImportCenterPage.tsx]] - `imports` [EXTRACTED]
- [[apidatasets.ts]] - `contains` [EXTRACTED]

## Source
**From** `client/src/lib/api/datasets.ts` **(starting line 77):**
```typescript
export interface ImportFileResult {
  fileName: string;
  ok: boolean;
  batch?: ImportBatch;
  error?: string;
  detail?: string;
  duplicateOf?: ImportBatch;
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI