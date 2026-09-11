---
source_file: "server/src/entities/sales/detectFormat.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L8"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# detectFormat()

## Connections
- [[adaptPdf()]] - `calls` [EXTRACTED]
- [[detectFormat.ts]] - `contains` [EXTRACTED]
- [[pdfAdapter.ts]] - `imports` [EXTRACTED]
- [[runSalesImport()]] - `calls` [EXTRACTED]
- [[salesimportPipeline.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/sales/detectFormat.ts` **(starting line 8):**
```typescript
export function detectFormat(rows: string[][]): DetectedFormat {
  const isKioskHeader = rows.some((r) => r[0] === "SKU" && r[1] === "Item" && r[2] === "Category");
  if (isKioskHeader) return { format: "kiosk" };

  const restaurantRow = rows.find((r) => r[0] === "Restaurant Name:");
  if (restaurantRow) {
    const channel: SalesChannel = /online/i.test(restaurantRow[1] ?? "") ? "petpooja_online" : "petpooja_pos";
    return { format: "petpooja", channel };
  }

  return { format: "unknown" };
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline