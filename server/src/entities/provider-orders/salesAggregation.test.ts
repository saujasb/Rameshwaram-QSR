import { test } from "node:test";
import assert from "node:assert/strict";
import { aggregateProviderOrderSales, type ProviderOrderSalesRow } from "./salesAggregation.js";

// Real verified production order (Phase 13 of the live-sales brief): RestID
// pomj6bse, order 244723, Self service -> "other", ₹720, status success.
const ORDER_244723: ProviderOrderSalesRow = {
  orderType: "other",
  totalAmount: "720",
  itemCount: 3,
  providerCreatedAt: "2026-09-15 20:12:27",
};

test("Sales Amount total comes straight from provider_orders.totalAmount, never invented", () => {
  const summary = aggregateProviderOrderSales([ORDER_244723], {});
  assert.equal(summary.totalOrders, 1);
  assert.equal(summary.totalAmount, 720);
  assert.equal(summary.averageOrderValue, 720);
});

test("multiple orders sum totalAmount and average correctly", () => {
  const rows: ProviderOrderSalesRow[] = [
    ORDER_244723,
    { orderType: "dine_in", totalAmount: "280", itemCount: 2, providerCreatedAt: "2026-09-15 21:00:00" },
  ];
  const summary = aggregateProviderOrderSales(rows, {});
  assert.equal(summary.totalOrders, 2);
  assert.equal(summary.totalAmount, 1000);
  assert.equal(summary.averageOrderValue, 500);
});

test("sales by order type groups and sums correctly", () => {
  const rows: ProviderOrderSalesRow[] = [
    { orderType: "dine_in", totalAmount: "100", itemCount: 1, providerCreatedAt: "2026-09-15 12:00:00" },
    { orderType: "dine_in", totalAmount: "50", itemCount: 1, providerCreatedAt: "2026-09-15 13:00:00" },
    { orderType: "delivery", totalAmount: "300", itemCount: 4, providerCreatedAt: "2026-09-15 14:00:00" },
  ];
  const summary = aggregateProviderOrderSales(rows, {});
  const dineIn = summary.byOrderType.find((t) => t.orderType === "dine_in");
  const delivery = summary.byOrderType.find((t) => t.orderType === "delivery");
  assert.equal(dineIn?.amount, 150);
  assert.equal(delivery?.amount, 300);
  // sorted by amount desc
  assert.equal(summary.byOrderType[0].orderType, "delivery");
});

test("business-day boundary: a 1am order belongs to the PREVIOUS business date, same rule PDF sales use", () => {
  // 05:00 is the default business-day start hour (shared-types/businessDate.ts).
  const lateNightOrder: ProviderOrderSalesRow = {
    orderType: "delivery",
    totalAmount: "150",
    itemCount: 1,
    providerCreatedAt: "2026-09-16 01:30:00",
  };
  const summary = aggregateProviderOrderSales([lateNightOrder], {});
  assert.equal(summary.businessDateFrom, "2026-09-15");
  assert.equal(summary.dailyTrend[0].businessDate, "2026-09-15");
});

test("from/to range excludes orders outside the requested business dates", () => {
  const rows: ProviderOrderSalesRow[] = [
    { orderType: "dine_in", totalAmount: "100", itemCount: 1, providerCreatedAt: "2026-09-10 12:00:00" },
    ORDER_244723, // 2026-09-15
  ];
  const summary = aggregateProviderOrderSales(rows, { from: "2026-09-15", to: "2026-09-15" });
  assert.equal(summary.totalOrders, 1);
  assert.equal(summary.totalAmount, 720);
});

test("no orders in range -> zeroed summary, not a crash", () => {
  const summary = aggregateProviderOrderSales([], { from: "2026-09-01", to: "2026-09-01" });
  assert.equal(summary.totalOrders, 0);
  assert.equal(summary.totalAmount, 0);
  assert.equal(summary.averageOrderValue, 0);
  assert.equal(summary.businessDateFrom, null);
});
