---
source_file: "client/src/modules/settings/SettingsPage.tsx"
type: "code"
community: "Data Explorer & Import UI"
location: "L77"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# BusinessDayCard()

## Connections
- [[SettingsPage.tsx]] - `contains` [EXTRACTED]
- [[hourLabel()]] - `calls` [EXTRACTED]
- [[useBusinessDaySettings()]] - `calls` [EXTRACTED]
- [[useSetBusinessDayStartHour()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/modules/settings/SettingsPage.tsx` **(starting line 77):**
```tsx
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
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI