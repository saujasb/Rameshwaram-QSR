import { getBusinessDayBounds, getCurrentBusinessDate, shiftDateKey } from "@shared/businessDate";

/**
 * The one standard date-range selection used across Sales & Revenue and Live
 * Orders. Deliberately no "Last 30 Days" / "All Time" -- anything wider is a
 * Custom Date Range with explicit start and end dates.
 */
export type DateRangePreset = "today" | "previous_day" | "last7" | "custom";

export interface DateRangeValue {
  preset: DateRangePreset;
  /** Business-date key (YYYY-MM-DD), only used when preset === "custom". */
  customFrom: string;
  /** Business-date key (YYYY-MM-DD), only used when preset === "custom". */
  customTo: string;
}

export const DATE_RANGE_PRESET_OPTIONS: { value: DateRangePreset; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "previous_day", label: "Previous Day" },
  { value: "last7", label: "Last 7 Days" },
  { value: "custom", label: "Custom Date Range" },
];

export function defaultDateRange(): DateRangeValue {
  const today = getCurrentBusinessDate();
  return { preset: "today", customFrom: today, customTo: today };
}

/**
 * Inclusive business-date keys for the selection -- the shape the
 * sales-summary / item-sales endpoints take. A custom range entered backwards
 * (end before start) is swapped rather than returning nothing; a custom range
 * with a missing date falls back to that single day.
 */
export function resolveBusinessDateRange(value: DateRangeValue): { from: string; to: string } {
  const today = getCurrentBusinessDate();
  if (value.preset === "today") return { from: today, to: today };
  if (value.preset === "previous_day") {
    const y = shiftDateKey(today, -1);
    return { from: y, to: y };
  }
  if (value.preset === "last7") return { from: shiftDateKey(today, -6), to: today };
  const start = value.customFrom || value.customTo || today;
  const end = value.customTo || value.customFrom || today;
  return start <= end ? { from: start, to: end } : { from: end, to: start };
}

/**
 * Inclusive-from / exclusive-to instants for the selection, on the same 04:30
 * outlet business-day boundary (shared-types/businessDate.ts) -- the shape the
 * paginated provider_orders list takes. getBusinessDayBounds() returns explicit
 * +05:30-offset instants, so these are safe regardless of the server's runtime
 * timezone.
 */
export function resolveInstantRange(value: DateRangeValue): { from: string; to: string } {
  const { from, to } = resolveBusinessDateRange(value);
  return { from: getBusinessDayBounds(from).start, to: getBusinessDayBounds(to).end };
}

/** "2026-09-23" for a single day, "2026-09-17 – 2026-09-23" for a span. */
export function formatBusinessDateRange(from?: string, to?: string): string {
  if (!from) return "";
  return !to || from === to ? from : `${from} – ${to}`;
}
