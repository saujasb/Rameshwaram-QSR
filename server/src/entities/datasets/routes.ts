import { Router, type RequestHandler } from "express";
import multer from "multer";
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
import { asyncHandler } from "../../shared/asyncHandler.js";

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

/** Accepts one or many files in a single request; each is imported independently. */
datasetsRouter.post(
  "/import",
  uploadFiles,
  asyncHandler(async (req, res) => {
    const files = (req.files as Express.Multer.File[] | undefined) ?? [];
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
      if (!ALLOWED_EXT.test(file.originalname)) {
        results.push({
          fileName: file.originalname,
          ok: false,
          error: "Unsupported file extension.",
          detail: "Accepted: .pdf, .xlsx, .xls, .xlsm",
        });
        continue;
      }
      try {
        const outcome = await runImport({
          fileName: file.originalname,
          buffer: file.buffer,
          businessDate,
          datasetOverrides,
          allowDuplicateFile,
        });
        results.push(
          outcome.ok
            ? { fileName: file.originalname, ok: true, batch: outcome.batch }
            : { fileName: file.originalname, ok: false, error: outcome.error, detail: outcome.detail, duplicateOf: outcome.duplicateOf }
        );
      } catch (err) {
        results.push({
          fileName: file.originalname,
          ok: false,
          error: "Failed to process this file.",
          detail: err instanceof Error ? err.message : String(err),
        });
      }
    }

    const anyOk = results.some((r) => (r as { ok: boolean }).ok);
    res.status(anyOk ? 201 : 422).json({ results });
  })
);

datasetsRouter.get(
  "/import-batches",
  asyncHandler(async (_req, res) => {
    res.json(await listImportBatches());
  })
);

datasetsRouter.get(
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

datasetsRouter.delete(
  "/import-batches/:id",
  asyncHandler(async (req, res) => {
    if (!(await deleteImportBatch(req.params.id))) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.status(204).end();
  })
);

datasetsRouter.get(
  "/records",
  asyncHandler(async (req, res) => {
    res.json(await queryRecords(parseFilter(req.query as Record<string, unknown>)));
  })
);

datasetsRouter.get(
  "/coverage",
  asyncHandler(async (_req, res) => {
    res.json(await datasetCoverage());
  })
);

datasetsRouter.get(
  "/facets",
  asyncHandler(async (_req, res) => {
    const [products, outlets, shifts] = await Promise.all([
      distinctValues("product"),
      distinctValues("outlet"),
      distinctValues("shift"),
    ]);
    res.json({ products, outlets, shifts });
  })
);

datasetsRouter.get(
  "/summary",
  asyncHandler(async (req, res) => {
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
    res.json({
      totals,
      daily,
      topProducts: top,
      categories,
      channels,
      hourly,
      wastageReasons,
    });
  })
);

datasetsRouter.get(
  "/products",
  asyncHandler(async (req, res) => {
    res.json(await productPerformance(parseFilter(req.query as Record<string, unknown>)));
  })
);

/** CSV export. Formula-looking cells are neutralized so Excel can't execute them. */
datasetsRouter.get(
  "/export.csv",
  asyncHandler(async (req, res) => {
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
  })
);

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

datasetsRouter.get(
  "/settings",
  asyncHandler(async (_req, res) => {
    res.json({ businessDayStartHour: await getBusinessDayStartHour() });
  })
);

datasetsRouter.put(
  "/settings",
  asyncHandler(async (req, res) => {
    const hour = req.body?.businessDayStartHour;
    if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
      res.status(400).json({ error: "businessDayStartHour must be an integer between 0 and 23." });
      return;
    }
    const saved = await setBusinessDayStartHour(hour);
    res.json({ businessDayStartHour: saved.hour, updatedAt: saved.updatedAt });
  })
);
