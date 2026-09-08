---
source_file: "server/src/entities/datasets/coerce.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L206"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# coerceNumber()

## Connections
- [[coerce.ts]] - `contains` [EXTRACTED]
- [[excel.ts]] - `imports` [EXTRACTED]
- [[extractRows()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/coerce.ts` **(starting line 206):**
```typescript
export function coerceNumber(value: unknown): number | null {
  if (value == null || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  let raw = String(value).trim();
  if (!raw) return null;
  // Accounting negatives: (1,234) => -1234
  const paren = raw.match(/^\((.*)\)$/);
  if (paren) raw = `-${paren[1]}`;
  raw = raw.replace(/[,\s]/g, "").replace(/^(rs\.?|inr)/i, "").replace(/%$/, "");
  raw = raw.replace(/[₹$]/g, "");
  if (raw === "" || raw === "-") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline