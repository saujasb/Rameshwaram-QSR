---
source_file: "shared-types/sales.ts"
type: "code"
community: "Sales Import UI"
location: "L63"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_UI
---

# SalesChannelTotal

## Connections
- [[shared-typessales.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/sales.ts` **(starting line 63):**
```typescript
export interface SalesChannelTotal {
  channel: SalesChannel;
  quantity: number;
  amount: number;
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_UI