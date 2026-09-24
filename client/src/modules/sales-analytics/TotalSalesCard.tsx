import { useProviderOrderSalesSummary } from "../../lib/api/providerOrders";
import type { SalesChannel } from "@shared/providerOrders";
import { formatBusinessDateRange, resolveBusinessDateRange, type DateRangeValue } from "../../lib/dateRange";

const SPLIT: { channel: SalesChannel; label: string; color: string }[] = [
  { channel: "petpooja_pos", label: "Petpooja POS", color: "var(--s2)" },
  { channel: "kiosk", label: "Kiosk", color: "var(--s1)" },
  { channel: "petpooja_online", label: "Online", color: "var(--s3)" },
];

function inr(n: number): string {
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

/** Compact composition ring -- one arc per source via stroke-dasharray, so a single 100% source still draws a full ring. */
function CompositionRing({ parts, total }: { parts: { label: string; value: number; color: string }[]; total: number }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg className="total-sales-ring" viewBox="0 0 110 110" role="img" aria-label="Total Sales by source">
      <circle cx={55} cy={55} r={r} fill="none" stroke="var(--line-2)" strokeWidth={14} />
      {total > 0 &&
        parts.map((p) => {
          const len = (p.value / total) * c;
          const arc = (
            <circle
              key={p.label}
              cx={55}
              cy={55}
              r={r}
              fill="none"
              stroke={p.color}
              strokeWidth={14}
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 55 55)"
            >
              <title>{`${p.label}: ${inr(p.value)}`}</title>
            </circle>
          );
          offset += len;
          return arc;
        })}
    </svg>
  );
}

/**
 * Overview's master Total Sales -- live provider_orders (successful orders only),
 * all sources combined: Petpooja POS + Kiosk + Online. Same sales-summary query
 * as Sales Amount's Combined view, never the PDF import.
 */
export function TotalSalesCard({ range }: { range: DateRangeValue }) {
  const { from, to } = resolveBusinessDateRange(range);
  const { data, isLoading, isError } = useProviderOrderSalesSummary({ from, to });
  const total = data?.totalAmount ?? 0;
  const amountFor = (ch: SalesChannel) => data?.byChannel.find((c) => c.channel === ch)?.amount ?? 0;
  const parts = SPLIT.map((s) => ({ ...s, value: amountFor(s.channel) }));
  // Any unclassified channel, shown only if it ever occurs so the split still adds up to Total Sales.
  const other = amountFor("other");
  if (other > 0) parts.push({ channel: "other", label: "Other", color: "var(--muted)", value: other });
  const pct = (v: number) => (total > 0 ? `${((v / total) * 100).toFixed(1)}%` : "0%");

  return (
    <div className="card total-sales-card">
      <div className="total-sales-main">
        <div className="total-sales-lab">Total Sales</div>
        <div className="total-sales-val">{isError ? "—" : isLoading ? "…" : inr(total)}</div>
        <div className="total-sales-note">
          {formatBusinessDateRange(from, to)}
          {data ? ` · ${data.totalOrders.toLocaleString()} orders` : ""}
        </div>
        {isError ? (
          <p className="total-sales-note">Couldn't load live sales. Check the backend connection and retry.</p>
        ) : (
          <ul className="total-sales-split">
            {parts.map((p) => (
              <li key={p.label}>
                <span className="sw" style={{ background: p.color }} />
                <span className="name">{p.label}</span>
                <span className="pct">{pct(p.value)}</span>
                <span className="amt">{inr(p.value)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <CompositionRing parts={parts} total={total} />
    </div>
  );
}
