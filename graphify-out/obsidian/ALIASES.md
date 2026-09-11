---
source_file: "server/src/entities/datasets/columnMap.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L20"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# ALIASES

## Connections
- [[columnMap.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/columnMap.ts` **(starting line 20):**
```typescript
const ALIASES: Record<NormalizedField, string[]> = {
  timestamp: ["timestamp", "date time", "datetime", "transaction time", "txn time", "order time", "bill time", "invoice time", "created at"],
  date: ["date", "transaction date", "txn date", "business date", "order date", "bill date", "invoice date", "sale date", "day"],
  time: ["time", "hour", "transaction hour", "order hour", "slot"],
  product: ["product", "item", "item name", "product name", "sku", "menu item", "dish", "particulars", "description"],
  category: ["category", "item category", "product category", "group", "menu group", "department", "section"],
  quantity: ["quantity", "qty", "qty.", "units", "count", "nos", "no of units", "sold qty", "produced qty", "wastage qty", "waste qty", "pcs"],
  salesValue: ["amount", "sales", "sales value", "total", "total (rs)", "total amount", "net amount", "value", "revenue", "gross amount", "net sales", "grand total"],
  outlet: ["outlet", "store", "branch", "location", "restaurant", "restaurant name", "site", "unit"],
  shift: ["shift", "session", "day part", "daypart", "shift name"],
  reason: ["reason", "wastage reason", "waste reason", "cause", "remark", "remarks", "note", "notes"],
};
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline