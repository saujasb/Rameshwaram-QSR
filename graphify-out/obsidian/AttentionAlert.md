---
source_file: "client/src/modules/dashboard/AttentionRequiredCard.tsx"
type: "code"
community: "Action Center UI"
location: "L4"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Action_Center_UI
---

# AttentionAlert

## Connections
- [[AttentionRequiredCard.tsx]] - `contains` [EXTRACTED]
- [[DashboardPage.tsx]] - `imports` [EXTRACTED]

## Source
**From** `client/src/modules/dashboard/AttentionRequiredCard.tsx` **(starting line 4):**
```tsx
export interface AttentionAlert {
  id: string;
  severity: "critical" | "attention" | "info";
  title: string;
  detail: string;
  linkPath: string;
}
```

#graphify/code #graphify/EXTRACTED #community/Action_Center_UI