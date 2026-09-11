---
source_file: "client/src/lib/api/datasets.ts"
type: "code"
community: "Data Explorer & Import UI"
location: "L141"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# useBusinessDaySettings()

## Connections
- [[BusinessDayCard()]] - `calls` [EXTRACTED]
- [[SettingsPage.tsx]] - `imports` [EXTRACTED]
- [[apidatasets.ts]] - `contains` [EXTRACTED]
- [[apiGet()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/datasets.ts` **(starting line 141):**
```typescript
export function useBusinessDaySettings() {
  return useQuery({
    queryKey: ["dataset-settings"],
    queryFn: () => apiGet<{ businessDayStartHour: number }>("/datasets/settings"),
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI