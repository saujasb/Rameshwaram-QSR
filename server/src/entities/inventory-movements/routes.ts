import { createCrudRouter } from "../../shared/createCrudRouter.js";
import { inventoryMovementRepository } from "./repository.js";

export const inventoryMovementRouter = createCrudRouter(inventoryMovementRepository);

inventoryMovementRouter.get("/by-item/:itemId", (req, res) => {
  const movements = inventoryMovementRepository
    .list()
    .filter((m) => m.itemId === req.params.itemId);
  res.json(movements);
});
