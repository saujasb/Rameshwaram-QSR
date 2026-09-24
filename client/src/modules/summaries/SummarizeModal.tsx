import { useState } from "react";
import { Mail, MessageCircle } from "lucide-react";
import type { SummaryChannel } from "@shared/summary";
import { getCurrentBusinessDate, shiftDateKey } from "@shared/businessDate";
import { Modal } from "../../components/Modal";
import { useDeliverSummary, useSummaryChannels, useSummaryPreview } from "../../lib/api/summaries";

const RANGES = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "last7", label: "Last 7 days" },
] as const;

function scopeFor(key: (typeof RANGES)[number]["key"]) {
  const today = getCurrentBusinessDate();
  if (key === "today") return { from: today, to: today };
  if (key === "yesterday") {
    const y = shiftDateKey(today, -1);
    return { from: y, to: y };
  }
  return { from: shiftDateKey(today, -6), to: today };
}

/**
 * "Summarize Data": sends a summary to the signed-in user's OWN registered
 * email / WhatsApp. The server picks the destination from their profile; this
 * screen can't choose a different one.
 */
export function SummarizeModal({ onClose }: { onClose: () => void }) {
  const [range, setRange] = useState<(typeof RANGES)[number]["key"]>("today");
  const scope = scopeFor(range);
  const channels = useSummaryChannels(true);
  const preview = useSummaryPreview(scope, true);
  const deliver = useDeliverSummary();

  return (
    <Modal title="Summarize data" onClose={onClose}>
      <div className="btn-row" style={{ marginTop: 0 }}>
        {RANGES.map((r) => (
          <button key={r.key} className={`btn small${range === r.key ? " primary" : ""}`} onClick={() => { setRange(r.key); deliver.reset(); }}>
            {r.label}
          </button>
        ))}
      </div>

      <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: 13, background: "var(--line)", padding: 12, borderRadius: 8 }}>
        {preview.isLoading ? "Preparing summary…" : preview.isError ? "Couldn't prepare the summary." : preview.data?.text}
      </pre>

      <h4 style={{ margin: "14px 0 6px" }}>Send it to me</h4>
      <div className="btn-row" style={{ marginTop: 0 }}>
        {(channels.data ?? []).map((c) => {
          const Icon = c.channel === "email" ? Mail : MessageCircle;
          const label = c.channel === "email" ? "Email" : "WhatsApp";
          const ready = c.providerConfigured && c.hasDestination;
          return (
            <button
              key={c.channel}
              className="btn"
              disabled={!ready || deliver.isPending}
              title={!c.hasDestination ? `No ${label.toLowerCase()} on your profile` : !c.providerConfigured ? `${label} delivery isn't set up yet` : undefined}
              onClick={() => deliver.mutate({ channel: c.channel as SummaryChannel, ...scope })}
            >
              <Icon size={15} aria-hidden /> {label}
              <span style={{ color: "var(--muted)", fontSize: 12 }}>
                {c.destinationMasked ?? "not on profile"}
                {c.hasDestination && !c.providerConfigured ? " · coming soon" : ""}
              </span>
            </button>
          );
        })}
      </div>
      {deliver.data && (
        <p role="status" style={{ fontSize: 13, color: deliver.data.status === "sent" ? "var(--good)" : "var(--ink-2)" }}>
          {deliver.data.message}
        </p>
      )}
      {deliver.isError && <p role="alert" style={{ fontSize: 13, color: "var(--critical)" }}>{(deliver.error as Error).message}</p>}
      <p style={{ color: "var(--muted)", fontSize: 12, marginBottom: 0 }}>
        Summaries only go to the email / WhatsApp number on your own profile. Email and WhatsApp delivery will switch on once a
        provider is connected.
      </p>
    </Modal>
  );
}
