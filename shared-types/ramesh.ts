import type { DatasetType } from "./datasets.js";
import type { AnomalyEvidence } from "./intelligence.js";

// Ramesh — the Rameshwaram Intelligence Assistant.
//
// Ramesh is a DETERMINISTIC query engine, not a generative model. Questions are
// parsed into a structured intent, the answer is computed by the same SQL/JS
// aggregations that power the dashboard, and the reply is templated from those
// numbers. This is a deliberate architectural choice:
//   * numbers can never be hallucinated -- they are computed, not predicted;
//   * every answer is reproducible: same data + same question => same output;
//   * the calculation shown IS the calculation performed;
//   * uploaded file content is never fed to a model as instructions, so
//     prompt injection via a spreadsheet cell is structurally impossible.

export const RAMESH_IDENTITY = "Ramesh — Rameshwaram Intelligence Assistant";

export const RAMESH_OFF_TOPIC_REPLY =
  "I'm Ramesh, the Rameshwaram Intelligence Assistant. I can only answer using business data from this dashboard.";

export type RameshIntent =
  | "total_sales"
  | "total_production"
  | "total_wastage"
  | "top_product"
  | "bottom_product"
  | "peak_hour"
  | "compare_dates"
  | "compare_datasets"
  | "wastage_reason"
  | "variance_explain"
  | "anomaly_explain"
  | "trend"
  | "data_coverage"
  | "help"
  | "off_topic"
  | "unsupported";

export interface RameshQuery {
  question: string;
  /** Dashboard filter context, so Ramesh answers within what the user is looking at. */
  context?: {
    from?: string;
    to?: string;
    product?: string;
    outlet?: string;
    shift?: string;
  };
}

/** What data the answer was computed from -- shown verbatim under "Data Used". */
export interface RameshDataUsed {
  datasets: DatasetType[];
  businessDateFrom: string | null;
  businessDateTo: string | null;
  product: string | null;
  outlet: string | null;
  shift: string | null;
  recordCount: number;
}

/** One line of arithmetic, rendered as shown. */
export interface RameshCalculationStep {
  label: string;
  expression: string;
  result: string;
}

export interface RameshAnswer {
  intent: RameshIntent;
  /** Direct answer. Never contains a number that isn't in `calculation`/`dataUsed`. */
  answer: string;
  dataUsed: RameshDataUsed | null;
  calculation: RameshCalculationStep[];
  conclusion: string;
  evidence: AnomalyEvidence[];
  /** Query params for the "View records" drill-down into the Data Explorer. */
  drilldownQuery: Record<string, string> | null;
  /** True when Ramesh declined for lack of data rather than answering. */
  insufficientData: boolean;
  /** Set when the question was rejected as off-topic or as an injection attempt. */
  refusalReason: "off_topic" | "injection_attempt" | null;
  /** Follow-up questions Ramesh can actually answer from the current data. */
  suggestions: string[];
}

export interface RameshMessage {
  id: string;
  role: "user" | "ramesh";
  text: string;
  answer?: RameshAnswer;
  timestamp: string;
}
