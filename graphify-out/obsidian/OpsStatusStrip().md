---
source_file: "client/src/components/layout/AppShell.tsx"
type: "code"
community: "App Shell & Bootstrap"
location: "L28"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/App_Shell__Bootstrap
---

# OpsStatusStrip()

## Connections
- [[AppShell.tsx]] - `contains` [EXTRACTED]
- [[formatBusinessDateLong()]] - `calls` [EXTRACTED]
- [[useHealthCheck()]] - `calls` [EXTRACTED]
- [[useLatestImportBatch()_1]] - `calls` [EXTRACTED]
- [[useLiveBusinessDate()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/components/layout/AppShell.tsx` **(starting line 28):**
```tsx
function OpsStatusStrip() {
  const businessDate = useLiveBusinessDate();
  const { data: health, isLoading: healthLoading, isError: healthError } = useHealthCheck();
  const { data: latestBatch } = useLatestImportBatch();
  const isLive = !healthLoading && !healthError && Boolean(health?.ok);
  const liveTone = healthLoading ? "notconn" : isLive ? "good" : "crit";

  return (
    <div className="ops-status">
      <span className="ops-status-item">
        <span className="ops-status-label">Business Date</span> {formatBusinessDateLong(businessDate)}
      </span>
      <span className="ops-status-sep" aria-hidden>·</span>
      <span className={`ops-status-item ops-live ${liveTone}`}>
        <span className={`status-dot ${liveTone}`} />
        {healthLoading ? "Connecting…" : isLive ? "Live" : "Offline"}
      </span>
      <span className="ops-status-sep" aria-hidden>·</span>
      <span className="ops-status-item">
        <span className="ops-status-label">Last sales sync</span>{" "}
        {latestBatch ? new Date(latestBatch.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "never"}
      </span>
    </div>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/App_Shell__Bootstrap