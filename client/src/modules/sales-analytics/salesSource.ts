import type { ProviderName } from "@shared/providerOrders";

// The Sales & Revenue live area's three-way source selector. "goselfserve" is
// labeled "Kiosk" here because that's what the live GoSelfServe/Kiosk API
// integration is called in the product -- distinct from the PDF-imported
// "Kiosk" channel shown in the Overview tab above, which is a separate,
// manual data source (see server/src/entities/sales/parsers/kiosk.ts).
export type SalesSource = ProviderName | "online" | "combined";

/**
 * Sources with a real, queryable provider_orders feed today. "online" has
 * none yet (see Petpooja Online channel-classification note in
 * server/src/entities/provider-orders/salesAggregation.ts). "combined" isn't
 * a separate provider or API -- it's the existing provider_orders queries
 * called with no provider filter, which already return every provider's
 * orders together.
 */
export type LiveSalesSource = ProviderName | "combined";

export const SALES_SOURCE_LABELS: Record<SalesSource, string> = {
  petpooja: "Petpooja",
  goselfserve: "Kiosk",
  combined: "Combined",
  online: "Online",
};

export const SALES_SOURCES: SalesSource[] = ["petpooja", "goselfserve", "combined", "online"];

export function isLiveSalesSource(source: SalesSource): source is LiveSalesSource {
  return source !== "online";
}

/** provider_orders filter value for a live source -- undefined means "all providers", i.e. combined. */
export function providerFilterFor(source: LiveSalesSource): ProviderName | undefined {
  return source === "combined" ? undefined : source;
}
