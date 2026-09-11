---
source_file: "client/src/components/layout/AppShell.tsx"
type: "code"
community: "App Shell & Bootstrap"
location: "L10"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/App_Shell__Bootstrap
---

# useTheme()

## Connections
- [[AppShell()]] - `calls` [EXTRACTED]
- [[AppShell.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/components/layout/AppShell.tsx` **(starting line 10):**
```tsx
function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() => (localStorage.getItem("theme") as "light" | "dark") ?? "light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  return { theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) };
}
```

#graphify/code #graphify/EXTRACTED #community/App_Shell__Bootstrap