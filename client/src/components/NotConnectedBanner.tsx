import type { ReactNode } from "react";

export function NotConnectedBanner({ children }: { children: ReactNode }) {
  return (
    <div className="banner-not-connected">
      <b>Awaiting integration.</b> {children}
    </div>
  );
}
