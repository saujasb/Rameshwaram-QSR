import type { BaseRecord } from "./entities.js";

export type ProviderName = "petpooja" | "goselfserve";
export type ProviderOrderStatus = "success" | "cancelled" | "pending";
export type ProviderOrderType = "dine_in" | "pick_up" | "delivery" | "other";
export type ProviderOrderSource = "pos" | "zomato" | "swiggy" | "other";
export type GoSelfServeSyncStatus = "not_configured" | "pending" | "sent" | "failed" | "not_applicable";

export interface ProviderOrderAddon {
  groupName: string;
  name: string;
  price: number;
  quantity: number;
  addonId: string;
  addonGroupId: string;
}

export interface ProviderOrderItem {
  name: string;
  itemId: string;
  itemCode: string;
  specialNotes: string;
  price: number;
  quantity: number;
  total: number;
  discount: number;
  tax: number;
  categoryName: string;
  addons: ProviderOrderAddon[];
}

export interface ProviderOrderTax {
  title: string;
  type: string;
  rate: number;
  amount: number;
}

export interface ProviderOrderDiscount {
  title: string;
  type: string;
  rate: number;
  amount: number;
}

export interface ProviderOrderPartPayment {
  paymentType: string;
  amount: number;
  customPaymentType: string;
}

export interface ProviderOrder extends BaseRecord {
  provider: ProviderName;
  providerOrderId: string;
  providerInvoiceId: string;
  restaurantId: string;
  restaurantName: string;
  status: ProviderOrderStatus;
  orderType: ProviderOrderType;
  orderFrom: ProviderOrderSource;
  orderFromLabel: string;
  subOrderType: string;
  paymentType: string;
  tableNo: string;
  noOfPersons: number;
  customerName: string;
  customerPhone: string;
  coreTotal: number;
  taxTotal: number;
  discountTotal: number;
  packagingCharge: number;
  serviceCharge: number;
  deliveryCharges: number;
  roundOff: number;
  totalAmount: number;
  comment: string;
  biller: string;
  assignee: string;
  tokenNo: string;
  itemCount: number;
  items: ProviderOrderItem[];
  taxes: ProviderOrderTax[];
  discounts: ProviderOrderDiscount[];
  partPayments: ProviderOrderPartPayment[];
  providerCreatedAt: string;
  receivedAt: string;
  goselfserveSyncStatus: GoSelfServeSyncStatus;
  goselfserveSyncError: string | null;
  goselfserveSyncedAt: string | null;
}

export interface ProviderOrderFilter {
  provider?: ProviderName;
  status?: ProviderOrderStatus;
  orderType?: ProviderOrderType;
  orderFrom?: ProviderOrderSource;
  search?: string;
  /** Inclusive lower bound on providerCreatedAt, as an ISO timestamp. */
  from?: string;
  /** Exclusive upper bound on providerCreatedAt, as an ISO timestamp. */
  to?: string;
  /** 1-based. Only takes effect when the caller also passes pageSize (see routes.ts). */
  page?: number;
  pageSize?: number;
  /** When true, restricts to the combined Petpooja Online channel (see classifySalesChannel) -- Swiggy + Zomato + any other confirmed online label, never split apart. Not a raw DB provider, so it's a separate flag rather than a `provider` value. */
  onlineOnly?: boolean;
  /** When true, excludes the combined Petpooja Online channel -- the inverse of onlineOnly. Lets "Petpooja" mean POS/counter orders only, everywhere it's selected, consistent with "Online" being its own separate source rather than a hidden subset of "Petpooja". */
  excludeOnline?: boolean;
  /** Matches orders whose totalAmount is within a small epsilon of this value (avoids float-precision false negatives on an otherwise-exact bill-amount search). */
  amount?: number;
}

/** Response shape for GET /provider-orders when pagination params are supplied. */
export interface ProviderOrdersPage {
  orders: ProviderOrder[];
  total: number;
  page: number;
  pageSize: number;
}

export const PROVIDER_ORDER_TYPE_LABELS: Record<ProviderOrderType, string> = {
  dine_in: "Dine In",
  pick_up: "Pick Up",
  delivery: "Delivery",
  other: "Other",
};

export const PROVIDER_ORDER_SOURCE_LABELS: Record<ProviderOrderSource, string> = {
  pos: "POS",
  zomato: "Zomato",
  swiggy: "Swiggy",
  other: "Aggregator",
};

// Sales Amount tab (dashboard Sales & Revenue page) -- aggregated straight from
// provider_orders (status = 'success' only), the same source of truth as the
// Live Feed. Never mixed with PDF-import figures.
export interface ProviderOrderTypeTotal {
  orderType: ProviderOrderType;
  quantity: number;
  amount: number;
}

export interface ProviderOrderDailyTotal {
  businessDate: string;
  quantity: number;
  amount: number;
}

/**
 * Business-facing sales channel -- distinct from ProviderOrderSource (the raw
 * order_from enum). "petpooja_online" is the ONE combined bucket for every
 * online aggregator (Swiggy, Zomato, and any future one) ordered through
 * Petpooja -- it is never split into per-aggregator totals. It's reached two
 * ways: (1) orderFrom is the already-confirmed "zomato" or "swiggy" enum
 * value (see providers/petpooja.ts's mapOrderFrom -- this keyword matching
 * predates this feature and isn't a guess), or (2) orderFromLabel matches
 * CONFIRMED_PETPOOJA_ONLINE_LABELS below, for some other online-channel value
 * Petpooja is confirmed to send that isn't literally "zomato"/"swiggy".
 */
export type SalesChannel = "petpooja_pos" | "petpooja_online" | "kiosk" | "other";

export const SALES_CHANNEL_DISPLAY_LABELS: Record<SalesChannel, string> = {
  petpooja_pos: "Petpooja (POS)",
  petpooja_online: "Petpooja (Online)",
  kiosk: "Kiosk",
  other: "Other",
};

/**
 * Every real Petpooja order observed in production to date carries
 * orderFromLabel "POS"/"pos" only. This list is deliberately empty until
 * Petpooja confirms some OTHER real order_from value their Online-ordering
 * mode sends beyond the already-recognized "zomato"/"swiggy" (either from a
 * real test order or directly from Petpooja support). Once confirmed, add it
 * here -- no webhook, schema, or normalization change is needed for that
 * value to start being classified correctly, because orderFromLabel already
 * carries it losslessly. Never add "POS"/"pos" here: that is the confirmed
 * Offline/counter value, not Online.
 */
export const CONFIRMED_PETPOOJA_ONLINE_LABELS: readonly string[] = [];

export function classifySalesChannel(order: {
  provider: ProviderName;
  orderFrom?: ProviderOrderSource;
  orderFromLabel: string;
}): SalesChannel {
  if (order.provider === "goselfserve") return "kiosk";
  if (order.provider === "petpooja") {
    if (order.orderFrom === "zomato" || order.orderFrom === "swiggy") return "petpooja_online";
    const label = order.orderFromLabel?.trim().toLowerCase() ?? "";
    const isConfirmedOnline = CONFIRMED_PETPOOJA_ONLINE_LABELS.some((v) => v.toLowerCase() === label);
    return isConfirmedOnline ? "petpooja_online" : "petpooja_pos";
  }
  return "other";
}

export interface OnlinePlatformInfo {
  isOnline: boolean;
  /**
   * "Zomato"/"Swiggy" when orderFrom confirms it, the raw orderFromLabel for
   * any other confirmed-online value (best-effort display, never a guess --
   * it's literally what the order carries), or null when this isn't an
   * online order at all.
   */
  platformLabel: string | null;
}

/** Order-level Source/Platform info for display (Live Orders, order detail) -- Source is always "Online" here; platformLabel is the Swiggy/Zomato/other aggregator. */
export function classifyOnlinePlatform(order: {
  provider: ProviderName;
  orderFrom?: ProviderOrderSource;
  orderFromLabel: string;
}): OnlinePlatformInfo {
  if (classifySalesChannel(order) !== "petpooja_online") return { isOnline: false, platformLabel: null };
  if (order.orderFrom === "zomato") return { isOnline: true, platformLabel: "Zomato" };
  if (order.orderFrom === "swiggy") return { isOnline: true, platformLabel: "Swiggy" };
  return { isOnline: true, platformLabel: order.orderFromLabel || null };
}

export interface ProviderOrderChannelTotal {
  channel: SalesChannel;
  orders: number;
  quantity: number;
  amount: number;
}

export interface ProviderOrderSalesSummary {
  businessDateFrom: string | null;
  businessDateTo: string | null;
  totalOrders: number;
  totalAmount: number;
  averageOrderValue: number;
  byOrderType: ProviderOrderTypeTotal[];
  byChannel: ProviderOrderChannelTotal[];
  dailyTrend: ProviderOrderDailyTotal[];
}

export interface ProviderOrderSalesFilter {
  from?: string;
  to?: string;
  provider?: ProviderName;
  restaurantId?: string;
  /** See ProviderOrderFilter.onlineOnly -- same meaning, same combined channel. */
  onlineOnly?: boolean;
  /** See ProviderOrderFilter.excludeOnline -- same meaning, inverse of onlineOnly. */
  excludeOnline?: boolean;
}

// Item Sales / Category Performance -- combined, single-list views over
// provider_orders.itemsJson. category is null (never a made-up label) when
// the source item genuinely carries no category.
export interface ProviderOrderItemTotal {
  name: string;
  category: string | null;
  quantity: number;
  amount: number;
}

export interface ProviderOrderCategoryTotal {
  category: string | null;
  quantity: number;
  amount: number;
}

export interface ProviderOrderItemSales {
  businessDateFrom: string | null;
  businessDateTo: string | null;
  items: ProviderOrderItemTotal[];
  categories: ProviderOrderCategoryTotal[];
}
