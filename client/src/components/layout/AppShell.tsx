import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { navGroups } from "../../routes";
import { GlobalSearch } from "./GlobalSearch";

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() => (localStorage.getItem("theme") as "light" | "dark") ?? "light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  return { theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) };
}

export function AppShell() {
  const { theme, toggle } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="brand-badge">Aikyam · The Rameshwaram Café</div>
        <div className="brand-title">Master Tracking Dashboard</div>
        {navGroups.map((group) => (
          <div className="nav-group" key={group.label}>
            <div className="nav-group-label">{group.label}</div>
            {group.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span aria-hidden>{item.icon}</span> {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </aside>

      <div className="main-col">
        <div className="topbar">
          <button className="hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open navigation">☰</button>
          <GlobalSearch />
          <button className="theme-toggle" onClick={toggle}>◐ {theme === "dark" ? "Dark" : "Light"}</button>
        </div>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
