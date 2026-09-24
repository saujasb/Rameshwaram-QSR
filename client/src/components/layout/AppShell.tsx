import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { navGroups } from "../../routes";
import { GlobalSearch } from "./GlobalSearch";
import { getCurrentBusinessDate, formatBusinessDateLong } from "@shared/businessDate";
import { useHealthCheck } from "../../lib/api/system";
import { useLatestImportBatch } from "../../lib/api/datasets";
import { RameshWidget } from "../../modules/ramesh/RameshWidget";

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() => (localStorage.getItem("theme") as "light" | "dark") ?? "light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  return { theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) };
}

function useLiveBusinessDate() {
  const [date, setDate] = useState(() => getCurrentBusinessDate());
  useEffect(() => {
    const id = setInterval(() => setDate(getCurrentBusinessDate()), 60000);
    return () => clearInterval(id);
  }, []);
  return date;
}

function OpsStatusStrip() {
  const businessDate = useLiveBusinessDate();
  const { data: health, isLoading: healthLoading, isError: healthError } = useHealthCheck();
  const { data: latestBatch } = useLatestImportBatch();
  const isLive = !healthLoading && !healthError && Boolean(health?.ok);
  const liveTone = healthLoading ? "notconn" : isLive ? "good" : "crit";

  return (
    <div className="ops-status">
      <span className="ops-status-item">
        <span className="ops-status-label">Business Date</span> {formatBusinessDateLong(businessDate)}
      </span>
      <span className="ops-status-sep" aria-hidden>·</span>
      <span className={`ops-status-item ops-live ${liveTone}`}>
        <span className={`status-dot ${liveTone}`} />
        {healthLoading ? "Connecting…" : isLive ? "Live" : "Offline"}
      </span>
      <span className="ops-status-sep" aria-hidden>·</span>
      <span className="ops-status-item">
        <span className="ops-status-label">Last sales sync</span>{" "}
        {latestBatch ? new Date(latestBatch.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "never"}
      </span>
    </div>
  );
}

export function AppShell() {
  const { theme, toggle } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="brand-block">
          <img className="brand-logo-img" src="/branding/brand-lockup.png" alt="The Rameshwaram Café" />
          <div className="brand-title">Master Tracking</div>
          <div className="brand-sub">Aikyam · Brookefield</div>
        </div>
        {navGroups.map((group) => (
          <div className="nav-group" key={group.label}>
            <div className="nav-group-label">{group.label}</div>
            {group.items.filter((item) => !item.hidden).map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="nav-icon" size={16} strokeWidth={1.9} aria-hidden /> {item.label}
              </NavLink>
            ))}
          </div>
        ))}
        <div className="sidebar-kolam" aria-hidden />
      </aside>

      <div className="main-col">
        <div className="topbar">
          <button className="hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open navigation">☰</button>
          <OpsStatusStrip />
          <GlobalSearch />
          <button className="theme-toggle" onClick={toggle}>◐ {theme === "dark" ? "Dark" : "Light"}</button>
        </div>
        <div className="content">
          <Outlet />
        </div>
        <RameshWidget />
      </div>
    </div>
  );
}
