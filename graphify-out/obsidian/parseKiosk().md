---
source_file: "server/src/entities/sales/parsers/kiosk.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L13"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# parseKiosk()

## Connections
- [[adaptPdf()]] - `calls` [EXTRACTED]
- [[kiosk.ts]] - `contains` [EXTRACTED]
- [[parseNumber()]] - `calls` [EXTRACTED]
- [[pdfAdapter.ts]] - `imports` [EXTRACTED]
- [[runSalesImport()]] - `calls` [EXTRACTED]
- [[salesimportPipeline.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/sales/parsers/kiosk.ts` **(starting line 13):**
```typescript
export function parseKiosk(rows: string[][]): ParsedReport {
  const errors: string[] = [];
  const items: ParsedReport["items"] = [];

  const headerIdx = rows.findIndex((r) => r[0] === "SKU" && r[1] === "Item" && r[2] === "Category");
  const totalMarkerIdx = rows.findIndex((r, i) => i > headerIdx && r.length === 1 && r[0] === "Total");
  const valueHeaderIdx = rows.findIndex((r) => r[0] === "Quantity" && r[1] === "Amount");

  if (headerIdx === -1) errors.push("Could not find the SKU / Item / Category header row.");
  if (totalMarkerIdx === -1) errors.push("Could not find the grand-total marker row after the item list.");
  if (valueHeaderIdx === -1) errors.push("Could not find the Quantity / Amount header row.");

  let grandTotalQuantity: number | null = null;
  let grandTotalAmount: number | null = null;

  if (headerIdx !== -1 && totalMarkerIdx !== -1 && valueHeaderIdx !== -1) {
    const labelRows = rows.slice(headerIdx + 1, totalMarkerIdx);
    const valueRows = rows.slice(valueHeaderIdx + 1);

    if (valueRows.length !== labelRows.length + 1) {
      errors.push(
        `Expected ${labelRows.length + 1} quantity/amount rows (one per item plus the grand total) but found ${valueRows.length}.`
      );
    }

    for (let i = 0; i < labelRows.length; i++) {
      const label = labelRows[i];
      const value = valueRows[i];
      if (label.length !== 2) {
        errors.push(`Item row ${i + 1}: expected [item name, category], got ${JSON.stringify(label)}.`);
        continue;
      }
      if (!value || value.length !== 2) {
        errors.push(`Item row ${i + 1} ("${label[0]}"): missing quantity/amount.`);
        continue;
      }
      const quantity = parseNumber(value[0]);
      const amount = parseNumber(value[1]);
      if (quantity == null || amount == null) {
        errors.push(`Item row ${i + 1} ("${label[0]}"): could not parse quantity/amount from ${JSON.stringify(value)}.`);
        continue;
      }
      items.push({ category: label[1], itemName: label[0], quantity, amount });
    }

    const grandTotalRow = valueRows[labelRows.length];
    if (grandTotalRow && grandTotalRow.length === 2) {
      grandTotalQuantity = parseNumber(grandTotalRow[0]);
      grandTotalAmount = parseNumber(grandTotalRow[1]);
    } else {
      errors.push("Could not find the grand-total quantity/amount row.");
    }
  }

  return {
    channel: "kiosk",
    calendarDateStart: null,
    calendarDateEnd: null,
    items,
    grandTotalQuantity,
    grandTotalAmount,
    subtotalChecks: [],
    parsingErrors: errors,
  };
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline