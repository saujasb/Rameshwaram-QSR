import type { OrderChannel, OrderStatus } from "@shared/entities";

export const CHANNEL_OPTIONS: { value: OrderChannel; label: string }[] = [
  { value: "dine_in", label: "Dine-in" },
  { value: "takeaway", label: "Takeaway" },
  { value: "delivery", label: "Delivery" },
];

export const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "received", label: "Received" },
  { value: "accepted", label: "Accepted" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "delayed", label: "Delayed" },
];

export const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  received: "accepted",
  accepted: "preparing",
  preparing: "ready",
  ready: "completed",
};
