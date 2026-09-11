---
source_file: "server/src/entities/analytics/actions-data.ts"
type: "code"
community: "Veg Indent & Analytics Engine"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Veg_Indent__Analytics_Engine
---

# actions-data.ts

## Connections
- [[PrioritizedAction]] - `imports` [EXTRACTED]
- [[analyticsroutes.ts]] - `imports_from` [EXTRACTED]
- [[prioritizedActions]] - `contains` [EXTRACTED]
- [[shared-typesanalytics.ts]] - `imports_from` [EXTRACTED]

## Source
**Full file:** `server/src/entities/analytics/actions-data.ts`
```typescript
import type { PrioritizedAction } from "../../../../shared-types/analytics.js";

// Ported verbatim from the real 07-Aug-2026 report's "Today's Prioritised Actions" list.
export const prioritizedActions: PrioritizedAction[] = [
  {
    id: "fix-idli-gram-standards",
    severity: "critical",
    title: "Correct the Button Idli / Lemon Idli gram standards in the software",
    detail:
      "Manager-supplied figures (Button Idli 150g/12pcs, Lemon Idli 170g/14pcs) are exactly swapped versus the report's current master data (170g/150g). A one-time item-master fix — high confidence, no judgment call needed.",
    impact: "Fixes 2 lines, every day",
  },
  {
    id: "reconcile-batter-count",
    severity: "critical",
    title: "Reconcile the batter count",
    detail:
      "Weigh opening carry-over + closing batter and log Dosa / Khali-dosa / Idli lines separately (SOP 5.1). Even with corrected recipe grams, Dosa (−29.8%) and Khali-dosa (+42.9%) still swing hard — that's a logging artefact, fix the count before touching batch sizes.",
    impact: "Stops phantom variance",
  },
  {
    id: "right-size-tomato-bath",
    severity: "serious",
    title: "Right-size Tomato Bath & slow-movers",
    detail:
      "47 plates sold vs 30 kg made. Set par levels from 14-day sales; cook-to-order after lunch (SOP 5.2). Applies to Lemon Rice & Curd Rice too.",
    impact: "~5 kg/day waste",
  },
  {
    id: "lock-countable-count",
    severity: "serious",
    title: "Lock a physical count on countable sweets & water",
    detail:
      "Pootharekulu ran 22% over sales. Open/close two-person count with damage & comp authorised (SOP 5.5). Pure loss, no quality upside.",
    impact: "₹500+/day recovered",
  },
  {
    id: "ghee-standard-decision",
    severity: "warning",
    title: "Decide ghee standard vs execution — per counter",
    detail:
      "Idli-counter ghee is −6.6 L / −₹4,091 vs recipe; dosa counter is perfect. Either portions are being cut (brand risk) or the standard is wrong. Standardise the ladle and re-base (SOP 5.3).",
    impact: "₹4,000/day clarity",
  },
  {
    id: "fill-comp-staff-usage",
    severity: "info",
    title: "Fill complimentary & staff-usage every close",
    detail:
      "Those columns are blank today, so legitimate comps/staff meals show up as variance and muddy every number above (SOP 5.6).",
    impact: "Clean data",
  },
];
```

#graphify/code #graphify/EXTRACTED #community/Veg_Indent__Analytics_Engine