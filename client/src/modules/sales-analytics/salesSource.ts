import type { ProviderName } from "@shared/providerOrders";

/**
 * The Sales & Revenue live area's source selector. Every value has a real,
 * queryable provider_orders feed: "combined" is the existing provider_orders
 * queries called with no provider filter (every provider's orders together),
 * and "online" is the combined Petpooja Online channel -- Swiggy + Zomato +
 * any other confirmed aggregator, per classifySalesChannel in
 * shared-types/providerOrders.ts -- never split into separate top-level
 * Swiggy/Zomato sources.
 */
export type SalesSource = ProviderName | "online" | "combined";
export type LiveSalesSource = SalesSource;

export const SALES_SOURCE_LABELS: Record<SalesSource, string> = {
  petpooja: "Petpooja",
  goselfserve: "Kiosk",
  combined: "Combined",
  online: "Online",
};

/** Standard source-tab order everywhere source tabs exist. */
export const SALES_SOURCES: SalesSource[] = ["petpooja", "goselfserve", "online", "combined"];

/** Live Feed is per-source only -- no Combined tab. */
export const LIVE_FEED_SOURCES: SalesSource[] = ["petpooja", "goselfserve", "online"];

/**
 * provider_orders / sales-summary / item-sales filter fields for a source
 * selector value. "online" isn't a raw DB provider, so it maps to the
 * onlineOnly flag rather than a provider value; "petpooja" excludes that same
 * Online channel so it means POS/counter orders only, and every Online order
 * shows up under Online alone; "combined" maps to no filter at all (every
 * provider together).
 */
export function liveSourceFilter(source: LiveSalesSource): { provider?: ProviderName; onlineOnly?: boolean; excludeOnline?: boolean } {
  if (source === "combined") return {};
  if (source === "online") return { onlineOnly: true };
  if (source === "petpooja") return { provider: "petpooja", excludeOnline: true };
  return { provider: source };
}
