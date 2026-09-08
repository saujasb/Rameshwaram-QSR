---
source_file: "shared-types/sales.ts"
type: "code"
community: "Sales Import UI"
location: "L34"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_UI
---

# SalesImportValidation

## Connections
- [[shared-typessales.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/sales.ts` **(starting line 34):**
```typescript
export interface SalesImportValidation {
  status: ImportValidationStatus;
  expectedQuantity: number | null;
  expectedAmount: number | null;
  actualQuantity: number;
  actualAmount: number;
  quantityDiff: number | null;
  amountDiff: number | null;
  notes: string[];
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_UI