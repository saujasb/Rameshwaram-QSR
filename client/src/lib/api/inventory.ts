import { createEntityHooks } from "../createEntityHooks";
import type { InventoryItem, InventoryMovement } from "@shared/entities";

export const inventoryHooks = createEntityHooks<InventoryItem>("inventory");
export const inventoryMovementHooks = createEntityHooks<InventoryMovement>("inventory-movements");
