---
source_file: "server/src/entities/intelligence/anomalies.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L29"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# Candidate

## Connections
- [[anomalies.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/anomalies.ts` **(starting line 29):**
```typescript
type Candidate = Omit<Anomaly, "evidence"> & { evidenceTypes: DatasetType[] };
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine