---
source_file: "server/src/entities/datasets/routes.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L59"
tags:
  - graphify/code
  - graphify/INFERRED
  - community/Ramesh_AI_Query_Engine
---

# uploadFiles()

## Connections
- [[datasetsroutes.ts]] - `indirect_call` [INFERRED]

## Source
**From** `server/src/entities/datasets/routes.ts` **(starting line 59):**
```typescript
const uploadFiles: RequestHandler = (req, res, next) => {
  upload.array("files", 6)(req, res, (err: unknown) => {
    if (!err) return next();
    const code = (err as { code?: string }).code;
    if (code === "LIMIT_FILE_SIZE") {
      res.status(413).json({
        error: "That file is too large.",
        detail: `Each file must be under ${Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))} MB. Split the export into smaller date ranges and import them one at a time.`,
      });
      return;
    }
    if (code === "LIMIT_FILE_COUNT" || code === "LIMIT_UNEXPECTED_FILE") {
      res.status(413).json({ error: "Too many files in one upload.", detail: "Import up to 6 files at a time." });
      return;
    }
    res.status(400).json({ error: "The upload could not be read.", detail: err instanceof Error ? err.message : String(err) });
  });
};
```

#graphify/code #graphify/INFERRED #community/Ramesh_AI_Query_Engine