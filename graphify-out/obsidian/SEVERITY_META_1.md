---
source_file: "client/src/modules/dashboard/AttentionRequiredCard.tsx"
type: "code"
community: "Action Center UI"
location: "L12"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Action_Center_UI
---

# SEVERITY_META

## Connections
- [[AttentionRequiredCard.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/dashboard/AttentionRequiredCard.tsx` **(starting line 12):**
```tsx
const SEVERITY_META: Record<AttentionAlert["severity"], { label: string; color: string }> = {
  critical: { label: "Critical", color: "var(--critical)" },
  attention: { label: "Warning", color: "var(--warning)" },
  info: { label: "Info", color: "var(--brand)" },
};
```

#graphify/code #graphify/EXTRACTED #community/Action_Center_UI