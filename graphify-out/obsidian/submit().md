---
source_file: "client/src/modules/ramesh/RameshWidget.tsx"
type: "code"
community: "Ramesh Chat Widget"
location: "L136"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_Chat_Widget
---

# submit()

## Connections
- [[RameshWidget()]] - `contains` [EXTRACTED]
- [[onKeyDown()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/modules/ramesh/RameshWidget.tsx` **(starting line 136):**
```tsx
  function submit(question: string) {
    const q = question.trim();
    if (!q || ask.isPending) return;
    const stamp = new Date().toISOString();
    setMessages((m) => [...m, { id: `u-${stamp}-${m.length}`, role: "user", text: q, timestamp: stamp }]);
    setDraft("");
    ask.mutate(
      { question: q },
      {
        onSuccess: (answer) => {
          setMessages((m) => [
            ...m,
            { id: `r-${Date.now()}-${m.length}`, role: "ramesh", text: answer.answer, answer, timestamp: new Date().toISOString() },
          ]);
        },
        onError: (err) => {
          setMessages((m) => [
            ...m,
            {
              id: `e-${Date.now()}-${m.length}`,
              role: "ramesh",
              text: err instanceof Error ? err.message : "Something went wrong reaching the data layer.",
              timestamp: new Date().toISOString(),
            },
          ]);
        },
      }
    );
  }
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_Chat_Widget