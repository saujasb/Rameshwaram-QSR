// Pure sales-aggregation logic, deliberately kept free of any DB import (see
// repository.ts, which imports db/pg.ts -- that module throws at import time
// if SUPABASE_DB_URL isn't set, which would make this logic untestable
// without real database credentials). Same separation this codebase already
// uses for providers/petpooja.ts (pure normalization) vs. repository.ts
// (DB-touching).
import { getBusinessDate } from "../../../../shared-types/businessDate.js";
import type { ProviderOrderSalesFilter, ProviderOrderSalesSummary, ProviderOrderType } from "../../../../shared-types/providerOrders.js";

export interface ProviderOrderSalesRow {
  orderType: ProviderOrderType;
  totalAmount: string | number;
  itemCount: number;
  providerCreatedAt: string;
}

/**
 * Sums provider_orders.totalAmount directly -- never invented -- and buckets
 * by the same shared getBusinessDate() rule the PDF-import sales summary
 * uses, so "today" means the same thing in both places.
 */
export function aggregateProviderOrderSales(
  rows: ProviderOrderSalesRow[],
  filter: Pick<ProviderOrderSalesFilter, "from" | "to">
): ProviderOrderSalesSummary {
  const byOrderType = new Map<ProviderOrderType, { quantity: number; amount: number }>();
  const dailyTrend = new Map<string, { quantity: number; amount: number }>();
  let totalOrders = 0;
  let totalAmount = 0;
  let minDate: string | null = null;
  let maxDate: string | null = null;

  for (const row of rows) {
    const amount = Number(row.totalAmount);
    const businessDate = getBusinessDate(row.providerCreatedAt.replace(" ", "T"));
    if (filter.from && businessDate < filter.from) continue;
    if (filter.to && businessDate > filter.to) continue;

    totalOrders++;
    totalAmount += amount;
    if (minDate == null || businessDate < minDate) minDate = businessDate;
    if (maxDate == null || businessDate > maxDate) maxDate = businessDate;

    const typeAgg = byOrderType.get(row.orderType) ?? { quantity: 0, amount: 0 };
    typeAgg.quantity += row.itemCount;
    typeAgg.amount += amount;
    byOrderType.set(row.orderType, typeAgg);

    const dayAgg = dailyTrend.get(businessDate) ?? { quantity: 0, amount: 0 };
    dayAgg.quantity += row.itemCount;
    dayAgg.amount += amount;
    dailyTrend.set(businessDate, dayAgg);
  }

  return {
    businessDateFrom: minDate,
    businessDateTo: maxDate,
    totalOrders,
    totalAmount,
    averageOrderValue: totalOrders > 0 ? totalAmount / totalOrders : 0,
    byOrderType: Array.from(byOrderType.entries())
      .map(([orderType, agg]) => ({ orderType, ...agg }))
      .sort((a, b) => b.amount - a.amount),
    dailyTrend: Array.from(dailyTrend.entries())
      .map(([businessDate, agg]) => ({ businessDate, ...agg }))
      .sort((a, b) => a.businessDate.localeCompare(b.businessDate)),
  };
}
