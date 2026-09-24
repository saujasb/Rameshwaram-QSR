import { Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { flatNavItems } from "./routes";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        {flatNavItems.map((item) => (
          <Route key={item.path} path={item.hasSubRoutes ? `${item.path}/*` : item.path} element={item.element} />
        ))}
      </Route>
    </Routes>
  );
}
