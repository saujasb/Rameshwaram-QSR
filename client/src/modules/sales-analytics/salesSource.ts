import type { ProviderName } from "@shared/providerOrders";

// The Sales & Revenue live area's three-way source selector. "goselfserve" is
// labeled "Kiosk" here because that's what the live GoSelfServe/Kiosk API
// integration is called in the product -- distinct from the PDF-imported
// "Kiosk" channel shown in the Overview tab above, which is a separate,
// manual data source (see server/src/entities/sales/parsers/kiosk.ts).
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

export const SALES_SOURCES: SalesSource[] = ["petpooja", "goselfserve", "combined", "online"];

/**
 * provider_orders / sales-summary / item-sales filter fields for a source
 * selector value. "online" isn't a raw DB provider, so it maps to the
 * onlineOnly flag rather than a provider value; "combined" maps to no filter
 * at all (every provider together).
 */
export function liveSourceFilter(source: LiveSalesSource): { provider?: ProviderName; onlineOnly?: boolean } {
  if (source === "combined") return {};
  if (source === "online") return { onlineOnly: true };
  return { provider: source };
}
