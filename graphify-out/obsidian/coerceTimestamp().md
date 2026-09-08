---
source_file: "server/src/entities/datasets/coerce.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L156"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# coerceTimestamp()

## Connections
- [[buildIso()]] - `calls` [EXTRACTED]
- [[coerce.ts]] - `contains` [EXTRACTED]
- [[coerceDateKey()]] - `calls` [EXTRACTED]
- [[coerceTime()]] - `calls` [EXTRACTED]
- [[excel.ts]] - `imports` [EXTRACTED]
- [[excelSerialToDate()]] - `calls` [EXTRACTED]
- [[extractRows()]] - `calls` [EXTRACTED]
- [[localIso()]] - `calls` [EXTRACTED]
- [[toDateKey()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/coerce.ts` **(starting line 156):**
```typescript
export function coerceTimestamp(
  timestampCell: unknown,
  dateCell: unknown,
  timeCell: unknown
): { iso: string; dateKey: string; hour: number } | null {
  // A single cell carrying both date and time.
  if (timestampCell != null && timestampCell !== "") {
    if (timestampCell instanceof Date && !Number.isNaN(timestampCell.getTime())) {
      const d = timestampCell;
      if (d.getHours() || d.getMinutes() || d.getSeconds()) {
        return { iso: localIso(d), dateKey: toDateKey(d), hour: d.getHours() };
      }
    }
    if (typeof timestampCell === "number") {
      const d = excelSerialToDate(timestampCell);
      // Only treat as a timestamp when it carries a fractional (time) component.
      if (d && Math.abs(timestampCell % 1) > 1e-9) {
        return { iso: localIso(d), dateKey: toDateKey(d), hour: d.getHours() };
      }
    }
    const raw = String(timestampCell).trim();
    const parsedDate = coerceDateKey(raw);
    const inlineTime = raw.match(/[T ](\d{1,2}:\d{2}(?::\d{2})?)\s*(am|pm)?/i);
    if (parsedDate && inlineTime) {
      const t = coerceTime(`${inlineTime[1]}${inlineTime[2] ? ` ${inlineTime[2]}` : ""}`);
      if (t) return buildIso(parsedDate, t);
    }
  }

  // Separate date + time columns.
  const dateKey = coerceDateKey(dateCell ?? timestampCell);
  const t = coerceTime(timeCell);
  if (dateKey && t) return buildIso(dateKey, t);

  return null;
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline