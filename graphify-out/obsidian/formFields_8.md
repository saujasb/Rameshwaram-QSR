---
source_file: "client/src/modules/front-counter/FrontCounterPage.tsx"
type: "code"
community: "Order Operations Pages"
location: "L26"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Order_Operations_Pages
---

# formFields

## Connections
- [[FrontCounterPage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/front-counter/FrontCounterPage.tsx` **(starting line 26):**
```tsx
const formFields: FormFieldConfig[] = [
  { key: "channel", label: "Channel", type: "select", required: true, options: CHANNEL_OPTIONS.filter((o) => o.value !== "delivery") },
```

#graphify/code #graphify/EXTRACTED #community/Order_Operations_Pages