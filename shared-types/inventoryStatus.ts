import type { InventoryItem, InventoryStatus } from "./entities.js";

export function computeInventoryStatus(item: Pick<InventoryItem, "onHandQty" | "minLevel" | "reorderLevel">): InventoryStatus {
  if (item.onHandQty === null) return "not_counted";
  if (item.onHandQty <= 0) return "out_of_stock";
  if (item.minLevel !== null && item.onHandQty <= item.minLevel) return "critical";
  if (item.reorderLevel !== null && item.onHandQty <= item.reorderLevel) return "low";
  return "healthy";
}
