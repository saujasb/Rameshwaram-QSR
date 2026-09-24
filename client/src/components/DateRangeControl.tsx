import { DATE_RANGE_PRESET_OPTIONS, type DateRangePreset, type DateRangeValue } from "../lib/dateRange";

/** Standard Today / Previous Day / Last 7 Days / Custom Date Range selector. Renders inline inside a .filters-bar. */
export function DateRangeControl({ value, onChange }: { value: DateRangeValue; onChange: (next: DateRangeValue) => void }) {
  return (
    <>
      <select
        value={value.preset}
        onChange={(e) => onChange({ ...value, preset: e.target.value as DateRangePreset })}
        aria-label="Date range"
      >
        {DATE_RANGE_PRESET_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {value.preset === "custom" && (
        <>
          <input
            type="date"
            value={value.customFrom}
            max={value.customTo || undefined}
            onChange={(e) => onChange({ ...value, customFrom: e.target.value })}
            aria-label="Start date"
          />
          <input
            type="date"
            value={value.customTo}
            min={value.customFrom || undefined}
            onChange={(e) => onChange({ ...value, customTo: e.target.value })}
            aria-label="End date"
          />
        </>
      )}
    </>
  );
}
