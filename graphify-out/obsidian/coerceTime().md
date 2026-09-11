---
source_file: "server/src/entities/datasets/coerce.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L77"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# coerceTime()

## Connections
- [[coerce.ts]] - `contains` [EXTRACTED]
- [[coerceTimestamp()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/coerce.ts` **(starting line 77):**
```typescript
export function coerceTime(value: unknown): { h: number; m: number; s: number } | null {
  if (value == null || value === "") return null;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return { h: value.getHours(), m: value.getMinutes(), s: value.getSeconds() };
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    // Excel stores a bare time as a day fraction (0 <= v < 1).
    if (value >= 0 && value < 1) {
      const totalSec = Math.round(value * 86400);
      return { h: Math.floor(totalSec / 3600) % 24, m: Math.floor((totalSec % 3600) / 60), s: totalSec % 60 };
    }
    // A whole number 0-23 is an hour column.
    if (Number.isInteger(value) && value >= 0 && value <= 23) return { h: value, m: 0, s: 0 };
    return null;
  }

  const raw = String(value).trim().toLowerCase();
  const ampm = raw.match(/^(\d{1,2})(?::(\d{2}))?(?::(\d{2}))?\s*(am|pm)$/);
  if (ampm) {
    let h = Number(ampm[1]) % 12;
    if (ampm[4] === "pm") h += 12;
    return { h, m: Number(ampm[2] ?? 0), s: Number(ampm[3] ?? 0) };
  }
  const hms = raw.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (hms) {
    const h = Number(hms[1]);
    const m = Number(hms[2]);
    const s = Number(hms[3] ?? 0);
    if (h <= 23 && m <= 59 && s <= 59) return { h, m, s };
  }
  return null;
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline