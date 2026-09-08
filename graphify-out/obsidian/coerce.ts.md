---
source_file: "server/src/entities/datasets/coerce.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# coerce.ts

## Connections
- [[DATE_PATTERNS]] - `contains` [EXTRACTED]
- [[EXCEL_EPOCH_MS]] - `contains` [EXTRACTED]
- [[MONTHS_1]] - `contains` [EXTRACTED]
- [[buildIso()]] - `contains` [EXTRACTED]
- [[businessDate.ts]] - `imports_from` [EXTRACTED]
- [[coerceDateKey()]] - `contains` [EXTRACTED]
- [[coerceNumber()]] - `contains` [EXTRACTED]
- [[coerceText()]] - `contains` [EXTRACTED]
- [[coerceTime()]] - `contains` [EXTRACTED]
- [[coerceTimestamp()]] - `contains` [EXTRACTED]
- [[excel.ts]] - `imports_from` [EXTRACTED]
- [[excelSerialToDate()]] - `contains` [EXTRACTED]
- [[localIso()]] - `contains` [EXTRACTED]
- [[looksLikeFormula()]] - `contains` [EXTRACTED]
- [[normalize.ts]] - `imports_from` [EXTRACTED]
- [[parseTextualDate()]] - `contains` [EXTRACTED]
- [[productKeyOf()_1]] - `contains` [EXTRACTED]
- [[toDateKey()]] - `imports` [EXTRACTED]
- [[validDateParts()]] - `contains` [EXTRACTED]

## Source
**Full file:** `server/src/entities/datasets/coerce.ts`
```typescript
import { toDateKey } from "../../../../shared-types/businessDate.js";

// Excel/PDF cells arrive as anything: JS Dates, Excel serial numbers, "16/08/2026",
// "16-Aug-26", "1,234.50", "Rs 1,234", " 12 ". These helpers coerce them without
// ever inventing a value -- every failure returns null so the caller can flag
// the row instead of silently substituting a default.

/** Excel's epoch is 1899-12-30 (accounting for its 1900 leap-year bug). */
const EXCEL_EPOCH_MS = Date.UTC(1899, 11, 30);
const MS_PER_DAY = 86400000;

/** Excel serials outside this band are almost certainly not dates. */
const MIN_SERIAL = 20000; // ~1954
const MAX_SERIAL = 80000; // ~2119

export function excelSerialToDate(serial: number): Date | null {
  if (!Number.isFinite(serial) || serial < MIN_SERIAL || serial > MAX_SERIAL) return null;
  // Excel stores times as binary day-fractions, so 23:05 can come back as
  // 23:04:59.9997. Snap to the nearest whole second BEFORE splitting into
  // components: without this, a 05:00:00 entry can arrive as 04:59:59 and get
  // bucketed into the previous business day.
  const ms = Math.round((EXCEL_EPOCH_MS + serial * MS_PER_DAY) / 1000) * 1000;
  const d = new Date(ms);
  // Rebuild in local time so downstream getHours()/business-date logic matches
  // the wall-clock time the operator actually saw in the spreadsheet.
  return new Date(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
    Math.round(d.getUTCSeconds())
  );
}

const DATE_PATTERNS: { re: RegExp; build: (m: RegExpMatchArray) => [number, number, number] }[] = [
  // 2026-08-16
  { re: /^(\d{4})-(\d{1,2})-(\d{1,2})$/, build: (m) => [Number(m[1]), Number(m[2]), Number(m[3])] },
  // 16/08/2026 or 16-08-2026 (day-first, the Indian convention these exports use)
  { re: /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/, build: (m) => [Number(m[3]), Number(m[2]), Number(m[1])] },
  // 16/08/26
  { re: /^(\d{1,2})[/-](\d{1,2})[/-](\d{2})$/, build: (m) => [2000 + Number(m[3]), Number(m[2]), Number(m[1])] },
];

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

function parseTextualDate(raw: string): [number, number, number] | null {
  // 16-Aug-2026 / 16 Aug 26 / Aug 16 2026
  const cleaned = raw.replace(/,/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
  let m = cleaned.match(/^(\d{1,2})[\s-]+([a-z]{3,})[\s-]+(\d{2,4})$/);
  if (m) {
    const mi = MONTHS.indexOf(m[2].slice(0, 3));
    if (mi >= 0) {
      const yr = Number(m[3]);
      return [yr < 100 ? 2000 + yr : yr, mi + 1, Number(m[1])];
    }
  }
  m = cleaned.match(/^([a-z]{3,})[\s-]+(\d{1,2})[\s-]+(\d{2,4})$/);
  if (m) {
    const mi = MONTHS.indexOf(m[1].slice(0, 3));
    if (mi >= 0) {
      const yr = Number(m[3]);
      return [yr < 100 ? 2000 + yr : yr, mi + 1, Number(m[2])];
    }
  }
  return null;
}

function validDateParts(y: number, mo: number, d: number): boolean {
  if (!Number.isInteger(y) || !Number.isInteger(mo) || !Number.isInteger(d)) return false;
  if (y < 2000 || y > 2100 || mo < 1 || mo > 12 || d < 1 || d > 31) return false;
  const dt = new Date(y, mo - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === mo - 1 && dt.getDate() === d;
}

/** Parses a time-of-day cell into {h, m, s}, or null. Handles "14:30", "2:30 PM", Excel fractions. */
export function coerceTime(value: unknown): { h: number; m: number; s: number } | null {
  if (value == null || value === "") return null;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return { h: value.getHours(), m: value.getMinutes(), s: value.getSeconds() };
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    // Excel stores a bare time as a day fraction (0 <= v < 1).
    if (value >= 0 && value < 1) {
      const totalSec = Math.round(value * 86400);
      return { h: Math.floor(totalSec / 3600) % 24, m: Math.floor((totalSec % 3600) / 60), s: totalSec % 60 };
    }
    // A whole number 0-23 is an hour column.
    if (Number.isInteger(value) && value >= 0 && value <= 23) return { h: value, m: 0, s: 0 };
    return null;
  }

  const raw = String(value).trim().toLowerCase();
  const ampm = raw.match(/^(\d{1,2})(?::(\d{2}))?(?::(\d{2}))?\s*(am|pm)$/);
  if (ampm) {
    let h = Number(ampm[1]) % 12;
    if (ampm[4] === "pm") h += 12;
    return { h, m: Number(ampm[2] ?? 0), s: Number(ampm[3] ?? 0) };
  }
  const hms = raw.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (hms) {
    const h = Number(hms[1]);
    const m = Number(hms[2]);
    const s = Number(hms[3] ?? 0);
    if (h <= 23 && m <= 59 && s <= 59) return { h, m, s };
  }
  return null;
}

/** Parses a date-ish cell into a calendar date key (YYYY-MM-DD), or null. */
export function coerceDateKey(value: unknown): string | null {
  if (value == null || value === "") return null;

  if (value instanceof Date && !Number.isNaN(value.getTime())) return toDateKey(value);

  if (typeof value === "number") {
    const d = excelSerialToDate(value);
    return d ? toDateKey(d) : null;
  }

  const raw = String(value).trim();
  if (!raw) return null;

  // An ISO timestamp inside a date column.
  const isoLike = raw.match(/^(\d{4}-\d{2}-\d{2})[T ]/);
  if (isoLike) return isoLike[1];

  for (const p of DATE_PATTERNS) {
    const m = raw.match(p.re);
    if (m) {
      const [y, mo, d] = p.build(m);
      if (validDateParts(y, mo, d)) return toDateKey(new Date(y, mo - 1, d));
    }
  }

  const textual = parseTextualDate(raw);
  if (textual && validDateParts(textual[0], textual[1], textual[2])) {
    return toDateKey(new Date(textual[0], textual[1] - 1, textual[2]));
  }

  // Numeric string that is really an Excel serial.
  if (/^\d+(\.\d+)?$/.test(raw)) {
    const d = excelSerialToDate(Number(raw));
    if (d) return toDateKey(d);
  }
  return null;
}

/**
 * Builds a full local timestamp from whatever time information the row has.
 * Returns null when there is no *time* -- we never fabricate a clock time from
 * a date-only cell, because that would invent an hour the business never saw.
 */
export function coerceTimestamp(
  timestampCell: unknown,
  dateCell: unknown,
  timeCell: unknown
): { iso: string; dateKey: string; hour: number } | null {
  // A single cell carrying both date and time.
  if (timestampCell != null && timestampCell !== "") {
    if (timestampCell instanceof Date && !Number.isNaN(timestampCell.getTime())) {
      const d = timestampCell;
      if (d.getHours() || d.getMinutes() || d.getSeconds()) {
        return { iso: localIso(d), dateKey: toDateKey(d), hour: d.getHours() };
      }
    }
    if (typeof timestampCell === "number") {
      const d = excelSerialToDate(timestampCell);
      // Only treat as a timestamp when it carries a fractional (time) component.
      if (d && Math.abs(timestampCell % 1) > 1e-9) {
        return { iso: localIso(d), dateKey: toDateKey(d), hour: d.getHours() };
      }
    }
    const raw = String(timestampCell).trim();
    const parsedDate = coerceDateKey(raw);
    const inlineTime = raw.match(/[T ](\d{1,2}:\d{2}(?::\d{2})?)\s*(am|pm)?/i);
    if (parsedDate && inlineTime) {
      const t = coerceTime(`${inlineTime[1]}${inlineTime[2] ? ` ${inlineTime[2]}` : ""}`);
      if (t) return buildIso(parsedDate, t);
    }
  }

  // Separate date + time columns.
  const dateKey = coerceDateKey(dateCell ?? timestampCell);
  const t = coerceTime(timeCell);
  if (dateKey && t) return buildIso(dateKey, t);

  return null;
}

function buildIso(dateKey: string, t: { h: number; m: number; s: number }) {
  const [y, mo, d] = dateKey.split("-").map(Number);
  const dt = new Date(y, mo - 1, d, t.h, t.m, t.s);
  return { iso: localIso(dt), dateKey: toDateKey(dt), hour: dt.getHours() };
}

/** Local ISO without a timezone suffix, so it round-trips as wall-clock time. */
export function localIso(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

/** Parses a numeric measure. Returns null rather than 0 when unparseable. */
export function coerceNumber(value: unknown): number | null {
  if (value == null || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  let raw = String(value).trim();
  if (!raw) return null;
  // Accounting negatives: (1,234) => -1234
  const paren = raw.match(/^\((.*)\)$/);
  if (paren) raw = `-${paren[1]}`;
  raw = raw.replace(/[,\s]/g, "").replace(/^(rs\.?|inr)/i, "").replace(/%$/, "");
  raw = raw.replace(/[₹$]/g, "");
  if (raw === "" || raw === "-") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

/**
 * Trims a text cell and strips control characters. Punctuation is preserved --
 * product names legitimately contain it ("ABC (Apple Beetroot Cucumber)",
 * "Idli & Vada", "Ghee Ragi Dosa (2 Pcs)").
 */
export function coerceText(value: unknown): string | null {
  if (value == null) return null;
  const raw = String(value);
  let out = "";
  for (let i = 0; i < raw.length; i++) {
    const code = raw.charCodeAt(i);
    // Drop C0/C1 control characters; keep all printable punctuation, since
    // product names legitimately contain it ("ABC (Apple Beetroot Cucumber)").
    out += code < 32 || code === 127 ? " " : raw[i];
  }
  const cleaned = out.replace(/\s+/g, " ").trim();
  return cleaned === "" ? null : cleaned;
}

/** True when a cell's text would be interpreted as a formula by a spreadsheet. */
export function looksLikeFormula(value: unknown): boolean {
  if (value == null) return false;
  const raw = String(value);
  return /^[=+@]/.test(raw.trim()) && /[a-zA-Z(]/.test(raw);
}

export function productKeyOf(product: string): string {
  return product.trim().toLowerCase().replace(/\s+/g, " ");
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline