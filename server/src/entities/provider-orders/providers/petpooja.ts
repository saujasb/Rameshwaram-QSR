// Normalizes the Petpooja "orderdetails" webhook payload (Global API
// Documentation.pdf) into our internal ProviderOrder shape. Field names below
// (order_type, order_from, status values, etc.) are taken verbatim from that
// document's sample payloads and its Order Object Fields table -- nothing here
// is guessed.
import type {
  ProviderOrderAddon,
  ProviderOrderDiscount,
  ProviderOrderItem,
  ProviderOrderPartPayment,
  ProviderOrderSource,
  ProviderOrderStatus,
  ProviderOrderTax,
  ProviderOrderType,
} from "../../../../../shared-types/providerOrders.js";
import type { NormalizedProviderOrder } from "../repository.js";

export class PetpoojaPayloadError extends Error {}

function str(v: unknown, fallback = ""): string {
  if (v == null) return fallback;
  return String(v);
}

function num(v: unknown, fallback = 0): number {
  if (v == null || v === "") return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

// Real POS traffic (2026-09-15 incident) sends "Pickup" and "Self service" --
// neither is in the Global API Documentation.pdf sample payload, which only
// showed "Dine In" / "Pick Up" / "Delivery". Exact-string matching silently
// rejected every live order of those types (124 dropped 2026-09-15
// 11:42-14:26), so this maps known spellings (case/whitespace-normalized)
// explicitly rather than keyword-matching -- a substring match like
// includes("pick") would silently misclassify some future unrelated value
// (e.g. "Self Pickup Counter") as pick_up instead of surfacing it as "other"
// for review. "Self service" isn't dine-in, pick-up, or delivery, so it maps
// to "other" rather than being guessed into one of them.
// ponytail: fixed lookup table, ceiling = a new Petpooja order_type spelling
// not listed here lands in "other" until someone adds it. Acceptable --
// "other" is a safe, visible fallback, never a crash.
const ORDER_TYPE_MAP: Record<string, ProviderOrderType> = {
  "dine in": "dine_in",
  pickup: "pick_up",
  "pick up": "pick_up",
  delivery: "delivery",
};

function mapOrderType(raw: string): ProviderOrderType {
  const v = raw.trim().toLowerCase().replace(/\s+/g, " ");
  return ORDER_TYPE_MAP[v] ?? "other";
}

function mapOrderFrom(raw: string): ProviderOrderSource {
  const v = raw.trim().toLowerCase();
  if (v === "pos") return "pos";
  if (v === "zomato") return "zomato";
  if (v === "swiggy") return "swiggy";
  return "other";
}

function mapStatus(raw: string): ProviderOrderStatus {
  const v = raw.trim().toLowerCase();
  if (v === "success") return "success";
  if (v === "cancelled") return "cancelled";
  throw new PetpoojaPayloadError(`Order.status: unrecognized value ${JSON.stringify(raw)}`);
}

function mapAddon(raw: any): ProviderOrderAddon {
  return {
    groupName: str(raw?.group_name),
    name: str(raw?.name),
    price: num(raw?.price),
    quantity: num(raw?.quantity, 1),
    addonId: str(raw?.addon_id),
    addonGroupId: str(raw?.addon_group_id),
  };
}

function mapItem(raw: any): ProviderOrderItem {
  return {
    name: str(raw?.name),
    itemId: str(raw?.itemid),
    itemCode: str(raw?.itemcode),
    specialNotes: str(raw?.specialnotes),
    price: num(raw?.price),
    quantity: num(raw?.quantity, 1),
    total: num(raw?.total),
    discount: num(raw?.discount),
    tax: num(raw?.tax),
    categoryName: str(raw?.category_name),
    addons: Array.isArray(raw?.addon) ? raw.addon.map(mapAddon) : [],
  };
}

function mapTax(raw: any): ProviderOrderTax {
  return { title: str(raw?.title), type: str(raw?.type), rate: num(raw?.rate), amount: num(raw?.amount) };
}

function mapDiscount(raw: any): ProviderOrderDiscount {
  return { title: str(raw?.title), type: str(raw?.type), rate: num(raw?.rate), amount: num(raw?.amount) };
}

function mapPartPayment(raw: any): ProviderOrderPartPayment {
  return {
    paymentType: str(raw?.payment_type),
    amount: num(raw?.amount),
    customPaymentType: str(raw?.custome_payment_type ?? raw?.custom_payment_type),
  };
}

/** Throws PetpoojaPayloadError with a human-readable reason on any structural problem. */
export function normalizePetpoojaPayload(body: any): NormalizedProviderOrder {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new PetpoojaPayloadError("Request body must be a JSON object.");
  }
  if (body.event !== "orderdetails") {
    throw new PetpoojaPayloadError(`Unsupported event type ${JSON.stringify(body.event)}; expected "orderdetails".`);
  }
  const props = body.properties;
  if (!props || typeof props !== "object") {
    throw new PetpoojaPayloadError("Missing properties object.");
  }
  const restaurant = props.Restaurant ?? {};
  const customer = props.Customer ?? {};
  const order = props.Order;
  if (!order || typeof order !== "object") {
    throw new PetpoojaPayloadError("Missing properties.Order object.");
  }
  if (order.orderID == null) throw new PetpoojaPayloadError("Order.orderID is required.");
  if (typeof order.order_type !== "string") throw new PetpoojaPayloadError("Order.order_type is required.");
  if (typeof order.status !== "string") throw new PetpoojaPayloadError("Order.status is required.");

  const rawOrderFrom = str(order.order_from, "POS");
  const items = Array.isArray(props.OrderItem) ? props.OrderItem.map(mapItem) : [];

  return {
    provider: "petpooja",
    providerOrderId: String(order.orderID),
    providerInvoiceId: str(order.customer_invoice_id, String(order.orderID)),
    restaurantId: str(restaurant.restID),
    restaurantName: str(restaurant.res_name),
    status: mapStatus(order.status),
    orderType: mapOrderType(order.order_type),
    orderFrom: mapOrderFrom(rawOrderFrom),
    orderFromLabel: rawOrderFrom,
    subOrderType: str(order.sub_order_type),
    paymentType: str(order.payment_type),
    tableNo: str(order.table_no),
    noOfPersons: num(order.no_of_persons),
    customerName: str(customer.name),
    customerPhone: str(customer.phone),
    coreTotal: num(order.core_total),
    taxTotal: num(order.tax_total),
    discountTotal: num(order.discount_total),
    packagingCharge: num(order.packaging_charge),
    serviceCharge: num(order.service_charge),
    deliveryCharges: num(order.delivery_charges),
    roundOff: num(order.round_off),
    totalAmount: num(order.total),
    comment: str(order.comment),
    biller: str(order.biller),
    assignee: str(order.assignee),
    tokenNo: str(order.token_no),
    items,
    taxes: Array.isArray(props.Tax) ? props.Tax.map(mapTax) : [],
    discounts: Array.isArray(props.Discount) ? props.Discount.map(mapDiscount) : [],
    partPayments: Array.isArray(order.part_payments) ? order.part_payments.map(mapPartPayment) : [],
    providerCreatedAt: str(order.created_on),
    rawPayload: body,
  };
}
