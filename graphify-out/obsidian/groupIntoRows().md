---
source_file: "server/src/entities/sales/pdfExtract.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L25"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# groupIntoRows()

## Connections
- [[extractPdfRows()]] - `calls` [EXTRACTED]
- [[pdfExtract.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/sales/pdfExtract.ts` **(starting line 25):**
```typescript
function groupIntoRows(items: TextItem[]): string[][] {
  const lines: { y: number; cells: { x: number; str: string }[] }[] = [];
  for (const item of items) {
    if (!item.str || !item.str.trim()) continue;
    const y = item.transform[5];
    const x = item.transform[4];
    let line = lines.find((l) => Math.abs(l.y - y) < LINE_Y_TOLERANCE);
    if (!line) {
      line = { y, cells: [] };
      lines.push(line);
    }
    line.cells.push({ x, str: item.str.trim() });
  }
  lines.sort((a, b) => b.y - a.y);
  return lines.map((l) =>
    l.cells
      .sort((a, b) => a.x - b.x)
      .map((c) => c.str)
      .filter(Boolean)
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline