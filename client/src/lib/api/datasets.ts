import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPut } from "./client";
import type {
  DatasetCoverage,
  DatasetFilter,
  DatasetType,
  ImportBatch,
  PaginatedRecords,
} from "@shared/datasets";
import type { HourlyBucket, ProductPerformanceRow } from "@shared/intelligence";

const BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

export interface DatasetSummary {
  totals: { quantity: number; value: number; recordCount: number };
  daily: { businessDate: string; quantity: number; value: number }[];
  topProducts: { product: string; category: string | null; quantity: number; value: number }[];
  categories: { category: string; quantity: number; value: number }[];
  channels: { channel: string; quantity: number; value: number }[];
  hourly: HourlyBucket[];
  wastageReasons: { reason: string; quantity: number; recordCount: number }[];
}

export function filterToParams(filter: DatasetFilter): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(filter)) {
    if (v !== undefined && v !== null && v !== "") p.set(k, String(v));
  }
  const qs = p.toString();
  return qs ? `?${qs}` : "";
}

export function useDatasetSummary(filter: DatasetFilter) {
  return useQuery({
    queryKey: ["dataset-summary", filter],
    queryFn: () => apiGet<DatasetSummary>(`/datasets/summary${filterToParams(filter)}`),
  });
}

export function useDatasetRecords(filter: DatasetFilter) {
  return useQuery({
    queryKey: ["dataset-records", filter],
    queryFn: () => apiGet<PaginatedRecords>(`/datasets/records${filterToParams(filter)}`),
  });
}

export function useProductPerformance(filter: DatasetFilter) {
  return useQuery({
    queryKey: ["dataset-products", filter],
    queryFn: () => apiGet<ProductPerformanceRow[]>(`/datasets/products${filterToParams(filter)}`),
  });
}

export function useDatasetCoverage() {
  return useQuery({ queryKey: ["dataset-coverage"], queryFn: () => apiGet<DatasetCoverage[]>("/datasets/coverage") });
}

export function useDatasetFacets() {
  return useQuery({
    queryKey: ["dataset-facets"],
    queryFn: () => apiGet<{ products: string[]; outlets: string[]; shifts: string[] }>("/datasets/facets"),
  });
}

export function useImportBatches() {
  return useQuery({ queryKey: ["dataset-import-batches"], queryFn: () => apiGet<ImportBatch[]>("/datasets/import-batches") });
}

export function useLatestImportBatch() {
  return useQuery({
    queryKey: ["dataset-import-batches"],
    queryFn: () => apiGet<ImportBatch[]>("/datasets/import-batches"),
    select: (b) => b[0] ?? null,
  });
}

export interface ImportFileResult {
  fileName: string;
  ok: boolean;
  batch?: ImportBatch;
  error?: string;
  detail?: string;
  duplicateOf?: ImportBatch;
}

export function exportCsvUrl(filter: DatasetFilter): string {
  return `${BASE}/datasets/export.csv${filterToParams(filter)}`;
}

/** Invalidates every query that reads imported data, so the whole dashboard refreshes. */
export function useInvalidateDataLayer() {
  const qc = useQueryClient();
  return () => {
    for (const key of [
      "dataset-summary", "dataset-records", "dataset-products", "dataset-coverage",
      "dataset-facets", "dataset-import-batches", "todays-intelligence", "top-insights",
      "anomalies", "reconciliation", "sales-summary", "sales-import-batches",
    ]) {
      qc.invalidateQueries({ queryKey: [key] });
    }
  };
}

export function useImportFiles() {
  const invalidate = useInvalidateDataLayer();
  return useMutation({
    mutationFn: async (input: {
      files: File[];
      businessDate?: string;
      datasetOverrides?: Record<string, DatasetType>;
      allowDuplicateFile?: boolean;
    }) => {
      const fd = new FormData();
      for (const f of input.files) fd.append("files", f);
      if (input.businessDate) fd.append("businessDate", input.businessDate);
      if (input.datasetOverrides) fd.append("datasetOverrides", JSON.stringify(input.datasetOverrides));
      if (input.allowDuplicateFile) fd.append("allowDuplicateFile", "true");

      const res = await fetch(`${BASE}/datasets/import`, { method: "POST", body: fd });
      const body = await res.json().catch(() => ({}));
      if (!res.ok && !body.results) {
        throw new Error(body.error ?? `Upload failed with ${res.status}`);
      }
      return (body.results ?? []) as ImportFileResult[];
    },
    onSuccess: invalidate,
  });
}

export function useDeleteImportBatch() {
  const invalidate = useInvalidateDataLayer();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${BASE}/datasets/import-batches/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) throw new Error(`Delete failed with ${res.status}`);
    },
    onSuccess: invalidate,
  });
}

export function useBusinessDaySettings() {
  return useQuery({
    queryKey: ["dataset-settings"],
    queryFn: () => apiGet<{ businessDayStartHour: number }>("/datasets/settings"),
  });
}

export function useSetBusinessDayStartHour() {
  const qc = useQueryClient();
  const invalidate = useInvalidateDataLayer();
  return useMutation({
    mutationFn: (businessDayStartHour: number) =>
      apiPut<{ businessDayStartHour: number; updatedAt: string }>("/datasets/settings", { businessDayStartHour }),
    onSuccess: (data) => {
      qc.setQueryData(["dataset-settings"], { businessDayStartHour: data.businessDayStartHour });
      invalidate();
    },
  });
}
