---
source_file: "client/src/modules/sales-analytics/VegIndentPage.tsx"
type: "code"
community: "Veg Indent & Analytics Engine"
location: "L7"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Veg_Indent__Analytics_Engine
---

# toneFor()

## Connections
- [[VegIndentPage()]] - `calls` [EXTRACTED]
- [[VegIndentPage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/sales-analytics/VegIndentPage.tsx` **(starting line 7):**
```tsx
function toneFor(status: string) {
  if (status === "ON TARGET") return "ok" as const;
  if (status === "OVER-ORDERED" || status === "ORDERED, NO REQMT") return "over" as const;
  if (status === "UNDER-ORDERED") return "under" as const;
  return "neutral" as const;
}
```

#graphify/code #graphify/EXTRACTED #community/Veg_Indent__Analytics_Engine