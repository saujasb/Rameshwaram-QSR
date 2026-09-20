import { getProviderOrderItemSales, getProviderOrderSalesSummary } from "../provider-orders/repository.js";
import { formatBusinessDateLong } from "../../../../shared-types/businessDate.js";
import { detectItemCategoryIntent, detectProvider, isLiveSalesQuestion } from "./liveSalesIntent.js";
import type { RameshSlots } from "./intents.js";

export interface LiveSalesFactsResult {
  /** True when the question is in-scope for provider_orders (Part 1, Rule A). */
  applies: boolean;
  /** Plain-text, source-labeled facts to hand to Gemini as grounding -- empty when !applies. */
  factsText: string;
}

/**
 * Computes real facts about live provider_orders sales for a question,
 * using the exact same repository functions Sales & Revenue / Item Sales /
 * Category Performance already use -- never a second calculation engine.
 * Dates come from `slots` (see groundedAnswer.ts for how those are resolved
 * against the shared 04:30 business-day boundary), never guessed here.
 * Routing decisions (is this a live-sales question, which provider, does it
 * want items/categories) are pure functions in liveSalesIntent.ts, so they
 * can be unit tested without a database connection.
 */
export async function computeLiveSalesFacts(question: string, slots: RameshSlots): Promise<LiveSalesFactsResult> {
  if (!isLiveSalesQuestion(question, slots)) return { applies: false, factsText: "" };

  const provider = detectProvider(question);
  const from = slots.from;
  const to = slots.to;
  const rangeLabel =
    slots.dateLabel ??
    (from && to
      ? from === to
        ? formatBusinessDateLong(from)
        : `${formatBusinessDateLong(from)} to ${formatBusinessDateLong(to)}`
      : "all available live sales history");

  const lines: string[] = [
    `LIVE SALES DATA (source: provider_orders -- real-time Petpooja + Kiosk/GoSelfServe orders; business day runs 04:30 to 04:29:59 the next calendar day) for ${rangeLabel}, ${
      provider ? `provider = ${provider}` : "combined across all providers"
    }:`,
  ];

  const summary = await getProviderOrderSalesSummary({ provider, from, to });
  lines.push(`- Total orders: ${summary.totalOrders}`);
  lines.push(`- Total sales amount: Rs ${summary.totalAmount.toLocaleString("en-IN")}`);
  lines.push(`- Average order value: Rs ${summary.averageOrderValue.toFixed(2)}`);
  if (summary.byChannel.length > 0) {
    lines.push(
      `- By channel: ${summary.byChannel
        .map((c) => `${c.channel} = Rs ${c.amount.toLocaleString("en-IN")} across ${c.orders} orders`)
        .join("; ")}`
    );
  }
  if (summary.dailyTrend.length > 1) {
    lines.push(
      `- Daily trend: ${summary.dailyTrend.map((d) => `${d.businessDate}: Rs ${d.amount.toLocaleString("en-IN")}`).join("; ")}`
    );
  }
  if (summary.totalOrders === 0) {
    lines.push(`- No live orders were recorded in this range.`);
  }

  const { wantsItems, wantsCategories } = detectItemCategoryIntent(question);
  if (wantsItems || wantsCategories) {
    const itemSales = await getProviderOrderItemSales({ provider, from, to });
    if (wantsItems) {
      const top = [...itemSales.items].sort((a, b) => b.quantity - a.quantity).slice(0, 10);
      lines.push(
        `- Top items by quantity sold: ${
          top.length ? top.map((i) => `${i.name} (qty ${i.quantity}, Rs ${i.amount.toLocaleString("en-IN")})`).join(", ") : "none"
        }`
      );
    }
    if (wantsCategories) {
      const top = [...itemSales.categories].sort((a, b) => b.amount - a.amount).slice(0, 10);
      lines.push(
        `- Category performance: ${
          top.length
            ? top.map((c) => `${c.category ?? "Uncategorized"} (Rs ${c.amount.toLocaleString("en-IN")}, qty ${c.quantity})`).join(", ")
            : "none"
        }`
      );
    }
  }

  return { applies: true, factsText: lines.join("\n") };
}
