// Rameshwaram's trading day does not follow the calendar day. A "business day"
// runs 05:00 -> 03:00 the next calendar day, so late-night sales (e.g. 14 Aug
// 01:30 AM) belong to the PREVIOUS business date (13 Aug), not the calendar
// date printed by the POS. Every sales calculation must go through this file
// rather than reading a raw calendar date, so the rule is applied consistently.
export const BUSINESS_DAY_START_HOUR = 5;

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

/**
 * Given a transaction timestamp, return the business date (YYYY-MM-DD) it
 * belongs to: calendar date if the clock time is >= 05:00, otherwise the
 * previous calendar date.
 */
export function getBusinessDate(timestamp: Date | string): string {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  const calendarKey = toDateKey(date);
  return date.getHours() < BUSINESS_DAY_START_HOUR ? shiftDateKey(calendarKey, -1) : calendarKey;
}

export function getCurrentBusinessDate(): string {
  return getBusinessDate(new Date());
}

/** ISO bounds (local time, no timezone suffix) of a business date: 05:00 that date -> 03:00 the next. */
export function getBusinessDayBounds(businessDate: string): { start: string; end: string } {
  const nextDay = shiftDateKey(businessDate, 1);
  return {
    start: `${businessDate}T05:00:00`,
    end: `${nextDay}T03:00:00`,
  };
}

export function isWithinBusinessDay(timestamp: Date | string, businessDate: string): boolean {
  return getBusinessDate(timestamp) === businessDate;
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
