import { randomUUID } from "node:crypto";
import { extractPdfRows } from "./pdfExtract.js";
import { detectFormat } from "./detectFormat.js";
import { parseKiosk } from "./parsers/kiosk.js";
import { parsePetpooja } from "./parsers/petpooja.js";
import { sumItems } from "./parseTypes.js";
import { upsertLineItems, insertImportBatch, type CandidateLineItem } from "./repository.js";
import { getBusinessDayBounds } from "../../../../shared-types/businessDate.js";
import type { ImportValidationStatus, SalesImportBatch } from "../../../../shared-types/sales.js";
import { approxEqual } from "./numbers.js";

export interface ImportOptions {
  fileName: string;
  buffer: Buffer;
  // Required for formats (Kiosk) that print no date at all. Optional for
  // formats that do print one (Petpooja) -- if supplied it must agree with
  // the report's own date, otherwise we reject rather than silently
  // relabeling data to a date the report doesn't claim.
  businessDate?: string;
}

export type ImportOutcome = { ok: true; batch: SalesImportBatch } | { ok: false; error: string; detail?: string };

const VALIDATION_EPSILON = 0.5;

export async function runSalesImport(options: ImportOptions): Promise<ImportOutcome> {
  const rows = await extractPdfRows(options.buffer);
  if (rows.length === 0) {
    return { ok: false, error: "The PDF appears to be empty or unreadable." };
  }

  const detected = detectFormat(rows);
  if (detected.format === "unknown") {
    return {
      ok: false,
      error: "Unrecognized sales report format.",
      detail: "This doesn't match the Kiosk, Petpooja (counter) or Petpooja Online report layouts this dashboard knows how to read.",
    };
  }

  const report = detected.format === "kiosk" ? parseKiosk(rows) : parsePetpooja(rows, detected.channel);

  if (report.items.length === 0) {
    return {
      ok: false,
      error: "No sales line items could be parsed from this PDF.",
      detail: report.parsingErrors.join(" ") || undefined,
    };
  }

  let businessDate: string;
  if (report.calendarDateStart && report.calendarDateEnd) {
    if (report.calendarDateStart !== report.calendarDateEnd) {
      return {
        ok: false,
        error: "This report spans more than one calendar day.",
        detail: `Date: ${report.calendarDateStart} to ${report.calendarDateEnd}. Each import must be a single business day -- please export and upload one day at a time.`,
      };
    }
    if (options.businessDate && options.businessDate !== report.calendarDateStart) {
      return {
        ok: false,
        error: "The business date you entered doesn't match the date printed in the report.",
        detail: `The report says ${report.calendarDateStart}, but ${options.businessDate} was entered.`,
      };
    }
    businessDate = report.calendarDateStart;
  } else {
    if (!options.businessDate) {
      return {
        ok: false,
        error: "This report has no date printed in it.",
        detail: "This format (Kiosk) doesn't include a date in the file -- please confirm the business date for this upload.",
      };
    }
    businessDate = options.businessDate;
  }

  const { start: businessDayStart, end: businessDayEnd } = getBusinessDayBounds(businessDate);

  // These report formats are pre-aggregated daily totals with no per-order
  // clock time, so there's no timestamp to run through the 5am cutoff rule --
  // every line item is stamped with the confirmed business date directly.
  const candidates: CandidateLineItem[] = report.items.map((item) => ({
    channel: report.channel,
    category: item.category,
    itemName: item.itemName,
    quantity: item.quantity,
    amount: item.amount,
    calendarDate: businessDate,
    businessDate,
    businessDayStart,
    businessDayEnd,
    transactionTimestamp: null,
    transactionTime: null,
  }));

  const batchId = randomUUID();
  const upsertResult = upsertLineItems(candidates, batchId);
  const computed = sumItems(report.items);

  const notes: string[] = [];
  let status: ImportValidationStatus = "passed";

  if (report.grandTotalQuantity == null || report.grandTotalAmount == null) {
    status = "warning";
    notes.push("This report has no grand-total row to validate against; totals are unverified.");
  } else if (
    !approxEqual(computed.quantity, report.grandTotalQuantity, VALIDATION_EPSILON) ||
    !approxEqual(computed.amount, report.grandTotalAmount, VALIDATION_EPSILON)
  ) {
    status = "failed";
    notes.push(
      `Parsed totals (qty ${computed.quantity}, Rs ${computed.amount.toFixed(2)}) don't match the report's own total (qty ${report.grandTotalQuantity}, Rs ${report.grandTotalAmount.toFixed(2)}).`
    );
  }

  const badSubtotals = report.subtotalChecks.filter(
    (s) => !approxEqual(s.actualQuantity, s.expectedQuantity, VALIDATION_EPSILON) || !approxEqual(s.actualAmount, s.expectedAmount, VALIDATION_EPSILON)
  );
  if (badSubtotals.length > 0) {
    if (status === "passed") status = "warning";
    notes.push(`${badSubtotals.length} category subtotal(s) didn't reconcile: ${badSubtotals.map((s) => s.category).join(", ")}.`);
  }

  if (report.parsingErrors.length > 0) {
    if (status === "passed") status = "warning";
    notes.push(...report.parsingErrors);
  }

  const batch = insertImportBatch({
    id: batchId,
    fileName: options.fileName,
    channel: report.channel,
    businessDate,
    recordsFound: report.items.length,
    recordsInserted: upsertResult.inserted,
    recordsUpdated: upsertResult.updated,
    duplicatesSkipped: upsertResult.duplicates,
    parsingErrors: report.parsingErrors,
    validation: {
      status,
      expectedQuantity: report.grandTotalQuantity,
      expectedAmount: report.grandTotalAmount,
      actualQuantity: computed.quantity,
      actualAmount: computed.amount,
      quantityDiff: report.grandTotalQuantity != null ? computed.quantity - report.grandTotalQuantity : null,
      amountDiff: report.grandTotalAmount != null ? computed.amount - report.grandTotalAmount : null,
      notes,
    },
    hasHourlyData: false,
  });

  return { ok: true, batch };
}
