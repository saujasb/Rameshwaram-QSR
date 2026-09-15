import { Router } from "express";
import { getProviderOrder, getProviderOrderSalesSummary, listProviderOrders } from "./repository.js";
import type { ProviderOrderFilter, ProviderOrderSalesFilter } from "../../../../shared-types/providerOrders.js";

export const providerOrdersRouter: Router = Router();

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

providerOrdersRouter.get("/", async (req, res) => {
  const filter: ProviderOrderFilter = {
    provider: str(req.query.provider) as ProviderOrderFilter["provider"],
    status: str(req.query.status) as ProviderOrderFilter["status"],
    orderType: str(req.query.orderType) as ProviderOrderFilter["orderType"],
    orderFrom: str(req.query.orderFrom) as ProviderOrderFilter["orderFrom"],
    search: str(req.query.search),
  };
  res.json(await listProviderOrders(filter));
});

// Must be registered before "/:id" so "sales-summary" isn't swallowed as an id.
providerOrdersRouter.get("/sales-summary", async (req, res) => {
  const filter: ProviderOrderSalesFilter = {
    from: str(req.query.from),
    to: str(req.query.to),
    provider: str(req.query.provider) as ProviderOrderSalesFilter["provider"],
    restaurantId: str(req.query.restaurantId),
  };
  res.json(await getProviderOrderSalesSummary(filter));
});

providerOrdersRouter.get("/:id", async (req, res) => {
  const order = await getProviderOrder(req.params.id);
  if (!order) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(order);
});
