import { createCrudRouter } from "../../shared/createCrudRouter.js";
import { inventoryMovementRepository } from "./repository.js";
import { asyncHandler } from "../../shared/asyncHandler.js";

export const inventoryMovementRouter = createCrudRouter(inventoryMovementRepository);

inventoryMovementRouter.get(
  "/by-item/:itemId",
  asyncHandler(async (req, res) => {
    const all = await inventoryMovementRepository.list();
    res.json(all.filter((m) => m.itemId === req.params.itemId));
  })
);
