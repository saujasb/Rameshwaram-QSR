export interface VarianceItem {
  name: string;
  producedKg: number;
  consumedKg: number;
  soldPlates: number;
  netDiffKg: number;
  variancePct: number;
}

export interface WastageAnalyticsItem {
  name: string;
  wastageKg: number;
  topContributor: boolean;
}

export interface ChannelMixItem {
  name: string;
  value: number;
}

export interface TopSellerItem {
  name: string;
  unitsSold: number;
}

export interface CostVarianceItem {
  name: string;
  varianceRupees: number;
}

export type VegIndentMatchKind = "full" | "blank" | "none" | "dup";

export interface VegIndentItem {
  name: string;
  matchedLine: string | null;
  unit: string | null;
  requirement: number | null;
  orderQty: number | null;
  kind: VegIndentMatchKind;
  note: string | null;
}

export interface KpiTargetRow {
  kpi: string;
  description: string;
  target: string;
  watch: string;
  act: string;
  today: string;
  grade: "good" | "warn" | "ser" | "crit";
  gradeLabel: string;
}

export interface PrioritizedAction {
  id: string;
  severity: "critical" | "serious" | "warning" | "info";
  title: string;
  detail: string;
  impact: string;
}

export interface AnalyticsSnapshot {
  reportDate: string;
  vegIndentRequirementDate: string;
  vegIndentOrderDate: string;
  itemsSold: number;
  productionKg: number;
  wastagePct: number;
  wastageKg: number;
  varianceBreaches: number;
  recipeVsActualRupees: number;
  variance: VarianceItem[];
  wastage: WastageAnalyticsItem[];
  channelMix: ChannelMixItem[];
  topSellers: TopSellerItem[];
  costVariance: CostVarianceItem[];
  vegIndent: VegIndentItem[];
  kpiTargets: KpiTargetRow[];
}
