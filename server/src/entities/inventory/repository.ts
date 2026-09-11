import { createRepository } from "../../shared/repository.js";
import type { InventoryItem } from "../../../../shared-types/entities.js";

export const inventoryRepository = createRepository<InventoryItem>("inventory_items");
