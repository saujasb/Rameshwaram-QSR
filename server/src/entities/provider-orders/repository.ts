import { randomUUID } from "node:crypto";
import { query, queryOne } from "../../db/pg.js";
import { aggregateProviderOrderSales, type ProviderOrderSalesRow } from "./salesAggregation.js";
import type {
  ProviderName,
  ProviderOrder,
  ProviderOrderAddon,
  ProviderOrderDiscount,
  ProviderOrderFilter,
  ProviderOrderItem,
  ProviderOrderPartPayment,
  ProviderOrderSalesFilter,
  ProviderOrderSalesSummary,
  ProviderOrderSource,
  ProviderOrderStatus,
  ProviderOrderTax,
  ProviderOrderType,
} from "../../../../shared-types/providerOrders.js";

// provider_orders / provider_webhook_events already exist in Supabase
// (verified in the Phase 1 audit) -- no DDL runs here.

export interface NormalizedProviderOrder {
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
  items: ProviderOrderItem[];
  taxes: ProviderOrderTax[];
  discounts: ProviderOrderDiscount[];
  partPayments: ProviderOrderPartPayment[];
  providerCreatedAt: string;
  rawPayload: unknown;
}

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
    coreTotal: Number(row.coreTotal),
    taxTotal: Number(row.taxTotal),
    discountTotal: Number(row.discountTotal),
    packagingCharge: Number(row.packagingCharge),
    serviceCharge: Number(row.serviceCharge),
    deliveryCharges: Number(row.deliveryCharges),
    roundOff: Number(row.roundOff),
    totalAmount: Number(row.totalAmount),
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
 * Idempotent upsert keyed on (provider, providerOrderId), same semantics as
 * the SQLite version: a repeat delivery of the exact same payload is a
 * no-op-shaped duplicate; a changed status/total updates the row in place.
 * Postgres's own UNIQUE(provider, providerOrderId) constraint + ON CONFLICT
 * gives the same race-safety a single-writer SQLite connection had.
 */
export async function upsertProviderOrder(input: NormalizedProviderOrder): Promise<UpsertOutcome> {
  const existing = await queryOne<{ id: string; rawPayloadJson: string }>(
    `SELECT id, "rawPayloadJson" FROM provider_orders WHERE provider = $1 AND "providerOrderId" = $2`,
    [input.provider, input.providerOrderId]
  );

  const now = new Date().toISOString();
  const rawPayloadJson = JSON.stringify(input.rawPayload);
  const isDuplicate = existing != null && existing.rawPayloadJson === rawPayloadJson;
  const id = existing?.id ?? randomUUID();

  await query(
    `INSERT INTO provider_orders (
      id, provider, "providerOrderId", "providerInvoiceId", "restaurantId", "restaurantName",
      status, "orderType", "orderFrom", "orderFromLabel", "subOrderType", "paymentType", "tableNo",
      "noOfPersons", "customerName", "customerPhone", "coreTotal", "taxTotal", "discountTotal",
      "packagingCharge", "serviceCharge", "deliveryCharges", "roundOff", "totalAmount", comment,
      biller, assignee, "tokenNo", "itemCount", "itemsJson", "taxesJson", "discountsJson",
      "partPaymentsJson", "rawPayloadJson", "providerCreatedAt", "receivedAt",
      "goselfserveSyncStatus", "createdAt", "updatedAt"
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,
      $26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,'pending',$37,$38
    )
    ON CONFLICT (provider, "providerOrderId") DO UPDATE SET
      "providerInvoiceId" = excluded."providerInvoiceId",
      "restaurantId" = excluded."restaurantId",
      "restaurantName" = excluded."restaurantName",
      status = excluded.status,
      "orderType" = excluded."orderType",
      "orderFrom" = excluded."orderFrom",
      "orderFromLabel" = excluded."orderFromLabel",
      "subOrderType" = excluded."subOrderType",
      "paymentType" = excluded."paymentType",
      "tableNo" = excluded."tableNo",
      "noOfPersons" = excluded."noOfPersons",
      "customerName" = excluded."customerName",
      "customerPhone" = excluded."customerPhone",
      "coreTotal" = excluded."coreTotal",
      "taxTotal" = excluded."taxTotal",
      "discountTotal" = excluded."discountTotal",
      "packagingCharge" = excluded."packagingCharge",
      "serviceCharge" = excluded."serviceCharge",
      "deliveryCharges" = excluded."deliveryCharges",
      "roundOff" = excluded."roundOff",
      "totalAmount" = excluded."totalAmount",
      comment = excluded.comment,
      biller = excluded.biller,
      assignee = excluded.assignee,
      "tokenNo" = excluded."tokenNo",
      "itemCount" = excluded."itemCount",
      "itemsJson" = excluded."itemsJson",
      "taxesJson" = excluded."taxesJson",
      "discountsJson" = excluded."discountsJson",
      "partPaymentsJson" = excluded."partPaymentsJson",
      "rawPayloadJson" = excluded."rawPayloadJson",
      "providerCreatedAt" = excluded."providerCreatedAt",
      "updatedAt" = excluded."updatedAt"`,
    [
      id, input.provider, input.providerOrderId, input.providerInvoiceId, input.restaurantId, input.restaurantName,
      input.status, input.orderType, input.orderFrom, input.orderFromLabel, input.subOrderType, input.paymentType, input.tableNo,
      input.noOfPersons, input.customerName, input.customerPhone, input.coreTotal, input.taxTotal, input.discountTotal,
      input.packagingCharge, input.serviceCharge, input.deliveryCharges, input.roundOff, input.totalAmount, input.comment,
      input.biller, input.assignee, input.tokenNo, input.items.length, JSON.stringify(input.items), JSON.stringify(input.taxes),
      JSON.stringify(input.discounts), JSON.stringify(input.partPayments), rawPayloadJson, input.providerCreatedAt, now,
      now, now,
    ]
  );

  const row = await queryOne(`SELECT * FROM provider_orders WHERE id = $1`, [id]);
  return { order: rowToOrder(row), isNew: !existing, isDuplicate: !!existing && isDuplicate };
}

export async function getProviderOrder(id: string): Promise<ProviderOrder | undefined> {
  const row = await queryOne(`SELECT * FROM provider_orders WHERE id = $1`, [id]);
  return row ? rowToOrder(row) : undefined;
}

// Preserves the original hardcoded safety cap that used to sit directly in the
// SELECT below: even a "show all" request from the client is bounded to this
// many rows so a wide date range can't produce an unbounded response.
export const MAX_PROVIDER_ORDERS_PAGE_SIZE = 1000;

// providerCreatedAt is stored as text, and the two providers write different
// formats (Petpooja: "YYYY-MM-DD HH:mm:ss", GoSelfServe: ISO "...T...Z").
// Postgres's own ::timestamptz cast parses both correctly, but a handful of
// test/QA rows (see Live Orders audit) have it blank, which would make a bare
// cast throw for every row in the table. The WHEN/THEN form of CASE is
// spec-guaranteed to only evaluate the cast when the regex already matched
// (unlike relying on AND short-circuit order), so those rows are simply left
// out of any date-filtered query instead of erroring the whole thing out.
const SAFE_PROVIDER_CREATED_AT = `(CASE WHEN "providerCreatedAt" ~ '^\\d{4}-\\d{2}-\\d{2}' THEN "providerCreatedAt"::timestamptz ELSE NULL END)`;

function buildProviderOrderWhere(filter: ProviderOrderFilter): { where: string; params: unknown[] } {
  const conditions: string[] = [];
  const params: unknown[] = [];
  const next = () => `$${params.length + 1}`;
  if (filter.provider) {
    conditions.push(`provider = ${next()}`);
    params.push(filter.provider);
  }
  if (filter.status) {
    conditions.push(`status = ${next()}`);
    params.push(filter.status);
  }
  if (filter.orderType) {
    conditions.push(`"orderType" = ${next()}`);
    params.push(filter.orderType);
  }
  if (filter.orderFrom) {
    conditions.push(`"orderFrom" = ${next()}`);
    params.push(filter.orderFrom);
  }
  if (filter.search) {
    const like = `%${filter.search}%`;
    conditions.push(`("providerOrderId" ILIKE ${next()} OR "customerName" ILIKE ${next()} OR "restaurantName" ILIKE ${next()})`);
    params.push(like, like, like);
  }
  if (filter.from) {
    conditions.push(`${SAFE_PROVIDER_CREATED_AT} >= ${next()}`);
    params.push(filter.from);
  }
  if (filter.to) {
    conditions.push(`${SAFE_PROVIDER_CREATED_AT} < ${next()}`);
    params.push(filter.to);
  }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  return { where, params };
}

/**
 * When filter.page/pageSize are omitted (existing callers -- Live Sales Feed,
 * Sales Amount tab's recent-sales list), this is byte-for-byte the original
 * behavior: newest 1000 rows, no offset. Callers that pass page/pageSize
 * (Live Orders' date-range browser) get real OFFSET/LIMIT pagination instead.
 */
export async function listProviderOrders(filter: ProviderOrderFilter): Promise<ProviderOrder[]> {
  const { where, params } = buildProviderOrderWhere(filter);
  const pageSize = Math.min(filter.pageSize ?? MAX_PROVIDER_ORDERS_PAGE_SIZE, MAX_PROVIDER_ORDERS_PAGE_SIZE);
  const offset = filter.page && filter.page > 1 ? (filter.page - 1) * pageSize : 0;
  const limitParam = `$${params.length + 1}`;
  const offsetParam = `$${params.length + 2}`;
  const rows = await query(
    `SELECT * FROM provider_orders ${where} ORDER BY "receivedAt" DESC LIMIT ${limitParam} OFFSET ${offsetParam}`,
    [...params, pageSize, offset]
  );
  return rows.map(rowToOrder);
}

/** Total matching rows for a filter, ignoring page/pageSize -- used to build pagination metadata. */
export async function countProviderOrders(filter: ProviderOrderFilter): Promise<number> {
  const { where, params } = buildProviderOrderWhere(filter);
  const row = await queryOne<{ count: string }>(`SELECT COUNT(*)::text AS count FROM provider_orders ${where}`, params);
  return Number(row?.count ?? 0);
}

export async function markGoSelfServeSyncResult(id: string, ok: boolean, error: string | null): Promise<void> {
  await query(
    `UPDATE provider_orders SET "goselfserveSyncStatus" = $1, "goselfserveSyncError" = $2, "goselfserveSyncedAt" = $3 WHERE id = $4`,
    [ok ? "sent" : "failed", error, new Date().toISOString(), id]
  );
}

export async function markGoSelfServeNotConfigured(id: string): Promise<void> {
  await query(`UPDATE provider_orders SET "goselfserveSyncStatus" = 'not_configured' WHERE id = $1`, [id]);
}

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

/**
 * Sales Amount tab source of truth: aggregates directly from provider_orders,
 * status = 'success' only (cancelled/pending excluded, never invented). Row
 * volume for a single-outlet dashboard is small enough that bucketing in JS
 * (rather than duplicating business-day math in SQL) is the simpler,
 * less error-prone option.
 */
export async function getProviderOrderSalesSummary(filter: ProviderOrderSalesFilter): Promise<ProviderOrderSalesSummary> {
  const conditions: string[] = [`status = 'success'`];
  const params: unknown[] = [];
  const next = () => `$${params.length + 1}`;
  if (filter.provider) {
    conditions.push(`provider = ${next()}`);
    params.push(filter.provider);
  }
  if (filter.restaurantId) {
    conditions.push(`"restaurantId" = ${next()}`);
    params.push(filter.restaurantId);
  }
  const where = `WHERE ${conditions.join(" AND ")}`;
  const rows = await query<ProviderOrderSalesRow>(
    `SELECT "orderType", "totalAmount", "itemCount", "providerCreatedAt" FROM provider_orders ${where} ORDER BY "providerCreatedAt" ASC LIMIT 20000`,
    params
  );
  return aggregateProviderOrderSales(rows, filter);
}

export async function recordWebhookEvent(input: {
  provider: string;
  ok: boolean;
  httpStatus: number;
  providerOrderId?: string | null;
  duplicate?: boolean;
  error?: string | null;
  body: unknown;
}): Promise<void> {
  await query(
    `INSERT INTO provider_webhook_events (id, provider, "receivedAt", ok, "httpStatus", "providerOrderId", duplicate, error, "bodyJson")
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [
      randomUUID(),
      input.provider,
      new Date().toISOString(),
      input.ok ? 1 : 0,
      input.httpStatus,
      input.providerOrderId ?? null,
      input.duplicate ? 1 : 0,
      input.error ?? null,
      JSON.stringify(redactTokens(input.body)),
    ]
  );
}
