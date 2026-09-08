---
source_file: "client/src/modules/dashboard/ActionCenterPage.tsx"
type: "code"
community: "Action Center UI"
location: "L5"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Action_Center_UI
---

# SEVERITY_META

## Connections
- [[ActionCenterPage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/dashboard/ActionCenterPage.tsx` **(starting line 5):**
```tsx
const SEVERITY_META: Record<ActionCenterItem["severity"], { label: string; color: string }> = {
  critical: { label: "Critical", color: "var(--critical)" },
  attention: { label: "Attention", color: "var(--warning)" },
  completed: { label: "Completed", color: "var(--good)" },
};
```

#graphify/code #graphify/EXTRACTED #community/Action_Center_UI