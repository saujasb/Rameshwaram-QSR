---
source_file: "client/src/modules/import/ImportCenterPage.tsx"
type: "code"
community: "Data Explorer & Import UI"
location: "L436"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# ImportCenterPage()

## Connections
- [[ImportCenterPage.tsx]] - `contains` [EXTRACTED]
- [[addFiles()]] - `contains` [EXTRACTED]
- [[fileIcon()]] - `calls` [EXTRACTED]
- [[fileKindLabel()]] - `calls` [EXTRACTED]
- [[fmtBytes()]] - `calls` [EXTRACTED]
- [[getCurrentBusinessDate()]] - `calls` [EXTRACTED]
- [[handleDrop()_1]] - `contains` [EXTRACTED]
- [[handleKeyDown()]] - `contains` [EXTRACTED]
- [[handleSubmit()_1]] - `contains` [EXTRACTED]
- [[importAnyway()]] - `contains` [EXTRACTED]
- [[openPicker()]] - `contains` [EXTRACTED]
- [[routes.tsx]] - `imports` [EXTRACTED]
- [[useImportFiles()]] - `calls` [EXTRACTED]
- [[useStagedProgress()_1]] - `calls` [EXTRACTED]

## Source
**From** `client/src/modules/import/ImportCenterPage.tsx` **(starting line 436):**
```tsx
export function ImportCenterPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [businessDate, setBusinessDate] = useState(getCurrentBusinessDate());
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importMutation = useImportFiles();
  const progressStep = useStagedProgress(importMutation.isPending, IMPORT_STEPS.length - 1);

  function addFiles(incoming: FileList | null) {
    if (!incoming?.length) return;
    const next = Array.from(incoming);
    setFiles((prev) => [...prev, ...next.filter((f) => !prev.some((p) => p.name === f.name && p.size === f.size))]);
  }

  function openPicker() {
    fileInputRef.current?.click();
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPicker();
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!files.length) return;
    importMutation.mutate({ files, businessDate });
  }

  function importAnyway(fileName: string) {
    const file = files.find((f) => f.name === fileName);
    if (!file) return;
    importMutation.mutate({ files: [file], businessDate, allowDuplicateFile: true });
  }

  const results = importMutation.data;
  const uploadError = importMutation.error;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Data Import Center</h1>
          <p className="page-desc">
            One place for every source file. Drop Kiosk or PetPooja sales PDFs and PetPooja / back-office Excel workbooks
            — several at once. Each file is read sheet by sheet, its columns are matched to the fields the dashboard
            needs, rows are validated and de-duplicated, and every number stays traceable to the file, sheet and row it
            came from. Re-uploading the same file never double-counts.
          </p>
        </div>
      </div>

      <div className="card">
        <h3>Upload source files</h3>
        <p className="h3sub">PDF, XLSX, XLS or XLSM. Multiple files per upload; each becomes its own import batch.</p>
        <form onSubmit={handleSubmit}>
          <div
            className={`dropzone${isDragging ? " dragging" : ""}${files.length ? " has-file" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={openPicker}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label="Drag and drop source files here, or press Enter to browse"
          >
            <input
              ref={fileInputRef}
              id="import-files"
              type="file"
              multiple
              accept={ACCEPT}
              style={{ display: "none" }}
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <div className="dropzone-icon">{files.length ? "▦" : "⇧"}</div>
            <div className="dropzone-title">
              {files.length ? `${files.length} file(s) ready to import` : "Drag & drop your sales, production or wastage exports here"}
            </div>
            <div className="dropzone-sub">or</div>
            <button
              type="button"
              className="btn primary small"
              onClick={(e) => {
                e.stopPropagation();
                openPicker();
              }}
            >
              Browse Files
            </button>
            <div className="dropzone-sub" style={{ marginTop: 8 }}>
              Supported formats: PDF, XLSX, XLS, XLSM
            </div>
          </div>

          {files.length > 0 && (
            <ul className="file-queue">
              {files.map((f) => (
                <li className="file-queue-item" key={`${f.name}-${f.size}`}>
                  <span className="file-queue-icon" aria-hidden="true">
                    {fileIcon(f.name)}
                  </span>
                  <span className="file-queue-body">
                    <span className="file-queue-name">{f.name}</span>
                    <span className="file-queue-meta">
                      {fileKindLabel(f.name)} · {fmtBytes(f.size)}
                    </span>
                  </span>
                  <button
                    type="button"
                    className="btn small"
                    disabled={importMutation.isPending}
                    aria-label={`Remove ${f.name} from the upload queue`}
                    onClick={() => setFiles((prev) => prev.filter((p) => !(p.name === f.name && p.size === f.size)))}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="form-grid" style={{ marginTop: 14 }}>
            <div className="field">
              <label htmlFor="import-business-date">Business date (fallback only)</label>
              <input
                id="import-business-date"
                type="date"
                value={businessDate}
                onChange={(e) => setBusinessDate(e.target.value)}
                disabled={importMutation.isPending}
              />
            </div>
          </div>
          <p className="import-note" style={{ marginTop: 10 }}>
            Used only for sources that print no date inside them (Kiosk PDFs). Excel and PetPooja files carry their own
            dates and are always trusted over this field — if a file's own date contradicts what's set here, the import
            is rejected rather than silently relabeled.
          </p>
          <div className="btn-row">
            <button type="submit" className="btn primary" disabled={!files.length || importMutation.isPending}>
              {importMutation.isPending
                ? "Importing…"
                : files.length === 1
                  ? "Import 1 file"
                  : `Import ${files.length} files`}
            </button>
            {files.length > 0 && !importMutation.isPending && (
              <button type="button" className="btn" onClick={() => setFiles([])}>
                Clear queue
              </button>
            )}
          </div>
        </form>
      </div>

      {importMutation.isPending && (
        <div className="card" aria-live="polite" aria-busy="true">
          <h3>Processing {files.length} file(s)…</h3>
          <p className="h3sub">Stages the importer runs through. Large workbooks can take a few moments.</p>
          <div className="progress-steps">
            {IMPORT_STEPS.map((label, i) => (
              <div
                key={label}
                className={`progress-step${i < progressStep ? " done" : i === progressStep ? " active" : ""}`}
              >
                <span className="progress-step-dot" />
                {label}
              </div>
            ))}
          </div>
        </div>
      )}

      {uploadError && (
        <div className="card" style={{ borderLeft: "3px solid var(--critical)" }} role="alert">
          <h3 style={{ color: "var(--critical)" }}>Upload could not be completed</h3>
          <p style={{ margin: 0 }}>{(uploadError as Error).message}</p>
          <p className="import-note" style={{ marginTop: 6 }}>
            Nothing was imported. Check that the server is reachable and try again.
          </p>
        </div>
      )}

      {results?.map((r, i) =>
        r.ok && r.batch ? (
          <SuccessCard key={`${r.fileName}-${i}`} batch={r.batch} />
```
*(truncated at 200 lines)*

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI