import { NavLink, Navigate, useLocation } from "react-router-dom";
import { Activity, Banknote, ChartPie, Layers, UtensilsCrossed, type LucideIcon } from "lucide-react";
import { SalesAnalyticsPage, type SalesView } from "./SalesAnalyticsPage";

const BASE = "/sales-analytics";

const SUB_NAV: { view: SalesView; slug: string; label: string; icon: LucideIcon }[] = [
  { view: "overview", slug: "", label: "Overview", icon: ChartPie },
  { view: "live", slug: "live-feed", label: "Live Feed", icon: Activity },
  { view: "amount", slug: "sales-amount", label: "Sales Amount", icon: Banknote },
  { view: "items", slug: "item-sales", label: "Item Sales", icon: UtensilsCrossed },
  { view: "categories", slug: "category-wise-sales", label: "Category Wise Sales", icon: Layers },
];

/**
 * Sales & Revenue's own vertical sub-navigation beside its content. One route
 * (/sales-analytics/*) -- the view comes from the URL, so SalesAnalyticsPage
 * stays mounted across sub-pages and keeps the selected source.
 */
export function SalesRevenueLayout() {
  const { pathname } = useLocation();
  const slug = pathname.slice(BASE.length).replace(/^\/+|\/+$/g, "");
  const current = SUB_NAV.find((s) => s.slug === slug);
  if (!current) return <Navigate to={BASE} replace />;

  return (
    <div className="subnav-layout">
      <nav className="subnav" aria-label="Sales & Revenue">
        {SUB_NAV.map((s) => (
          <NavLink
            key={s.view}
            to={s.slug ? `${BASE}/${s.slug}` : BASE}
            end
            className={({ isActive }) => `subnav-link${isActive ? " active" : ""}`}
          >
            <s.icon size={16} strokeWidth={1.9} aria-hidden /> {s.label}
          </NavLink>
        ))}
      </nav>
      <div className="subnav-content">
        <SalesAnalyticsPage view={current.view} />
      </div>
    </div>
  );
}
