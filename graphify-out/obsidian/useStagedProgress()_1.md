---
source_file: "client/src/modules/import/ImportCenterPage.tsx"
type: "code"
community: "Data Explorer & Import UI"
location: "L29"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# useStagedProgress()

## Connections
- [[ImportCenterPage()]] - `calls` [EXTRACTED]
- [[ImportCenterPage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/import/ImportCenterPage.tsx` **(starting line 29):**
```tsx
function useStagedProgress(active: boolean, stepCount: number, stepDurationMs = 750): number {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!active) {
      setStep(0);
      return;
    }
    const id = setInterval(() => setStep((s) => Math.min(s + 1, stepCount - 1)), stepDurationMs);
    return () => clearInterval(id);
  }, [active, stepCount, stepDurationMs]);
  return step;
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI