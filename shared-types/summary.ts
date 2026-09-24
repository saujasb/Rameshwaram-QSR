// "Summarize Data" -- send a dashboard summary to the signed-in user's own
// registered email or WhatsApp number.
//
// The destination always comes from the requester's profile on the server,
// never from the request, so nobody can use this to send business data to an
// arbitrary address.

export type SummaryChannel = "email" | "whatsapp";

export interface SummaryScope {
  /** Business dates, YYYY-MM-DD, inclusive. Defaults to today's business date. */
  from?: string;
  to?: string;
}

export interface SummaryChannelStatus {
  channel: SummaryChannel;
  /** A delivery provider is configured on the server. */
  providerConfigured: boolean;
  /** The user has a destination on their profile for this channel. */
  hasDestination: boolean;
  /** e.g. "r•••@gmail.com" / "+91•••••3210" -- never the full value. */
  destinationMasked: string | null;
}

export interface SummaryPreview {
  title: string;
  text: string;
  businessDateFrom: string;
  businessDateTo: string;
}

export interface SummaryDeliveryResult {
  status: "sent" | "not_configured" | "no_destination" | "failed";
  message: string;
}
