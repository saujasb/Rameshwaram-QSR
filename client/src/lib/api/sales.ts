import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiDelete, apiFetch, apiGet, apiPut, BASE } from "./client";
import type { SalesSummary, SalesImportBatch, SalesTargetSetting } from "@shared/sales";


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

/** Same query/cache as useImportBatches -- just reads the most recent batch, for freshness badges. */
export function useLatestImportBatch() {
  return useQuery({
    queryKey: ["sales-import-batches"],
    queryFn: () => apiGet<SalesImportBatch[]>("/sales/import-batches"),
    select: (batches) => batches[0] ?? null,
  });
}

export interface ImportError extends Error {
  detail?: string;
}

// Small files (< SMALL_FILE_BYTES) go straight through as multipart, same as
// before. Larger files would exceed Vercel's ~4.5MB function body limit, so
// they go browser -> Supabase Storage (signed upload URL) -> server instead.
const SMALL_FILE_BYTES = 4 * 1024 * 1024;

async function uploadViaStorage(file: File): Promise<string> {
  const sign = await apiFetch(`${BASE}/uploads/sign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName: file.name, contentType: file.type }),
  });
  const signBody = await sign.json().catch(() => ({}));
  if (!sign.ok) throw new Error(signBody.error ?? "Could not prepare the upload.");

  const put = await fetch(signBody.signedUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!put.ok) throw new Error(`Upload to storage failed with ${put.status}`);
  return signBody.path as string;
}

export function useImportSalesPdf() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, businessDate }: { file: File; businessDate?: string }) => {
      let res: Response;
      if (file.size <= SMALL_FILE_BYTES) {
        const formData = new FormData();
        formData.append("file", file);
        if (businessDate) formData.append("businessDate", businessDate);
        res = await apiFetch(`${BASE}/sales/import`, { method: "POST", body: formData });
      } else {
        const storagePath = await uploadViaStorage(file);
        res = await apiFetch(`${BASE}/sales/import`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ storagePath, fileName: file.name, businessDate }),
        });
      }
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

export function useSalesTarget() {
  return useQuery({
    queryKey: ["sales-target"],
    queryFn: () => apiGet<SalesTargetSetting>("/sales/target"),
  });
}

export function useSetSalesTarget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (amount: number) => apiPut<SalesTargetSetting>("/sales/target", { amount }),
    onSuccess: (data) => qc.setQueryData(["sales-target"], data),
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
