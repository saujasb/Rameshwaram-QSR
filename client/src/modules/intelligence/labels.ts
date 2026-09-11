import { ANOMALY_KIND_LABELS } from "@shared/intelligence";
import { DATASET_LABELS, type DatasetType } from "@shared/datasets";

export { ANOMALY_KIND_LABELS };

/** Tolerates an unexpected dataset value from the API rather than rendering "undefined". */
export function DATASET_LABELS_SAFE(t: DatasetType | string): string {
  return DATASET_LABELS[t as DatasetType] ?? String(t);
}
