import { Router, type Request } from "express";
import { query } from "../../db/pg.js";
import { getCurrentBusinessDate, isDateKey, formatBusinessDateLong } from "../../../../shared-types/businessDate.js";
import type { SummaryChannel, SummaryChannelStatus, SummaryDeliveryResult, SummaryPreview } from "../../../../shared-types/summary.js";
import { getProviderOrderSalesSummary } from "../provider-orders/repository.js";
import { asyncRoute } from "../../shared/asyncRoute.js";
import { deliveryProviders, maskEmail, maskPhone } from "./providers.js";

// "Summarize Data": the requester is always req.auth (the verified session),
// and the destination is always that user's own profile email / WhatsApp
// number. Neither can be supplied in the request.

export const summariesRouter: Router = Router();

const CHANNELS: SummaryChannel[] = ["email", "whatsapp"];

function destinationFor(req: Request, channel: SummaryChannel): string | null {
  const p = req.auth!.profile;
  return channel === "email" ? p.email : p.phone;
}

function masked(channel: SummaryChannel, value: string | null): string | null {
  if (!value) return null;
  return channel === "email" ? maskEmail(value) : maskPhone(value);
}

function parseScope(body: unknown): { from: string; to: string } {
  const b = (body ?? {}) as Record<string, unknown>;
  const today = getCurrentBusinessDate();
  const from = isDateKey(b.from) ? (b.from as string) : today;
  const to = isDateKey(b.to) ? (b.to as string) : from;
  return from <= to ? { from, to } : { from: to, to: from };
}

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export async function buildSummary(from: string, to: string): Promise<SummaryPreview> {
  const s = await getProviderOrderSalesSummary({ from, to });
  const period = from === to ? formatBusinessDateLong(from) : `${formatBusinessDateLong(from)} – ${formatBusinessDateLong(to)}`;
  const lines = [
    `Rameshwaram QSR — sales summary`,
    period,
    ``,
    `Total sales: ${inr(s.totalAmount)}`,
    `Orders: ${s.totalOrders.toLocaleString("en-IN")}`,
    `Average order value: ${inr(s.averageOrderValue)}`,
  ];
  if (s.byChannel.length > 0) {
    lines.push(``, `By channel:`);
    for (const c of s.byChannel) lines.push(`• ${c.channel}: ${inr(c.amount)} (${c.orders} orders)`);
  }
  return { title: `Sales summary · ${period}`, text: lines.join("\n"), businessDateFrom: from, businessDateTo: to };
}

summariesRouter.get("/channels", (req, res) => {
  const statuses: SummaryChannelStatus[] = CHANNELS.map((channel) => {
    const dest = destinationFor(req, channel);
    return {
      channel,
      providerConfigured: deliveryProviders[channel].isConfigured(),
      hasDestination: Boolean(dest),
      destinationMasked: masked(channel, dest),
    };
  });
  res.json(statuses);
});

summariesRouter.post("/preview", asyncRoute(async (req, res) => {
  const { from, to } = parseScope(req.body);
  res.json(await buildSummary(from, to));
}));

summariesRouter.post("/deliver", asyncRoute(async (req, res) => {
  const channel: SummaryChannel | null = req.body?.channel === "email" || req.body?.channel === "whatsapp" ? req.body.channel : null;
  if (!channel) {
    res.status(400).json({ error: "Choose Email or WhatsApp." });
    return;
  }
  const scope = parseScope(req.body);
  const destination = destinationFor(req, channel);
  const provider = deliveryProviders[channel];

  let result: SummaryDeliveryResult;
  let error: string | null = null;
  if (!destination) {
    result = {
      status: "no_destination",
      message: channel === "email" ? "Your profile has no email address. Ask an admin to add one." : "Your profile has no WhatsApp number. Ask an admin to add one.",
    };
  } else if (!provider.isConfigured()) {
    result = { status: "not_configured", message: `${channel === "email" ? "Email" : "WhatsApp"} delivery isn't set up yet. Nothing was sent.` };
  } else {
    try {
      const summary = await buildSummary(scope.from, scope.to);
      await provider.send({ to: destination, subject: summary.title, text: summary.text });
      result = { status: "sent", message: `Sent to ${masked(channel, destination)}.` };
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
      console.error("[summaries] delivery failed:", error);
      result = { status: "failed", message: "Could not send the summary. Try again later." };
    }
  }

  await query(
    `INSERT INTO public.summary_delivery_log (user_id, channel, destination_masked, scope, status, error) VALUES ($1, $2, $3, $4, $5, $6)`,
    [req.auth!.userId, channel, masked(channel, destination), JSON.stringify(scope), result.status, error]
  ).catch(() => {});

  res.status(result.status === "sent" ? 200 : result.status === "failed" ? 502 : 409).json(result);
}));
