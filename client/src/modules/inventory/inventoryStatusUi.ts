import type { InventoryStatus } from "@shared/entities";
import type { BadgeTone } from "../../components/StatusBadge";

export const INVENTORY_STATUS_LABEL: Record<InventoryStatus, string> = {
  not_counted: "Not counted",
  healthy: "Healthy",
  low: "Low",
  critical: "Critical",
  out_of_stock: "Out of stock",
};

export const INVENTORY_STATUS_TONE: Record<InventoryStatus, BadgeTone> = {
  not_counted: "neutral",
  healthy: "ok",
  low: "under",
  critical: "over",
  out_of_stock: "over",
};
