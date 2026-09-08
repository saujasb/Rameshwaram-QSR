---
source_file: "server/src/entities/datasets/routes.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L215"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# csvCell()

## Connections
- [[datasetsroutes.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/routes.ts` **(starting line 215):**
```typescript
function csvCell(value: unknown): string {
  if (value == null) return "";
  let s = String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  if (/[",\r\n]/.test(s)) s = `"${s.replace(/"/g, '""')}"`;
  return s;
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine