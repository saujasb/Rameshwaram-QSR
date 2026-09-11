---
source_file: "client/src/components/BusinessDayTimeline.tsx"
type: "code"
community: "Dashboard & Sales Trend Visualization"
location: "L10"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dashboard__Sales_Trend_Visualization
---

# BusinessDayTimeline()

## Connections
- [[BusinessDayTimeline.tsx]] - `contains` [EXTRACTED]
- [[DashboardPage.tsx]] - `imports` [EXTRACTED]
- [[formatBusinessDateShort()]] - `calls` [EXTRACTED]
- [[shiftDateKey()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/components/BusinessDayTimeline.tsx` **(starting line 10):**
```tsx
export function BusinessDayTimeline({ businessDate, live = false }: { businessDate: string; live?: boolean }) {
  const W = 560;
  const H = 54;
  const padL = 6;
  const padR = 6;
  const barY = 22;
  const barH = 8;
  const trackW = W - padL - padR;

  const dayStart = new Date(`${businessDate}T05:00:00`);
  const elapsedHours = (Date.now() - dayStart.getTime()) / (1000 * 60 * 60);
  const clampedElapsed = Math.max(0, Math.min(WINDOW_HOURS, elapsedHours));
  const showMarker = live && elapsedHours >= 0 && elapsedHours <= WINDOW_HOURS;

  const x = (hourOffset: number) => padL + (hourOffset / WINDOW_HOURS) * trackW;
  const ticks = [
    { hour: 0, label: "05 AM" },
    { hour: 7, label: "12 PM" },
    { hour: 19, label: "12 AM" },
    { hour: WINDOW_HOURS, label: "03 AM" },
  ];

  const nextDayLabel = formatBusinessDateShort(shiftDateKey(businessDate, 1));

  return (
    <div className="biz-timeline">
      <svg className="chart-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Business day timeline for ${businessDate}`}>
        <rect x={padL} y={barY} width={trackW} height={barH} rx={4} fill="var(--line-2)" />
        <rect
          x={padL}
          y={barY}
          width={showMarker ? x(clampedElapsed) - padL : trackW}
          height={barH}
          rx={4}
          fill={showMarker ? "var(--brand)" : "var(--gold)"}
          opacity={showMarker ? 1 : 0.55}
        />
        {showMarker && (
          <>
            <circle cx={x(clampedElapsed)} cy={barY + barH / 2} r={5.5} fill="var(--brand)" stroke="var(--card)" strokeWidth={2} />
            <text x={x(clampedElapsed)} y={barY - 8} textAnchor="middle" className="val-label" fill="var(--brand)" fontWeight={700}>
              Now
            </text>
          </>
        )}
        {ticks.map((t) => (
          <g key={t.hour}>
            <line x1={x(t.hour)} y1={barY - 3} x2={x(t.hour)} y2={barY + barH + 3} stroke="var(--axis)" strokeWidth={1} />
            <text x={x(t.hour)} y={H - 6} textAnchor="middle" className="axis-label">
              {t.label}
            </text>
          </g>
        ))}
      </svg>
      <div className="biz-timeline-caption">
        <b>{formatBusinessDateShort(businessDate)}</b> business day · 05:00 → {nextDayLabel} 03:00
      </div>
    </div>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Dashboard__Sales_Trend_Visualization