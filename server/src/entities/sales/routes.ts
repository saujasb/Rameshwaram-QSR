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
import { asyncHandler } from "../../shared/asyncHandler.js";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

export const salesRouter: Router = Router();

salesRouter.post(
  "/import",
  upload.single("file"),
  asyncHandler(async (req, res) => {
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
  })
);

salesRouter.get(
  "/import-batches",
  asyncHandler(async (_req, res) => {
    res.json(await listImportBatches());
  })
);

salesRouter.get(
  "/import-batches/:id",
  asyncHandler(async (req, res) => {
    const batch = await getImportBatch(req.params.id);
    if (!batch) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(batch);
  })
);

salesRouter.delete(
  "/import-batches/:id",
  asyncHandler(async (req, res) => {
    const removed = await deleteImportBatch(req.params.id);
    if (!removed) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.status(204).end();
  })
);

salesRouter.get(
  "/summary",
  asyncHandler(async (req, res) => {
    const from = typeof req.query.from === "string" ? req.query.from : undefined;
    const to = typeof req.query.to === "string" ? req.query.to : undefined;
    res.json(await getSalesSummary({ from, to }));
  })
);

salesRouter.get(
  "/line-items",
  asyncHandler(async (req, res) => {
    const from = typeof req.query.from === "string" ? req.query.from : undefined;
    const to = typeof req.query.to === "string" ? req.query.to : undefined;
    res.json(await listLineItems({ from, to }));
  })
);

salesRouter.get(
  "/target",
  asyncHandler(async (_req, res) => {
    res.json(await getDailyTarget());
  })
);

salesRouter.put(
  "/target",
  asyncHandler(async (req, res) => {
    const amount = req.body?.amount;
    if (typeof amount !== "number" || !Number.isFinite(amount) || amount < 0) {
      res.status(400).json({ error: "amount must be a non-negative number." });
      return;
    }
    res.json(await setDailyTarget(amount));
  })
);
