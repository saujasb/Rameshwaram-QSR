import { test } from "node:test";
import assert from "node:assert/strict";
import {
  aggregateProviderOrderItems,
  aggregateProviderOrderSales,
  classifySalesChannel,
  type ProviderOrderItemRow,
  type ProviderOrderSalesRow,
} from "./salesAggregation.js";

// Real verified production order (Phase 13 of the live-sales brief): RestID
// pomj6bse, order 244723, Self service -> "other", ₹720, status success.
const ORDER_244723: ProviderOrderSalesRow = {
  provider: "petpooja",
  orderFromLabel: "POS",
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
    { provider: "goselfserve", orderFromLabel: "gss", orderType: "dine_in", totalAmount: "280", itemCount: 2, providerCreatedAt: "2026-09-15 21:00:00" },
  ];
  const summary = aggregateProviderOrderSales(rows, {});
  assert.equal(summary.totalOrders, 2);
  assert.equal(summary.totalAmount, 1000);
  assert.equal(summary.averageOrderValue, 500);
});

test("sales by order type groups and sums correctly", () => {
  const rows: ProviderOrderSalesRow[] = [
    { provider: "petpooja", orderFromLabel: "POS", orderType: "dine_in", totalAmount: "100", itemCount: 1, providerCreatedAt: "2026-09-15 12:00:00" },
    { provider: "petpooja", orderFromLabel: "POS", orderType: "dine_in", totalAmount: "50", itemCount: 1, providerCreatedAt: "2026-09-15 13:00:00" },
    { provider: "goselfserve", orderFromLabel: "gss", orderType: "delivery", totalAmount: "300", itemCount: 4, providerCreatedAt: "2026-09-15 14:00:00" },
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
    provider: "petpooja",
    orderFromLabel: "POS",
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
    { provider: "petpooja", orderFromLabel: "POS", orderType: "dine_in", totalAmount: "100", itemCount: 1, providerCreatedAt: "2026-09-10 12:00:00" },
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

test("classifySalesChannel: goselfserve is always kiosk", () => {
  assert.equal(classifySalesChannel({ provider: "goselfserve", orderFromLabel: "gss" }), "kiosk");
  assert.equal(classifySalesChannel({ provider: "goselfserve", orderFromLabel: "haldirams" }), "kiosk");
});

test("classifySalesChannel: every real Petpooja order observed to date (POS/pos) is petpooja_pos, never petpooja_online", () => {
  assert.equal(classifySalesChannel({ provider: "petpooja", orderFromLabel: "POS" }), "petpooja_pos");
  assert.equal(classifySalesChannel({ provider: "petpooja", orderFromLabel: "pos" }), "petpooja_pos");
});

test("classifySalesChannel: with no confirmed Online label yet, nothing is ever classified petpooja_online -- not even a plausible-looking guess", () => {
  for (const guess of ["online", "Online", "website", "app", "petpooja online", "web"]) {
    assert.equal(classifySalesChannel({ provider: "petpooja", orderFromLabel: guess }), "petpooja_pos");
  }
});

test("aggregateProviderOrderSales: byChannel splits Petpooja vs Kiosk combined orders correctly", () => {
  const rows: ProviderOrderSalesRow[] = [
    { provider: "petpooja", orderFromLabel: "POS", orderType: "dine_in", totalAmount: "100", itemCount: 1, providerCreatedAt: "2026-09-15 12:00:00" },
    { provider: "petpooja", orderFromLabel: "POS", orderType: "dine_in", totalAmount: "50", itemCount: 1, providerCreatedAt: "2026-09-15 13:00:00" },
    { provider: "goselfserve", orderFromLabel: "gss", orderType: "pick_up", totalAmount: "300", itemCount: 4, providerCreatedAt: "2026-09-15 14:00:00" },
  ];
  const summary = aggregateProviderOrderSales(rows, {});
  const pos = summary.byChannel.find((c) => c.channel === "petpooja_pos");
  const kiosk = summary.byChannel.find((c) => c.channel === "kiosk");
  const online = summary.byChannel.find((c) => c.channel === "petpooja_online");
  assert.equal(pos?.orders, 2);
  assert.equal(pos?.amount, 150);
  assert.equal(kiosk?.orders, 1);
  assert.equal(kiosk?.amount, 300);
  assert.equal(online, undefined, "no petpooja_online bucket should ever appear from real POS-only data");
  assert.equal(summary.totalAmount, 450);
});

test("aggregateProviderOrderItems: same item name across orders/categories combines into one row (no highest/lowest split)", () => {
  const rows: ProviderOrderItemRow[] = [
    { providerCreatedAt: "2026-09-15 12:00:00", name: "Filter Coffee", categoryName: "Beverages", quantity: 2, total: 100 },
    { providerCreatedAt: "2026-09-15 13:00:00", name: "Filter Coffee", categoryName: "Beverages", quantity: 1, total: 50 },
    { providerCreatedAt: "2026-09-15 14:00:00", name: "Masala Dosa", categoryName: "Tiffin", quantity: 3, total: 300 },
  ];
  const result = aggregateProviderOrderItems(rows, {});
  assert.equal(result.items.length, 2);
  const coffee = result.items.find((i) => i.name === "Filter Coffee");
  assert.equal(coffee?.quantity, 3);
  assert.equal(coffee?.amount, 150);
  assert.equal(coffee?.category, "Beverages");
});

test("aggregateProviderOrderItems: item with no category is left null, never given a made-up label", () => {
  const rows: ProviderOrderItemRow[] = [
    { providerCreatedAt: "2026-09-15 12:00:00", name: "Mystery Combo", categoryName: null, quantity: 1, total: 200 },
  ];
  const result = aggregateProviderOrderItems(rows, {});
  assert.equal(result.items[0].category, null);
  assert.equal(result.categories.length, 1);
  assert.equal(result.categories[0].category, null);
  assert.equal(result.categories[0].amount, 200);
});

test("aggregateProviderOrderItems: respects business-day boundary and from/to range, same as order-level aggregation", () => {
  const rows: ProviderOrderItemRow[] = [
    { providerCreatedAt: "2026-09-16 01:30:00", name: "Late Night Item", categoryName: null, quantity: 1, total: 90 },
  ];
  const result = aggregateProviderOrderItems(rows, { from: "2026-09-15", to: "2026-09-15" });
  assert.equal(result.items.length, 1, "01:30 belongs to the previous (05:00-start) business date, so it's inside 2026-09-15");
  const outOfRange = aggregateProviderOrderItems(rows, { from: "2026-09-16", to: "2026-09-16" });
  assert.equal(outOfRange.items.length, 0);
});
