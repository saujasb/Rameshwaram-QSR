---
source_file: "shared-types/businessDate.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L88"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# formatHourBucket()

## Connections
- [[DataExplorerPage()]] - `calls` [EXTRACTED]
- [[DataExplorerPage.tsx]] - `imports` [EXTRACTED]
- [[TodaysIntelligencePanel()]] - `calls` [EXTRACTED]
- [[TodaysIntelligencePanel.tsx]] - `imports` [EXTRACTED]
- [[analysis.ts]] - `imports` [EXTRACTED]
- [[anomalyInsight()]] - `calls` [EXTRACTED]
- [[anomalyToLine()]] - `calls` [EXTRACTED]
- [[answerPeakHour()]] - `calls` [EXTRACTED]
- [[buildTodaysIntelligence()]] - `calls` [EXTRACTED]
- [[businessDate.ts]] - `contains` [EXTRACTED]
- [[datasetsrepository.ts]] - `imports` [EXTRACTED]
- [[engine.ts]] - `imports` [EXTRACTED]
- [[hourlyBuckets()]] - `calls` [EXTRACTED]
- [[insights.ts]] - `imports` [EXTRACTED]
- [[intelligenceroutes.ts]] - `imports` [EXTRACTED]
- [[peakHourInsight()]] - `calls` [EXTRACTED]

## Source
**From** `shared-types/businessDate.ts` **(starting line 88):**
```typescript
export function formatHourBucket(clockHour: number): string {
  const fmt = (h: number) => {
    const suffix = h < 12 || h === 24 ? "AM" : "PM";
    const display = h % 12 === 0 ? 12 : h % 12;
    return `${display}${suffix}`;
  };
  return `${fmt(clockHour)}–${fmt((clockHour + 1) % 24)}`;
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine