---
source_file: "client/src/components/layout/AppShell.tsx"
type: "code"
community: "App Shell & Bootstrap"
location: "L54"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/App_Shell__Bootstrap
---

# AppShell()

## Connections
- [[App.tsx]] - `imports` [EXTRACTED]
- [[AppShell.tsx]] - `contains` [EXTRACTED]
- [[useTheme()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/components/layout/AppShell.tsx` **(starting line 54):**
```tsx
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
            {group.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="nav-icon" aria-hidden>{item.icon}</span> {item.label}
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
```

#graphify/code #graphify/EXTRACTED #community/App_Shell__Bootstrap