import { Router } from "express";
import { getProviderOrder, listProviderOrders } from "./repository.js";
import type { ProviderOrderFilter } from "../../../../shared-types/providerOrders.js";
import { asyncHandler } from "../../shared/asyncHandler.js";

export const providerOrdersRouter: Router = Router();

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

providerOrdersRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const filter: ProviderOrderFilter = {
      provider: str(req.query.provider) as ProviderOrderFilter["provider"],
      status: str(req.query.status) as ProviderOrderFilter["status"],
      orderType: str(req.query.orderType) as ProviderOrderFilter["orderType"],
      orderFrom: str(req.query.orderFrom) as ProviderOrderFilter["orderFrom"],
      search: str(req.query.search),
    };
    res.json(await listProviderOrders(filter));
  })
);

providerOrdersRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const order = await getProviderOrder(req.params.id);
    if (!order) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(order);
  })
);
