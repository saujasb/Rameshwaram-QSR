---
source_file: "shared-types/businessDate.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L98"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# formatBusinessDateLong()

## Connections
- [[AppShell.tsx]] - `imports` [EXTRACTED]
- [[BusinessDayExamples()]] - `calls` [EXTRACTED]
- [[CoverageCard()]] - `calls` [EXTRACTED]
- [[DashboardPage()]] - `calls` [EXTRACTED]
- [[DashboardPage.tsx]] - `imports` [EXTRACTED]
- [[ImportCenterPage.tsx]] - `imports` [EXTRACTED]
- [[OpsStatusStrip()]] - `calls` [EXTRACTED]
- [[SettingsPage.tsx]] - `imports` [EXTRACTED]
- [[TodaysIntelligencePanel()]] - `calls` [EXTRACTED]
- [[TodaysIntelligencePanel.tsx]] - `imports` [EXTRACTED]
- [[analysis.ts]] - `imports` [EXTRACTED]
- [[anomalies.ts]] - `imports` [EXTRACTED]
- [[anomalyAction()]] - `calls` [EXTRACTED]
- [[anomalyInsight()]] - `calls` [EXTRACTED]
- [[anomalyToLine()]] - `calls` [EXTRACTED]
- [[answerCompareDates()]] - `calls` [EXTRACTED]
- [[answerSeries()]] - `calls` [EXTRACTED]
- [[buildSuggestions()]] - `calls` [EXTRACTED]
- [[businessDate.ts]] - `contains` [EXTRACTED]
- [[changeAnalysis()]] - `calls` [EXTRACTED]
- [[computeReconciliation()]] - `calls` [EXTRACTED]
- [[dateRange()]] - `calls` [EXTRACTED]
- [[efficiencyAnalysis()]] - `calls` [EXTRACTED]
- [[engine.ts]] - `imports` [EXTRACTED]
- [[insights.ts]] - `imports` [EXTRACTED]
- [[missingDatesInsight()]] - `calls` [EXTRACTED]
- [[movementInsight()]] - `calls` [EXTRACTED]
- [[noMatch()]] - `calls` [EXTRACTED]
- [[productStalls()]] - `calls` [EXTRACTED]
- [[productionVariance()]] - `calls` [EXTRACTED]
- [[rangeLabel()]] - `calls` [EXTRACTED]
- [[reconciliation.ts]] - `imports` [EXTRACTED]
- [[reconciliationAnalysis()]] - `calls` [EXTRACTED]
- [[salesMovement()]] - `calls` [EXTRACTED]
- [[wastageSurges()]] - `calls` [EXTRACTED]
- [[windowFor()]] - `calls` [EXTRACTED]

## Source
**From** `shared-types/businessDate.ts` **(starting line 98):**
```typescript
export function formatBusinessDateLong(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine