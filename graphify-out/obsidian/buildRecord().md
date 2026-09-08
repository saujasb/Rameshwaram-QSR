---
source_file: "server/src/entities/datasets/normalize.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L54"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# buildRecord()

## Connections
- [[datasetsimportPipeline.ts]] - `imports` [EXTRACTED]
- [[fingerprintFor()]] - `calls` [EXTRACTED]
- [[getBusinessDate()]] - `calls` [EXTRACTED]
- [[normalize.ts]] - `contains` [EXTRACTED]
- [[productKeyOf()_1]] - `calls` [EXTRACTED]
- [[runImport()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/normalize.ts` **(starting line 54):**
```typescript
export function buildRecord(input: RawRowInput, ctx: BuildContext): BuildOutcome {
  const flags: RecordFlag[] = [];
  const rawSummary = JSON.stringify({
    product: input.product,
    qty: input.quantity,
    value: input.salesValue,
    date: input.transactionDate,
    ts: input.rawTimestamp,
  });

  const product = input.product?.trim();
  if (!product) {
    return { ok: false, reason: "No product/item name in this row", sourceRow: input.sourceRow, sourceSheet: input.sourceSheet, raw: rawSummary };
  }

  if (input.quantity == null) {
    return { ok: false, reason: "Quantity missing or not numeric", sourceRow: input.sourceRow, sourceSheet: input.sourceSheet, raw: rawSummary };
  }

  // Resolve the business date. A per-row timestamp always wins; otherwise the
  // row's own calendar date; otherwise the batch-level date the user confirmed.
  let businessDate: string | null = null;
  if (input.rawTimestamp) {
    businessDate = getBusinessDate(input.rawTimestamp, ctx.businessDayStartHour);
  } else if (input.transactionDate) {
    // No clock time: the source's calendar date IS the business date. We do not
    // invent an hour, so the 05:00 rule has nothing to shift.
    businessDate = input.transactionDate;
    flags.push("missing_timestamp");
  } else if (ctx.fallbackBusinessDate) {
    businessDate = ctx.fallbackBusinessDate;
    flags.push("missing_timestamp");
  }

  if (!businessDate) {
    return {
      ok: false,
      reason: "No date on the row and no business date supplied for the file",
      sourceRow: input.sourceRow,
      sourceSheet: input.sourceSheet,
      raw: rawSummary,
    };
  }

  if (input.quantity < 0) flags.push("negative_quantity");
  else if (input.quantity === 0) flags.push("zero_quantity");
  if (input.salesValue != null && input.salesValue < 0) flags.push("negative_value");

  const now = new Date().toISOString();
  const productKey = productKeyOf(product);

  const record: DatasetRecord = {
    id: randomUUID(),
    datasetType: input.datasetType,
    rawTimestamp: input.rawTimestamp,
    transactionDate: input.transactionDate,
    businessDate,
    businessDayStartHour: ctx.businessDayStartHour,
    hour: input.hour,
    shift: input.shift,
    product,
    category: input.category,
    outlet: input.outlet,
    channel: input.channel,
    quantity: input.quantity,
    salesValue: input.salesValue,
    reason: input.reason,
    importBatchId: ctx.importBatchId,
    sourceFile: ctx.sourceFile,
    sourceType: ctx.sourceType,
    sourceSheet: input.sourceSheet,
    sourcePage: input.sourcePage,
    sourceRow: input.sourceRow,
    fingerprint: fingerprintFor(input, ctx, businessDate, productKey),
    flags,
    createdAt: now,
    updatedAt: now,
  };

  return { ok: true, record };
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline