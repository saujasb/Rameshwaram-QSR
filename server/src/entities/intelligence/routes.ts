import { Router } from "express";
import type { DatasetFilter, DatasetType } from "../../../../shared-types/datasets.js";
import type { TodaysIntelligence } from "../../../../shared-types/intelligence.js";
import { formatHourBucket, getCurrentBusinessDate } from "../../../../shared-types/businessDate.js";
import { getBusinessDayStartHour } from "../datasets/db.js";
import { hourlyBuckets, latestBusinessDate, totalsFor } from "../datasets/repository.js";
import { calculated, computeReconciliation, observed, unavailable } from "./reconciliation.js";
import { detectAnomalies } from "./anomalies.js";
import { buildInsights } from "./insights.js";

export const intelligenceRouter: Router = Router();

function parseFilter(q: Record<string, unknown>): DatasetFilter {
  const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);
  const dt = str(q.datasetType);
  return {
    from: str(q.from),
    to: str(q.to),
    datasetType: dt === "sales" || dt === "production" || dt === "wastage" ? (dt as DatasetType) : undefined,
    product: str(q.product),
    outlet: str(q.outlet),
    shift: str(q.shift),
  };
}

/**
 * "Today" defaults to the latest business date that actually HAS data rather
 * than the wall-clock business date: a manager opening the dashboard before the
 * day's report has been imported should see the last real day, clearly labelled,
 * not an empty page implying zero trade.
 */
function resolveBusinessDate(requested?: string): string {
  if (requested) return requested;
  return latestBusinessDate() ?? getCurrentBusinessDate(getBusinessDayStartHour());
}

function buildTodaysIntelligence(businessDate: string): TodaysIntelligence {
  const startHour = getBusinessDayStartHour();
  const range: DatasetFilter = { from: businessDate, to: businessDate };

  const sales = totalsFor({ ...range, datasetType: "sales" });
  const production = totalsFor({ ...range, datasetType: "production" });
  const wastage = totalsFor({ ...range, datasetType: "wastage" });

  const scope = `${businessDate} business day`;
  const hasSales = sales.recordCount > 0;
  const hasProduction = production.recordCount > 0;
  const hasWastage = wastage.recordCount > 0;

  const buckets = hourlyBuckets(range);
  const salesBuckets = buckets.filter((b) => b.salesValue > 0);
  const peak = salesBuckets.length
    ? salesBuckets.reduce((a, b) => (b.salesValue > a.salesValue ? b : a))
    : null;

  // Ratios need production as a denominator; without it they are genuinely
  // unknowable, so they report "unavailable" rather than 0.
  const ratio = (num: number, label: string) =>
    hasProduction && production.quantity > 0
      ? calculated((num / production.quantity) * 100, `${label} over ${production.quantity} produced units, ${scope}`)
      : unavailable(
          hasProduction
            ? `Production recorded as 0 units for ${scope}, so this ratio has no denominator`
            : `No production records imported for ${scope}`
        );

  return {
    businessDate,
    businessDayStartHour: startHour,
    salesValue: hasSales
      ? observed(sales.value, `${sales.recordCount} sales records, ${scope}`)
      : unavailable(`No sales records imported for ${scope}`),
    salesQty: hasSales
      ? observed(sales.quantity, `${sales.recordCount} sales records, ${scope}`)
      : unavailable(`No sales records imported for ${scope}`),
    productionQty: hasProduction
      ? observed(production.quantity, `${production.recordCount} production records, ${scope}`)
      : unavailable(`No production records imported for ${scope}`),
    wastageQty: hasWastage
      ? observed(wastage.quantity, `${wastage.recordCount} wastage records, ${scope}`)
      : unavailable(`No wastage records imported for ${scope}`),
    efficiencyPct: ratio(sales.quantity + wastage.quantity, "Sales plus wastage"),
    variancePct: ratio(production.quantity - sales.quantity - wastage.quantity, "Production minus sales and wastage"),
    sellThroughPct: ratio(sales.quantity, "Sales quantity"),
    wastagePct: ratio(wastage.quantity, "Wastage quantity"),
    peakHour: peak ? { hour: peak.hour, label: formatHourBucket(peak.hour), salesValue: peak.salesValue } : null,
    hasTimestampedData: buckets.length > 0,
  };
}

intelligenceRouter.get("/today", (req, res) => {
  const requested = typeof req.query.businessDate === "string" ? req.query.businessDate : undefined;
  res.json(buildTodaysIntelligence(resolveBusinessDate(requested)));
});

intelligenceRouter.get("/insights", (req, res) => {
  res.json(buildInsights(parseFilter(req.query as Record<string, unknown>)));
});

intelligenceRouter.get("/anomalies", (req, res) => {
  res.json(detectAnomalies(parseFilter(req.query as Record<string, unknown>)));
});

intelligenceRouter.get("/reconciliation", (req, res) => {
  res.json(computeReconciliation(parseFilter(req.query as Record<string, unknown>)));
});
