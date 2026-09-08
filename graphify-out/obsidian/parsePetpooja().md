---
source_file: "server/src/entities/sales/parsers/petpooja.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L47"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# parsePetpooja()

## Connections
- [[adaptPdf()]] - `calls` [EXTRACTED]
- [[isValueHeader()]] - `indirect_call` [INFERRED]
- [[lastTwoNumbers()]] - `calls` [EXTRACTED]
- [[parseDateRange()]] - `calls` [EXTRACTED]
- [[parserspetpooja.ts]] - `contains` [EXTRACTED]
- [[pdfAdapter.ts]] - `imports` [EXTRACTED]
- [[round2()_3]] - `calls` [EXTRACTED]
- [[runSalesImport()]] - `calls` [EXTRACTED]
- [[salesimportPipeline.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/sales/parsers/petpooja.ts` **(starting line 47):**
```typescript
export function parsePetpooja(rows: string[][], channel: SalesChannel): ParsedReport {
  const errors: string[] = [];
  const items: ParsedLineItem[] = [];
  const subtotalChecks: ParsedSubtotalCheck[] = [];
  const { start: calendarDateStart, end: calendarDateEnd } = parseDateRange(rows);
  if (!calendarDateStart) errors.push("Could not find/parse the report's Date: header row.");

  const labelHeaderIdx = rows.findIndex((r) => r[0] === "Category" && r[1] === "Item");
  const valueHeaderIdx = rows.findIndex(isValueHeader);

  let grandTotalQuantity: number | null = null;
  let grandTotalAmount: number | null = null;

  if (labelHeaderIdx === -1) errors.push("Could not find the Category / Item header row.");
  if (valueHeaderIdx === -1) errors.push("Could not find the Code / Sap Code / Qty. / Total header row.");

  if (labelHeaderIdx !== -1 && valueHeaderIdx !== -1) {
    const labelRows = rows.slice(labelHeaderIdx + 1, valueHeaderIdx);
    const valueRows = rows.slice(valueHeaderIdx + 1);

    if (labelRows.length !== valueRows.length) {
      errors.push(
        `Label rows (${labelRows.length}) and value rows (${valueRows.length}) don't line up -- the report layout may have changed.`
      );
    }

    let currentCategory = "";
    let runningQuantity = 0;
    let runningAmount = 0;
    const n = Math.min(labelRows.length, valueRows.length);

    for (let i = 0; i < n; i++) {
      const label = labelRows[i];
      const value = valueRows[i];
      const nums = lastTwoNumbers(value);
      if (!nums) {
        errors.push(`Row ${i + 1} (label ${JSON.stringify(label)}): could not parse a quantity/amount pair from ${JSON.stringify(value)}.`);
        continue;
      }

      if (label.length === 1 && STAT_LABELS.has(label[0])) {
        if (label[0] === "Total") {
          grandTotalQuantity = nums.quantity;
          grandTotalAmount = nums.amount;
        }
        continue;
      }

      if (label.length === 1 && label[0] === "Sub Total") {
        subtotalChecks.push({
          category: currentCategory,
          expectedQuantity: nums.quantity,
          expectedAmount: nums.amount,
          actualQuantity: round2(runningQuantity),
          actualAmount: round2(runningAmount),
        });
        runningQuantity = 0;
        runningAmount = 0;
        continue;
      }

      if (label.length === 2) {
        currentCategory = label[0];
        items.push({ category: currentCategory, itemName: label[1], quantity: nums.quantity, amount: nums.amount });
        runningQuantity += nums.quantity;
        runningAmount += nums.amount;
        continue;
      }

      if (label.length === 1) {
        items.push({ category: currentCategory, itemName: label[0], quantity: nums.quantity, amount: nums.amount });
        runningQuantity += nums.quantity;
        runningAmount += nums.amount;
        continue;
      }

      errors.push(`Row ${i + 1}: unrecognized label row shape ${JSON.stringify(label)}.`);
    }
  }

  return {
    channel,
    calendarDateStart,
    calendarDateEnd,
    items,
    grandTotalQuantity,
    grandTotalAmount,
    subtotalChecks,
    parsingErrors: errors,
  };
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline