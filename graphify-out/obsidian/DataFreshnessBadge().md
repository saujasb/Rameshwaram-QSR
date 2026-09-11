---
source_file: "client/src/components/DataFreshnessBadge.tsx"
type: "code"
community: "Sales Analytics Charts"
location: "L16"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Analytics_Charts
---

# DataFreshnessBadge()

## Connections
- [[DashboardPage.tsx]] - `imports` [EXTRACTED]
- [[DataFreshnessBadge.tsx]] - `contains` [EXTRACTED]
- [[SalesAnalyticsPage.tsx]] - `imports` [EXTRACTED]
- [[formatRelativeTime()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/components/DataFreshnessBadge.tsx` **(starting line 16):**
```tsx
export function DataFreshnessBadge({ lastSyncedAt, staleAfterMinutes = 1560 }: { lastSyncedAt: string | null; staleAfterMinutes?: number }) {
  if (!lastSyncedAt) {
    return (
      <span className="freshness notconn">
        <span className="status-dot notconn" /> No sales data imported yet
      </span>
    );
  }

  const syncedMs = new Date(lastSyncedAt).getTime();
  const minutesAgo = (Date.now() - syncedMs) / 60000;
  const isStale = minutesAgo > staleAfterMinutes;

  return (
    <span className={`freshness ${isStale ? "warn" : "good"}`}>
      <span className={`status-dot ${isStale ? "warn" : "good"}`} />
      {isStale ? "Data may be outdated" : "Data synced"} · last import {formatRelativeTime(syncedMs)}
    </span>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Analytics_Charts