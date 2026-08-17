import { useQuery } from "@tanstack/react-query";
import { apiGet } from "./client";
import type { DatasetFilter } from "@shared/datasets";
import type { Anomaly, Insight, ReconciliationSummary, TodaysIntelligence } from "@shared/intelligence";
import { filterToParams } from "./datasets";

export function useTodaysIntelligence(businessDate?: string) {
  const qs = businessDate ? `?businessDate=${businessDate}` : "";
  return useQuery({
    queryKey: ["todays-intelligence", businessDate ?? null],
    queryFn: () => apiGet<TodaysIntelligence>(`/intelligence/today${qs}`),
  });
}

export function useTopInsights(filter: DatasetFilter = {}) {
  return useQuery({
    queryKey: ["top-insights", filter],
    queryFn: () => apiGet<Insight[]>(`/intelligence/insights${filterToParams(filter)}`),
  });
}

export function useAnomalies(filter: DatasetFilter = {}) {
  return useQuery({
    queryKey: ["anomalies", filter],
    queryFn: () => apiGet<Anomaly[]>(`/intelligence/anomalies${filterToParams(filter)}`),
  });
}

export function useReconciliation(filter: DatasetFilter = {}) {
  return useQuery({
    queryKey: ["reconciliation", filter],
    queryFn: () => apiGet<ReconciliationSummary>(`/intelligence/reconciliation${filterToParams(filter)}`),
  });
}
