---
source_file: "server/src/entities/datasets/normalize.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L149"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# fingerprintFor()

## Connections
- [[buildRecord()]] - `calls` [EXTRACTED]
- [[normalize.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/normalize.ts` **(starting line 149):**
```typescript
function fingerprintFor(input: RawRowInput, ctx: BuildContext, businessDate: string, productKey: string): string {
  if (input.aggregated) {
    return ["agg", input.datasetType, input.channel ?? "na", businessDate, productKey].join("::");
  }
  return [
    "row",
    input.datasetType,
    businessDate,
    productKey,
    input.rawTimestamp ?? "nots",
    input.outlet ?? "na",
    input.shift ?? "na",
    String(input.quantity),
    String(input.salesValue ?? ""),
    ctx.sourceFile,
    input.sourceSheet ?? "na",
    String(input.sourceRow ?? "na"),
  ].join("::");
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline