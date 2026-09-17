import type { ProviderName } from "@shared/providerOrders";

// The Sales & Revenue live area's three-way source selector. "goselfserve" is
// labeled "Kiosk" here because that's what the live GoSelfServe/Kiosk API
// integration is called in the product -- distinct from the PDF-imported
// "Kiosk" channel shown in the Overview tab above, which is a separate,
// manual data source (see server/src/entities/sales/parsers/kiosk.ts).
export type SalesSource = ProviderName | "online";

/** Sources with a real, queryable provider_orders feed today. "online" has none yet. */
export type LiveSalesSource = ProviderName;

export const SALES_SOURCE_LABELS: Record<SalesSource, string> = {
  petpooja: "Petpooja",
  goselfserve: "Kiosk",
  online: "Online",
};

export const SALES_SOURCES: SalesSource[] = ["petpooja", "goselfserve", "online"];

export function isLiveSalesSource(source: SalesSource): source is LiveSalesSource {
  return source !== "online";
}
