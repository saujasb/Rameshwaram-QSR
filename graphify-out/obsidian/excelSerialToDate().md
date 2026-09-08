---
source_file: "server/src/entities/datasets/coerce.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L16"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# excelSerialToDate()

## Connections
- [[coerce.ts]] - `contains` [EXTRACTED]
- [[coerceDateKey()]] - `calls` [EXTRACTED]
- [[coerceTimestamp()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/coerce.ts` **(starting line 16):**
```typescript
export function excelSerialToDate(serial: number): Date | null {
  if (!Number.isFinite(serial) || serial < MIN_SERIAL || serial > MAX_SERIAL) return null;
  // Excel stores times as binary day-fractions, so 23:05 can come back as
  // 23:04:59.9997. Snap to the nearest whole second BEFORE splitting into
  // components: without this, a 05:00:00 entry can arrive as 04:59:59 and get
  // bucketed into the previous business day.
  const ms = Math.round((EXCEL_EPOCH_MS + serial * MS_PER_DAY) / 1000) * 1000;
  const d = new Date(ms);
  // Rebuild in local time so downstream getHours()/business-date logic matches
  // the wall-clock time the operator actually saw in the spreadsheet.
  return new Date(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
    Math.round(d.getUTCSeconds())
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline