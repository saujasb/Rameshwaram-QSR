import { Router } from "express";
import multer from "multer";
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

salesRouter.get("/import-batches", (_req, res) => {
  res.json(listImportBatches());
});

salesRouter.get("/import-batches/:id", (req, res) => {
  const batch = getImportBatch(req.params.id);
  if (!batch) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(batch);
});

salesRouter.delete("/import-batches/:id", (req, res) => {
  const removed = deleteImportBatch(req.params.id);
  if (!removed) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.status(204).end();
});

salesRouter.get("/summary", (req, res) => {
  const from = typeof req.query.from === "string" ? req.query.from : undefined;
  const to = typeof req.query.to === "string" ? req.query.to : undefined;
  res.json(getSalesSummary({ from, to }));
});

salesRouter.get("/line-items", (req, res) => {
  const from = typeof req.query.from === "string" ? req.query.from : undefined;
  const to = typeof req.query.to === "string" ? req.query.to : undefined;
  res.json(listLineItems({ from, to }));
});

salesRouter.get("/target", (_req, res) => {
  res.json(getDailyTarget());
});

salesRouter.put("/target", (req, res) => {
  const amount = req.body?.amount;
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount < 0) {
    res.status(400).json({ error: "amount must be a non-negative number." });
    return;
  }
  res.json(setDailyTarget(amount));
});
