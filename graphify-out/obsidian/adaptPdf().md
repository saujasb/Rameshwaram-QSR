---
source_file: "server/src/entities/datasets/pdfAdapter.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L33"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# adaptPdf()

## Connections
- [[datasetsimportPipeline.ts]] - `imports` [EXTRACTED]
- [[detectFormat()]] - `calls` [EXTRACTED]
- [[extractPdfRows()]] - `calls` [EXTRACTED]
- [[parseKiosk()]] - `calls` [EXTRACTED]
- [[parsePetpooja()]] - `calls` [EXTRACTED]
- [[pdfAdapter.ts]] - `contains` [EXTRACTED]
- [[runImport()]] - `calls` [EXTRACTED]
- [[sumItems()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/pdfAdapter.ts` **(starting line 33):**
```typescript
export async function adaptPdf(buffer: Buffer, confirmedBusinessDate: string | undefined): Promise<PdfAdaptResult> {
  const empty = { rows: [], reportDate: null, channel: null, summary: null, parsingErrors: [], reconciliation: null };

  const pdfRows = await extractPdfRows(buffer);
  if (pdfRows.length === 0) {
    return { ok: false, error: "The PDF appears to be empty or unreadable.", ...empty };
  }

  const detected = detectFormat(pdfRows);
  if (detected.format === "unknown") {
    return {
      ok: false,
      error: "Unrecognized PDF sales-report layout.",
      detail:
        "This doesn't match the Kiosk, PetPooja (counter) or PetPooja Online item-wise report layouts. Excel (.xlsx/.xls) is also supported if you can export that instead.",
      ...empty,
    };
  }

  const report = detected.format === "kiosk" ? parseKiosk(pdfRows) : parsePetpooja(pdfRows, detected.channel);

  if (report.items.length === 0) {
    return {
      ok: false,
      error: "No sales line items could be read from this PDF.",
      detail: report.parsingErrors.join(" ") || undefined,
      ...empty,
    };
  }

  if (report.calendarDateStart && report.calendarDateEnd && report.calendarDateStart !== report.calendarDateEnd) {
    return {
      ok: false,
      error: "This report covers more than one calendar day.",
      detail: `Date: ${report.calendarDateStart} to ${report.calendarDateEnd}. Import one business day per file so each day's totals stay attributable.`,
      ...empty,
    };
  }

  const reportDate = report.calendarDateStart ?? null;

  // A PDF that prints its own date wins over the operator's entry; disagreeing
  // is an error rather than a silent relabel.
  if (reportDate && confirmedBusinessDate && confirmedBusinessDate !== reportDate) {
    return {
      ok: false,
      error: "The business date entered doesn't match the date printed in the report.",
      detail: `The report says ${reportDate}, but ${confirmedBusinessDate} was entered.`,
      ...empty,
    };
  }

  const businessDate = reportDate ?? confirmedBusinessDate ?? null;
  if (!businessDate) {
    return {
      ok: false,
      error: "This report has no date printed in it.",
      detail: "Kiosk exports don't include a date. Confirm the business date for this upload and import again.",
      ...empty,
    };
  }

  const rows: RawRowInput[] = report.items.map((item, i) => ({
    datasetType: "sales",
    rawTimestamp: null, // item-wise reports carry no per-order clock time
    transactionDate: businessDate,
    hour: null,
    shift: null,
    product: item.itemName,
    category: item.category,
    outlet: null,
    channel: report.channel,
    quantity: item.quantity,
    salesValue: item.amount,
    reason: null,
    sourceSheet: null,
    sourcePage: null,
    sourceRow: i + 1,
    aggregated: true,
  }));

  const computed = sumItems(report.items);

  return {
    ok: true,
    rows,
    reportDate: businessDate,
    channel: report.channel,
    parsingErrors: report.parsingErrors,
    reconciliation: {
      expectedQuantity: report.grandTotalQuantity,
      expectedAmount: report.grandTotalAmount,
      actualQuantity: computed.quantity,
      actualAmount: computed.amount,
    },
    summary: {
      sheetName: `${report.channel} (PDF)`,
      detectedDatasetType: "sales",
      detectionConfidence: 1,
      rowsDetected: report.items.length,
      rowsImported: rows.length,
      rowsRejected: 0,
      columnMappings: [],
      businessDateFrom: businessDate,
      businessDateTo: businessDate,
      skippedReason: null,
    },
  };
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline