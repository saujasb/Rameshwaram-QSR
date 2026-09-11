---
source_file: "shared-types/businessDate.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# businessDate.ts

## Connections
- [[AppShell.tsx]] - `imports_from` [EXTRACTED]
- [[BUSINESS_DAY_LENGTH_HOURS]] - `contains` [EXTRACTED]
- [[BUSINESS_DAY_START_HOUR]] - `contains` [EXTRACTED]
- [[BusinessDayTimeline.tsx]] - `imports_from` [EXTRACTED]
- [[DEFAULT_BUSINESS_DAY_START_HOUR]] - `contains` [EXTRACTED]
- [[DashboardPage.tsx]] - `imports_from` [EXTRACTED]
- [[DataExplorerPage.tsx]] - `imports_from` [EXTRACTED]
- [[ImportCenterPage.tsx]] - `imports_from` [EXTRACTED]
- [[SalesAnalyticsPage.tsx]] - `imports_from` [EXTRACTED]
- [[SalesImportPage.tsx]] - `imports_from` [EXTRACTED]
- [[SalesTrendChart.tsx]] - `imports_from` [EXTRACTED]
- [[SettingsPage.tsx]] - `imports_from` [EXTRACTED]
- [[ShiftPerformancePage.tsx]] - `imports_from` [EXTRACTED]
- [[TodaysIntelligencePanel.tsx]] - `imports_from` [EXTRACTED]
- [[analysis.ts]] - `imports_from` [EXTRACTED]
- [[anomalies.ts]] - `imports_from` [EXTRACTED]
- [[businessDateRange()]] - `contains` [EXTRACTED]
- [[coerce.ts]] - `imports_from` [EXTRACTED]
- [[datasetsimportPipeline.ts]] - `imports_from` [EXTRACTED]
- [[datasetsrepository.ts]] - `imports_from` [EXTRACTED]
- [[engine.ts]] - `imports_from` [EXTRACTED]
- [[formatBusinessDateLong()]] - `contains` [EXTRACTED]
- [[formatBusinessDateShort()]] - `contains` [EXTRACTED]
- [[formatHourBucket()]] - `contains` [EXTRACTED]
- [[getBusinessDate()]] - `contains` [EXTRACTED]
- [[getBusinessDayBounds()]] - `contains` [EXTRACTED]
- [[getBusinessHourSlot()]] - `contains` [EXTRACTED]
- [[getClockHour()]] - `contains` [EXTRACTED]
- [[getCurrentBusinessDate()]] - `contains` [EXTRACTED]
- [[insights.ts]] - `imports_from` [EXTRACTED]
- [[intelligenceroutes.ts]] - `imports_from` [EXTRACTED]
- [[intents.ts]] - `imports_from` [EXTRACTED]
- [[isDateKey()]] - `contains` [EXTRACTED]
- [[isWithinBusinessDay()]] - `contains` [EXTRACTED]
- [[normalize.ts]] - `imports_from` [EXTRACTED]
- [[pad2()_1]] - `contains` [EXTRACTED]
- [[reconciliation.ts]] - `imports_from` [EXTRACTED]
- [[salesimportPipeline.ts]] - `imports_from` [EXTRACTED]
- [[shiftDateKey()]] - `contains` [EXTRACTED]
- [[toDateKey()]] - `contains` [EXTRACTED]

## Source
**Full file:** `shared-types/businessDate.ts`
```typescript
// Rameshwaram's trading day does not follow the calendar day. A "business day"
// runs from BUSINESS_DAY_START_HOUR (default 05:00) to that same hour the next
// calendar day, so late-night sales (e.g. 14 Aug 01:30 AM) belong to the
// PREVIOUS business date (13 Aug), not the calendar date printed by the POS.
//
// Every sales/production/wastage calculation must go through this file rather
// than reading a raw calendar date, so the rule is applied consistently. The
// start hour is configurable (admin setting, persisted server-side); callers
// that don't pass one get the default.
export const DEFAULT_BUSINESS_DAY_START_HOUR = 5;

/** Kept as a named export for callers that only need the default. */
export const BUSINESS_DAY_START_HOUR = DEFAULT_BUSINESS_DAY_START_HOUR;

/** The trading window is always 24h long, just offset -- 05:00 -> 05:00(+1). */
export const BUSINESS_DAY_LENGTH_HOURS = 24;

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

/**
 * Given a transaction timestamp, return the business date (YYYY-MM-DD) it
 * belongs to: the calendar date if the clock time is >= startHour, otherwise
 * the previous calendar date.
 */
export function getBusinessDate(timestamp: Date | string, startHour = DEFAULT_BUSINESS_DAY_START_HOUR): string {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  const calendarKey = toDateKey(date);
  return date.getHours() < startHour ? shiftDateKey(calendarKey, -1) : calendarKey;
}

export function getCurrentBusinessDate(startHour = DEFAULT_BUSINESS_DAY_START_HOUR): string {
  return getBusinessDate(new Date(), startHour);
}

/** ISO bounds (local time, no timezone suffix) of a business date: startHour that date -> startHour the next. */
export function getBusinessDayBounds(
  businessDate: string,
  startHour = DEFAULT_BUSINESS_DAY_START_HOUR
): { start: string; end: string } {
  const nextDay = shiftDateKey(businessDate, 1);
  const hh = pad2(startHour);
  return { start: `${businessDate}T${hh}:00:00`, end: `${nextDay}T${hh}:00:00` };
}

export function isWithinBusinessDay(
  timestamp: Date | string,
  businessDate: string,
  startHour = DEFAULT_BUSINESS_DAY_START_HOUR
): boolean {
  return getBusinessDate(timestamp, startHour) === businessDate;
}

/**
 * Position of a timestamp within its business day, 0..23. Hour 0 is the
 * business-day start hour, so a 01:00 AM transaction on a 05:00-start day sits
 * at slot 20 -- which is what "late night belongs to yesterday's curve" means
 * on an hourly chart. The raw clock hour is preserved separately.
 */
export function getBusinessHourSlot(timestamp: Date | string, startHour = DEFAULT_BUSINESS_DAY_START_HOUR): number {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  return (date.getHours() - startHour + BUSINESS_DAY_LENGTH_HOURS) % BUSINESS_DAY_LENGTH_HOURS;
}

/** Clock hour (0-23) exactly as it appears on the original transaction. Never derived from the business date. */
export function getClockHour(timestamp: Date | string): number {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  return date.getHours();
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
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine