import type { SalesChannel } from "../../../../shared-types/sales.js";

export type DetectedFormat =
  | { format: "kiosk" }
  | { format: "petpooja"; channel: SalesChannel }
  | { format: "unknown" };

export function detectFormat(rows: string[][]): DetectedFormat {
  const isKioskHeader = rows.some((r) => r[0] === "SKU" && r[1] === "Item" && r[2] === "Category");
  if (isKioskHeader) return { format: "kiosk" };

  const restaurantRow = rows.find((r) => r[0] === "Restaurant Name:");
  if (restaurantRow) {
    const channel: SalesChannel = /online/i.test(restaurantRow[1] ?? "") ? "petpooja_online" : "petpooja_pos";
    return { format: "petpooja", channel };
  }

  return { format: "unknown" };
}
