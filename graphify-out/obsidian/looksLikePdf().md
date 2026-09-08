---
source_file: "server/src/entities/datasets/pdfAdapter.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L144"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# looksLikePdf()

## Connections
- [[datasetsimportPipeline.ts]] - `imports` [EXTRACTED]
- [[pdfAdapter.ts]] - `contains` [EXTRACTED]
- [[runImport()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/pdfAdapter.ts` **(starting line 144):**
```typescript
export function looksLikePdf(buffer: Buffer): boolean {
  return buffer.length > 5 && buffer.subarray(0, 5).toString("latin1") === "%PDF-";
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline