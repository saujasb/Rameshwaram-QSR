---
source_file: "client/src/components/charts/HBarChart.tsx"
type: "code"
community: "Sales Analytics Charts"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Analytics_Charts
---

# HBarChart.tsx

## Connections
- [[HBarChart()]] - `contains` [EXTRACTED]
- [[HBarDatum]] - `contains` [EXTRACTED]
- [[SalesAnalyticsPage.tsx]] - `imports_from` [EXTRACTED]
- [[WastagePage.tsx]] - `imports_from` [EXTRACTED]

## Source
**Full file:** `client/src/components/charts/HBarChart.tsx`
```tsx
export interface HBarDatum {
  name: string;
  value: number;
  tooltip?: string;
  color?: string;
  highlight?: boolean;
}

export function HBarChart({
  data,
  valueFormatter = (v: number) => String(v),
  defaultColor = "var(--s1)",
}: {
  data: HBarDatum[];
  valueFormatter?: (v: number) => string;
  defaultColor?: string;
}) {
  const W = 920;
  const rowH = 30;
  const padL = 190;
  const padR = 70;
  const padT = 8;
  const padB = 8;
  const H = padT + data.length * rowH + padB;
  const max = Math.max(...data.map((d) => d.value), 1);
  const x = (v: number) => padL + (v / max) * (W - padL - padR);

  return (
    <svg className="chart-svg" viewBox={`0 0 ${W} ${H}`} role="img">
      {data.map((d, i) => {
        const y = padT + i * rowH + 5;
        const bh = rowH - 13;
        const barW = Math.max(1, x(d.value) - padL);
        return (
          <g key={d.name}>
            <rect
              x={padL}
              y={y}
              width={barW}
              height={bh}
              rx={4}
              fill={d.color ?? defaultColor}
              opacity={d.highlight === false ? 0.7 : 1}
            >
              <title>{d.tooltip ?? `${d.name}: ${valueFormatter(d.value)}`}</title>
            </rect>
            <text x={padL - 10} y={y + bh / 2 + 4} textAnchor="end" className="bar-label">{d.name}</text>
            <text x={x(d.value) + 6} y={y + bh / 2 + 4} className="val-label">{valueFormatter(d.value)}</text>
          </g>
        );
      })}
    </svg>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Analytics_Charts