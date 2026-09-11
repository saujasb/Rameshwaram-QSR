---
source_file: "server/src/entities/sales/numbers.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# numbers.ts

## Connections
- [[approxEqual()]] - `contains` [EXTRACTED]
- [[kiosk.ts]] - `imports_from` [EXTRACTED]
- [[parseNumber()]] - `contains` [EXTRACTED]
- [[parserspetpooja.ts]] - `imports_from` [EXTRACTED]
- [[round2()_3]] - `contains` [EXTRACTED]
- [[salesimportPipeline.ts]] - `imports_from` [EXTRACTED]

## Source
**Full file:** `server/src/entities/sales/numbers.ts`
```typescript
export function parseNumber(raw: string | undefined): number | null {
  if (raw == null) return null;
  const cleaned = raw.replace(/,/g, "").replace(/[₹\s]/g, "");
  if (cleaned === "") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function approxEqual(a: number, b: number, epsilon = 0.05): boolean {
  return Math.abs(a - b) <= epsilon;
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline