---
source_file: "client/src/modules/import/ImportCenterPage.tsx"
type: "code"
community: "Data Explorer & Import UI"
location: "L81"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# Gauge()

## Connections
- [[ImportCenterPage.tsx]] - `contains` [EXTRACTED]
- [[pctTone()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/modules/import/ImportCenterPage.tsx` **(starting line 81):**
```tsx
function Gauge({ label, pct }: { label: string; pct: number }) {
  const clamped = Math.max(0, Math.min(100, Math.round(pct)));
  return (
    <div className="gauge">
      <span className="gauge-label">{label}</span>
      <span className="gauge-track">
        <span className={`gauge-fill ${pctTone(clamped)}`} style={{ width: `${clamped}%` }} />
      </span>
      <span className="gauge-val">{clamped}%</span>
    </div>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI