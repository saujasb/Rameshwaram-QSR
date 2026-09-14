import { Router } from "express";
import multer from "multer";
import { downloadUpload } from "../../shared/uploads.js";
import { runSalesImport } from "./importPipeline.js";
import {
  getSalesSummary,
  listImportBatches,
  getImportBatch,
  deleteImportBatch,
  listLineItems,
  getDailyTarget,
  setDailyTarget,
} from "./repository.js";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

export const salesRouter: Router = Router();

salesRouter.post("/import", upload.single("file"), async (req, res) => {
  // Two ways a file gets here: a direct multipart upload (small files, still
  // fine on Vercel) or a { storagePath, fileName } JSON body pointing at a
  // file the browser already put in Supabase Storage (large files, bypassing
  // the ~4.5MB Vercel function body limit). Same pipeline either way.
  let fileName: string;
  let buffer: Buffer;
  if (req.file) {
    fileName = req.file.originalname;
    buffer = req.file.buffer;
  } else if (typeof req.body?.storagePath === "string" && req.body.storagePath) {
    fileName = typeof req.body?.fileName === "string" ? req.body.fileName : req.body.storagePath;
    try {
      buffer = await downloadUpload(req.body.storagePath);
    } catch (err) {
      res.status(400).json({ error: "Could not read the uploaded file.", detail: err instanceof Error ? err.message : String(err) });
      return;
    }
  } else {
    res.status(400).json({ error: "No file uploaded." });
    return;
  }

  const looksLikePdf = req.file ? req.file.mimetype === "application/pdf" || fileName.toLowerCase().endsWith(".pdf") : fileName.toLowerCase().endsWith(".pdf");
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
    const result = await runSalesImport({ fileName, buffer, businessDate });
    if (!result.ok) {
      res.status(422).json({ error: result.error, detail: result.detail });
      return;
    }
    res.status(201).json(result.batch);
  } catch (err) {
    res.status(500).json({ error: "Failed to process the PDF.", detail: err instanceof Error ? err.message : String(err) });
  }
});

salesRouter.get("/import-batches", async (_req, res) => {
  res.json(await listImportBatches());
});

salesRouter.get("/import-batches/:id", async (req, res) => {
  const batch = await getImportBatch(req.params.id);
  if (!batch) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(batch);
});

salesRouter.delete("/import-batches/:id", async (req, res) => {
  const removed = await deleteImportBatch(req.params.id);
  if (!removed) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.status(204).end();
});

salesRouter.get("/summary", async (req, res) => {
  const from = typeof req.query.from === "string" ? req.query.from : undefined;
  const to = typeof req.query.to === "string" ? req.query.to : undefined;
  res.json(await getSalesSummary({ from, to }));
});

salesRouter.get("/line-items", async (req, res) => {
  const from = typeof req.query.from === "string" ? req.query.from : undefined;
  const to = typeof req.query.to === "string" ? req.query.to : undefined;
  res.json(await listLineItems({ from, to }));
});

salesRouter.get("/target", async (_req, res) => {
  res.json(await getDailyTarget());
});

salesRouter.put("/target", async (req, res) => {
  const amount = req.body?.amount;
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount < 0) {
    res.status(400).json({ error: "amount must be a non-negative number." });
    return;
  }
  res.json(await setDailyTarget(amount));
});
