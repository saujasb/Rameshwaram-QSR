import { Router } from "express";
import { createCrudRouter } from "../../shared/createCrudRouter.js";
import { inventoryRepository } from "./repository.js";
import { inventoryMovementRepository } from "../inventory-movements/repository.js";

export const inventoryRouter: Router = createCrudRouter(inventoryRepository);

async function recordMovement(
  itemId: string,
  type: "receive" | "adjustment" | "count",
  quantityDelta: number,
  resultingQty: number,
  note: string,
  employeeName: string
) {
  await inventoryMovementRepository.create({
    itemId,
    type,
    quantityDelta,
    resultingQty,
    note,
    employeeName,
  });
}

inventoryRouter.post("/:id/receive", async (req, res) => {
  const item = await inventoryRepository.get(req.params.id);
  if (!item) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const quantity = Number(req.body?.quantity ?? 0);
  const note = req.body?.note ?? "";
  const employeeName = req.body?.employeeName ?? "";
  const resultingQty = (item.onHandQty ?? 0) + quantity;
  const updated = await inventoryRepository.update(item.id, {
    onHandQty: resultingQty,
    lastCountedAt: new Date().toISOString(),
  });
  await recordMovement(item.id, "receive", quantity, resultingQty, note, employeeName);
  res.json(updated);
});

inventoryRouter.post("/:id/adjust", async (req, res) => {
  const item = await inventoryRepository.get(req.params.id);
  if (!item) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const delta = Number(req.body?.delta ?? 0);
  const note = req.body?.note ?? "";
  const employeeName = req.body?.employeeName ?? "";
  const resultingQty = (item.onHandQty ?? 0) + delta;
  const updated = await inventoryRepository.update(item.id, {
    onHandQty: resultingQty,
    lastCountedAt: new Date().toISOString(),
  });
  await recordMovement(item.id, "adjustment", delta, resultingQty, note, employeeName);
  res.json(updated);
});

inventoryRouter.post("/:id/count", async (req, res) => {
  const item = await inventoryRepository.get(req.params.id);
  if (!item) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const quantity = Number(req.body?.quantity ?? 0);
  const note = req.body?.note ?? "";
  const employeeName = req.body?.employeeName ?? "";
  const delta = quantity - (item.onHandQty ?? 0);
  const updated = await inventoryRepository.update(item.id, {
    onHandQty: quantity,
    lastCountedAt: new Date().toISOString(),
  });
  await recordMovement(item.id, "count", delta, quantity, note, employeeName);
  res.json(updated);
});
