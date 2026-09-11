---
source_file: "client/src/components/layout/AppShell.tsx"
type: "code"
community: "App Shell & Bootstrap"
location: "L19"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/App_Shell__Bootstrap
---

# useLiveBusinessDate()

## Connections
- [[AppShell.tsx]] - `contains` [EXTRACTED]
- [[OpsStatusStrip()]] - `calls` [EXTRACTED]
- [[getCurrentBusinessDate()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/components/layout/AppShell.tsx` **(starting line 19):**
```tsx
function useLiveBusinessDate() {
  const [date, setDate] = useState(() => getCurrentBusinessDate());
  useEffect(() => {
    const id = setInterval(() => setDate(getCurrentBusinessDate()), 60000);
    return () => clearInterval(id);
  }, []);
  return date;
}
```

#graphify/code #graphify/EXTRACTED #community/App_Shell__Bootstrap