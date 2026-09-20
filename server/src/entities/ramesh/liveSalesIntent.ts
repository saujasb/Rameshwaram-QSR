// Pure question-routing logic, deliberately kept free of any DB import (see
// salesAggregation.ts, which documents why: repository.ts imports db/pg.ts,
// which throws at import time if SUPABASE_DB_URL isn't set -- that would make
// this logic untestable without real database credentials). liveSalesFacts.ts
// is the DB-touching half that uses these pure functions.
import type { ProviderName } from "../../../../shared-types/providerOrders.js";
import type { RameshSlots } from "./intents.js";

// Detects whether a question is in the "live sales" domain (Part 1, Rule A of
// the live-sales/business-day master task): today's/yesterday's/a date's
// sales, order count, sales amount, AOV, Petpooja/Kiosk/combined sales,
// channel breakdown, item sales, quantities sold, category performance,
// recent/live orders. Intentionally broad/inclusive -- a false positive just
// adds an extra, still-correct fact block; it never fabricates anything.
const SALES_DOMAIN_RE =
  /\b(sale|sales|revenue|order|orders|aov|average order value|channel|combined|item|items|quantit(?:y|ies)|categor(?:y|ies)|petpooja|kiosk|goselfserve|go ?self ?serve|provider)\b/i;
const PETPOOJA_RE = /\bpetpooja\b/i;
const KIOSK_RE = /\bkiosk\b|\bgoselfserve\b|\bgo ?self ?serve\b/i;
const ITEM_RE = /\bitems?\b|\bproducts? sold\b|\bquantit(?:y|ies)\b|top sell/i;
const CATEGORY_RE = /\bcategor(?:y|ies)\b/i;

/** Which provider (if any) the question names. */
export function detectProvider(question: string): ProviderName | undefined {
  const petpooja = PETPOOJA_RE.test(question);
  const kiosk = KIOSK_RE.test(question);
  if (petpooja && !kiosk) return "petpooja";
  if (kiosk && !petpooja) return "goselfserve";
  return undefined; // unspecified, or both mentioned -> combined (no provider filter)
}

/** Whether a question is in the live-sales domain (Part 1, Rule A). */
export function isLiveSalesQuestion(question: string, slots: Pick<RameshSlots, "datasetTypes">): boolean {
  return (slots.datasetTypes ?? []).includes("sales") || SALES_DOMAIN_RE.test(question);
}

/** Whether the question asks about items and/or categories specifically. */
export function detectItemCategoryIntent(question: string): { wantsItems: boolean; wantsCategories: boolean } {
  return { wantsItems: ITEM_RE.test(question), wantsCategories: CATEGORY_RE.test(question) };
}
