---
source_file: "client/src/modules/dashboard/AttentionRequiredCard.tsx"
type: "code"
community: "Action Center UI"
location: "L18"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Action_Center_UI
---

# SEVERITY_RANK

## Connections
- [[AttentionRequiredCard.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/dashboard/AttentionRequiredCard.tsx` **(starting line 18):**
```tsx
const SEVERITY_RANK: Record<AttentionAlert["severity"], number> = { critical: 0, attention: 1, info: 2 };
```

#graphify/code #graphify/EXTRACTED #community/Action_Center_UI