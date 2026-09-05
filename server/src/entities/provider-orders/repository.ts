import { randomUUID } from "node:crypto";
import { db } from "../../db/client.js";
import { ensureProviderOrderTables } from "./db.js";
import type {
  ProviderOrder,
  ProviderOrderAddon,
  ProviderOrderDiscount,
  ProviderOrderFilter,
  ProviderOrderItem,
  ProviderOrderPartPayment,
  ProviderOrderSource,
  ProviderOrderStatus,
  ProviderOrderTax,
  ProviderOrderType,
} from "../../../../shared-types/providerOrders.js";

ensureProviderOrderTables();

export interface NormalizedPetpoojaOrder {
  provider: "petpooja";
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
  items: ProviderOrderItem[];
  taxes: ProviderOrderTax[];
  discounts: ProviderOrderDiscount[];
  partPayments: ProviderOrderPartPayment[];
  providerCreatedAt: string;
  rawPayload: unknown;
}

const findExistingStmt = db.prepare(
  `SELECT id, rawPayloadJson FROM provider_orders WHERE provider = ? AND providerOrderId = ?`
);

const upsertStmt = db.prepare(`
  INSERT INTO provider_orders (
    id, provider, providerOrderId, providerInvoiceId, restaurantId, restaurantName,
    status, orderType, orderFrom, orderFromLabel, subOrderType, paymentType, tableNo,
    noOfPersons, customerName, customerPhone, coreTotal, taxTotal, discountTotal,
    packagingCharge, serviceCharge, deliveryCharges, roundOff, totalAmount, comment,
    biller, assignee, tokenNo, itemCount, itemsJson, taxesJson, discountsJson,
    partPaymentsJson, rawPayloadJson, providerCreatedAt, receivedAt,
    goselfserveSyncStatus, createdAt, updatedAt
  ) VALUES (
    @id, @provider, @providerOrderId, @providerInvoiceId, @restaurantId, @restaurantName,
    @status, @orderType, @orderFrom, @orderFromLabel, @subOrderType, @paymentType, @tableNo,
    @noOfPersons, @customerName, @customerPhone, @coreTotal, @taxTotal, @discountTotal,
    @packagingCharge, @serviceCharge, @deliveryCharges, @roundOff, @totalAmount, @comment,
    @biller, @assignee, @tokenNo, @itemCount, @itemsJson, @taxesJson, @discountsJson,
    @partPaymentsJson, @rawPayloadJson, @providerCreatedAt, @receivedAt,
    'pending', @createdAt, @updatedAt
  )
  ON CONFLICT(provider, providerOrderId) DO UPDATE SET
    providerInvoiceId = excluded.providerInvoiceId,
    restaurantId = excluded.restaurantId,
    restaurantName = excluded.restaurantName,
    status = excluded.status,
    orderType = excluded.orderType,
    orderFrom = excluded.orderFrom,
    orderFromLabel = excluded.orderFromLabel,
    subOrderType = excluded.subOrderType,
    paymentType = excluded.paymentType,
    tableNo = excluded.tableNo,
    noOfPersons = excluded.noOfPersons,
    customerName = excluded.customerName,
    customerPhone = excluded.customerPhone,
    coreTotal = excluded.coreTotal,
    taxTotal = excluded.taxTotal,
    discountTotal = excluded.discountTotal,
    packagingCharge = excluded.packagingCharge,
    serviceCharge = excluded.serviceCharge,
    deliveryCharges = excluded.deliveryCharges,
    roundOff = excluded.roundOff,
    totalAmount = excluded.totalAmount,
    comment = excluded.comment,
    biller = excluded.biller,
    assignee = excluded.assignee,
    tokenNo = excluded.tokenNo,
    itemCount = excluded.itemCount,
    itemsJson = excluded.itemsJson,
    taxesJson = excluded.taxesJson,
    discountsJson = excluded.discountsJson,
    partPaymentsJson = excluded.partPaymentsJson,
    rawPayloadJson = excluded.rawPayloadJson,
    providerCreatedAt = excluded.providerCreatedAt,
    updatedAt = excluded.updatedAt
`);

const getByIdStmt = db.prepare(`SELECT * FROM provider_orders WHERE id = ?`);

function rowToOrder(row: any): ProviderOrder {
  return {
    id: row.id,
    provider: row.provider,
    providerOrderId: row.providerOrderId,
    providerInvoiceId: row.providerInvoiceId,
    restaurantId: row.restaurantId,
    restaurantName: row.restaurantName,
    status: row.status,
    orderType: row.orderType,
    orderFrom: row.orderFrom,
    orderFromLabel: row.orderFromLabel,
    subOrderType: row.subOrderType,
    paymentType: row.paymentType,
    tableNo: row.tableNo,
    noOfPersons: row.noOfPersons,
    customerName: row.customerName,
    customerPhone: row.customerPhone,
    coreTotal: row.coreTotal,
    taxTotal: row.taxTotal,
    discountTotal: row.discountTotal,
    packagingCharge: row.packagingCharge,
    serviceCharge: row.serviceCharge,
    deliveryCharges: row.deliveryCharges,
    roundOff: row.roundOff,
    totalAmount: row.totalAmount,
    comment: row.comment,
    biller: row.biller,
    assignee: row.assignee,
    tokenNo: row.tokenNo,
    itemCount: row.itemCount,
    items: JSON.parse(row.itemsJson),
    taxes: JSON.parse(row.taxesJson),
    discounts: JSON.parse(row.discountsJson),
    partPayments: JSON.parse(row.partPaymentsJson),
    providerCreatedAt: row.providerCreatedAt,
    receivedAt: row.receivedAt,
    goselfserveSyncStatus: row.goselfserveSyncStatus,
    goselfserveSyncError: row.goselfserveSyncError,
    goselfserveSyncedAt: row.goselfserveSyncedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export interface UpsertOutcome {
  order: ProviderOrder;
  isNew: boolean;
  isDuplicate: boolean;
}

/**
 * Idempotent upsert keyed on (provider, providerOrderId): a repeat delivery of
 * the exact same payload is recorded as a duplicate (no-op update); a delivery
 * with a changed status/total for an order we've already seen updates the row
 * in place. Single prepared statement + SQLite's serialized writer thread
 * gives this its race-condition safety -- no separate app-level lock needed.
 */
export function upsertProviderOrder(input: NormalizedPetpoojaOrder): UpsertOutcome {
  const existing = findExistingStmt.get(input.provider, input.providerOrderId) as
    | { id: string; rawPayloadJson: string }
    | undefined;

  const now = new Date().toISOString();
  const rawPayloadJson = JSON.stringify(input.rawPayload);
  const isDuplicate = existing != null && existing.rawPayloadJson === rawPayloadJson;
  const id = existing?.id ?? randomUUID();

  upsertStmt.run({
    id,
    provider: input.provider,
    providerOrderId: input.providerOrderId,
    providerInvoiceId: input.providerInvoiceId,
    restaurantId: input.restaurantId,
    restaurantName: input.restaurantName,
    status: input.status,
    orderType: input.orderType,
    orderFrom: input.orderFrom,
    orderFromLabel: input.orderFromLabel,
    subOrderType: input.subOrderType,
    paymentType: input.paymentType,
    tableNo: input.tableNo,
    noOfPersons: input.noOfPersons,
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    coreTotal: input.coreTotal,
    taxTotal: input.taxTotal,
    discountTotal: input.discountTotal,
    packagingCharge: input.packagingCharge,
    serviceCharge: input.serviceCharge,
    deliveryCharges: input.deliveryCharges,
    roundOff: input.roundOff,
    totalAmount: input.totalAmount,
    comment: input.comment,
    biller: input.biller,
    assignee: input.assignee,
    tokenNo: input.tokenNo,
    itemCount: input.items.length,
    itemsJson: JSON.stringify(input.items),
    taxesJson: JSON.stringify(input.taxes),
    discountsJson: JSON.stringify(input.discounts),
    partPaymentsJson: JSON.stringify(input.partPayments),
    rawPayloadJson,
    providerCreatedAt: input.providerCreatedAt,
    receivedAt: now,
    createdAt: now,
    updatedAt: now,
  });

  const row = getByIdStmt.get(id);
  return { order: rowToOrder(row), isNew: !existing, isDuplicate: !!existing && isDuplicate };
}

export function getProviderOrder(id: string): ProviderOrder | undefined {
  const row = getByIdStmt.get(id);
  return row ? rowToOrder(row) : undefined;
}

export function listProviderOrders(filter: ProviderOrderFilter): ProviderOrder[] {
  const conditions: string[] = [];
  const params: unknown[] = [];
  if (filter.provider) {
    conditions.push("provider = ?");
    params.push(filter.provider);
  }
  if (filter.status) {
    conditions.push("status = ?");
    params.push(filter.status);
  }
  if (filter.orderType) {
    conditions.push("orderType = ?");
    params.push(filter.orderType);
  }
  if (filter.orderFrom) {
    conditions.push("orderFrom = ?");
    params.push(filter.orderFrom);
  }
  if (filter.search) {
    conditions.push("(providerOrderId LIKE ? OR customerName LIKE ? OR restaurantName LIKE ?)");
    const like = `%${filter.search}%`;
    params.push(like, like, like);
  }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const rows = db
    .prepare(`SELECT * FROM provider_orders ${where} ORDER BY receivedAt DESC LIMIT 1000`)
    .all(...params);
  return rows.map(rowToOrder);
}

export function markGoSelfServeSyncResult(id: string, ok: boolean, error: string | null): void {
  db.prepare(
    `UPDATE provider_orders SET goselfserveSyncStatus = ?, goselfserveSyncError = ?, goselfserveSyncedAt = ? WHERE id = ?`
  ).run(ok ? "sent" : "failed", error, new Date().toISOString(), id);
}

export function markGoSelfServeNotConfigured(id: string): void {
  db.prepare(`UPDATE provider_orders SET goselfserveSyncStatus = 'not_configured' WHERE id = ?`).run(id);
}

const insertEventStmt = db.prepare(`
  INSERT INTO provider_webhook_events (id, provider, receivedAt, ok, httpStatus, providerOrderId, duplicate, error, bodyJson)
  VALUES (@id, @provider, @receivedAt, @ok, @httpStatus, @providerOrderId, @duplicate, @error, @bodyJson)
`);

/** Redacts any `token` field before persisting, per the "no secrets in logs" requirement. */
function redactTokens(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redactTokens);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = /^token$/i.test(k) && v ? "[redacted]" : redactTokens(v);
    }
    return out;
  }
  return value;
}

export function recordWebhookEvent(input: {
  provider: string;
  ok: boolean;
  httpStatus: number;
  providerOrderId?: string | null;
  duplicate?: boolean;
  error?: string | null;
  body: unknown;
}): void {
  insertEventStmt.run({
    id: randomUUID(),
    provider: input.provider,
    receivedAt: new Date().toISOString(),
    ok: input.ok ? 1 : 0,
    httpStatus: input.httpStatus,
    providerOrderId: input.providerOrderId ?? null,
    duplicate: input.duplicate ? 1 : 0,
    error: input.error ?? null,
    bodyJson: JSON.stringify(redactTokens(input.body)),
  });
}
