import { useQuery } from "@tanstack/react-query";
import { apiGet } from "./client";
import type { ProviderOrder, ProviderOrderFilter } from "@shared/providerOrders";

function filterToParams(filter: ProviderOrderFilter): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(filter)) {
    if (v) p.set(k, String(v));
  }
  const qs = p.toString();
  return qs ? `?${qs}` : "";
}

export function useProviderOrders(filter: ProviderOrderFilter, refetchIntervalMs = 15000) {
  return useQuery({
    queryKey: ["provider-orders", filter],
    queryFn: () => apiGet<ProviderOrder[]>(`/provider-orders${filterToParams(filter)}`),
    refetchInterval: refetchIntervalMs,
  });
}
