import { useEffect, useMemo, useState } from "react";
import {
  formatBusinessDateLong,
  formatBusinessDateShort,
  getBusinessDate,
  toDateKey,
} from "@shared/businessDate";
import { DATASET_LABELS } from "@shared/datasets";
import { useBusinessDaySettings, useDatasetCoverage, useSetBusinessDayStartHour } from "../../lib/api/datasets";

const HOURS = Array.from({ length: 24 }, (_, h) => h);

/** "05:00 AM" / "12:00 AM" / "01:00 PM" — how the team reads a clock, not 0-23. */
function hourLabel(hour: number): string {
  const suffix = hour < 12 ? "AM" : "PM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${String(display).padStart(2, "0")}:00 ${suffix}`;
}

const MUTED = { color: "var(--muted)", fontSize: 12.5 } as const;

function BusinessDayExamples({ hour }: { hour: number }) {
  const examples = useMemo(() => {
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    const calendarDate = toDateKey(base);
    const rows = [(hour + 23) % 24, hour, (hour + 1) % 24].map((clockHour) => {
      const stamp = new Date(base);
      stamp.setHours(clockHour);
      return { clockHour, businessDate: getBusinessDate(stamp, hour) };
    });
    return { calendarDate, rows };
  }, [hour]);

  const { calendarDate, rows } = examples;
  const lateRow = rows[0];

  return (
    <>
      <p style={{ marginTop: 4 }}>
        With the trading day starting at <b>{hourLabel(hour)}</b>, a transaction rung up on{" "}
        {formatBusinessDateShort(calendarDate)} at {hourLabel(lateRow.clockHour)} counts as the{" "}
        <b>{formatBusinessDateLong(lateRow.businessDate)}</b> business day
        {lateRow.businessDate !== calendarDate ? " — the previous calendar date" : ""}, and the{" "}
        <b>{formatBusinessDateLong(calendarDate)}</b> business day starts at {hourLabel(hour)} on{" "}
        {formatBusinessDateShort(calendarDate)} and runs until {hourLabel(hour)} the following morning.
      </p>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Transaction time in the source</th>
              <th>Counted in this business day</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.clockHour}>
                <td>
                  {formatBusinessDateShort(calendarDate)} · {hourLabel(r.clockHour)}
                </td>
                <td>
                  {formatBusinessDateLong(r.businessDate)}
                  {r.businessDate !== calendarDate && (
                    <span style={{ ...MUTED, marginLeft: 8 }}>previous calendar date</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function BusinessDayCard() {
  const { data: settings, isLoading } = useBusinessDaySettings();
  const saveMutation = useSetBusinessDayStartHour();
  const [hour, setHour] = useState<number | null>(null);

  useEffect(() => {
    if (settings && hour === null) setHour(settings.businessDayStartHour);
  }, [settings, hour]);

  const savedHour = settings?.businessDayStartHour ?? null;
  const selected = hour ?? savedHour ?? 5;
  const dirty = savedHour !== null && selected !== savedHour;

  return (
    <div className="card">
      <h3>Business day start</h3>
      <p className="h3sub">
        The clock hour at which one trading day ends and the next begins. Late-night sales belong to the day the shift
        started on, not to the calendar date the POS printed.
      </p>

      {isLoading && <p style={MUTED}>Loading current setting…</p>}

      <div className="form-grid">
        <div className="field">
          <label htmlFor="business-day-start-hour">Day starts at</label>
          <select
            id="business-day-start-hour"
            value={selected}
            disabled={isLoading || saveMutation.isPending}
            onChange={(e) => setHour(Number(e.target.value))}
          >
            {HOURS.map((h) => (
              <option key={h} value={h}>
                {hourLabel(h)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <BusinessDayExamples hour={selected} />

      <div className="callout">
        <b>Changing this is not retroactive.</b> It changes how <b>new</b> imports are bucketed and how the dashboard
        works out "today". Records already imported keep the start hour they were imported under — that hour is stored on
        every row for audit — so historical rows stay in the buckets they were originally assigned. To re-bucket them,
        undo the affected imports in the Data Import Center and import those files again.
      </div>

      <div className="btn-row">
        <button
          className="btn primary"
          disabled={!dirty || saveMutation.isPending}
          onClick={() => saveMutation.mutate(selected)}
        >
          {saveMutation.isPending ? "Saving…" : "Save start hour"}
        </button>
        {dirty && !saveMutation.isPending && (
          <button className="btn" onClick={() => setHour(savedHour)}>
            Cancel
          </button>
        )}
      </div>

      {saveMutation.isError && (
        <p style={{ color: "var(--critical)", fontSize: 13, marginBottom: 0 }} role="alert">
          Could not save the setting: {(saveMutation.error as Error).message}. Nothing was changed.
        </p>
      )}
      {saveMutation.isSuccess && !dirty && (
        <p style={{ color: "var(--good)", fontSize: 13, marginBottom: 0 }} role="status">
          Saved. New imports and the dashboard's "today" now use {hourLabel(selected)}.
        </p>
      )}
      {!dirty && savedHour !== null && !saveMutation.isSuccess && (
        <p style={{ ...MUTED, marginBottom: 0 }}>Currently in effect: {hourLabel(savedHour)}.</p>
      )}
    </div>
  );
}

function CoverageCard() {
  const { data: coverage, isLoading } = useDatasetCoverage();
  const rows = coverage ?? [];
  const noTimestampRows = rows.filter((c) => !c.hasTimestamps);

  return (
    <div className="card">
      <h3>Data coverage</h3>
      <p className="h3sub">What has actually been imported so far, per dataset — and what each source does not carry.</p>

      {isLoading && <p style={MUTED}>Loading coverage…</p>}

      {!isLoading && rows.length === 0 && (
        <div className="empty-state">
          <p>Nothing imported yet. Once files are imported in the Data Import Center, their coverage appears here.</p>
        </div>
      )}

      {rows.length > 0 && (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Dataset</th>
                <th className="num">Records</th>
                <th>Business dates covered</th>
                <th className="num">Distinct products</th>
                <th>Hourly analysis</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.datasetType}>
                  <td>{DATASET_LABELS[c.datasetType]}</td>
                  <td className="num">{c.recordCount.toLocaleString()}</td>
                  <td>
                    {c.businessDateFrom && c.businessDateTo
                      ? c.businessDateFrom === c.businessDateTo
                        ? formatBusinessDateLong(c.businessDateFrom)
                        : `${formatBusinessDateLong(c.businessDateFrom)} → ${formatBusinessDateLong(c.businessDateTo)}`
                      : "—"}
                  </td>
                  <td className="num">{c.distinctProducts.toLocaleString()}</td>
                  <td>
                    {c.hasTimestamps ? (
                      <span className="pill good" style={{ marginTop: 0 }}>
                        Available
                      </span>
                    ) : (
                      <span className="pill notconn" style={{ marginTop: 0 }}>
                        Not available
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {noTimestampRows.length > 0 && (
        <div className="callout notconn">
          Hourly analysis is unavailable for{" "}
          {noTimestampRows.map((c) => DATASET_LABELS[c.datasetType]).join(", ")} because the source files carry no
          per-transaction time — only a report date. Those rows are still counted in daily totals; they just cannot be
          split across hours, and no hourly figure is estimated for them.
        </div>
      )}
    </div>
  );
}

export function SettingsPage() {
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Settings</h1>
          <p className="page-desc">
            How the dashboard interprets time, and exactly which data it currently holds. These settings change the
            reading of every number on every page, so each one states plainly what it does and does not affect.
          </p>
        </div>
      </div>

      <BusinessDayCard />
      <CoverageCard />
    </div>
  );
}
