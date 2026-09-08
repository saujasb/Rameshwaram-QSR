---
source_file: "server/src/entities/datasets/coerce.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L226"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# coerceText()

## Connections
- [[coerce.ts]] - `contains` [EXTRACTED]
- [[excel.ts]] - `imports` [EXTRACTED]
- [[extractRows()]] - `calls` [EXTRACTED]
- [[parseWorkbook()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/coerce.ts` **(starting line 226):**
```typescript
export function coerceText(value: unknown): string | null {
  if (value == null) return null;
  const raw = String(value);
  let out = "";
  for (let i = 0; i < raw.length; i++) {
    const code = raw.charCodeAt(i);
    // Drop C0/C1 control characters; keep all printable punctuation, since
    // product names legitimately contain it ("ABC (Apple Beetroot Cucumber)").
    out += code < 32 || code === 127 ? " " : raw[i];
  }
  const cleaned = out.replace(/\s+/g, " ").trim();
  return cleaned === "" ? null : cleaned;
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline