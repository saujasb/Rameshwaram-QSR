---
source_file: "shared-types/sales.ts"
type: "code"
community: "Sales Analytics Charts"
location: "L5"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Analytics_Charts
---

# SALES_CHANNEL_LABELS

## Connections
- [[SalesAnalyticsPage.tsx]] - `imports` [EXTRACTED]
- [[SalesImportPage.tsx]] - `imports` [EXTRACTED]
- [[shared-typessales.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/sales.ts` **(starting line 5):**
```typescript
export const SALES_CHANNEL_LABELS: Record<SalesChannel, string> = {
  kiosk: "Kiosk",
  petpooja_pos: "PetPooja (Counter/POS)",
  petpooja_online: "Online",
};
```

#graphify/code #graphify/EXTRACTED #community/Sales_Analytics_Charts