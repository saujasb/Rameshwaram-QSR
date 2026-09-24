import { useState, type FormEvent } from "react";
import {
  MIN_PASSWORD_LENGTH,
  ROLE_DESCRIPTIONS,
  ROLE_LABELS,
  ROLES,
  type ManagedUser,
  type Role,
} from "@shared/auth";
import { Modal } from "../../components/Modal";
import { useAuth } from "../../lib/auth/AuthContext";
import { useCreateUser, useManagedUsers, useResetUserPassword, useUpdateUser } from "../../lib/api/users";

const MUTED = { color: "var(--muted)", fontSize: 12.5 } as const;

function formatWhen(iso: string | null): string {
  if (!iso) return "Never";
  return new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

/** A readable random temporary password the admin can pass on; the user must change it at first sign-in. */
function generateTempPassword(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const bytes = new Uint32Array(14);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

function RoleSelect({ value, onChange, disabled, id }: { value: Role; onChange: (r: Role) => void; disabled?: boolean; id: string }) {
  return (
    <>
      <select id={id} value={value} disabled={disabled} onChange={(e) => onChange(e.target.value as Role)}>
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {ROLE_LABELS[r]}
          </option>
        ))}
      </select>
      <span style={MUTED}>{ROLE_DESCRIPTIONS[value]}</span>
    </>
  );
}

function UserForm({ user, onDone }: { user?: ManagedUser; onDone: () => void }) {
  const { user: me } = useAuth();
  const create = useCreateUser();
  const update = useUpdateUser();
  const isSelf = user?.id === me?.id;

  const [username, setUsername] = useState(user?.username ?? "");
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [role, setRole] = useState<Role>(user?.role ?? "staff");
  const [password, setPassword] = useState(() => (user ? "" : generateTempPassword()));
  const [created, setCreated] = useState<{ username: string; password: string } | null>(null);

  const mutation = user ? update : create;

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (user) {
      await update.mutateAsync({ id: user.id, fullName, email: email.trim() || null, phone: phone.trim() || null, ...(isSelf ? {} : { role }) });
      onDone();
    } else {
      const u = await create.mutateAsync({ username: username.trim().toLowerCase(), fullName, email: email.trim() || null, phone: phone.trim() || null, role, password });
      setCreated({ username: u.username, password });
    }
  }

  if (created) {
    return (
      <div>
        <p>
          <b>{created.username}</b> can now sign in. Share this temporary password with them privately — it is not shown again,
          and they'll be asked to choose their own at first sign-in.
        </p>
        <pre style={{ fontSize: 16, padding: 12, background: "var(--line)", borderRadius: 8, userSelect: "all" }}>{created.password}</pre>
        <div className="btn-row">
          <button className="btn primary" onClick={onDone}>
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => void submit(e).catch(() => {})} noValidate>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="um-username">Username</label>
          <input
            id="um-username"
            value={username}
            disabled={Boolean(user)}
            autoCapitalize="none"
            spellCheck={false}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            placeholder="e.g. ravi.k"
          />
          {!user && <span style={MUTED}>3–32 characters: a–z, 0–9, dot, dash, underscore. Can't be changed later.</span>}
        </div>
        <div className="field">
          <label htmlFor="um-name">Name</label>
          <input id="um-name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="um-email">Email (optional)</label>
          <input id="um-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
        </div>
        <div className="field">
          <label htmlFor="um-phone">Mobile / WhatsApp (optional)</label>
          <input id="um-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+919876543210" />
        </div>
        <div className="field">
          <label htmlFor="um-role">Role</label>
          <RoleSelect id="um-role" value={role} onChange={setRole} disabled={isSelf} />
          {isSelf && <span style={MUTED}>You can't change your own role.</span>}
        </div>
        {!user && (
          <div className="field">
            <label htmlFor="um-password">Temporary password</label>
            <input id="um-password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="off" spellCheck={false} />
            <span style={MUTED}>At least {MIN_PASSWORD_LENGTH} characters. They'll set their own at first sign-in.</span>
          </div>
        )}
      </div>
      {mutation.isError && (
        <p role="alert" style={{ color: "var(--critical)", fontSize: 13 }}>
          {(mutation.error as Error).message}
        </p>
      )}
      <div className="btn-row">
        <button className="btn primary" type="submit" disabled={mutation.isPending || !fullName.trim() || (!user && (!username.trim() || password.length < MIN_PASSWORD_LENGTH))}>
          {mutation.isPending ? "Saving…" : user ? "Save changes" : "Add user"}
        </button>
        <button className="btn" type="button" onClick={onDone}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function ResetPassword({ user, onDone }: { user: ManagedUser; onDone: () => void }) {
  const reset = useResetUserPassword();
  const [password] = useState(generateTempPassword);
  if (reset.isSuccess) {
    return (
      <div>
        <p>
          New temporary password for <b>{user.username}</b>. Their other sessions were signed out; they'll choose a new password at
          next sign-in.
        </p>
        <pre style={{ fontSize: 16, padding: 12, background: "var(--line)", borderRadius: 8, userSelect: "all" }}>{password}</pre>
        <div className="btn-row">
          <button className="btn primary" onClick={onDone}>
            Done
          </button>
        </div>
      </div>
    );
  }
  return (
    <div>
      <p>
        Give <b>{user.fullName || user.username}</b> a new temporary password? They'll be signed out everywhere.
      </p>
      {reset.isError && <p role="alert" style={{ color: "var(--critical)", fontSize: 13 }}>{(reset.error as Error).message}</p>}
      <div className="btn-row">
        <button className="btn primary" disabled={reset.isPending} onClick={() => reset.mutate({ id: user.id, password })}>
          {reset.isPending ? "Resetting…" : "Reset password"}
        </button>
        <button className="btn" onClick={onDone}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export function UserManagement() {
  const { user: me } = useAuth();
  const { data: users, isLoading, isError, error } = useManagedUsers();
  const update = useUpdateUser();
  const [editing, setEditing] = useState<ManagedUser | "new" | null>(null);
  const [resetting, setResetting] = useState<ManagedUser | null>(null);

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h3>User Management</h3>
          <p className="h3sub">Who can sign in to the dashboard, and what each person can see and change.</p>
        </div>
        <button className="btn primary" onClick={() => setEditing("new")}>
          Add user
        </button>
      </div>

      {isLoading && <p style={MUTED}>Loading users…</p>}
      {isError && <p role="alert" style={{ color: "var(--critical)" }}>{(error as Error).message}</p>}
      {update.isError && <p role="alert" style={{ color: "var(--critical)", fontSize: 13 }}>{(update.error as Error).message}</p>}

      {users && (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Mobile / WhatsApp</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last login</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSelf = u.id === me?.id;
                return (
                  <tr key={u.id} style={u.isActive ? undefined : { opacity: 0.6 }}>
                    <td>
                      {u.fullName || "—"}
                      {isSelf && <span style={{ ...MUTED, marginLeft: 6 }}>(you)</span>}
                    </td>
                    <td>{u.username}</td>
                    <td>{u.email ?? "—"}</td>
                    <td>{u.phone ?? "—"}</td>
                    <td>{ROLE_LABELS[u.role]}</td>
                    <td>
                      <span className={`pill ${u.isActive ? "good" : "notconn"}`} style={{ marginTop: 0 }}>
                        {u.isActive ? (u.mustChangePassword ? "Active · temp password" : "Active") : "Deactivated"}
                      </span>
                    </td>
                    <td>{formatWhen(u.lastLoginAt)}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <button className="btn small" onClick={() => setEditing(u)}>
                        Edit
                      </button>{" "}
                      <button className="btn small" onClick={() => setResetting(u)}>
                        Reset password
                      </button>{" "}
                      {!isSelf && (
                        <button
                          className="btn small"
                          disabled={update.isPending}
                          onClick={() => update.mutate({ id: u.id, isActive: !u.isActive })}
                        >
                          {u.isActive ? "Deactivate" : "Activate"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="callout" style={{ marginTop: 14 }}>
        <b>Roles.</b>{" "}
        {ROLES.map((r) => (
          <span key={r} style={{ display: "block", marginTop: 4 }}>
            <b>{ROLE_LABELS[r]}</b> — {ROLE_DESCRIPTIONS[r]}
          </span>
        ))}
      </div>

      {editing && (
        <Modal title={editing === "new" ? "Add user" : `Edit ${editing.username}`} onClose={() => setEditing(null)}>
          <UserForm user={editing === "new" ? undefined : editing} onDone={() => setEditing(null)} />
        </Modal>
      )}
      {resetting && (
        <Modal title="Reset password" onClose={() => setResetting(null)}>
          <ResetPassword user={resetting} onDone={() => setResetting(null)} />
        </Modal>
      )}
    </div>
  );
}
