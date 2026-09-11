---
source_file: "client/src/modules/sales-analytics/SalesImportPage.tsx"
type: "code"
community: "Sales Import UI"
location: "L8"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_UI
---

# IMPORT_STEPS

## Connections
- [[SalesImportPage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/sales-analytics/SalesImportPage.tsx` **(starting line 8):**
```tsx
const IMPORT_STEPS = ["Reading PDF", "Extracting transactions", "Validating data", "Calculating business dates", "Checking duplicates", "Updating dashboard"];

function useStagedProgress(active: boolean, stepCount: number, stepDurationMs = 850): number {
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

#graphify/code #graphify/EXTRACTED #community/Sales_Import_UI