---
source_file: "client/src/modules/ramesh/RameshWidget.tsx"
type: "code"
community: "Ramesh Chat Widget"
location: "L12"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_Chat_Widget
---

# drilldownPath()

## Connections
- [[AnswerBody()]] - `calls` [EXTRACTED]
- [[RameshWidget.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/ramesh/RameshWidget.tsx` **(starting line 12):**
```tsx
function drilldownPath(query: Record<string, string> | null): string | null {
  if (!query || Object.keys(query).length === 0) return null;
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) if (v) p.set(k, v);
  return `/data-explorer?${p.toString()}`;
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_Chat_Widget