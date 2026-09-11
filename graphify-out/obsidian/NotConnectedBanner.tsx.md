---
source_file: "client/src/components/NotConnectedBanner.tsx"
type: "code"
community: "Order Operations Pages"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Order_Operations_Pages
---

# NotConnectedBanner.tsx

## Connections
- [[DeliveryPage.tsx]] - `imports_from` [EXTRACTED]
- [[FrontCounterPage.tsx]] - `imports_from` [EXTRACTED]
- [[KitchenPage.tsx]] - `imports_from` [EXTRACTED]
- [[NotConnectedBanner()]] - `contains` [EXTRACTED]
- [[OrdersPage.tsx]] - `imports_from` [EXTRACTED]

## Source
**Full file:** `client/src/components/NotConnectedBanner.tsx`
```tsx
import type { ReactNode } from "react";

export function NotConnectedBanner({ children }: { children: ReactNode }) {
  return (
    <div className="banner-not-connected">
      <b>Awaiting integration.</b> {children}
    </div>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Order_Operations_Pages