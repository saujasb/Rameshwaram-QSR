---
source_file: "client/src/lib/api/datasets.ts"
type: "code"
community: "Data Explorer & Import UI"
location: "L148"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# useSetBusinessDayStartHour()

## Connections
- [[BusinessDayCard()]] - `calls` [EXTRACTED]
- [[SettingsPage.tsx]] - `imports` [EXTRACTED]
- [[apidatasets.ts]] - `contains` [EXTRACTED]
- [[apiPut()]] - `calls` [EXTRACTED]
- [[useInvalidateDataLayer()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/datasets.ts` **(starting line 148):**
```typescript
export function useSetBusinessDayStartHour() {
  const qc = useQueryClient();
  const invalidate = useInvalidateDataLayer();
  return useMutation({
    mutationFn: (businessDayStartHour: number) =>
      apiPut<{ businessDayStartHour: number; updatedAt: string }>("/datasets/settings", { businessDayStartHour }),
    onSuccess: (data) => {
      qc.setQueryData(["dataset-settings"], { businessDayStartHour: data.businessDayStartHour });
      invalidate();
    },
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI