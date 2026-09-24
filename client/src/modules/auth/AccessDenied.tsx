import { Link } from "react-router-dom";
import { ROLE_LABELS } from "@shared/auth";
import { useAuth } from "../../lib/auth/AuthContext";

export function AccessDenied() {
  const { user } = useAuth();
  return (
    <div className="card" role="alert">
      <h3>You don't have access to this page</h3>
      <p className="h3sub">
        Your role ({user ? ROLE_LABELS[user.role] : "unknown"}) doesn't include this area. If you need it, ask an admin to
        change your role.
      </p>
      <Link className="btn" to="/">
        Go to your home page
      </Link>
    </div>
  );
}
