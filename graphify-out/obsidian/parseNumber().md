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

# parseNumber()

## Connections
- [[kiosk.ts]] - `imports` [EXTRACTED]
- [[lastTwoNumbers()]] - `calls` [EXTRACTED]
- [[numbers.ts]] - `contains` [EXTRACTED]
- [[parseKiosk()]] - `calls` [EXTRACTED]
- [[parserspetpooja.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/sales/numbers.ts` **(starting line 1):**
```typescript
export function parseNumber(raw: string | undefined): number | null {
  if (raw == null) return null;
  const cleaned = raw.replace(/,/g, "").replace(/[₹\s]/g, "");
  if (cleaned === "") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline