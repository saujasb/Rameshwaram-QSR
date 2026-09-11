---
source_file: "client/src/components/layout/GlobalSearch.tsx"
type: "code"
community: "App Shell & Bootstrap"
location: "L32"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/App_Shell__Bootstrap
---

# GlobalSearch()

## Connections
- [[AppShell.tsx]] - `imports` [EXTRACTED]
- [[GlobalSearch.tsx]] - `contains` [EXTRACTED]
- [[apiGet()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/components/layout/GlobalSearch.tsx` **(starting line 32):**
```tsx
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