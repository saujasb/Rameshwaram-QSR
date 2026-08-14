// Petpooja "Item Wise: Sales Report" export (both the in-store/offline POS
// and the Online variant share this exact layout). After column-aware
// extraction:
//   ["Date:", "<yyyy-mm-dd> to <yyyy-mm-dd>"]
//   ["Name:", "Item Wise: Sales Report"]
//   ["Restaurant Name:", "<restaurant>"]
//   ["Category","Item"]                       <- label-section header
//   ["Total"] ["Min."] ["Max."] ["Avg."]       <- report-level stat rows
//   ["<category>","<first item in category>"] <- new category + its first item
//   ["<item>"]                              x N  <- more items in that category
//   ["Sub Total"]                              <- category subtotal
//   ... (repeats per category)
//   ["Code","Sap Code","Qty.","Total (","₹)"]  <- value-section header
//   ["<qty>","<amount>"]                       <- one value row per label row above, same order
//
// Every label row after the header (stat, category+item, item, subtotal)
// consumes exactly one value row in the same sequence, regardless of what
// appears in the value row's leading "Code" cell(s) -- so we always read the
// LAST two cells of a value row as (quantity, amount) and zip label/value
// rows 1:1 by position.
import type { SalesChannel } from "../../../../../shared-types/sales.js";
import type { ParsedReport, ParsedLineItem, ParsedSubtotalCheck } from "../parseTypes.js";
import { parseNumber, round2 } from "../numbers.js";

const STAT_LABELS = new Set(["Total", "Min.", "Max.", "Avg."]);

function parseDateRange(rows: string[][]): { start: string | null; end: string | null } {
  const dateRow = rows.find((r) => r[0] === "Date:");
  const raw = dateRow?.[1] ?? "";
  const match = raw.match(/^(\d{4}-\d{2}-\d{2})\s+to\s+(\d{4}-\d{2}-\d{2})$/);
  if (!match) return { start: null, end: null };
  return { start: match[1], end: match[2] };
}

function isValueHeader(row: string[]): boolean {
  return row[0] === "Code" && row.includes("Sap Code") && row.some((c) => c.startsWith("Qty"));
}

function lastTwoNumbers(row: string[]): { quantity: number; amount: number } | null {
  if (row.length < 2) return null;
  const amount = parseNumber(row[row.length - 1]);
  const quantity = parseNumber(row[row.length - 2]);
  if (amount == null || quantity == null) return null;
  return { quantity, amount };
}

export function parsePetpooja(rows: string[][], channel: SalesChannel): ParsedReport {
  const errors: string[] = [];
  const items: ParsedLineItem[] = [];
  const subtotalChecks: ParsedSubtotalCheck[] = [];
  const { start: calendarDateStart, end: calendarDateEnd } = parseDateRange(rows);
  if (!calendarDateStart) errors.push("Could not find/parse the report's Date: header row.");

  const labelHeaderIdx = rows.findIndex((r) => r[0] === "Category" && r[1] === "Item");
  const valueHeaderIdx = rows.findIndex(isValueHeader);

  let grandTotalQuantity: number | null = null;
  let grandTotalAmount: number | null = null;

  if (labelHeaderIdx === -1) errors.push("Could not find the Category / Item header row.");
  if (valueHeaderIdx === -1) errors.push("Could not find the Code / Sap Code / Qty. / Total header row.");

  if (labelHeaderIdx !== -1 && valueHeaderIdx !== -1) {
    const labelRows = rows.slice(labelHeaderIdx + 1, valueHeaderIdx);
    const valueRows = rows.slice(valueHeaderIdx + 1);

    if (labelRows.length !== valueRows.length) {
      errors.push(
        `Label rows (${labelRows.length}) and value rows (${valueRows.length}) don't line up -- the report layout may have changed.`
      );
    }

    let currentCategory = "";
    let runningQuantity = 0;
    let runningAmount = 0;
    const n = Math.min(labelRows.length, valueRows.length);

    for (let i = 0; i < n; i++) {
      const label = labelRows[i];
      const value = valueRows[i];
      const nums = lastTwoNumbers(value);
      if (!nums) {
        errors.push(`Row ${i + 1} (label ${JSON.stringify(label)}): could not parse a quantity/amount pair from ${JSON.stringify(value)}.`);
        continue;
      }

      if (label.length === 1 && STAT_LABELS.has(label[0])) {
        if (label[0] === "Total") {
          grandTotalQuantity = nums.quantity;
          grandTotalAmount = nums.amount;
        }
        continue;
      }

      if (label.length === 1 && label[0] === "Sub Total") {
        subtotalChecks.push({
          category: currentCategory,
          expectedQuantity: nums.quantity,
          expectedAmount: nums.amount,
          actualQuantity: round2(runningQuantity),
          actualAmount: round2(runningAmount),
        });
        runningQuantity = 0;
        runningAmount = 0;
        continue;
      }

      if (label.length === 2) {
        currentCategory = label[0];
        items.push({ category: currentCategory, itemName: label[1], quantity: nums.quantity, amount: nums.amount });
        runningQuantity += nums.quantity;
        runningAmount += nums.amount;
        continue;
      }

      if (label.length === 1) {
        items.push({ category: currentCategory, itemName: label[0], quantity: nums.quantity, amount: nums.amount });
        runningQuantity += nums.quantity;
        runningAmount += nums.amount;
        continue;
      }

      errors.push(`Row ${i + 1}: unrecognized label row shape ${JSON.stringify(label)}.`);
    }
  }

  return {
    channel,
    calendarDateStart,
    calendarDateEnd,
    items,
    grandTotalQuantity,
    grandTotalAmount,
    subtotalChecks,
    parsingErrors: errors,
  };
}
