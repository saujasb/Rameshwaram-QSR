---
source_file: "client/src/modules/settings/SettingsPage.tsx"
type: "code"
community: "Data Explorer & Import UI"
location: "L232"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# SettingsPage()

## Connections
- [[SettingsPage.tsx]] - `contains` [EXTRACTED]
- [[routes.tsx]] - `imports` [EXTRACTED]

## Source
**From** `client/src/modules/settings/SettingsPage.tsx` **(starting line 232):**
```tsx
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
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI