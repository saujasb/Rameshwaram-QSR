---
source_file: "client/src/components/charts/DivergingBar.tsx"
type: "code"
community: "Veg Indent & Analytics Engine"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Veg_Indent__Analytics_Engine
---

# DivergingBar.tsx

## Connections
- [[DivergingBar()]] - `contains` [EXTRACTED]
- [[DivergingDatum]] - `contains` [EXTRACTED]
- [[SalesAnalyticsPage.tsx]] - `imports_from` [EXTRACTED]
- [[VegIndentPage.tsx]] - `imports_from` [EXTRACTED]

## Source
**Full file:** `client/src/components/charts/DivergingBar.tsx`
```tsx
export interface DivergingDatum {
  name: string;
  value: number;
  tooltip?: string;
  positiveColor?: string;
  negativeColor?: string;
}

export function DivergingBar({
  data,
  valueFormatter = (v: number) => `${v > 0 ? "+" : ""}${v}`,
  positiveColor = "var(--s2)",
  negativeColor = "var(--s1)",
}: {
  data: DivergingDatum[];
  valueFormatter?: (v: number) => string;
  positiveColor?: string;
  negativeColor?: string;
}) {
  const W = 920;
  const rowH = 30;
  const padL = 190;
  const padR = 70;
  const padT = 26;
  const padB = 8;
  const H = padT + data.length * rowH + padB;
  const max = Math.max(...data.map((d) => Math.abs(d.value)), 1);
  const mid = padL + (W - padL - padR) / 2;
  const half = (W - padL - padR) / 2;
  const x = (v: number) => mid + (v / max) * half;

  return (
    <svg className="chart-svg" viewBox={`0 0 ${W} ${H}`} role="img">
      {[-max, -max / 2, 0, max / 2, max].map((g) => (
        <line key={g} x1={x(g)} y1={padT - 6} x2={x(g)} y2={H - padB} className={g === 0 ? "zeroline" : "gridline"} />
      ))}
      {data.map((d, i) => {
        const y = padT + i * rowH + 4;
        const bh = rowH - 12;
        const over = d.value >= 0;
        const x0 = x(0);
        const x1 = x(d.value);
        const rx = Math.min(x0, x1);
        const rw = Math.max(1, Math.abs(x1 - x0));
        const crowded = !over && x1 - padL < 64;
        const labelX = over ? x1 + 6 : crowded ? x1 + 6 : x1 - 6;
        const labelAnchor = over || crowded ? "start" : "end";
        return (
          <g key={d.name}>
            <rect x={rx} y={y} width={rw} height={bh} rx={4} fill={over ? (d.positiveColor ?? positiveColor) : (d.negativeColor ?? negativeColor)}>
              <title>{d.tooltip ?? `${d.name}: ${valueFormatter(d.value)}`}</title>
            </rect>
            <text x={padL - 10} y={y + bh / 2 + 4} textAnchor="end" className="bar-label">{d.name}</text>
            <text
              x={labelX}
              y={y + bh / 2 + 4}
              textAnchor={labelAnchor}
              className="val-label"
              fill={crowded ? "#fffdf8" : undefined}
            >
              {valueFormatter(d.value)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Veg_Indent__Analytics_Engine