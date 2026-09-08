---
source_file: "server/src/entities/analytics/data.ts"
type: "code"
community: "Veg Indent & Analytics Engine"
location: "L6"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Veg_Indent__Analytics_Engine
---

# analyticsSnapshot

## Connections
- [[analyticsroutes.ts]] - `imports` [EXTRACTED]
- [[data.ts]] - `contains` [EXTRACTED]
- [[run.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/analytics/data.ts` **(starting line 6):**
```typescript
export const analyticsSnapshot: AnalyticsSnapshot = {
  reportDate: "2026-08-07",
  vegIndentRequirementDate: "2026-08-10",
  vegIndentOrderDate: "2026-08-11",
  itemsSold: 6214,
  productionKg: 794.8,
  wastagePct: 3.62,
  wastageKg: 28.77,
  varianceBreaches: 6,
  recipeVsActualRupees: -7709,

  variance: [
    { name: "Khara Bath", producedKg: 28.7, consumedKg: 26.78, soldPlates: 162, netDiffKg: -0.76, variancePct: -2.8 },
    { name: "Kesari Bath", producedKg: 30.15, consumedKg: 29.35, soldPlates: 195, netDiffKg: -1.85, variancePct: -6.3 },
    { name: "Ven Pongal", producedKg: 42.25, consumedKg: 41.02, soldPlates: 155, netDiffKg: 2.27, variancePct: 5.5 },
    { name: "Puliyogare", producedKg: 37.7, consumedKg: 37.02, soldPlates: 135.5, netDiffKg: -3.63, variancePct: -9.8 },
    { name: "Tomato Bath", producedKg: 30.35, consumedKg: 25.35, soldPlates: 47, netDiffKg: 8.9, variancePct: 35.1 },
    { name: "Bisibele Bhath", producedKg: 40.8, consumedKg: 39.68, soldPlates: 111, netDiffKg: 0.83, variancePct: 2.1 },
    { name: "Lemon Rice", producedKg: 18.8, consumedKg: 16.79, soldPlates: 56, netDiffKg: -0.01, variancePct: -0.05 },
    { name: "Curd Rice", producedKg: 27.55, consumedKg: 25.58, soldPlates: 82, netDiffKg: -3.12, variancePct: -12.2 },
    { name: "Carrot Halwa", producedKg: 14.25, consumedKg: 14.25, soldPlates: 85, netDiffKg: 2.65, variancePct: 18.6 },
    { name: "Idli Batter", producedKg: 192.31, consumedKg: 192.31, soldPlates: 1042, netDiffKg: 36.01, variancePct: 18.7 },
    { name: "Dosa Batter", producedKg: 124.03, consumedKg: 124.03, soldPlates: 1342, netDiffKg: -37.01, variancePct: -29.8 },
    { name: "Khali Dosa Batter", producedKg: 126.5, consumedKg: 122.3, soldPlates: 291, netDiffKg: 52.46, variancePct: 42.9 },
    { name: "Bangalore Idli Batter", producedKg: 81.4, consumedKg: 76.15, soldPlates: 426, netDiffKg: -0.53, variancePct: -0.7 },
  ],

  wastage: [
    { name: "Bangalore Idli Batter", wastageKg: 5.25, topContributor: true },
    { name: "Tomato Bath", wastageKg: 5.0, topContributor: true },
    { name: "Ghee-Sambar Button Idli", wastageKg: 4.6, topContributor: true },
    { name: "Khali Dosa Batter", wastageKg: 4.2, topContributor: true },
    { name: "Lemon Rice", wastageKg: 2.008, topContributor: false },
    { name: "Curd Rice", wastageKg: 1.967, topContributor: false },
    { name: "Khara Bath", wastageKg: 1.92, topContributor: false },
    { name: "Ven Pongal", wastageKg: 1.23, topContributor: false },
    { name: "Bisibele Bhath", wastageKg: 1.12, topContributor: false },
    { name: "Kesari Bath", wastageKg: 0.8, topContributor: false },
    { name: "Puliyogare", wastageKg: 0.677, topContributor: false },
  ],

  channelMix: [
    { name: "PetPooja (counter/POS)", value: 2758 },
    { name: "Kiosk", value: 2241 },
    { name: "Online", value: 1215 },
  ],

  topSellers: [
    { name: "Filter Coffee", unitsSold: 1507 },
    { name: "Masala Tea", unitsSold: 734 },
    { name: "Ghee Pudi Masala Dosa", unitsSold: 618 },
    { name: "Ghee Pudi Idli", unitsSold: 541 },
    { name: "Ghee Sambar Button Idli", unitsSold: 271 },
    { name: "Butter Masala Dosa", unitsSold: 255 },
    { name: "Garlic Roast Dosa", unitsSold: 166 },
    { name: "Mini Masala Dosa", unitsSold: 159 },
    { name: "Ghee Paddu", unitsSold: 151 },
    { name: "Ghee Plain Dosa", unitsSold: 125 },
  ],

  costVariance: [
    { name: "Ghee (Idli Section)", varianceRupees: -4091 },
    { name: "Filter Coffee", varianceRupees: -2358 },
    { name: "Butter", varianceRupees: -1221 },
    { name: "Chutney Pudi", varianceRupees: -724 },
    { name: "Pheni w/ Badam Milk", varianceRupees: -189 },
    { name: "Tea Powder", varianceRupees: -162 },
    { name: "Gulab Jamoon", varianceRupees: -44 },
    { name: "Water 1000ml", varianceRupees: 42 },
    { name: "Badam Powder", varianceRupees: 68 },
    { name: "Boost", varianceRupees: 78 },
    { name: "Ghee Badam Holige", varianceRupees: 120 },
    { name: "Water 500ml", varianceRupees: 21 },
    { name: "Kerala Parota", varianceRupees: 17 },
    { name: "Horlicks", varianceRupees: 220 },
    { name: "Pootharekulu", varianceRupees: 514 },
  ],

  kpiTargets: [
    { kpi: "Wastage % of production", description: "Money cooked and thrown away", target: "<2%", watch: "2–4%", act: ">4%", today: "3.62%", grade: "warn", gradeLabel: "⚠ Watch" },
    { kpi: "Prod-vs-sales variance", description: "Planning accuracy per item", target: "±5%", watch: "±5–10%", act: ">±10%", today: "6 breaches", grade: "crit", gradeLabel: "🔴 Act" },
    { kpi: "Portion adherence (ghee)", description: "Brand consistency & margin", target: "±3%", watch: "±3–7%", act: ">±7%", today: "−10%", grade: "ser", gradeLabel: "🟠 Off-std" },
    { kpi: "Countable-stock shrinkage", description: "Loss / pilferage on RTS items", target: "0%", watch: "1–2%", act: ">2%", today: "+22% (Poothrkl)", grade: "crit", gradeLabel: "🔴 Act" },
    { kpi: "Recipe-vs-actual (₹/day)", description: "Total consumption discipline", target: "±₹1,500", watch: "±1,500–4,000", act: ">±4,000", today: "−₹7,709", grade: "ser", gradeLabel: "🟠 Investigate" },
    { kpi: "Comp / staff logged", description: "Un-booked usage hides variance", target: "100%", watch: "80–99%", act: "<80%", today: "0% (blank)", grade: "crit", gradeLabel: "🔴 Fill in" },
  ],

  vegIndent: [
    { name: "Tomato", matchedLine: "Tomato", unit: "KG", requirement: 80, orderQty: 150, kind: "full", note: null },
    { name: "Drumstick", matchedLine: "Drumstick", unit: "KG", requirement: 15, orderQty: 15, kind: "full", note: null },
    { name: "Cucumber", matchedLine: "Cucumber", unit: "KG", requirement: 2, orderQty: 8, kind: "full", note: null },
    { name: "Capsicum", matchedLine: "Capsicum", unit: "KG", requirement: 3, orderQty: 7, kind: "full", note: null },
    { name: "Carrot", matchedLine: "Carrot", unit: "KG", requirement: 15, orderQty: 30, kind: "full", note: null },
    { name: "Small Onion", matchedLine: "Small onion", unit: "KG", requirement: null, orderQty: null, kind: "blank", note: null },
    { name: "Beans", matchedLine: "Beans", unit: "KG", requirement: 5, orderQty: 15, kind: "full", note: null },
    { name: "Long beans", matchedLine: "Long beans", unit: "BUNCH", requirement: 2, orderQty: 2, kind: "full", note: "Sheet tracks in BUNCH; requirement given in kg — compared by quantity only." },
    { name: "Thondeikai", matchedLine: "Tonde kayi", unit: "KG", requirement: null, orderQty: null, kind: "blank", note: "Matched to 'Tonde kayi' (same vegetable, alt. spelling)." },
    { name: "Beet root", matchedLine: "Beet root", unit: "PCS", requirement: null, orderQty: null, kind: "blank", note: "Sheet UOM is PCS, not kg." },
    { name: "Radish", matchedLine: "Radish", unit: "KG", requirement: null, orderQty: null, kind: "blank", note: null },
    { name: "Knol Kol", matchedLine: "Knol Kol", unit: "KG", requirement: null, orderQty: 1, kind: "blank", note: null },
    { name: "Green chilli", matchedLine: "Green chillies", unit: "KG", requirement: 10, orderQty: 30, kind: "full", note: "Matched to 'Green chillies'; sheet also has a separate 'Green chillies (Cleaned)' line, not used here." },
    { name: "Raw banana", matchedLine: "Raw banana", unit: "KG", requirement: null, orderQty: null, kind: "blank", note: null },
    { name: "Ritch Gourd", matchedLine: "Ritch Gourd", unit: "KG", requirement: 1, orderQty: null, kind: "full", note: null },
    { name: "Bottle gourd", matchedLine: "Bottle gourd", unit: "KG", requirement: null, orderQty: null, kind: "blank", note: null },
    { name: "Manglore southekayi", matchedLine: "manglore southeka", unit: "BUNCH", requirement: null, orderQty: null, kind: "blank", note: null },
    { name: "White pumpkin", matchedLine: "White pumpkin", unit: "BUNCH", requirement: null, orderQty: null, kind: "blank", note: null },
    { name: "Bajji chilli", matchedLine: "Bajji chilli", unit: "KG", requirement: null, orderQty: 1, kind: "blank", note: null },
    { name: "Lemon", matchedLine: "Lemon", unit: "BUNCH", requirement: 10, orderQty: 20, kind: "full", note: "Sheet tracks in BUNCH; requirement given in kg — compared by quantity only." },
    { name: "Ginger big size", matchedLine: "Ginger big size", unit: "KG", requirement: 10, orderQty: 15, kind: "full", note: null },
    { name: "Garlic", matchedLine: "Garlic", unit: "KG", requirement: 15, orderQty: 10, kind: "full", note: null },
    { name: "Raw mango", matchedLine: "Raw mango", unit: "KG", requirement: 4, orderQty: 9, kind: "full", note: null },
    { name: "Corrianderleaves", matchedLine: "Corrianderleaves", unit: "KG", requirement: 80, orderQty: 130, kind: "full", note: "Given as bunches; sheet tracks in KG — compared by quantity only, units differ." },
    { name: "Mint Leaves", matchedLine: "Mint Leaves", unit: "KG", requirement: 20, orderQty: 20, kind: "full", note: "Given as bunches; sheet tracks in KG — compared by quantity only, units differ." },
    { name: "Drumstick leaves", matchedLine: "Drumstick leaves", unit: "KG", requirement: null, orderQty: null, kind: "blank", note: null },
    { name: "Green peas", matchedLine: "Green peas", unit: "KG", requirement: 1, orderQty: 6, kind: "full", note: null },
    { name: "Sweet corn", matchedLine: "Sweet corn", unit: "BUNCH", requirement: 1, orderQty: null, kind: "full", note: "Sheet tracks in BUNCH; requirement given in kg — compared by quantity only." },
    { name: "Banana fruit", matchedLine: "Banana ruit", unit: "BUNCH", requirement: null, orderQty: null, kind: "blank", note: null },
    { name: "Apple", matchedLine: "Apple", unit: "BUNCH", requirement: null, orderQty: null, kind: "blank", note: null },
    { name: "Water melon", matchedLine: null, unit: null, requirement: null, orderQty: null, kind: "none", note: "Not a tracked line item in the indent report." },
    { name: "Musk melon", matchedLine: null, unit: null, requirement: null, orderQty: null, kind: "none", note: "Not a tracked line item in the indent report." },
    { name: "Lady finger", matchedLine: "Lady Finger", unit: "KG", requirement: null, orderQty: null, kind: "blank", note: null },
    { name: "Pommagranate", matchedLine: "Pommagranate", unit: "BUNCH", requirement: 4, orderQty: null, kind: "full", note: null },
    { name: "Pineapple", matchedLine: "Pineapple", unit: "KG", requirement: 1, orderQty: 3, kind: "full", note: "Given as piece; sheet tracks in KG — compared by quantity only, units differ." },
    { name: "Methi leaves", matchedLine: "Methi leaves", unit: "BUNCH", requirement: null, orderQty: null, kind: "blank", note: null },
    { name: "Sabbaki leaves", matchedLine: "Sabbaki leaves", unit: "BUNCH", requirement: 2, orderQty: 8, kind: "full", note: "Likely equivalent unit — compared by quantity only." },
    { name: "Spring onion", matchedLine: "Spring onion", unit: "BUNCH", requirement: 2, orderQty: 11, kind: "full", note: "Likely equivalent unit — compared by quantity only." },
    { name: "Curry leaves", matchedLine: "Curry leaves", unit: "KG", requirement: null, orderQty: 6, kind: "blank", note: null },
    { name: "Long brinjal", matchedLine: "Brinjal", unit: "KG", requirement: null, orderQty: 10, kind: "blank", note: "Sheet has one generic 'Brinjal' line — doesn't distinguish Long vs Round. Not double-counted with Round brinjal." },
    { name: "Avare bele", matchedLine: null, unit: null, requirement: null, orderQty: null, kind: "none", note: "Not a tracked line item in the indent report." },
    { name: "Harvey soppu", matchedLine: "Harvey soppu", unit: "BUNCH", requirement: 15, orderQty: 15, kind: "full", note: null },
    { name: "Red harvey soppu", matchedLine: null, unit: null, requirement: null, orderQty: null, kind: "none", note: "Sheet only tracks generic 'Harvey soppu' — no separate 'Red' variant." },
    { name: "Chow-chow", matchedLine: null, unit: null, requirement: 1, orderQty: null, kind: "none", note: "Not a tracked line item in the indent report." },
    { name: "Mushroom", matchedLine: "Mushroom", unit: "KG", requirement: null, orderQty: null, kind: "blank", note: "Unit given as pkt; sheet tracks in KG." },
    { name: "Round brinjal", matchedLine: "Brinjal", unit: "KG", requirement: null, orderQty: null, kind: "dup", note: "See 'Long brinjal' — same single 'Brinjal' line in sheet, not double-counted." },
    { name: "Palak", matchedLine: "Palak", unit: "KG", requirement: 5, orderQty: 5, kind: "full", note: "Given as pieces; sheet tracks in KG — compared by quantity only, units differ." },
    { name: "Without peeled sambar onion", matchedLine: "Small onion", unit: "KG", requirement: null, orderQty: null, kind: "dup", note: "See 'Small Onion' — same sheet line, not double-counted." },
  ],
};
```

#graphify/code #graphify/EXTRACTED #community/Veg_Indent__Analytics_Engine