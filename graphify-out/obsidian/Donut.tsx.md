---
source_file: "client/src/components/charts/Donut.tsx"
type: "code"
community: "Sales Analytics Charts"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Analytics_Charts
---

# Donut.tsx

## Connections
- [[Donut()]] - `contains` [EXTRACTED]
- [[DonutDatum]] - `contains` [EXTRACTED]
- [[SalesAnalyticsPage.tsx]] - `imports_from` [EXTRACTED]

## Source
**Full file:** `client/src/components/charts/Donut.tsx`
```tsx
export interface DonutDatum {
  name: string;
  value: number;
  color: string;
}

export function Donut({ data, centerLabel, centerSub }: { data: DonutDatum[]; centerLabel: string; centerSub: string }) {
  const cx = 130;
  const cy = 130;
  const r = 92;
  const rin = 56;
  const total = data.reduce((s, d) => s + d.value, 0);
  let ang = -Math.PI / 2;

  return (
    <svg className="chart-svg" viewBox="0 0 260 260" style={{ maxWidth: 260, margin: "0 auto" }} role="img">
      {data.map((d) => {
        const frac = d.value / total;
        const a2 = ang + frac * 2 * Math.PI;
        const big = frac > 0.5 ? 1 : 0;
        const p = [
          cx + r * Math.cos(ang), cy + r * Math.sin(ang),
          cx + r * Math.cos(a2), cy + r * Math.sin(a2),
          cx + rin * Math.cos(a2), cy + rin * Math.sin(a2),
          cx + rin * Math.cos(ang), cy + rin * Math.sin(ang),
        ];
        const path = `M${p[0]} ${p[1]} A${r} ${r} 0 ${big} 1 ${p[2]} ${p[3]} L${p[4]} ${p[5]} A${rin} ${rin} 0 ${big} 0 ${p[6]} ${p[7]} Z`;
        ang = a2;
        return (
          <path key={d.name} d={path} fill={d.color} stroke="var(--surface-1)" strokeWidth={2}>
            <title>{`${d.name}: ${d.value.toLocaleString()} (${(frac * 100).toFixed(0)}%)`}</title>
          </path>
        );
      })}
      <text x={cx} y={cy - 4} textAnchor="middle" fill="var(--ink)" fontSize={24} fontWeight={800}>{centerLabel}</text>
      <text x={cx} y={cy + 16} textAnchor="middle" fill="var(--muted)" fontSize={11.5}>{centerSub}</text>
    </svg>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Analytics_Charts