import cors from "cors";
import express, { type Express, type NextFunction, type Request, type Response } from "express";
import { wastageRouter } from "./entities/wastage/routes.js";
import { taskRouter } from "./entities/tasks/routes.js";
import { inventoryRouter } from "./entities/inventory/routes.js";
import { inventoryMovementRouter } from "./entities/inventory-movements/routes.js";
import { supplierRouter } from "./entities/suppliers/routes.js";
import { purchaseRouter } from "./entities/purchases/routes.js";
import { maintenanceRouter } from "./entities/maintenance/routes.js";
import { complaintRouter } from "./entities/complaints/routes.js";
import { staffRouter } from "./entities/staff/routes.js";
import { attendanceRouter } from "./entities/attendance/routes.js";
import { expenseRouter } from "./entities/expenses/routes.js";
import { orderRouter } from "./entities/orders/routes.js";
import { salesRouter } from "./entities/sales/routes.js";
import { datasetsRouter } from "./entities/datasets/routes.js";
import { intelligenceRouter } from "./entities/intelligence/routes.js";
import { rameshRouter } from "./entities/ramesh/routes.js";
import { analyticsRouter } from "./entities/analytics/routes.js";
import { actionCenterRouter } from "./shared/actionCenter.js";
import { providerOrdersRouter } from "./entities/provider-orders/routes.js";
import { providerWebhookRouter } from "./entities/provider-orders/webhook.js";
import { uploadsRouter } from "./shared/uploads.js";
import { requireApiAccess } from "./auth/accessPolicy.js";
import { authRouter } from "./auth/routes.js";
import { usersRouter } from "./entities/users/routes.js";
import { summariesRouter } from "./entities/summaries/routes.js";

// Express app only -- no app.listen() here. server/src/index.ts calls
// app.listen() for local dev; api/index.ts exports this same app to Vercel's
// Node runtime, which invokes it directly as a (req, res) handler.
const allowedOrigins = process.env.CLIENT_ORIGIN?.split(",").map((o) => o.trim());

export const app: Express = express();
app.disable("x-powered-by");
app.use(cors({ origin: allowedOrigins ?? true }));
app.use(express.json());

// Every /api request passes this single gate first: it verifies the session
// server-side and checks the caller's role against auth/accessPolicy.ts.
// Unknown /api paths are denied by default. Webhooks and the health check are
// explicitly public there (webhooks authenticate with their own token).
app.use("/api", requireApiAccess);

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/summaries", summariesRouter);

app.use("/api/wastage", wastageRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/inventory-movements", inventoryMovementRouter);
app.use("/api/suppliers", supplierRouter);
app.use("/api/purchases", purchaseRouter);
app.use("/api/maintenance", maintenanceRouter);
app.use("/api/complaints", complaintRouter);
app.use("/api/staff", staffRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/expenses", expenseRouter);
app.use("/api/orders", orderRouter);
app.use("/api/sales", salesRouter);
app.use("/api/datasets", datasetsRouter);
app.use("/api/intelligence", intelligenceRouter);
app.use("/api/ramesh", rameshRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/action-center", actionCenterRouter);
app.use("/api/provider-orders", providerOrdersRouter);
app.use("/api/webhooks", providerWebhookRouter);
app.use("/api/uploads", uploadsRouter);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// Last-resort error handler: log server-side, never leak internals to the client.
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[api] unhandled error:", err instanceof Error ? err.message : err);
  if (res.headersSent) return;
  const status = typeof (err as { status?: unknown })?.status === "number" ? (err as { status: number }).status : 500;
  res.status(status >= 400 && status < 600 ? status : 500).json({ error: status === 400 ? "Bad request." : "Something went wrong." });
});
