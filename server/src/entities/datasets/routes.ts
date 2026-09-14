import { Router, type RequestHandler } from "express";
import multer from "multer";
import { downloadUpload } from "../../shared/uploads.js";
import type { DatasetFilter, DatasetType } from "../../../../shared-types/datasets.js";
import { runImport } from "./importPipeline.js";
import {
  categoryTotals,
  channelTotals,
  dailyTotals,
  datasetCoverage,
  deleteImportBatch,
  distinctValues,
  exportRecords,
  getImportBatch,
  hourlyBuckets,
  listImportBatches,
  productPerformance,
  queryRecords,
  topProducts,
  totalsFor,
  wastageByReason,
} from "./repository.js";
import { getBusinessDayStartHour, setBusinessDayStartHour } from "./db.js";

const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 6 },
});

const ALLOWED_EXT = /\.(pdf|xlsx|xls|xlsm)$/i;

export const datasetsRouter: Router = Router();

function parseFilter(q: Record<string, unknown>): DatasetFilter {
  const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);
  const num = (v: unknown) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };
  const dt = str(q.datasetType);
  return {
    from: str(q.from),
    to: str(q.to),
    datasetType: dt === "sales" || dt === "production" || dt === "wastage" ? (dt as DatasetType) : undefined,
    product: str(q.product),
    outlet: str(q.outlet),
    shift: str(q.shift),
    search: str(q.search),
    page: num(q.page),
    pageSize: num(q.pageSize),
  };
}

/**
 * Multer rejects oversized/too-many files by throwing, which would otherwise
 * surface as an opaque 500. Translate it into something a manager can act on.
 */
const uploadFiles: RequestHandler = (req, res, next) => {
  upload.array("files", 6)(req, res, (err: unknown) => {
    if (!err) return next();
    const code = (err as { code?: string }).code;
    if (code === "LIMIT_FILE_SIZE") {
      res.status(413).json({
        error: "That file is too large.",
        detail: `Each file must be under ${Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))} MB. Split the export into smaller date ranges and import them one at a time.`,
      });
      return;
    }
    if (code === "LIMIT_FILE_COUNT" || code === "LIMIT_UNEXPECTED_FILE") {
      res.status(413).json({ error: "Too many files in one upload.", detail: "Import up to 6 files at a time." });
      return;
    }
    res.status(400).json({ error: "The upload could not be read.", detail: err instanceof Error ? err.message : String(err) });
  });
};

interface PendingFile {
  fileName: string;
  buffer: Buffer;
}

/**
 * Accepts either direct multipart file(s) (small files) or, for files too
 * large for a Vercel function body, a { storagePaths: [{path, fileName}] }
 * JSON body pointing at files the browser already uploaded to Supabase
 * Storage -- see shared/uploads.ts. Skips multer entirely for the JSON case.
 */
const acceptFiles: RequestHandler = (req, res, next) => {
  const contentType = req.headers["content-type"] ?? "";
  if (contentType.startsWith("multipart/form-data")) {
    uploadFiles(req, res, next);
    return;
  }
  next();
};

/** Accepts one or many files in a single request; each is imported independently. */
datasetsRouter.post("/import", acceptFiles, async (req, res) => {
  let files: PendingFile[];
  if (req.files && (req.files as Express.Multer.File[]).length > 0) {
    files = (req.files as Express.Multer.File[]).map((f) => ({ fileName: f.originalname, buffer: f.buffer }));
  } else if (Array.isArray(req.body?.storagePaths) && req.body.storagePaths.length > 0) {
    try {
      files = await Promise.all(
        (req.body.storagePaths as { path: string; fileName: string }[]).map(async (f) => ({
          fileName: f.fileName ?? f.path,
          buffer: await downloadUpload(f.path),
        }))
      );
    } catch (err) {
      res.status(400).json({ error: "Could not read an uploaded file.", detail: err instanceof Error ? err.message : String(err) });
      return;
    }
  } else {
    files = [];
  }
  if (files.length === 0) {
    res.status(400).json({ error: "No files uploaded." });
    return;
  }

  const rawDate = req.body?.businessDate;
  const businessDate = typeof rawDate === "string" && rawDate.trim() ? rawDate.trim() : undefined;

  let datasetOverrides: Record<string, DatasetType> | undefined;
  if (typeof req.body?.datasetOverrides === "string" && req.body.datasetOverrides.trim()) {
    try {
      datasetOverrides = JSON.parse(req.body.datasetOverrides);
    } catch {
      res.status(400).json({ error: "datasetOverrides must be valid JSON." });
      return;
    }
  }
  const allowDuplicateFile = req.body?.allowDuplicateFile === "true" || req.body?.allowDuplicateFile === true;

  const results: unknown[] = [];
  for (const file of files) {
    if (!ALLOWED_EXT.test(file.fileName)) {
      results.push({
        fileName: file.fileName,
        ok: false,
        error: "Unsupported file extension.",
        detail: "Accepted: .pdf, .xlsx, .xls, .xlsm",
      });
      continue;
    }
    try {
      const outcome = await runImport({
        fileName: file.fileName,
        buffer: file.buffer,
        businessDate,
        datasetOverrides,
        allowDuplicateFile,
      });
      results.push(
        outcome.ok
          ? { fileName: file.fileName, ok: true, batch: outcome.batch }
          : { fileName: file.fileName, ok: false, error: outcome.error, detail: outcome.detail, duplicateOf: outcome.duplicateOf }
      );
    } catch (err) {
      results.push({
        fileName: file.fileName,
        ok: false,
        error: "Failed to process this file.",
        detail: err instanceof Error ? err.message : String(err),
      });
    }
  }

  const anyOk = results.some((r) => (r as { ok: boolean }).ok);
  res.status(anyOk ? 201 : 422).json({ results });
});

datasetsRouter.get("/import-batches", async (_req, res) => {
  res.json(await listImportBatches());
});

datasetsRouter.get("/import-batches/:id", async (req, res) => {
  const batch = await getImportBatch(req.params.id);
  if (!batch) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(batch);
});

datasetsRouter.delete("/import-batches/:id", async (req, res) => {
  if (!(await deleteImportBatch(req.params.id))) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.status(204).end();
});

datasetsRouter.get("/records", async (req, res) => {
  res.json(await queryRecords(parseFilter(req.query as Record<string, unknown>)));
});

datasetsRouter.get("/coverage", async (_req, res) => {
  res.json(await datasetCoverage());
});

datasetsRouter.get("/facets", async (_req, res) => {
  const [products, outlets, shifts] = await Promise.all([
    distinctValues("product"),
    distinctValues("outlet"),
    distinctValues("shift"),
  ]);
  res.json({ products, outlets, shifts });
});

datasetsRouter.get("/summary", async (req, res) => {
  const filter = parseFilter(req.query as Record<string, unknown>);
  const [totals, daily, top, categories, channels, hourly, wastageReasons] = await Promise.all([
    totalsFor(filter),
    dailyTotals(filter),
    topProducts(filter, 15),
    categoryTotals(filter),
    channelTotals(filter),
    hourlyBuckets(filter),
    wastageByReason(filter),
  ]);
  res.json({ totals, daily, topProducts: top, categories, channels, hourly, wastageReasons });
});

datasetsRouter.get("/products", async (req, res) => {
  res.json(await productPerformance(parseFilter(req.query as Record<string, unknown>)));
});

/** CSV export. Formula-looking cells are neutralized so Excel can't execute them. */
datasetsRouter.get("/export.csv", async (req, res) => {
  const rows = await exportRecords(parseFilter(req.query as Record<string, unknown>));
  const cols = [
    "datasetType", "businessDate", "transactionDate", "rawTimestamp", "hour", "shift",
    "product", "category", "outlet", "channel", "quantity", "salesValue", "reason",
    "sourceFile", "sourceType", "sourceSheet", "sourcePage", "sourceRow",
  ] as const;

  const lines = [cols.join(",")];
  for (const r of rows) {
    lines.push(cols.map((c) => csvCell((r as unknown as Record<string, unknown>)[c])).join(","));
  }

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="rameshwaram-records-${Date.now()}.csv"`);
  res.send(lines.join("\r\n"));
});

/**
 * CSV injection defence: a cell beginning =, +, -, @, tab or CR is prefixed
 * with a single quote so spreadsheets treat it as text rather than a formula.
 */
function csvCell(value: unknown): string {
  if (value == null) return "";
  let s = String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  if (/[",\r\n]/.test(s)) s = `"${s.replace(/"/g, '""')}"`;
  return s;
}

datasetsRouter.get("/settings", async (_req, res) => {
  res.json({ businessDayStartHour: await getBusinessDayStartHour() });
});

datasetsRouter.put("/settings", async (req, res) => {
  const hour = req.body?.businessDayStartHour;
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
    res.status(400).json({ error: "businessDayStartHour must be an integer between 0 and 23." });
    return;
  }
  const saved = await setBusinessDayStartHour(hour);
  res.json({ businessDayStartHour: saved.hour, updatedAt: saved.updatedAt });
});
