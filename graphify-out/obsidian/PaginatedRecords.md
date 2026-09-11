---
source_file: "shared-types/datasets.ts"
type: "code"
community: "Data Explorer & Import UI"
location: "L186"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# PaginatedRecords

## Connections
- [[apidatasets.ts]] - `imports` [EXTRACTED]
- [[datasetsrepository.ts]] - `imports` [EXTRACTED]
- [[shared-typesdatasets.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/datasets.ts` **(starting line 186):**
```typescript
export interface PaginatedRecords {
  data: DatasetRecord[];
  pagination: { page: number; pageSize: number; totalItems: number; totalPages: number };
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI