---
source_file: "server/src/entities/datasets/coerce.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L113"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# coerceDateKey()

## Connections
- [[coerce.ts]] - `contains` [EXTRACTED]
- [[coerceTimestamp()]] - `calls` [EXTRACTED]
- [[excel.ts]] - `imports` [EXTRACTED]
- [[excelSerialToDate()]] - `calls` [EXTRACTED]
- [[extractRows()]] - `calls` [EXTRACTED]
- [[parseTextualDate()]] - `calls` [EXTRACTED]
- [[toDateKey()]] - `calls` [EXTRACTED]
- [[validDateParts()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/coerce.ts` **(starting line 113):**
```typescript
export function coerceDateKey(value: unknown): string | null {
  if (value == null || value === "") return null;

  if (value instanceof Date && !Number.isNaN(value.getTime())) return toDateKey(value);

  if (typeof value === "number") {
    const d = excelSerialToDate(value);
    return d ? toDateKey(d) : null;
  }

  const raw = String(value).trim();
  if (!raw) return null;

  // An ISO timestamp inside a date column.
  const isoLike = raw.match(/^(\d{4}-\d{2}-\d{2})[T ]/);
  if (isoLike) return isoLike[1];

  for (const p of DATE_PATTERNS) {
    const m = raw.match(p.re);
    if (m) {
      const [y, mo, d] = p.build(m);
      if (validDateParts(y, mo, d)) return toDateKey(new Date(y, mo - 1, d));
    }
  }

  const textual = parseTextualDate(raw);
  if (textual && validDateParts(textual[0], textual[1], textual[2])) {
    return toDateKey(new Date(textual[0], textual[1] - 1, textual[2]));
  }

  // Numeric string that is really an Excel serial.
  if (/^\d+(\.\d+)?$/.test(raw)) {
    const d = excelSerialToDate(Number(raw));
    if (d) return toDateKey(d);
  }
  return null;
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline