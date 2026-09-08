---
source_file: "client/src/modules/settings/SettingsPage.tsx"
type: "code"
community: "Data Explorer & Import UI"
location: "L14"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# hourLabel()

## Connections
- [[BusinessDayCard()]] - `calls` [EXTRACTED]
- [[BusinessDayExamples()]] - `calls` [EXTRACTED]
- [[SettingsPage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/settings/SettingsPage.tsx` **(starting line 14):**
```tsx
function hourLabel(hour: number): string {
  const suffix = hour < 12 ? "AM" : "PM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${String(display).padStart(2, "0")}:00 ${suffix}`;
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI