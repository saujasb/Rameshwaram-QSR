// Rameshwaram's trading day does not follow the calendar day. The official
// outlet business day runs 04:30 -> 04:29:59.999 the next calendar day, so a
// 1:00 AM order belongs to the PREVIOUS business date (e.g. an order at
// 21 Sep 01:00 AM is part of the 20 Sep business day), and an early opening
// at 04:45 AM correctly starts the NEW business day.
//
// Every sales/production/wastage calculation must go through this file rather
// than reading a raw calendar date, so the rule is applied consistently. The
// start hour is configurable per-dataset (dataset_records' own admin setting,
// persisted server-side via getBusinessDayStartHour()); callers that don't
// pass one get the 04:30 default, which is the one true value for live
// provider_orders sales (Dashboard, Sales & Revenue, Live Orders, Ask
// Anything) -- there is no separate/competing definition for those.
export const DEFAULT_BUSINESS_DAY_START_HOUR = 4.5;

/** Kept as a named export for callers that only need the default. */
export const BUSINESS_DAY_START_HOUR = DEFAULT_BUSINESS_DAY_START_HOUR;

/** The trading window is always 24h long, just offset -- 04:30 -> 04:30(+1). */
export const BUSINESS_DAY_LENGTH_HOURS = 24;

// The outlet's fixed timezone (Rameshwaram Café, Brookefield, Bengaluru,
// India = IST, UTC+5:30). Hardcoded rather than read from the process/
// browser's local timezone: this code runs in local dev (often IST already,
// which can mask bugs), in Vercel serverless functions (UTC by default,
// unless a TZ env var is set -- none is), and in whatever timezone a
// browser tab happens to be in. "What business day is it" and "is this order
// before or after 04:30" must mean the same thing regardless of where the
// code executes, so every timestamp is explicitly resolved into this zone
// rather than trusting `Date.prototype.getHours()`'s runtime-dependent
// local-time behavior.
const OUTLET_UTC_OFFSET_MINUTES = 330; // +05:30
const OUTLET_UTC_OFFSET_SUFFIX = "+05:30";

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function shiftDateKey(dateKey: string, days: number): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return toDateKey(dt);
}

export function isDateKey(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export interface OutletLocalParts {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number; // 0-23
  minute: number;
  second: number;
}

/**
 * Resolves a timestamp to its Y/M/D/H/M/S components in the outlet's fixed
 * local timezone (IST) -- never the executing process's own timezone.
 *
 * A string carrying an explicit zone (trailing Z, or a +HH:MM/-HH:MM offset)
 * is an unambiguous absolute instant and is converted into IST. A bare
 * "YYYY-MM-DD HH:mm:ss" / "YYYY-MM-DDTHH:mm:ss" string -- Petpooja's own
 * providerCreatedAt format, and every dataset-import timestamp -- is already
 * the outlet's own wall-clock reading and is used verbatim, never
 * reinterpreted as if it were UTC or the runtime's local zone. A `Date`
 * object (e.g. `new Date()` for "now") is always an absolute instant, so it
 * always takes the shift-into-IST path.
 */
export function toOutletLocalParts(timestamp: Date | string): OutletLocalParts {
  if (typeof timestamp === "string") {
    const trimmed = timestamp.trim();
    const hasExplicitZone = /(?:[zZ]|[+-]\d{2}:?\d{2})$/.test(trimmed);
    const naive = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/);
    if (!hasExplicitZone && naive) {
      const [, y, mo, d, h, mi, s] = naive;
      return { year: Number(y), month: Number(mo), day: Number(d), hour: Number(h), minute: Number(mi), second: Number(s) };
    }
  }
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  const ist = new Date(date.getTime() + OUTLET_UTC_OFFSET_MINUTES * 60_000);
  return {
    year: ist.getUTCFullYear(),
    month: ist.getUTCMonth() + 1,
    day: ist.getUTCDate(),
    hour: ist.getUTCHours(),
    minute: ist.getUTCMinutes(),
    second: ist.getUTCSeconds(),
  };
}

/**
 * Given a transaction timestamp, return the business date (YYYY-MM-DD) it
 * belongs to: the calendar date (in outlet-local time) if the clock time is
 * >= startHour, otherwise the previous calendar date. startHour may be
 * fractional (4.5 = 04:30); compared at minute precision so e.g. 04:29 and
 * 04:30 fall on opposite sides of a 4.5 boundary.
 */
export function getBusinessDate(timestamp: Date | string, startHour = DEFAULT_BUSINESS_DAY_START_HOUR): string {
  const { year, month, day, hour, minute } = toOutletLocalParts(timestamp);
  const calendarKey = `${year}-${pad2(month)}-${pad2(day)}`;
  const minutesOfDay = hour * 60 + minute;
  const startMinutes = Math.round(startHour * 60);
  return minutesOfDay < startMinutes ? shiftDateKey(calendarKey, -1) : calendarKey;
}

export function getCurrentBusinessDate(startHour = DEFAULT_BUSINESS_DAY_START_HOUR): string {
  return getBusinessDate(new Date(), startHour);
}

/**
 * Bounds of a business date as unambiguous, explicit-offset instants
 * (+05:30) -- safe to use directly as SQL/JS comparison values regardless of
 * the database session's or process's own timezone, unlike a naive
 * zone-less string.
 */
export function getBusinessDayBounds(
  businessDate: string,
  startHour = DEFAULT_BUSINESS_DAY_START_HOUR
): { start: string; end: string } {
  const nextDay = shiftDateKey(businessDate, 1);
  const totalMinutes = Math.round(startHour * 60);
  const hh = pad2(Math.floor(totalMinutes / 60));
  const mm = pad2(totalMinutes % 60);
  return {
    start: `${businessDate}T${hh}:${mm}:00${OUTLET_UTC_OFFSET_SUFFIX}`,
    end: `${nextDay}T${hh}:${mm}:00${OUTLET_UTC_OFFSET_SUFFIX}`,
  };
}

export function isWithinBusinessDay(
  timestamp: Date | string,
  businessDate: string,
  startHour = DEFAULT_BUSINESS_DAY_START_HOUR
): boolean {
  return getBusinessDate(timestamp, startHour) === businessDate;
}

/**
 * Position of a timestamp within its business day, 0..23 (outlet-local
 * clock hour). Hour 0 is the business-day start hour, so a 01:00 AM
 * transaction on a 04:30-start day sits near the end of its own business
 * day's curve. The raw clock hour is preserved separately (getClockHour).
 */
export function getBusinessHourSlot(timestamp: Date | string, startHour = DEFAULT_BUSINESS_DAY_START_HOUR): number {
  const hour = getClockHour(timestamp);
  return (hour - Math.floor(startHour) + BUSINESS_DAY_LENGTH_HOURS) % BUSINESS_DAY_LENGTH_HOURS;
}

/** Clock hour (0-23), in outlet-local time, exactly as it appears on the original transaction. Never derived from the business date. */
export function getClockHour(timestamp: Date | string): number {
  return toOutletLocalParts(timestamp).hour;
}

/** "05:00–06:00 AM" style label for an hourly bucket, from a raw clock hour. */
export function formatHourBucket(clockHour: number): string {
  const fmt = (h: number) => {
    const suffix = h < 12 || h === 24 ? "AM" : "PM";
    const display = h % 12 === 0 ? 12 : h % 12;
    return `${display}${suffix}`;
  };
  return `${fmt(clockHour)}–${fmt((clockHour + 1) % 24)}`;
}

/** "13 Aug 2026" -- for headers and cards that show the active business date. */
export function formatBusinessDateLong(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/** "13 Aug" -- for compact chart axes and markers. */
export function formatBusinessDateShort(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

/** Inclusive list of business dates from -> to. Guards against reversed/huge ranges. */
export function businessDateRange(from: string, to: string, maxDays = 400): string[] {
  const out: string[] = [];
  let cursor = from;
  for (let i = 0; i < maxDays; i++) {
    out.push(cursor);
    if (cursor >= to) break;
    cursor = shiftDateKey(cursor, 1);
  }
  return out;
}
