---
source_file: "server/src/entities/sales/repository.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L17"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# CandidateLineItem

## Connections
- [[SalesChannel]] - `references` [EXTRACTED]
- [[salesimportPipeline.ts]] - `imports` [EXTRACTED]
- [[salesrepository.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/sales/repository.ts` **(starting line 17):**
```typescript
export interface CandidateLineItem {
  channel: SalesChannel;
  category: string;
  itemName: string;
  quantity: number;
  amount: number;
  calendarDate: string;
  businessDate: string;
  businessDayStart: string;
  businessDayEnd: string;
  transactionTimestamp: string | null;
  transactionTime: string | null;
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline