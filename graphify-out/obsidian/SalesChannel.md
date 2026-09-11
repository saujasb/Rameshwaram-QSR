---
source_file: "shared-types/sales.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L3"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# SalesChannel

## Connections
- [[CandidateLineItem]] - `references` [EXTRACTED]
- [[ParsedReport]] - `references` [EXTRACTED]
- [[detectFormat.ts]] - `imports` [EXTRACTED]
- [[parseTypes.ts]] - `imports` [EXTRACTED]
- [[parserspetpooja.ts]] - `imports` [EXTRACTED]
- [[salesrepository.ts]] - `imports` [EXTRACTED]
- [[shared-typessales.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/sales.ts` **(starting line 3):**
```typescript
export type SalesChannel = "kiosk" | "petpooja_pos" | "petpooja_online";

export const SALES_CHANNEL_LABELS: Record<SalesChannel, string> = {
  kiosk: "Kiosk",
  petpooja_pos: "PetPooja (Counter/POS)",
  petpooja_online: "Online",
};
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline