export type BadgeTone = "ok" | "over" | "under" | "neutral";

export function StatusBadge({ label, tone }: { label: string; tone: BadgeTone }) {
  return <span className={`tag ${tone}`}>{label}</span>;
}
