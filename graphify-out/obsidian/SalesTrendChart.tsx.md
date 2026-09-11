---
source_file: "client/src/components/charts/SalesTrendChart.tsx"
type: "code"
community: "Dashboard & Sales Trend Visualization"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dashboard__Sales_Trend_Visualization
---

# SalesTrendChart.tsx

## Connections
- [[DashboardPage.tsx]] - `imports_from` [EXTRACTED]
- [[SalesAnalyticsPage.tsx]] - `imports_from` [EXTRACTED]
- [[SalesTrendChart()]] - `contains` [EXTRACTED]
- [[TrendMarker]] - `contains` [EXTRACTED]
- [[TrendPoint]] - `contains` [EXTRACTED]
- [[businessDate.ts]] - `imports_from` [EXTRACTED]
- [[formatBusinessDateShort()]] - `imports` [EXTRACTED]

## Source
**Full file:** `client/src/components/charts/SalesTrendChart.tsx`
```tsx
import { formatBusinessDateShort } from "@shared/businessDate";

export interface TrendPoint {
  businessDate: string;
  amount: number;
}

export interface TrendMarker {
  businessDate: string;
  label: string;
  color?: string;
}

/**
 * Trend of daily business-day totals (the only granularity these sales
 * reports actually carry -- there's no per-order timestamp to draw an
 * intra-day curve from). An optional target line and a handful of named day
 * markers (today / yesterday / same day last week) sit on top.
 */
export function SalesTrendChart({
  data,
  target,
  markers = [],
  valueFormatter = (v: number) => `₹${v.toLocaleString()}`,
}: {
  data: TrendPoint[];
  target?: number | null;
  markers?: TrendMarker[];
  valueFormatter?: (v: number) => string;
}) {
  if (data.length < 2) {
    return (
      <div className="empty-state" style={{ padding: "28px 20px" }}>
        <p style={{ color: "var(--muted)", fontSize: 13.5, margin: 0 }}>
          Import at least two business days of sales to see a trend line.
        </p>
      </div>
    );
  }

  const W = 920;
  const H = 260;
  const padL = 56;
  const padR = 24;
  const padT = 20;
  const padB = 30;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const values = data.map((d) => d.amount);
  const maxRaw = Math.max(...values, target ?? 0);
  const max = maxRaw > 0 ? maxRaw * 1.15 : 1;

  const x = (i: number) => padL + (data.length === 1 ? plotW / 2 : (i / (data.length - 1)) * plotW);
  const y = (v: number) => padT + plotH - (v / max) * plotH;

  const linePath = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i)} ${y(d.amount)}`).join(" ");
  const areaPath = `${linePath} L${x(data.length - 1)} ${padT + plotH} L${x(0)} ${padT + plotH} Z`;

  const gridSteps = 4;
  const gridValues = Array.from({ length: gridSteps + 1 }, (_, i) => (max / gridSteps) * i);

  const markerByDate = new Map(markers.map((m) => [m.businessDate, m]));

  return (
    <svg className="chart-svg" viewBox={`0 0 ${W} ${H}`} role="img">
      {gridValues.map((g) => (
        <g key={g}>
          <line x1={padL} y1={y(g)} x2={W - padR} y2={y(g)} className="gridline" />
          <text x={padL - 10} y={y(g) + 4} textAnchor="end" className="axis-label">
            {g >= 100000 ? `₹${(g / 100000).toFixed(1)}L` : `₹${Math.round(g / 1000)}k`}
          </text>
        </g>
      ))}

      {target != null && target > 0 && (
        <g>
          <line x1={padL} y1={y(target)} x2={W - padR} y2={y(target)} stroke="var(--gold)" strokeWidth={1.5} strokeDasharray="6 4" />
          <text x={W - padR} y={y(target) - 6} textAnchor="end" className="val-label" fill="var(--gold)" fontWeight={700}>
            Target {valueFormatter(target)}
          </text>
        </g>
      )}

      <defs>
        <linearGradient id="salesTrendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.22} />
          <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#salesTrendFill)" />
      <path d={linePath} fill="none" stroke="var(--brand)" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />

      {data.map((d, i) => {
        const marker = markerByDate.get(d.businessDate);
        return (
          <g key={d.businessDate}>
            <circle cx={x(i)} cy={y(d.amount)} r={marker ? 5.5 : 3} fill={marker ? (marker.color ?? "var(--brand)") : "var(--brand)"} stroke="var(--card)" strokeWidth={marker ? 2 : 1}>
              <title>
                {formatBusinessDateShort(d.businessDate)}
                {marker ? ` (${marker.label})` : ""}: {valueFormatter(d.amount)}
              </title>
            </circle>
            {marker && (
              <text x={x(i)} y={y(d.amount) - 12} textAnchor="middle" className="val-label" fill={marker.color ?? "var(--brand)"} fontWeight={700}>
                {marker.label}
              </text>
            )}
          </g>
        );
      })}

      {data.map((d, i) => {
        if (data.length > 10 && i % Math.ceil(data.length / 10) !== 0 && i !== data.length - 1) return null;
        return (
          <text key={d.businessDate} x={x(i)} y={H - 8} textAnchor="middle" className="axis-label">
            {formatBusinessDateShort(d.businessDate)}
          </text>
        );
      })}
    </svg>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Dashboard__Sales_Trend_Visualization