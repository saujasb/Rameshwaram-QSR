---
source_file: "client/src/modules/ramesh/RameshWidget.tsx"
type: "code"
community: "Ramesh Chat Widget"
location: "L166"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_Chat_Widget
---

# onKeyDown()

## Connections
- [[RameshWidget()]] - `contains` [EXTRACTED]
- [[submit()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/modules/ramesh/RameshWidget.tsx` **(starting line 166):**
```tsx
  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(draft);
    }
  }
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_Chat_Widget