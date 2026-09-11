---
source_file: "server/src/entities/datasets/excel.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L232"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# looksLikeSpreadsheet()

## Connections
- [[datasetsimportPipeline.ts]] - `imports` [EXTRACTED]
- [[excel.ts]] - `contains` [EXTRACTED]
- [[runImport()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/excel.ts` **(starting line 232):**
```typescript
export function looksLikeSpreadsheet(buffer: Buffer): boolean {
  if (buffer.length < 8) return false;
  // XLSX/XLSM are ZIP archives: "PK\x03\x04"
  if (buffer[0] === 0x50 && buffer[1] === 0x4b) return true;
  // Legacy XLS (BIFF8) OLE2 compound file magic
  const ole = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];
  return ole.every((b, i) => buffer[i] === b);
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline