import { randomUUID } from "node:crypto";
import { query, withTransaction } from "../../db/client.js";
import type {
  ProviderName,
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

function rowToOrder(row: Record<string, unknown>): ProviderOrder {
  return {
    id: row.id as string,
    provider: row.provider as ProviderName,
    providerOrderId: row.providerOrderId as string,
    providerInvoiceId: row.providerInvoiceId as string,
    restaurantId: row.restaurantId as string,
    restaurantName: row.restaurantName as string,
    status: row.status as ProviderOrderStatus,
    orderType: row.orderType as ProviderOrderType,
    orderFrom: row.orderFrom as ProviderOrderSource,
    orderFromLabel: row.orderFromLabel as string,
    subOrderType: row.subOrderType as string,
    paymentType: row.paymentType as string,
    tableNo: row.tableNo as string,
    noOfPersons: row.noOfPersons as number,
    customerName: row.customerName as string,
    customerPhone: row.customerPhone as string,
    coreTotal: row.coreTotal as number,
    taxTotal: row.taxTotal as number,
    discountTotal: row.discountTotal as number,
    packagingCharge: row.packagingCharge as number,
    serviceCharge: row.serviceCharge as number,
    deliveryCharges: row.deliveryCharges as number,
    roundOff: row.roundOff as number,
    totalAmount: row.totalAmount as number,
    comment: row.comment as string,
    biller: row.biller as string,
    assignee: row.assignee as string,
    tokenNo: row.tokenNo as string,
    itemCount: row.itemCount as number,
    items: JSON.parse(row.itemsJson as string),
    taxes: JSON.parse(row.taxesJson as string),
    discounts: JSON.parse(row.discountsJson as string),
    partPayments: JSON.parse(row.partPaymentsJson as string),
    providerCreatedAt: row.providerCreatedAt as string,
    receivedAt: row.receivedAt as string,
    goselfserveSyncStatus: row.goselfserveSyncStatus as ProviderOrder["goselfserveSyncStatus"],
    goselfserveSyncError: row.goselfserveSyncError as string | null,
    goselfserveSyncedAt: row.goselfserveSyncedAt as string | null,
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
  };
}

export interface UpsertOutcome {
  order: ProviderOrder;
  isNew: boolean;
  isDuplicate: boolean;
}

/**
 * Idempotent upsert keyed on (provider, providerOrderId): a repeat delivery
 * of the exact same payload is recorded as a duplicate (no-op update); a
 * delivery with a changed status/total for an order already seen updates
 * the row in place.
 *
 * Postgres concurrency note (this replaces the SQLite-era version of this
 * comment, which relied on SQLite's single-writer thread for race safety --
 * that assumption does not hold here and this implementation does not make
 * it):
 *   - The actual write is one atomic `INSERT ... ON CONFLICT (provider,
 *     "providerOrderId") DO UPDATE`, which Postgres itself resolves
 *     correctly even if two webhook deliveries for the same
 *     (provider, providerOrderId) race at the database level -- this is
 *     the real safety guarantee, not any assumption about the app.
 *   - `isNew` is read back via `RETURNING (xmax = 0) AS "isNew"`, a
 *     standard Postgres idiom: a freshly-inserted row's system `xmax`
 *     column is 0, while a row reached via the DO UPDATE branch has a
 *     non-zero xmax. This is decided by the database at the moment the
 *     conflict is actually resolved, so it stays correct even for two
 *     truly simultaneous first-ever deliveries of the same brand-new order.
 *   - `isDuplicate` (whether the payload is byte-identical to what's already
 *     stored) needs the row's PRE-update value, which Postgres does not
 *     expose in the same RETURNING clause as the post-update row. This is
 *     read via `SELECT ... FOR UPDATE` before the upsert, inside the same
 *     transaction, which also serializes concurrent updates to the *same*
 *     existing order. The one narrow case this doesn't fully close is two
 *     truly simultaneous *first-ever* deliveries of the same new order
 *     (nothing to lock yet on either side) -- in that case `isDuplicate`
 *     for the losing transaction may be reported as `false` when the
 *     delivery was in fact identical. `isDuplicate` is audit/log-only
 *     (see recordWebhookEvent below) and never gates what gets stored, so
 *     this narrow edge case cannot cause incorrect data, only an
 *     imprecise audit annotation for a vanishingly rare race.
 */
export async function upsertProviderOrder(input: NormalizedProviderOrder): Promise<UpsertOutcome> {
  return withTransaction(async (client) => {
    const lockRes = await client.query<{ id: string; rawPayloadJson: string }>(
      `SELECT id, "rawPayloadJson" FROM provider_orders WHERE provider = $1 AND "providerOrderId" = $2 FOR UPDATE`,
      [input.provider, input.providerOrderId]
    );
    const existing = lockRes.rows[0];
    const id = existing?.id ?? randomUUID();
    const rawPayloadJson = JSON.stringify(input.rawPayload);
    const isDuplicate = existing != null && existing.rawPayloadJson === rawPayloadJson;
    const now = new Date().toISOString();

    const upsertRes = await client.query(
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
        "providerInvoiceId" = EXCLUDED."providerInvoiceId",
        "restaurantId" = EXCLUDED."restaurantId",
        "restaurantName" = EXCLUDED."restaurantName",
        status = EXCLUDED.status,
        "orderType" = EXCLUDED."orderType",
        "orderFrom" = EXCLUDED."orderFrom",
        "orderFromLabel" = EXCLUDED."orderFromLabel",
        "subOrderType" = EXCLUDED."subOrderType",
        "paymentType" = EXCLUDED."paymentType",
        "tableNo" = EXCLUDED."tableNo",
        "noOfPersons" = EXCLUDED."noOfPersons",
        "customerName" = EXCLUDED."customerName",
        "customerPhone" = EXCLUDED."customerPhone",
        "coreTotal" = EXCLUDED."coreTotal",
        "taxTotal" = EXCLUDED."taxTotal",
        "discountTotal" = EXCLUDED."discountTotal",
        "packagingCharge" = EXCLUDED."packagingCharge",
        "serviceCharge" = EXCLUDED."serviceCharge",
        "deliveryCharges" = EXCLUDED."deliveryCharges",
        "roundOff" = EXCLUDED."roundOff",
        "totalAmount" = EXCLUDED."totalAmount",
        comment = EXCLUDED.comment,
        biller = EXCLUDED.biller,
        assignee = EXCLUDED.assignee,
        "tokenNo" = EXCLUDED."tokenNo",
        "itemCount" = EXCLUDED."itemCount",
        "itemsJson" = EXCLUDED."itemsJson",
        "taxesJson" = EXCLUDED."taxesJson",
        "discountsJson" = EXCLUDED."discountsJson",
        "partPaymentsJson" = EXCLUDED."partPaymentsJson",
        "rawPayloadJson" = EXCLUDED."rawPayloadJson",
        "providerCreatedAt" = EXCLUDED."providerCreatedAt",
        "updatedAt" = EXCLUDED."updatedAt"
      RETURNING *, (xmax = 0) AS "isNew"`,
      [
        id,
        input.provider,
        input.providerOrderId,
        input.providerInvoiceId,
        input.restaurantId,
        input.restaurantName,
        input.status,
        input.orderType,
        input.orderFrom,
        input.orderFromLabel,
        input.subOrderType,
        input.paymentType,
        input.tableNo,
        input.noOfPersons,
        input.customerName,
        input.customerPhone,
        input.coreTotal,
        input.taxTotal,
        input.discountTotal,
        input.packagingCharge,
        input.serviceCharge,
        input.deliveryCharges,
        input.roundOff,
        input.totalAmount,
        input.comment,
        input.biller,
        input.assignee,
        input.tokenNo,
        input.items.length,
        JSON.stringify(input.items),
        JSON.stringify(input.taxes),
        JSON.stringify(input.discounts),
        JSON.stringify(input.partPayments),
        rawPayloadJson,
        input.providerCreatedAt,
        now,
        now,
        now,
      ]
    );

    const row = upsertRes.rows[0] as Record<string, unknown> & { isNew: boolean };
    return { order: rowToOrder(row), isNew: row.isNew, isDuplicate: !!existing && isDuplicate };
  });
}

export async function getProviderOrder(id: string): Promise<ProviderOrder | undefined> {
  const { rows } = await query(`SELECT * FROM provider_orders WHERE id = $1`, [id]);
  return rows[0] ? rowToOrder(rows[0]) : undefined;
}

export async function listProviderOrders(filter: ProviderOrderFilter): Promise<ProviderOrder[]> {
  const conditions: string[] = [];
  const params: unknown[] = [];
  if (filter.provider) {
    params.push(filter.provider);
    conditions.push(`provider = $${params.length}`);
  }
  if (filter.status) {
    params.push(filter.status);
    conditions.push(`status = $${params.length}`);
  }
  if (filter.orderType) {
    params.push(filter.orderType);
    conditions.push(`"orderType" = $${params.length}`);
  }
  if (filter.orderFrom) {
    params.push(filter.orderFrom);
    conditions.push(`"orderFrom" = $${params.length}`);
  }
  if (filter.search) {
    const like = `%${filter.search}%`;
    params.push(like, like, like);
    const n = params.length;
    conditions.push(`("providerOrderId" LIKE $${n - 2} OR "customerName" LIKE $${n - 1} OR "restaurantName" LIKE $${n})`);
  }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const { rows } = await query(`SELECT * FROM provider_orders ${where} ORDER BY "receivedAt" DESC LIMIT 1000`, params);
  return rows.map(rowToOrder);
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
