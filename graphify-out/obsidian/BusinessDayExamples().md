---
source_file: "client/src/modules/settings/SettingsPage.tsx"
type: "code"
community: "Data Explorer & Import UI"
location: "L22"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# BusinessDayExamples()

## Connections
- [[SettingsPage.tsx]] - `contains` [EXTRACTED]
- [[formatBusinessDateLong()]] - `calls` [EXTRACTED]
- [[formatBusinessDateShort()]] - `calls` [EXTRACTED]
- [[getBusinessDate()]] - `calls` [EXTRACTED]
- [[hourLabel()]] - `calls` [EXTRACTED]
- [[toDateKey()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/modules/settings/SettingsPage.tsx` **(starting line 22):**
```tsx
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
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI