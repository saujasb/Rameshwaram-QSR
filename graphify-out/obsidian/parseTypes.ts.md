---
source_file: "server/src/entities/sales/parseTypes.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# parseTypes.ts

## Connections
- [[ParsedLineItem]] - `contains` [EXTRACTED]
- [[ParsedReport]] - `contains` [EXTRACTED]
- [[ParsedSubtotalCheck]] - `contains` [EXTRACTED]
- [[SalesChannel]] - `imports` [EXTRACTED]
- [[kiosk.ts]] - `imports_from` [EXTRACTED]
- [[parserspetpooja.ts]] - `imports_from` [EXTRACTED]
- [[pdfAdapter.ts]] - `imports_from` [EXTRACTED]
- [[salesimportPipeline.ts]] - `imports_from` [EXTRACTED]
- [[shared-typessales.ts]] - `imports_from` [EXTRACTED]
- [[sumItems()]] - `contains` [EXTRACTED]

## Source
**Full file:** `server/src/entities/sales/parseTypes.ts`
```typescript
import type { SalesChannel } from "../../../../shared-types/sales.js";

export interface ParsedLineItem {
  category: string;
  itemName: string;
  quantity: number;
  amount: number;
}

export interface ParsedSubtotalCheck {
  category: string;
  expectedQuantity: number;
  expectedAmount: number;
  actualQuantity: number;
  actualAmount: number;
}

export interface ParsedReport {
  channel: SalesChannel;
  // Present only when the source report prints a date (Petpooja formats).
  // Kiosk exports have no date anywhere in the document.
  calendarDateStart: string | null;
  calendarDateEnd: string | null;
  items: ParsedLineItem[];
  grandTotalQuantity: number | null;
  grandTotalAmount: number | null;
  subtotalChecks: ParsedSubtotalCheck[];
  parsingErrors: string[];
}

export function sumItems(items: ParsedLineItem[]): { quantity: number; amount: number } {
  return items.reduce(
    (acc, i) => ({ quantity: acc.quantity + i.quantity, amount: acc.amount + i.amount }),
    { quantity: 0, amount: 0 }
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline