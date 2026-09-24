// Roles & permissions shared by server (enforcement) and client (hiding nav).
//
// The server is the only place these are *enforced* (server/src/auth/
// accessPolicy.ts). The client uses the same map purely to avoid showing
// links a user can't use -- hiding UI is never the security boundary.
//
// To add a finer-grained permission later: add it to PERMISSIONS, grant it to
// roles in ROLE_PERMISSIONS, and reference it from an access-policy rule.

export const ROLES = ["admin", "manager", "staff", "viewer"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  manager: "Manager",
  staff: "Staff",
  viewer: "Viewer",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  admin: "Full access, including Settings and User Management.",
  manager: "All dashboard, sales, order and operations areas. Cannot manage users or system settings.",
  staff: "Operational areas only: orders, kitchen, tasks, inventory, wastage, maintenance, complaints.",
  viewer: "Read-only access to the dashboard, sales, orders and analytics. Cannot change anything.",
};

export const PERMISSIONS = [
  "dashboard.view",
  "sales.view",
  "analytics.view",
  "orders.view",
  "orders.edit",
  "operations.view",
  "operations.edit",
  "people.view",
  "people.edit",
  "finance.view",
  "finance.edit",
  "targets.edit",
  "data.import",
  "data.export",
  "assistant.use",
  "summary.request",
  "settings.view",
  "settings.manage",
  "users.manage",
] as const;
export type Permission = (typeof PERMISSIONS)[number];

const VIEW_ONLY: Permission[] = [
  "dashboard.view",
  "sales.view",
  "analytics.view",
  "orders.view",
  "operations.view",
  "people.view",
  "finance.view",
  "data.export",
  "assistant.use",
  "summary.request",
];

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  admin: PERMISSIONS,
  manager: PERMISSIONS.filter((p) => p !== "users.manage" && p !== "settings.manage"),
  staff: ["orders.view", "orders.edit", "operations.view", "operations.edit"],
  viewer: VIEW_ONLY,
};

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

export function permissionsForRole(role: Role): Permission[] {
  return [...ROLE_PERMISSIONS[role]];
}

export function roleHasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

/** The signed-in user as the client sees them (from GET /api/auth/me). */
export interface AuthUser {
  id: string;
  username: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  role: Role;
  mustChangePassword: boolean;
  permissions: Permission[];
}

/**
 * Which login methods the login screen offers. Driven by server-side env
 * flags (AUTH_EMAIL_OTP_ENABLED / AUTH_PHONE_OTP_ENABLED), so enabling OTP
 * later needs no client rebuild or code change.
 */
export interface LoginMethods {
  password: boolean;
  emailOtp: boolean;
  phoneOtp: boolean;
  /** "sms" or "whatsapp" -- which channel phone OTP is delivered on. */
  phoneOtpChannel: "sms" | "whatsapp";
}

export const USERNAME_PATTERN = /^[a-z0-9][a-z0-9._-]{2,31}$/;
export const PHONE_PATTERN = /^\+[1-9][0-9]{7,14}$/;
export const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
export const MIN_PASSWORD_LENGTH = 10;

/** A row in Settings -> User Management. */
export interface ManagedUser {
  id: string;
  username: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  role: Role;
  isActive: boolean;
  mustChangePassword: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  username: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  role: Role;
  /** Temporary password; the user is asked to change it on first login. */
  password: string;
}

export interface UpdateUserInput {
  fullName?: string;
  email?: string | null;
  phone?: string | null;
  role?: Role;
  isActive?: boolean;
}
