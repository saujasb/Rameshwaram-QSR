import { createCrudRouter } from "../../shared/createCrudRouter.js";
import { inventoryMovementRepository } from "./repository.js";

export const inventoryMovementRouter = createCrudRouter(inventoryMovementRepository);

inventoryMovementRouter.get("/by-item/:itemId", async (req, res) => {
  const all = await inventoryMovementRepository.list();
  res.json(all.filter((m) => m.itemId === req.params.itemId));
});
