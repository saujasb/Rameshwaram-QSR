import type { BaseRecord } from "./entities.js";

export type ProviderName = "petpooja" | "goselfserve";
export type ProviderOrderStatus = "success" | "cancelled" | "pending";
export type ProviderOrderType = "dine_in" | "pick_up" | "delivery" | "other";
export type ProviderOrderSource = "pos" | "zomato" | "swiggy" | "other";
export type GoSelfServeSyncStatus = "not_configured" | "pending" | "sent" | "failed";

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

export interface ProviderOrderSalesSummary {
  businessDateFrom: string | null;
  businessDateTo: string | null;
  totalOrders: number;
  totalAmount: number;
  averageOrderValue: number;
  byOrderType: ProviderOrderTypeTotal[];
  dailyTrend: ProviderOrderDailyTotal[];
}

export interface ProviderOrderSalesFilter {
  from?: string;
  to?: string;
  provider?: ProviderName;
  restaurantId?: string;
}
