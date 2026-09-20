function formatRelativeTime(fromMs: number): string {
  const minutes = Math.round((Date.now() - fromMs) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

/**
 * Tells the user, without them having to guess, how current the *imported*
 * data behind this page actually is -- driven by the last successful import
 * batch's timestamp, never a decorative "live" claim. This is specifically an
 * import-freshness indicator: it says nothing about live webhook feeds
 * (Petpooja/Kiosk via provider_orders), which have their own "Live ·
 * auto-refreshing" indicators where shown. The label props exist so a caller
 * whose imports aren't about "sales" (e.g. Production/Wastage/Data Import in
 * general) doesn't get a misleading "sales" claim baked into the text.
 */
export function DataFreshnessBadge({
  lastSyncedAt,
  staleAfterMinutes = 1560,
  notConnectedLabel = "No sales data imported yet",
  syncedLabel = "Data synced",
  staleLabel = "Data may be outdated",
}: {
  lastSyncedAt: string | null;
  staleAfterMinutes?: number;
  notConnectedLabel?: string;
  syncedLabel?: string;
  staleLabel?: string;
}) {
  if (!lastSyncedAt) {
    return (
      <span className="freshness notconn">
        <span className="status-dot notconn" /> {notConnectedLabel}
      </span>
    );
  }

  const syncedMs = new Date(lastSyncedAt).getTime();
  const minutesAgo = (Date.now() - syncedMs) / 60000;
  const isStale = minutesAgo > staleAfterMinutes;

  return (
    <span className={`freshness ${isStale ? "warn" : "good"}`}>
      <span className={`status-dot ${isStale ? "warn" : "good"}`} />
      {isStale ? staleLabel : syncedLabel} · last import {formatRelativeTime(syncedMs)}
    </span>
  );
}
