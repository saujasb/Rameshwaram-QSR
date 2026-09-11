import type { SalesChannel } from "../../../../shared-types/sales.js";

export interface ParsedLineItem {
  category: string;
  itemName: string;
  quantity: number;
  amount: number;
}

export interface ParsedSubtotalCheck {
  category: string;
  expectedQuantity: number;
  expectedAmount: number;
  actualQuantity: number;
  actualAmount: number;
}

export interface ParsedReport {
  channel: SalesChannel;
  // Present only when the source report prints a date (Petpooja formats).
  // Kiosk exports have no date anywhere in the document.
  calendarDateStart: string | null;
  calendarDateEnd: string | null;
  items: ParsedLineItem[];
  grandTotalQuantity: number | null;
  grandTotalAmount: number | null;
  subtotalChecks: ParsedSubtotalCheck[];
  parsingErrors: string[];
}

export function sumItems(items: ParsedLineItem[]): { quantity: number; amount: number } {
  return items.reduce(
    (acc, i) => ({ quantity: acc.quantity + i.quantity, amount: acc.amount + i.amount }),
    { quantity: 0, amount: 0 }
  );
}
