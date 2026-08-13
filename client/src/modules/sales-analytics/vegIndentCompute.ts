import type { VegIndentItem } from "@shared/analytics";

export interface VegIndentComputed extends VegIndentItem {
  diff: number | null;
  pct: number | null;
  status: string;
}

export function computeVegIndent(v: VegIndentItem): VegIndentComputed {
  let diff: number | null = null;
  let pct: number | null = null;
  let status: string;

  if (v.kind === "full") {
    if (v.orderQty == null) {
      status = "NO ORDER";
    } else if (v.requirement == null) {
      status = "SEE NOTE";
    } else {
      diff = v.orderQty - v.requirement;
      pct = v.requirement !== 0 ? diff / v.requirement : 0;
      status = Math.abs(pct) <= 0.01 ? "ON TARGET" : pct > 0 ? "OVER-ORDERED" : "UNDER-ORDERED";
    }
  } else if (v.kind === "blank") {
    status = v.orderQty ? "ORDERED, NO REQMT" : "NO REQMT STATED";
  } else if (v.kind === "none") {
    status = "NOT TRACKED";
  } else {
    status = "SEE NOTE";
  }

  return { ...v, diff, pct, status };
}
