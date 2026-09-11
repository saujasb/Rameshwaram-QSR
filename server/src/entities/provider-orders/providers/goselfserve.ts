// Normalizes the GoSelfServe inbound order-push payload into our internal
// ProviderOrder shape. Field names below (merchant, outlet, orderRefId,
// items[].unitPrice, etc.) are taken verbatim from CreateOrderDto and its
// nested schemas in their live Swagger
// (https://orderservice.qsr.goselfserve.in/orders-json).
//
// GoSelfServe never documented an enum of `status`/`type` values (their own
// docs call the only sample payload "illustrative, not official") -- see the
// GoSelfServe support message. mapStatus/mapOrderType below keyword-match the
// obvious cases and fall back to "pending"/"other" instead of guessing, so
// unrecognized values are visible for manual review rather than silently
// misfiled as success/cancelled.
// ponytail: keyword-matched status/type vocabulary, ceiling = unrecognized
// values land in "pending"/"other". Upgrade once GoSelfServe confirms their
// real enum values -- swap these two functions for a fixed lookup table.
import type {
  ProviderOrderAddon,
  ProviderOrderDiscount,
  ProviderOrderItem,
  ProviderOrderSource,
  ProviderOrderStatus,
  ProviderOrderTax,
  ProviderOrderType,
} from "../../../../../shared-types/providerOrders.js";
import type { NormalizedProviderOrder } from "../repository.js";

export class GoSelfServePayloadError extends Error {}

function str(v: unknown, fallback = ""): string {
  if (v == null) return fallback;
  return String(v);
}

function num(v: unknown, fallback = 0): number {
  if (v == null || v === "") return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function mapStatus(raw: string): ProviderOrderStatus {
  const v = raw.trim().toLowerCase();
  if (v.includes("cancel") || v.includes("reject")) return "cancelled";
  if (v.includes("success") || v.includes("complete") || v.includes("deliver") || v.includes("paid")) return "success";
  return "pending";
}

function mapOrderType(raw: string): ProviderOrderType {
  const v = raw.trim().toLowerCase();
  if (v.includes("dine")) return "dine_in";
  if (v.includes("pick") || v.includes("takeaway") || v.includes("take away")) return "pick_up";
  if (v.includes("deliver")) return "delivery";
  return "other";
}

function mapOrderFrom(raw: string): ProviderOrderSource {
  const v = raw.trim().toLowerCase();
  if (v.includes("zomato")) return "zomato";
  if (v.includes("swiggy")) return "swiggy";
  if (v.includes("pos") || v.includes("kiosk")) return "pos";
  return "other";
}

function mapAddon(raw: any): ProviderOrderAddon {
  return {
    groupName: str(raw?.group),
    name: str(raw?.name),
    price: num(raw?.price),
    quantity: 1,
    addonId: str(raw?.addonId),
    addonGroupId: str(raw?.groupId),
  };
}

/** GoSelfServe models variants separately from addons; folded into the same addons list so the dashboard's existing item view shows both. */
function mapVariantAsAddon(raw: any): ProviderOrderAddon {
  return {
    groupName: "Variant",
    name: str(raw?.name),
    price: num(raw?.price),
    quantity: 1,
    addonId: str(raw?.pid),
    addonGroupId: "",
  };
}

function mapItem(raw: any): ProviderOrderItem {
  const addons = Array.isArray(raw?.addons) ? raw.addons.map(mapAddon) : [];
  const variants = Array.isArray(raw?.variants) ? raw.variants.map(mapVariantAsAddon) : [];
  const taxTotal = Array.isArray(raw?.taxes)
    ? raw.taxes.reduce((sum: number, t: any) => sum + num(t?.total ?? t?.amount), 0)
    : 0;
  return {
    name: str(raw?.name),
    itemId: str(raw?.itemId),
    itemCode: str(raw?.sku),
    specialNotes: str(raw?.instruction),
    price: num(raw?.unitPrice),
    quantity: num(raw?.quantity, 1),
    total: num(raw?.finalPrice),
    discount: num(raw?.discount),
    tax: taxTotal,
    categoryName: str(raw?.category),
    addons: [...variants, ...addons],
  };
}

function mapTax(raw: any): ProviderOrderTax {
  return { title: str(raw?.name), type: str(raw?.type), rate: num(raw?.tax), amount: num(raw?.total ?? raw?.amount) };
}

/** DiscountDto's fields aren't expanded in GoSelfServe's Swagger beyond "array" -- read defensively. */
function mapDiscount(raw: any): ProviderOrderDiscount {
  return {
    title: str(raw?.title ?? raw?.name),
    type: str(raw?.type),
    rate: num(raw?.rate),
    amount: num(raw?.amount ?? raw?.value),
  };
}

/** Throws GoSelfServePayloadError with a human-readable reason on any structural problem. */
export function normalizeGoSelfServeOrder(body: any): NormalizedProviderOrder {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new GoSelfServePayloadError("Request body must be a JSON object.");
  }
  if (body.orderRefId == null) throw new GoSelfServePayloadError("orderRefId is required.");
  if (typeof body.status !== "string") throw new GoSelfServePayloadError("status is required.");
  if (typeof body.type !== "string") throw new GoSelfServePayloadError("type is required.");

  const customer = body.customer ?? {};
  const rawOrderFrom = str(body.provider, "pos");
  const items = Array.isArray(body.items) ? body.items.map(mapItem) : [];

  return {
    provider: "goselfserve",
    providerOrderId: String(body.orderRefId),
    providerInvoiceId: str(body.billNo, String(body.orderRefId)),
    restaurantId: str(body.outlet),
    restaurantName: str(body.merchant),
    status: mapStatus(body.status),
    orderType: mapOrderType(body.type),
    orderFrom: mapOrderFrom(rawOrderFrom),
    orderFromLabel: rawOrderFrom,
    subOrderType: "",
    paymentType: "",
    tableNo: str(body.tableNo),
    noOfPersons: 0,
    customerName: str(customer.name),
    customerPhone: str(customer.mobile),
    coreTotal: num(body.amount),
    taxTotal: num(body.tax),
    discountTotal: num(body.discount),
    packagingCharge: num(body.packing),
    serviceCharge: 0,
    deliveryCharges: 0,
    roundOff: num(body.roundoff),
    totalAmount: num(body.total),
    comment: str(customer?.address?.instructions),
    biller: "",
    assignee: "",
    tokenNo: str(body.tokenNo),
    items,
    taxes: Array.isArray(body.taxes) ? body.taxes.map(mapTax) : [],
    discounts: Array.isArray(body.discounts) ? body.discounts.map(mapDiscount) : [],
    partPayments: [],
    providerCreatedAt: str(body.createdOn),
    rawPayload: body,
  };
}
