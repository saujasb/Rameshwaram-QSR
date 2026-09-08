---
source_file: "client/src/components/layout/GlobalSearch.tsx"
type: "code"
community: "App Shell & Bootstrap"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/App_Shell__Bootstrap
---

# GlobalSearch.tsx

## Connections
- [[AppShell.tsx]] - `imports_from` [EXTRACTED]
- [[GlobalSearch()]] - `contains` [EXTRACTED]
- [[SOURCES]] - `contains` [EXTRACTED]
- [[SearchResult]] - `contains` [EXTRACTED]
- [[Source]] - `contains` [EXTRACTED]
- [[apiclient.ts]] - `imports_from` [EXTRACTED]
- [[apiGet()]] - `imports` [EXTRACTED]

## Source
**Full file:** `client/src/components/layout/GlobalSearch.tsx`
```tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../../lib/api/client";

interface SearchResult {
  id: string;
  title: string;
  moduleLabel: string;
  path: string;
}

interface Source {
  resource: string;
  moduleLabel: string;
  path: string;
  titleOf: (record: any) => string;
}

const SOURCES: Source[] = [
  { resource: "wastage", moduleLabel: "Wastage", path: "/wastage", titleOf: (r) => r.itemName },
  { resource: "tasks", moduleLabel: "Task / SPO", path: "/tasks", titleOf: (r) => r.name },
  { resource: "inventory", moduleLabel: "Inventory", path: "/inventory", titleOf: (r) => r.name },
  { resource: "purchases", moduleLabel: "Purchase", path: "/purchases", titleOf: (r) => `${r.item} — ${r.supplierName}` },
  { resource: "suppliers", moduleLabel: "Supplier", path: "/suppliers", titleOf: (r) => r.name },
  { resource: "maintenance", moduleLabel: "Maintenance", path: "/maintenance", titleOf: (r) => `${r.equipment} — ${r.location}` },
  { resource: "complaints", moduleLabel: "Complaint", path: "/complaints", titleOf: (r) => `${r.customerName || "Guest"} — ${r.issueType}` },
  { resource: "staff", moduleLabel: "Staff", path: "/staff", titleOf: (r) => r.name },
  { resource: "expenses", moduleLabel: "Expense", path: "/expenses", titleOf: (r) => r.description },
  { resource: "orders", moduleLabel: "Order", path: "/orders", titleOf: (r) => `${r.channel} — ${r.itemsSummary}` },
];

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState<SearchResult[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (index !== null) return;
    Promise.all(
      SOURCES.map((s) =>
        apiGet<any[]>(`/${s.resource}`)
          .then((records) => records.map((r) => ({ id: r.id, title: s.titleOf(r) || "(untitled)", moduleLabel: s.moduleLabel, path: s.path })))
          .catch(() => [])
      )
    ).then((groups) => setIndex(groups.flat()));
  }, [index]);

  const results = useMemo(() => {
    if (!query.trim() || !index) return [];
    const q = query.toLowerCase();
    return index.filter((r) => r.title.toLowerCase().includes(q)).slice(0, 20);
  }, [query, index]);

  return (
    <div className="search-box">
      <input
        placeholder="Search employees, orders, tasks, inventory, suppliers…"
        value={query}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onChange={(e) => setQuery(e.target.value)}
      />
      {open && query.trim() && (
        <div className="search-results">
          {results.length === 0 ? (
            <div style={{ padding: "10px 14px", fontSize: 13, color: "var(--muted)" }}>No matches.</div>
          ) : (
            results.map((r) => (
              <a
                key={`${r.moduleLabel}-${r.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setQuery("");
                  setOpen(false);
                  navigate(`${r.path}?focus=${r.id}`);
                }}
                href={`${r.path}?focus=${r.id}`}
              >
                {r.title}
                <span className="muted-tag">{r.moduleLabel}</span>
              </a>
            ))
          )}
        </div>
      )}
    </div>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/App_Shell__Bootstrap