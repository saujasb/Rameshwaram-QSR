---
source_file: "server/src/entities/sales/detectFormat.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# detectFormat.ts

## Connections
- [[DetectedFormat]] - `contains` [EXTRACTED]
- [[SalesChannel]] - `imports` [EXTRACTED]
- [[detectFormat()]] - `contains` [EXTRACTED]
- [[pdfAdapter.ts]] - `imports_from` [EXTRACTED]
- [[salesimportPipeline.ts]] - `imports_from` [EXTRACTED]
- [[shared-typessales.ts]] - `imports_from` [EXTRACTED]

## Source
**Full file:** `server/src/entities/sales/detectFormat.ts`
```typescript
import type { SalesChannel } from "../../../../shared-types/sales.js";

export type DetectedFormat =
  | { format: "kiosk" }
  | { format: "petpooja"; channel: SalesChannel }
  | { format: "unknown" };

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