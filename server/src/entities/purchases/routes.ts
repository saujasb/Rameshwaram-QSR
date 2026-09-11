import { Router } from "express";
import { createCrudRouter } from "../../shared/createCrudRouter.js";
import { purchaseRepository } from "./repository.js";

export const purchaseRouter: Router = createCrudRouter(purchaseRepository);

purchaseRouter.post("/:id/receive", (req, res) => {
  const purchase = purchaseRepository.get(req.params.id);
  if (!purchase) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const receivedQuantity = Number(req.body?.receivedQuantity ?? purchase.quantity);
  const status = receivedQuantity >= purchase.quantity ? "received" : "partially_received";
  const updated = purchaseRepository.update(purchase.id, { receivedQuantity, status });
  res.json(updated);
});
