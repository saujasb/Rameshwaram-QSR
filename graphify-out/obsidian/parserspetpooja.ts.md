---
source_file: "server/src/entities/sales/parsers/petpooja.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# parsers/petpooja.ts

## Connections
- [[ParsedLineItem]] - `imports` [EXTRACTED]
- [[ParsedReport]] - `imports` [EXTRACTED]
- [[ParsedSubtotalCheck]] - `imports` [EXTRACTED]
- [[STAT_LABELS]] - `contains` [EXTRACTED]
- [[SalesChannel]] - `imports` [EXTRACTED]
- [[isValueHeader()]] - `contains` [EXTRACTED]
- [[lastTwoNumbers()]] - `contains` [EXTRACTED]
- [[numbers.ts]] - `imports_from` [EXTRACTED]
- [[parseDateRange()]] - `contains` [EXTRACTED]
- [[parseNumber()]] - `imports` [EXTRACTED]
- [[parsePetpooja()]] - `contains` [EXTRACTED]
- [[parseTypes.ts]] - `imports_from` [EXTRACTED]
- [[pdfAdapter.ts]] - `imports_from` [EXTRACTED]
- [[round2()_3]] - `imports` [EXTRACTED]
- [[salesimportPipeline.ts]] - `imports_from` [EXTRACTED]
- [[shared-typessales.ts]] - `imports_from` [EXTRACTED]

## Source
**From** `server/src/entities/sales/parsers/petpooja.ts` **(starting line 1):**
```typescript
// Petpooja "Item Wise: Sales Report" export (both the in-store/offline POS
// and the Online variant share this exact layout). After column-aware
// extraction:
//   ["Date:", "<yyyy-mm-dd> to <yyyy-mm-dd>"]
//   ["Name:", "Item Wise: Sales Report"]
//   ["Restaurant Name:", "<restaurant>"]
//   ["Category","Item"]                       <- label-section header
//   ["Total"] ["Min."] ["Max."] ["Avg."]       <- report-level stat rows
//   ["<category>","<first item in category>"] <- new category + its first item
//   ["<item>"]                              x N  <- more items in that category
//   ["Sub Total"]                              <- category subtotal
//   ... (repeats per category)
//   ["Code","Sap Code","Qty.","Total (","₹)"]  <- value-section header
//   ["<qty>","<amount>"]                       <- one value row per label row above, same order
//
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline