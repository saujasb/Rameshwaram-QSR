import type { BaseRecord } from "./entities.js";

export type SalesChannel = "kiosk" | "petpooja_pos" | "petpooja_online";

export const SALES_CHANNEL_LABELS: Record<SalesChannel, string> = {
  kiosk: "Kiosk",
  petpooja_pos: "PetPooja (Counter/POS)",
  petpooja_online: "Online",
};

export interface SalesLineItem extends BaseRecord {
  importBatchId: string;
  channel: SalesChannel;
  category: string;
  itemName: string;
  quantity: number;
  amount: number;
  // Calendar date as printed/confirmed by the source report. Not necessarily
  // the trading day it belongs to -- see businessDate.
  calendarDate: string;
  // Computed via the shared business-date engine (shared-types/businessDate.ts).
  businessDate: string;
  businessDayStart: string;
  businessDayEnd: string;
  // These three source reports are pre-aggregated daily item totals with no
  // per-order clock time, so these stay null until a timestamped export format
  // is imported. Never fabricated.
  transactionTimestamp: string | null;
  transactionTime: string | null;
}

export type ImportValidationStatus = "passed" | "warning" | "failed";

export interface SalesImportValidation {
  status: ImportValidationStatus;
  expectedQuantity: number | null;
  expectedAmount: number | null;
  actualQuantity: number;
  actualAmount: number;
  quantityDiff: number | null;
  amountDiff: number | null;
  notes: string[];
}

export interface SalesImportBatch extends BaseRecord {
  fileName: string;
  channel: SalesChannel;
  businessDate: string;
  recordsFound: number;
  recordsInserted: number;
  recordsUpdated: number;
  duplicatesSkipped: number;
  parsingErrors: string[];
  validation: SalesImportValidation;
  hasHourlyData: boolean;
}

export interface SalesImportRejection {
  error: string;
  detail?: string;
}

export interface SalesChannelTotal {
  channel: SalesChannel;
  quantity: number;
  amount: number;
}

export interface SalesCategoryTotal {
  category: string;
  quantity: number;
  amount: number;
}

export interface SalesItemTotal {
  itemName: string;
  category: string;
  quantity: number;
  amount: number;
}

export interface SalesDailyTotal {
  businessDate: string;
  quantity: number;
  amount: number;
}

export interface SalesTargetSetting {
  amount: number | null;
  updatedAt: string | null;
}

export interface SalesSummary {
  businessDateFrom: string | null;
  businessDateTo: string | null;
  totalQuantity: number;
  totalAmount: number;
  byChannel: SalesChannelTotal[];
  byCategory: SalesCategoryTotal[];
  topItems: SalesItemTotal[];
  dailyTrend: SalesDailyTotal[];
  hasHourlyData: boolean;
}
