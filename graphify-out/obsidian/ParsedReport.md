---
source_file: "server/src/entities/sales/parseTypes.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L18"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# ParsedReport

## Connections
- [[SalesChannel]] - `references` [EXTRACTED]
- [[kiosk.ts]] - `imports` [EXTRACTED]
- [[parseTypes.ts]] - `contains` [EXTRACTED]
- [[parserspetpooja.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/sales/parseTypes.ts` **(starting line 18):**
```typescript
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
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline