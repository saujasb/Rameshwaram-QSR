import { Router } from "express";
import {
  countProviderOrders,
  getProviderOrder,
  getProviderOrderItemSales,
  getProviderOrderSalesSummary,
  listProviderOrders,
  MAX_PROVIDER_ORDERS_PAGE_SIZE,
} from "./repository.js";
import type { ProviderOrderFilter, ProviderOrderSalesFilter, ProviderOrdersPage } from "../../../../shared-types/providerOrders.js";

export const providerOrdersRouter: Router = Router();

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

function bool(v: unknown): boolean {
  return v === "true";
}

function clampInt(v: string | undefined, fallback: number, min: number, max: number): number {
  const n = v ? parseInt(v, 10) : NaN;
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

providerOrdersRouter.get("/", async (req, res) => {
  const filter: ProviderOrderFilter = {
    provider: str(req.query.provider) as ProviderOrderFilter["provider"],
    status: str(req.query.status) as ProviderOrderFilter["status"],
    orderType: str(req.query.orderType) as ProviderOrderFilter["orderType"],
    orderFrom: str(req.query.orderFrom) as ProviderOrderFilter["orderFrom"],
    search: str(req.query.search),
    from: str(req.query.from),
    to: str(req.query.to),
    onlineOnly: bool(req.query.onlineOnly),
  };

  // Backward compatible: callers that don't ask for pagination (Live Sales
  // Feed, Sales Amount tab's recent-sales list) keep getting the original
  // flat array response, still capped at the original 1000-row safety limit.
  const wantsPagination = req.query.page !== undefined || req.query.pageSize !== undefined;
  if (!wantsPagination) {
    res.json(await listProviderOrders(filter));
    return;
  }

  const pageSizeRaw = str(req.query.pageSize);
  const pageSize =
    pageSizeRaw === "all" ? MAX_PROVIDER_ORDERS_PAGE_SIZE : clampInt(pageSizeRaw, 20, 1, MAX_PROVIDER_ORDERS_PAGE_SIZE);
  const page = clampInt(str(req.query.page), 1, 1, 1_000_000);

  const [orders, total] = await Promise.all([
    listProviderOrders({ ...filter, page, pageSize }),
    countProviderOrders(filter),
  ]);
  const body: ProviderOrdersPage = { orders, total, page, pageSize };
  res.json(body);
});

// Must be registered before "/:id" so "sales-summary" isn't swallowed as an id.
providerOrdersRouter.get("/sales-summary", async (req, res) => {
  const filter: ProviderOrderSalesFilter = {
    from: str(req.query.from),
    to: str(req.query.to),
    provider: str(req.query.provider) as ProviderOrderSalesFilter["provider"],
    restaurantId: str(req.query.restaurantId),
    onlineOnly: bool(req.query.onlineOnly),
  };
  res.json(await getProviderOrderSalesSummary(filter));
});

// Must also be registered before "/:id" for the same reason as sales-summary.
providerOrdersRouter.get("/item-sales", async (req, res) => {
  const filter: ProviderOrderSalesFilter = {
    from: str(req.query.from),
    to: str(req.query.to),
    provider: str(req.query.provider) as ProviderOrderSalesFilter["provider"],
    restaurantId: str(req.query.restaurantId),
    onlineOnly: bool(req.query.onlineOnly),
  };
  res.json(await getProviderOrderItemSales(filter));
});

providerOrdersRouter.get("/:id", async (req, res) => {
  const order = await getProviderOrder(req.params.id);
  if (!order) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(order);
});
