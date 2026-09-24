import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, LogOut, Users } from "lucide-react";
import { ROLE_LABELS } from "@shared/auth";
import { useAuth } from "../../lib/auth/AuthContext";
import { SummarizeModal } from "../../modules/summaries/SummarizeModal";

export function UserMenu() {
  const { user, can, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  if (!user) return null;
  const initials = (user.fullName || user.username).split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="user-menu" ref={ref}>
      <button className="user-menu-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu">
        <span className="user-avatar" aria-hidden>{initials}</span>
        <span className="user-menu-name">{user.fullName || user.username}</span>
      </button>
      {open && (
        <div className="card user-menu-pop" role="menu">
          <div className="user-menu-head">
            <div style={{ fontWeight: 600 }}>{user.fullName || user.username}</div>
            <div style={{ color: "var(--muted)", fontSize: 12 }}>
              @{user.username} · {ROLE_LABELS[user.role]}
            </div>
          </div>
          {can("summary.request") && (
            <button className="user-menu-item" role="menuitem" onClick={() => { setOpen(false); setSummarizing(true); }}>
              <FileText size={15} aria-hidden /> Summarize data
            </button>
          )}
          {can("users.manage") && (
            <button className="user-menu-item" role="menuitem" onClick={() => { setOpen(false); navigate("/settings/users"); }}>
              <Users size={15} aria-hidden /> User management
            </button>
          )}
          <button className="user-menu-item" role="menuitem" onClick={() => void logout()}>
            <LogOut size={15} aria-hidden /> Sign out
          </button>
        </div>
      )}
      {summarizing && <SummarizeModal onClose={() => setSummarizing(false)} />}
    </div>
  );
}
