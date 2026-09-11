import { useQuery } from "@tanstack/react-query";
import { apiGet } from "./client";
import type { AnalyticsSnapshot, PrioritizedAction } from "@shared/analytics";

export function useAnalyticsSnapshot() {
  return useQuery({ queryKey: ["analytics-snapshot"], queryFn: () => apiGet<AnalyticsSnapshot>("/analytics/snapshot") });
}

export function usePrioritizedActions() {
  return useQuery({ queryKey: ["analytics-actions"], queryFn: () => apiGet<PrioritizedAction[]>("/analytics/actions") });
}
