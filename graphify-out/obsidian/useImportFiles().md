---
source_file: "client/src/lib/api/datasets.ts"
type: "code"
community: "Data Explorer & Import UI"
location: "L104"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# useImportFiles()

## Connections
- [[ImportCenterPage()]] - `calls` [EXTRACTED]
- [[ImportCenterPage.tsx]] - `imports` [EXTRACTED]
- [[apidatasets.ts]] - `contains` [EXTRACTED]
- [[useInvalidateDataLayer()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/datasets.ts` **(starting line 104):**
```typescript
export function useImportFiles() {
  const invalidate = useInvalidateDataLayer();
  return useMutation({
    mutationFn: async (input: {
      files: File[];
      businessDate?: string;
      datasetOverrides?: Record<string, DatasetType>;
      allowDuplicateFile?: boolean;
    }) => {
      const fd = new FormData();
      for (const f of input.files) fd.append("files", f);
      if (input.businessDate) fd.append("businessDate", input.businessDate);
      if (input.datasetOverrides) fd.append("datasetOverrides", JSON.stringify(input.datasetOverrides));
      if (input.allowDuplicateFile) fd.append("allowDuplicateFile", "true");

      const res = await fetch(`${BASE}/datasets/import`, { method: "POST", body: fd });
      const body = await res.json().catch(() => ({}));
      if (!res.ok && !body.results) {
        throw new Error(body.error ?? `Upload failed with ${res.status}`);
      }
      return (body.results ?? []) as ImportFileResult[];
    },
    onSuccess: invalidate,
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI