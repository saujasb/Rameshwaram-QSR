import { randomUUID } from "node:crypto";
import { query, queryOne } from "../../db/pg.js";
import {
  aggregateProviderOrderItems,
  aggregateProviderOrderSales,
  type ProviderOrderItemRow,
  type ProviderOrderSalesRow,
} from "./salesAggregation.js";
import { shiftDateKey } from "../../../../shared-types/businessDate.js";
import { CONFIRMED_PETPOOJA_ONLINE_LABELS } from "../../../../shared-types/providerOrders.js";
import type {
  ProviderName,
  ProviderOrder,
  ProviderOrderAddon,
  ProviderOrderDiscount,
  ProviderOrderFilter,
  ProviderOrderItem,
  ProviderOrderItemSales,
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

// Same two confirmed order_from values classifySalesChannel checks (shared-
// types/providerOrders.ts) -- kept here as SQL rather than fetching every
// Petpooja row and filtering in JS, so "Online" queries stay cheap as volume
// grows. CONFIRMED_PETPOOJA_ONLINE_LABELS is the same list that function
// falls back to for any other confirmed online orderFromLabel; an empty list
// makes `= ANY($n)` correctly match nothing, never everything.
const ONLINE_ORDER_FROM_VALUES = ["zomato", "swiggy"];
const ONLINE_LABELS_LOWER = CONFIRMED_PETPOOJA_ONLINE_LABELS.map((v) => v.toLowerCase());

/** Appends the "this row is the combined Petpooja Online channel" condition, in sync with classifySalesChannel's definition. */
function pushOnlineOnlyCondition(conditions: string[], params: unknown[], next: () => string): void {
  const orderFromParam = next();
  params.push(ONLINE_ORDER_FROM_VALUES);
  const labelParam = next();
  params.push(ONLINE_LABELS_LOWER);
  conditions.push(`(provider = 'petpooja' AND ("orderFrom" = ANY(${orderFromParam}) OR lower("orderFromLabel") = ANY(${labelParam})))`);
}

function buildProviderOrderWhere(filter: ProviderOrderFilter): { where: string; params: unknown[] } {
  const conditions: string[] = [];
  const params: unknown[] = [];
  const next = () => `$${params.length + 1}`;
  if (filter.provider) {
    conditions.push(`provider = ${next()}`);
    params.push(filter.provider);
  }
  if (filter.onlineOnly) {
    pushOnlineOnlyCondition(conditions, params, next);
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
 * Cheap SQL-side pre-filter, on top of the precise business-day bucketing
 * that already happens in JS (aggregateProviderOrderSales/Items -- see that
 * file's comment on why bucketing stays in JS). Widened by one calendar day
 * on each side so the business-day cutoff (default 05:00, shared-types/
 * businessDate.ts) can never exclude a row the JS pass would have kept -- it
 * only narrows what's fetched from Postgres, never what's counted. This is
 * what keeps a bounded query (the common case: today/this week/this month)
 * well under the row caps below as order volume grows, without touching the
 * caps themselves.
 */
function coarseBusinessDateBounds(from?: string, to?: string): { gte?: string; lt?: string } {
  if (!from && !to) return {};
  return {
    gte: from ? `${shiftDateKey(from, -1)}T00:00:00` : undefined,
    lt: to ? `${shiftDateKey(to, 1)}T00:00:00` : undefined,
  };
}

/**
 * Sales Amount tab / Overview live-sales source of truth: aggregates directly
 * from provider_orders, status = 'success' only (cancelled/pending excluded,
 * never invented). Row volume for a single-outlet dashboard is small enough
 * that bucketing in JS (rather than duplicating business-day math in SQL) is
 * the simpler, less error-prone option -- the coarse date pre-filter above is
 * what keeps this scaling as volume grows, without changing that approach.
 */
export async function getProviderOrderSalesSummary(filter: ProviderOrderSalesFilter): Promise<ProviderOrderSalesSummary> {
  const conditions: string[] = [`status = 'success'`];
  const params: unknown[] = [];
  const next = () => `$${params.length + 1}`;
  if (filter.provider) {
    conditions.push(`provider = ${next()}`);
    params.push(filter.provider);
  }
  if (filter.onlineOnly) {
    pushOnlineOnlyCondition(conditions, params, next);
  }
  if (filter.restaurantId) {
    conditions.push(`"restaurantId" = ${next()}`);
    params.push(filter.restaurantId);
  }
  const { gte, lt } = coarseBusinessDateBounds(filter.from, filter.to);
  if (gte) {
    conditions.push(`${SAFE_PROVIDER_CREATED_AT} >= ${next()}`);
    params.push(gte);
  }
  if (lt) {
    conditions.push(`${SAFE_PROVIDER_CREATED_AT} < ${next()}`);
    params.push(lt);
  }
  const where = `WHERE ${conditions.join(" AND ")}`;
  const rows = await query<ProviderOrderSalesRow>(
    `SELECT provider, "orderFrom", "orderFromLabel", "orderType", "totalAmount", "itemCount", "providerCreatedAt"
     FROM provider_orders ${where} ORDER BY "providerCreatedAt" ASC LIMIT 20000`,
    params
  );
  return aggregateProviderOrderSales(rows, filter);
}

// Mirrors getProviderOrderSalesSummary's existing safety ceiling -- not a new,
// lower limit. Applied to the number of qualifying ORDERS before unnesting
// their items, so a wide/unbounded date range still can't unnest an unbounded
// number of item rows.
const ITEM_SALES_MAX_ORDERS = 20000;

/**
 * Item Sales / Category Performance source of truth. Aggregates in SQL via
 * jsonb_array_elements rather than fetching every matching order's full
 * itemsJson into Node -- items can outnumber orders several-fold, so this is
 * the one place in this file where server-side aggregation (Phase 13) matters
 * more than the "bucket in JS" simplicity used elsewhere; the coarse date
 * pre-filter still narrows which orders get unnested at all, and business-day
 * bucketing of the unnested rows still happens in JS via aggregateProviderOrderItems
 * for the same precision reasons as getProviderOrderSalesSummary.
 */
export async function getProviderOrderItemSales(filter: ProviderOrderSalesFilter): Promise<ProviderOrderItemSales> {
  const conditions: string[] = [`status = 'success'`];
  const params: unknown[] = [];
  const next = () => `$${params.length + 1}`;
  if (filter.provider) {
    conditions.push(`provider = ${next()}`);
    params.push(filter.provider);
  }
  if (filter.onlineOnly) {
    pushOnlineOnlyCondition(conditions, params, next);
  }
  if (filter.restaurantId) {
    conditions.push(`"restaurantId" = ${next()}`);
    params.push(filter.restaurantId);
  }
  const { gte, lt } = coarseBusinessDateBounds(filter.from, filter.to);
  if (gte) {
    conditions.push(`${SAFE_PROVIDER_CREATED_AT} >= ${next()}`);
    params.push(gte);
  }
  if (lt) {
    conditions.push(`${SAFE_PROVIDER_CREATED_AT} < ${next()}`);
    params.push(lt);
  }
  const where = `WHERE ${conditions.join(" AND ")}`;
  const limitParam = `$${params.length + 1}`;

  const rows = await query<{
    providerCreatedAt: string;
    item: { name?: string; categoryName?: string; quantity?: number; total?: number };
  }>(
    `WITH filtered_orders AS (
       SELECT "providerCreatedAt", "itemsJson" FROM provider_orders ${where}
       ORDER BY "providerCreatedAt" ASC LIMIT ${limitParam}
     )
     SELECT fo."providerCreatedAt", item
     FROM filtered_orders fo, LATERAL jsonb_array_elements((fo."itemsJson")::jsonb) AS item`,
    [...params, ITEM_SALES_MAX_ORDERS]
  );

  const itemRows: ProviderOrderItemRow[] = rows.map((r) => ({
    providerCreatedAt: r.providerCreatedAt,
    name: r.item?.name ?? "Unknown item",
    categoryName: r.item?.categoryName ?? null,
    quantity: r.item?.quantity ?? 0,
    total: r.item?.total ?? 0,
  }));
  return aggregateProviderOrderItems(itemRows, filter);
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
