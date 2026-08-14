import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiDelete } from "./client";
import type { SalesSummary, SalesImportBatch } from "@shared/sales";

const BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

function summaryKey(from?: string, to?: string) {
  return ["sales-summary", from ?? null, to ?? null] as const;
}

export function useSalesSummary(from?: string, to?: string) {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const qs = params.toString();
  return useQuery({
    queryKey: summaryKey(from, to),
    queryFn: () => apiGet<SalesSummary>(`/sales/summary${qs ? `?${qs}` : ""}`),
  });
}

export function useImportBatches() {
  return useQuery({
    queryKey: ["sales-import-batches"],
    queryFn: () => apiGet<SalesImportBatch[]>("/sales/import-batches"),
  });
}

export interface ImportError extends Error {
  detail?: string;
}

export function useImportSalesPdf() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, businessDate }: { file: File; businessDate?: string }) => {
      const formData = new FormData();
      formData.append("file", file);
      if (businessDate) formData.append("businessDate", businessDate);
      const res = await fetch(`${BASE}/sales/import`, { method: "POST", body: formData });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        const err = new Error(body.error ?? `Request failed with ${res.status}`) as ImportError;
        err.detail = body.detail;
        throw err;
      }
      return body as SalesImportBatch;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sales-summary"] });
      qc.invalidateQueries({ queryKey: ["sales-import-batches"] });
    },
  });
}

export function useDeleteImportBatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiDelete(`/sales/import-batches/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sales-summary"] });
      qc.invalidateQueries({ queryKey: ["sales-import-batches"] });
    },
  });
}
