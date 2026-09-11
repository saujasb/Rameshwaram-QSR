---
source_file: "client/src/modules/import/ImportCenterPage.tsx"
type: "code"
community: "Data Explorer & Import UI"
location: "L315"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# FailureCard()

## Connections
- [[ImportCenterPage.tsx]] - `contains` [EXTRACTED]
- [[dateRange()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/modules/import/ImportCenterPage.tsx` **(starting line 315):**
```tsx
function FailureCard({
  result,
  onImportAnyway,
  pending,
}: {
  result: ImportFileResult;
  onImportAnyway: (fileName: string) => void;
  pending: boolean;
}) {
  const dup = result.duplicateOf;
  return (
    <div className="card" style={{ borderLeft: "3px solid var(--critical)" }}>
      <h3 style={{ color: dup ? "var(--warning)" : "var(--critical)" }}>
        {dup ? "Already imported — nothing was changed" : "Import failed"}
      </h3>
      <p className="h3sub">{result.fileName}</p>
      {dup ? (
        <>
          <p style={{ margin: 0 }}>
            This is the same file that was already imported as <b>{dup.fileName}</b> on{" "}
            {new Date(dup.createdAt).toLocaleString()}, covering {dateRange(dup.businessDateFrom, dup.businessDateTo)}.
            Nothing was imported again, so no number was double-counted.
          </p>
          <p className="import-note" style={{ marginTop: 8 }}>
            If this really is a fresh export that happens to be byte-identical, you can force it through — rows that
            already exist will still be de-duplicated on their own fingerprints.
          </p>
          <div className="btn-row">
            <button className="btn" disabled={pending} onClick={() => onImportAnyway(result.fileName)}>
              Import anyway
            </button>
          </div>
        </>
      ) : (
        <>
          <p style={{ margin: 0 }}>{result.error ?? "The file could not be imported."}</p>
          {result.detail && (
            <p style={{ color: "var(--ink-2)", fontSize: 13, marginTop: 6 }}>{result.detail}</p>
          )}
        </>
      )}
    </div>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI