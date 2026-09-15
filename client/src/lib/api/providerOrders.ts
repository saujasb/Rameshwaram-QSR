import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { apiGet } from "./client";
import { supabase } from "../supabaseClient";
import type { ProviderOrder, ProviderOrderFilter, ProviderOrderSalesFilter, ProviderOrderSalesSummary } from "@shared/providerOrders";

function filterToParams(filter: object): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(filter)) {
    if (v) p.set(k, String(v));
  }
  const qs = p.toString();
  return qs ? `?${qs}` : "";
}

// With Realtime connected, this poll is just a safety net (missed events,
// clock drift) -- Realtime pushes the update immediately. Without it (no
// VITE_SUPABASE_* configured, or the socket dropped), this is the only thing
// keeping the feed live, so it stays reasonably short either way.
export function useProviderOrders(filter: ProviderOrderFilter, refetchIntervalMs = 15000) {
  return useQuery({
    queryKey: ["provider-orders", filter],
    queryFn: () => apiGet<ProviderOrder[]>(`/provider-orders${filterToParams(filter)}`),
    refetchInterval: refetchIntervalMs,
  });
}

export function useProviderOrderSalesSummary(filter: ProviderOrderSalesFilter) {
  return useQuery({
    queryKey: ["provider-orders-sales-summary", filter],
    queryFn: () => apiGet<ProviderOrderSalesSummary>(`/provider-orders/sales-summary${filterToParams(filter)}`),
    refetchInterval: 15000,
  });
}

export type RealtimeStatus = "connecting" | "live" | "degraded";

// Must match exactly the column-level SELECT grant given to anon/authenticated
// on provider_orders (see the "restrict_provider_orders_columns_for_dashboard_clients"
// migration). Keeps customerName, customerPhone, rawPayloadJson, comment,
// biller, assignee, tokenNo, goselfserveSync* etc. out of the Realtime payload
// even though the app code never reads payload content anyway (see below) --
// defense in depth, since the raw WebSocket frame is otherwise inspectable.
const REALTIME_SAFE_COLUMNS = [
  "id",
  "provider",
  "providerOrderId",
  "restaurantId",
  "restaurantName",
  "status",
  "orderType",
  "orderFrom",
  "orderFromLabel",
  "totalAmount",
  "itemCount",
  "providerCreatedAt",
  "receivedAt",
];

/**
 * Subscribes to Postgres Changes (INSERT + UPDATE) on provider_orders and
 * invalidates the cached list/summary queries so they refetch from the
 * already-normalized REST endpoints -- simpler and safer than hand-mapping
 * the raw replication row (numeric/JSON-string column quirks) into a
 * ProviderOrder here. React Query only refetches in the background (no
 * loading flicker) since cached data already exists.
 *
 * Falls back to silently doing nothing if Realtime isn't configured
 * (`supabase` is null) -- the existing poll in useProviderOrders /
 * useProviderOrderSalesSummary keeps the page live either way.
 */
export function useProviderOrdersRealtime(): RealtimeStatus {
  const qc = useQueryClient();
  const [status, setStatus] = useState<RealtimeStatus>(supabase ? "connecting" : "degraded");

  useEffect(() => {
    const client = supabase;
    if (!client) return;

    function onChange() {
      qc.invalidateQueries({ queryKey: ["provider-orders"], exact: false });
      qc.invalidateQueries({ queryKey: ["provider-orders-sales-summary"], exact: false });
    }

    const channel = client
      .channel("provider_orders_dashboard")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "provider_orders", select: REALTIME_SAFE_COLUMNS },
        onChange
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "provider_orders", select: REALTIME_SAFE_COLUMNS },
        onChange
      )
      .subscribe((subStatus) => {
        if (subStatus === "SUBSCRIBED") setStatus("live");
        else if (subStatus === "CHANNEL_ERROR" || subStatus === "TIMED_OUT" || subStatus === "CLOSED") setStatus("degraded");
      });

    return () => {
      client.removeChannel(channel);
    };
  }, [qc]);

  return status;
}
