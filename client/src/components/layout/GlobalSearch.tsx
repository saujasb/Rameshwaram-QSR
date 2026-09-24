import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Permission } from "@shared/auth";
import { apiGet } from "../../lib/api/client";
import { useAuth } from "../../lib/auth/AuthContext";

interface SearchResult {
  id: string;
  title: string;
  moduleLabel: string;
  path: string;
}

interface Source {
  resource: string;
  permission: Permission;
  moduleLabel: string;
  path: string;
  titleOf: (record: any) => string;
}

const SOURCES: Source[] = [
  { resource: "wastage", permission: "operations.view", moduleLabel: "Wastage", path: "/wastage", titleOf: (r) => r.itemName },
  { resource: "tasks", permission: "operations.view", moduleLabel: "Task / SPO", path: "/tasks", titleOf: (r) => r.name },
  { resource: "inventory", permission: "operations.view", moduleLabel: "Inventory", path: "/inventory", titleOf: (r) => r.name },
  { resource: "purchases", permission: "operations.view", moduleLabel: "Purchase", path: "/purchases", titleOf: (r) => `${r.item} — ${r.supplierName}` },
  { resource: "suppliers", permission: "operations.view", moduleLabel: "Supplier", path: "/suppliers", titleOf: (r) => r.name },
  { resource: "maintenance", permission: "operations.view", moduleLabel: "Maintenance", path: "/maintenance", titleOf: (r) => `${r.equipment} — ${r.location}` },
  { resource: "complaints", permission: "operations.view", moduleLabel: "Complaint", path: "/complaints", titleOf: (r) => `${r.customerName || "Guest"} — ${r.issueType}` },
  { resource: "staff", permission: "people.view", moduleLabel: "Staff", path: "/staff", titleOf: (r) => r.name },
  { resource: "expenses", permission: "finance.view", moduleLabel: "Expense", path: "/expenses", titleOf: (r) => r.description },
  { resource: "orders", permission: "orders.view", moduleLabel: "Order", path: "/orders", titleOf: (r) => `${r.channel} — ${r.itemsSummary}` },
];

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState<SearchResult[] | null>(null);
  const navigate = useNavigate();
  const { can } = useAuth();

  useEffect(() => {
    if (index !== null) return;
    Promise.all(
      // Only search what this user is allowed to open (the API would refuse the rest anyway).
      SOURCES.filter((s) => can(s.permission)).map((s) =>
        apiGet<any[]>(`/${s.resource}`)
          .then((records) => records.map((r) => ({ id: r.id, title: s.titleOf(r) || "(untitled)", moduleLabel: s.moduleLabel, path: s.path })))
          .catch(() => [])
      )
    ).then((groups) => setIndex(groups.flat()));
  }, [index, can]);

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
