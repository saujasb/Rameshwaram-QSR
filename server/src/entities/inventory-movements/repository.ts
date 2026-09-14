import { createRepository } from "../../shared/repository.js";
import type { InventoryMovement } from "../../../../shared-types/entities.js";

export const inventoryMovementRepository = createRepository<InventoryMovement>("inventory_movements");
