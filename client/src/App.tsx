import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { flatNavItems, type NavItem } from "./routes";
import { useAuth } from "./lib/auth/AuthContext";
import { LoginPage } from "./modules/auth/LoginPage";
import { ChangePasswordPage } from "./modules/auth/ChangePasswordPage";
import { AccessDenied } from "./modules/auth/AccessDenied";
import { SetPasswordPage } from "./modules/auth/SetPasswordPage";
import { takePasswordLinkFromUrl } from "./lib/auth/passwordLink";

// Captured once, before anything renders, so the link's one-time token is
// taken out of the address bar immediately.
const initialPasswordLink = takePasswordLinkFromUrl();

function Guarded({ item }: { item: NavItem }) {
  const { can } = useAuth();
  if (can(item.permission)) return item.element;
  // Staff don't have the sales dashboard; send "/" to their first allowed page instead of a dead end.
  if (item.path === "/") {
    const first = flatNavItems.find((i) => !i.hidden && can(i.permission));
    if (first) return <Navigate to={first.path} replace />;
  }
  return <AccessDenied />;
}

export default function App() {
  const { status, user } = useAuth();
  const [passwordLink, setPasswordLink] = useState(initialPasswordLink);
  const [loginView, setLoginView] = useState<"signin" | "forgot">("signin");

  // An emailed setup/reset link works whether or not anyone is signed in here.
  if (passwordLink) {
    return (
      <SetPasswordPage
        link={passwordLink}
        onDone={(next) => {
          window.history.replaceState(null, "", "/");
          setLoginView(next === "forgot" ? "forgot" : "signin");
          setPasswordLink(null);
        }}
      />
    );
  }

  // The whole dashboard sits behind sign-in. (The API independently rejects
  // every data request without a valid session, so this is not the only
  // barrier -- a direct URL or API call gets nothing without one.)
  if (status === "loading") {
    return (
      <div className="auth-screen" aria-busy="true">
        <p style={{ color: "var(--muted)" }}>Loading…</p>
      </div>
    );
  }
  if (status === "signed-out" || !user) return <LoginPage initialView={loginView} />;
  if (user.mustChangePassword) return <ChangePasswordPage />;

  return (
    <Routes>
      <Route element={<AppShell />}>
        {flatNavItems.map((item) => (
          <Route key={item.path} path={item.hasSubRoutes ? `${item.path}/*` : item.path} element={<Guarded item={item} />} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
