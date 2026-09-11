---
source_file: "client/src/components/NotConnectedBanner.tsx"
type: "code"
community: "Order Operations Pages"
location: "L3"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Order_Operations_Pages
---

# NotConnectedBanner()

## Connections
- [[DeliveryPage.tsx]] - `imports` [EXTRACTED]
- [[FrontCounterPage.tsx]] - `imports` [EXTRACTED]
- [[KitchenPage.tsx]] - `imports` [EXTRACTED]
- [[NotConnectedBanner.tsx]] - `contains` [EXTRACTED]
- [[OrdersPage.tsx]] - `imports` [EXTRACTED]

## Source
**From** `client/src/components/NotConnectedBanner.tsx` **(starting line 3):**
```tsx
export function NotConnectedBanner({ children }: { children: ReactNode }) {
  return (
    <div className="banner-not-connected">
      <b>Awaiting integration.</b> {children}
    </div>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Order_Operations_Pages