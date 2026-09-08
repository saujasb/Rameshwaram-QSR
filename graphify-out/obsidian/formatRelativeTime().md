---
source_file: "client/src/components/DataFreshnessBadge.tsx"
type: "code"
community: "Sales Analytics Charts"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Analytics_Charts
---

# formatRelativeTime()

## Connections
- [[DataFreshnessBadge()]] - `calls` [EXTRACTED]
- [[DataFreshnessBadge.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/components/DataFreshnessBadge.tsx` **(starting line 1):**
```tsx
function formatRelativeTime(fromMs: number): string {
  const minutes = Math.round((Date.now() - fromMs) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Analytics_Charts