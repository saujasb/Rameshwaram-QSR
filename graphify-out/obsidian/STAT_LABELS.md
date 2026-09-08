---
source_file: "server/src/entities/sales/parsers/petpooja.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L25"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# STAT_LABELS

## Connections
- [[parserspetpooja.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/sales/parsers/petpooja.ts` **(starting line 25):**
```typescript
const STAT_LABELS = new Set(["Total", "Min.", "Max.", "Avg."]);

function parseDateRange(rows: string[][]): { start: string | null; end: string | null } {
  const dateRow = rows.find((r) => r[0] === "Date:");
  const raw = dateRow?.[1] ?? "";
  const match = raw.match(/^(\d{4}-\d{2}-\d{2})\s+to\s+(\d{4}-\d{2}-\d{2})$/);
  if (!match) return { start: null, end: null };
  return { start: match[1], end: match[2] };
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline