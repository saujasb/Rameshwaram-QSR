import type { SummaryChannel } from "../../../../shared-types/summary.js";

/**
 * Pluggable delivery providers for "Summarize Data".
 *
 * None is connected yet -- no paid email/WhatsApp service is required for
 * the dashboard to work. To connect one later, implement `send` for that
 * channel (e.g. Resend / SES / SMTP for email; Meta WhatsApp Cloud API /
 * Twilio for WhatsApp), read its credentials from server-side env vars only
 * (never VITE_*), and make `isConfigured` return true when they're present.
 * Nothing else in the feature needs to change.
 */
export interface DeliveryMessage {
  to: string;
  subject: string;
  text: string;
}

export interface DeliveryProvider {
  channel: SummaryChannel;
  isConfigured(): boolean;
  send(message: DeliveryMessage): Promise<void>;
}

const notConnected = (channel: SummaryChannel): DeliveryProvider => ({
  channel,
  isConfigured: () => false,
  async send() {
    throw new Error(`${channel} delivery is not configured.`);
  },
});

export const deliveryProviders: Record<SummaryChannel, DeliveryProvider> = {
  email: notConnected("email"),
  whatsapp: notConnected("whatsapp"),
};

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "•••";
  return `${local.slice(0, 1)}•••@${domain}`;
}

export function maskPhone(phone: string): string {
  return phone.length <= 6 ? "•••" : `${phone.slice(0, 3)}•••••${phone.slice(-4)}`;
}
