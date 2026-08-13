import { CrudModulePage } from "../../components/crud/CrudModulePage";
import { StatusBadge } from "../../components/StatusBadge";
import { NotConnectedBanner } from "../../components/NotConnectedBanner";
import { orderHooks } from "../../lib/api/orders";
import type { ManualOrderEntry } from "@shared/entities";
import type { ColumnConfig, FormFieldConfig } from "../../components/crud/types";
import { CHANNEL_OPTIONS, NEXT_STATUS, STATUS_OPTIONS } from "../orders/channelHelpers";

const KITCHEN_STATUSES = new Set(["received", "accepted", "preparing", "ready", "delayed"]);

function useKitchenQueue() {
  const { data, ...rest } = orderHooks.useList();
  return { ...rest, data: data?.filter((o) => KITCHEN_STATUSES.has(o.status)) };
}

const columns: ColumnConfig<ManualOrderEntry>[] = [
  { key: "receivedAt", label: "Received", render: (r) => new Date(r.receivedAt).toLocaleTimeString() },
  { key: "channel", label: "Channel", render: (r) => CHANNEL_OPTIONS.find((o) => o.value === r.channel)?.label ?? r.channel },
  { key: "itemsSummary", label: "Items" },
  {
    key: "status",
    label: "Status",
    render: (r) => <StatusBadge label={r.status} tone={r.status === "delayed" ? "over" : "neutral"} />,
  },
];

const formFields: FormFieldConfig[] = [
  { key: "channel", label: "Channel", type: "select", required: true, options: CHANNEL_OPTIONS },
  { key: "itemsSummary", label: "Items", type: "textarea", required: true },
  { key: "receivedAt", label: "Received at", type: "datetime", required: true },
  { key: "status", label: "Status", type: "select", required: true, options: STATUS_OPTIONS },
];

export function KitchenPage() {
  const update = orderHooks.useUpdate();
  const { data: queue } = useKitchenQueue();
  const busyLoad = queue?.length ?? 0;
  const kitchenState = busyLoad === 0 ? { label: "Normal", tone: "good" } : busyLoad <= 4 ? { label: "Busy", tone: "warn" } : { label: "Overloaded", tone: "crit" };

  return (
    <div>
      <NotConnectedBanner>
        No Kitchen Display System (KDS) is connected yet, so prep times and SLA breaches aren't measured automatically.
        This queue reflects manually-logged orders only.
      </NotConnectedBanner>
      <div className="card">
        <h3>Kitchen status</h3>
        <p className="h3sub">Based on manually-logged orders currently in the queue — not a live KDS signal.</p>
        <span className={`status-dot ${kitchenState.tone}`} /> <b>{kitchenState.label}</b> · {busyLoad} order(s) in queue
      </div>
      <CrudModulePage<ManualOrderEntry>
        title="Kitchen Queue"
        description="Orders currently received, accepted, preparing, ready, or delayed. Advance status as the kitchen works through them."
        hooks={{ useList: useKitchenQueue, useCreate: orderHooks.useCreate, useUpdate: orderHooks.useUpdate, useRemove: orderHooks.useRemove }}
        columns={columns}
        formFields={formFields}
        defaultValues={{
          channel: "dine_in",
          itemsSummary: "",
          totalAmount: null,
          status: "received",
          receivedAt: new Date().toISOString().slice(0, 16),
          completedAt: null,
          notes: "",
          source: "manual",
        }}
        emptyMessage="Kitchen queue is empty."
        addButtonLabel="Log order"
        renderDetail={(record) => {
          const next = NEXT_STATUS[record.status];
          return next ? (
            <div className="btn-row" style={{ marginTop: 0, marginBottom: 14 }}>
              <button
                className="btn small"
                onClick={() =>
                  update.mutate({
                    id: record.id,
                    patch: { status: next, completedAt: next === "completed" ? new Date().toISOString() : null },
                  })
                }
              >
                Advance to "{STATUS_OPTIONS.find((o) => o.value === next)?.label}"
              </button>
            </div>
          ) : null;
        }}
      />
    </div>
  );
}
