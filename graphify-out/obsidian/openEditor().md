---
source_file: "client/src/modules/dashboard/SalesTargetEditor.tsx"
type: "code"
community: "Sales Analytics Charts"
location: "L12"
tags:
  - graphify/code
  - graphify/INFERRED
  - community/Sales_Analytics_Charts
---

# openEditor()

## Connections
- [[useSalesTargetWithEditor()]] - `indirect_call` [INFERRED]

## Source
**From** `client/src/modules/dashboard/SalesTargetEditor.tsx` **(starting line 12):**
```tsx
  function openEditor() {
    setDraft(target?.amount ? String(target.amount) : "");
    setEditing(true);
  }
```

#graphify/code #graphify/INFERRED #community/Sales_Analytics_Charts