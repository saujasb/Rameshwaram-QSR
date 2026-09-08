---
source_file: "client/src/components/StatusBadge.tsx"
type: "code"
community: "Inventory Management UI"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Inventory_Management_UI
---

# BadgeTone

## Connections
- [[StatusBadge.tsx]] - `contains` [EXTRACTED]
- [[inventoryStatusUi.ts]] - `imports` [EXTRACTED]

## Source
**From** `client/src/components/StatusBadge.tsx` **(starting line 1):**
```tsx
export type BadgeTone = "ok" | "over" | "under" | "neutral";

export function StatusBadge({ label, tone }: { label: string; tone: BadgeTone }) {
  return <span className={`tag ${tone}`}>{label}</span>;
}
```

#graphify/code #graphify/EXTRACTED #community/Inventory_Management_UI