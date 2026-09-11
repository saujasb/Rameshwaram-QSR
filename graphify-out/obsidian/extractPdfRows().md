---
source_file: "server/src/entities/sales/pdfExtract.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L52"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# extractPdfRows()

## Connections
- [[adaptPdf()]] - `calls` [EXTRACTED]
- [[groupIntoRows()]] - `calls` [EXTRACTED]
- [[pdfAdapter.ts]] - `imports` [EXTRACTED]
- [[pdfExtract.ts]] - `contains` [EXTRACTED]
- [[runSalesImport()]] - `calls` [EXTRACTED]
- [[salesimportPipeline.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/sales/pdfExtract.ts` **(starting line 52):**
```typescript
export async function extractPdfRows(buffer: Buffer): Promise<string[][]> {
  const allRows: string[][] = [];
  await pdf(buffer, {
    pagerender: async (pageData: { getTextContent: () => Promise<{ items: TextItem[] }> }) => {
      const content = await pageData.getTextContent();
      const rows = groupIntoRows(content.items);
      allRows.push(...rows);
      return "";
    },
  });
  return allRows.filter((r) => r.length > 0);
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline