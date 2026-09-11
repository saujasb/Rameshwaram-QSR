---
source_file: "server/src/entities/datasets/importPipeline.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L18"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# ImportRequest

## Connections
- [[DatasetType]] - `references` [EXTRACTED]
- [[datasetsimportPipeline.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/importPipeline.ts` **(starting line 18):**
```typescript
export interface ImportRequest {
  fileName: string;
  buffer: Buffer;
  /** Required for sources that print no date (Kiosk PDFs). */
  businessDate?: string;
  /** Per-sheet dataset type corrections from the import preview. */
  datasetOverrides?: Record<string, DatasetType>;
  /** Set true to import a byte-identical file again on purpose. */
  allowDuplicateFile?: boolean;
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline