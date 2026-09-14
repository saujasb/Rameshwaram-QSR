// Outbound adapter to GoSelfServe's order-status endpoint.
//
// Direction: the live Swagger at https://orderservice.qsr.goselfserve.in/orders-json
// shows POST /order/status (operationId ThirdpartywebhookController_handleOrderStatus)
// is hosted ON GoSelfServe's own server -- so integration direction is OUTBOUND:
// we call them, they don't call us.
//
// Contract gap (see final report / BLOCKED section): the live schema for this
// operation's body is `ProcessOrderStatusDto`, which GoSelfServe's own generated
// Swagger exposes as `{ "type": "object", "properties": {} }` -- genuinely empty.
// Their own supplied .docx says the same thing and calls its example payload
// "illustrative... NOT the official payload". That illustrative shape is the
// only documented shape anywhere (repo, PDF, docx, live Swagger), so it's used
// here as a best-effort default, isolated to buildStatusPayload() below so it's
// a one-line change once GoSelfServe confirms the real field names.
import type { ProviderOrder } from "../../../../shared-types/providerOrders.js";
import { markGoSelfServeNotConfigured, markGoSelfServeSyncResult } from "./repository.js";

const BASE_URL = process.env.GOSELFSERVE_BASE_URL ?? "https://orderservice.qsr.goselfserve.in";
const API_TOKEN = process.env.GOSELFSERVE_API_TOKEN;
const API_KEY = process.env.GOSELFSERVE_API_KEY;
const TIMEOUT_MS = 8000;

function buildStatusPayload(order: ProviderOrder): Record<string, unknown> {
  return {
    order_id: order.providerOrderId,
    status: order.status,
    updated_at: order.updatedAt,
    additional_data: {
      provider: order.provider,
      order_type: order.orderType,
      order_from: order.orderFromLabel,
      total: order.totalAmount,
    },
  };
}

/**
 * Fire-and-forget from the webhook's point of view: failures here never fail
 * the inbound Petpooja webhook response, they just mark goselfserveSyncStatus
 * so it's visible on the dashboard and can be retried by re-running this.
 */
export async function syncOrderStatusToGoSelfServe(order: ProviderOrder): Promise<void> {
  if (!API_TOKEN && !API_KEY) {
    markGoSelfServeNotConfigured(order.id);
    return;
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (API_TOKEN) headers["x-api-token"] = API_TOKEN;
  if (API_KEY) headers["x-api-key"] = API_KEY;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}/order/status`, {
      method: "POST",
      headers,
      body: JSON.stringify(buildStatusPayload(order)),
      signal: controller.signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      markGoSelfServeSyncResult(order.id, false, `HTTP ${res.status}: ${text.slice(0, 300)}`);
      return;
    }
    markGoSelfServeSyncResult(order.id, true, null);
  } catch (err) {
    markGoSelfServeSyncResult(order.id, false, err instanceof Error ? err.message : String(err));
  } finally {
    clearTimeout(timeout);
  }
}
