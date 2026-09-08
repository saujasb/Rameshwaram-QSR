---
source_file: "server/src/entities/sales/routes.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L16"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# salesRouter

## Connections
- [[index.ts]] - `imports` [EXTRACTED]
- [[salesroutes.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/sales/routes.ts` **(starting line 16):**
```typescript
export const salesRouter: Router = Router();

salesRouter.post("/import", upload.single("file"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded." });
    return;
  }
  const looksLikePdf = req.file.mimetype === "application/pdf" || req.file.originalname.toLowerCase().endsWith(".pdf");
  if (!looksLikePdf) {
    res.status(400).json({ error: "Only PDF files are supported." });
    return;
  }

  const rawBusinessDate = req.body?.businessDate;
  const businessDate = typeof rawBusinessDate === "string" && rawBusinessDate.trim() ? rawBusinessDate.trim() : undefined;
  if (businessDate && !/^\d{4}-\d{2}-\d{2}$/.test(businessDate)) {
    res.status(400).json({ error: "businessDate must be in YYYY-MM-DD format." });
    return;
  }

  try {
    const result = await runSalesImport({ fileName: req.file.originalname, buffer: req.file.buffer, businessDate });
    if (!result.ok) {
      res.status(422).json({ error: result.error, detail: result.detail });
      return;
    }
    res.status(201).json(result.batch);
  } catch (err) {
    res.status(500).json({ error: "Failed to process the PDF.", detail: err instanceof Error ? err.message : String(err) });
  }
});
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline