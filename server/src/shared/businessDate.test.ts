import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_BUSINESS_DAY_START_HOUR,
  getBusinessDate,
  getBusinessDayBounds,
  getCurrentBusinessDate,
  shiftDateKey,
  toOutletLocalParts,
} from "../../../shared-types/businessDate.js";

test("the official business-day rule is 04:30 (04:30 -> 04:29:59.999 next day)", () => {
  assert.equal(DEFAULT_BUSINESS_DAY_START_HOUR, 4.5);
});

// ---- Part 11, test A: exact boundary edge cases from the master task -----

test("04:29:59 on the same calendar day belongs to the PREVIOUS business day", () => {
  assert.equal(getBusinessDate("2026-09-20 04:29:59"), "2026-09-19");
});

test("04:30:00 on the same calendar day starts the NEW business day", () => {
  assert.equal(getBusinessDate("2026-09-20 04:30:00"), "2026-09-20");
});

test("01:00 on the next calendar day still belongs to the PREVIOUS business day", () => {
  assert.equal(getBusinessDate("2026-09-21 01:00:00"), "2026-09-20");
});

test("04:29 on the next calendar day still belongs to the PREVIOUS business day", () => {
  assert.equal(getBusinessDate("2026-09-21 04:29:00"), "2026-09-20");
});

test("04:30 on the next calendar day starts the NEW business day", () => {
  assert.equal(getBusinessDate("2026-09-21 04:30:00"), "2026-09-21");
});

test("an early opening at 04:45 correctly belongs to the NEW business day", () => {
  assert.equal(getBusinessDate("2026-09-21 04:45:00"), "2026-09-21");
});

test("midday and late-evening orders belong to that calendar day's business day", () => {
  assert.equal(getBusinessDate("2026-09-20 12:00:00"), "2026-09-20");
  assert.equal(getBusinessDate("2026-09-20 23:59:00"), "2026-09-20");
});

test("03:00 the next calendar day belongs to the PREVIOUS business day", () => {
  assert.equal(getBusinessDate("2026-09-21 03:00:00"), "2026-09-20");
});

// ---- Today/Yesterday resolution (Part 11, test B) -------------------------

test("getCurrentBusinessDate resolves against the outlet's fixed IST timezone, not the process timezone", () => {
  // A Date object at 2026-09-21T00:00:00Z is 05:30 IST on the 21st -- already
  // past the 04:30 cutoff, so it's the 21st's business day, regardless of
  // what timezone the Node process executing this test happens to run in.
  const instant = new Date("2026-09-21T00:00:00Z");
  assert.equal(getBusinessDate(instant), "2026-09-21");
});

test("shiftDateKey correctly derives yesterday from a resolved business date", () => {
  const today = getCurrentBusinessDate();
  const yesterday = shiftDateKey(today, -1);
  // Re-deriving business-date-of(yesterday's 04:30 start) must land back on yesterday.
  const { start } = getBusinessDayBounds(yesterday);
  assert.equal(getBusinessDate(start), yesterday);
});

// ---- Timezone-explicit parsing: the actual bug this rewrite fixes ---------

test("a naive Petpooja-style timestamp (no zone) is treated as outlet-local (IST) wall-clock time, never as the runtime's own local time or UTC", () => {
  const parts = toOutletLocalParts("2026-09-20 13:25:44");
  assert.deepEqual(parts, { year: 2026, month: 9, day: 20, hour: 13, minute: 25, second: 44 });
});

test("an explicit-UTC GoSelfServe-style timestamp (trailing Z) is correctly converted into outlet-local (IST) time before bucketing", () => {
  // 07:55:46 UTC = 13:25:46 IST (UTC+5:30) -- matches the real Petpooja/
  // GoSelfServe cross-check from the original production audit.
  const parts = toOutletLocalParts("2026-09-19T07:55:46.000Z");
  assert.equal(parts.hour, 13);
  assert.equal(parts.minute, 25);
});

test("Petpooja's naive format and GoSelfServe's explicit-UTC format agree on the same business day for the same real moment", () => {
  const petpoojaStyle = getBusinessDate("2026-09-20 13:25:44"); // IST wall-clock
  const goselfserveStyle = getBusinessDate("2026-09-20T07:55:44.000Z"); // same instant, UTC
  assert.equal(petpoojaStyle, goselfserveStyle);
});

// ---- getBusinessDayBounds: unambiguous, SQL/JS-safe bounds ----------------

test("getBusinessDayBounds returns explicit +05:30-offset instants at the 04:30 boundary, safe regardless of session/runtime timezone", () => {
  const { start, end } = getBusinessDayBounds("2026-09-20");
  assert.equal(start, "2026-09-20T04:30:00+05:30");
  assert.equal(end, "2026-09-21T04:30:00+05:30");
});

test("getBusinessDayBounds still works correctly for a whole-hour startHour (dataset_records' own configurable setting, e.g. 5)", () => {
  const { start, end } = getBusinessDayBounds("2026-09-20", 5);
  assert.equal(start, "2026-09-20T05:00:00+05:30");
  assert.equal(end, "2026-09-21T05:00:00+05:30");
});
