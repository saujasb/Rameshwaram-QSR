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
 * Tells the user, without them having to guess, how current the sales data
 * behind this page actually is -- driven by the last successful import's
 * timestamp, never a decorative "live" claim.
 */
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
