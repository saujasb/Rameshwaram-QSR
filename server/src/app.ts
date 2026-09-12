import cors from "cors";
import express, { type Express } from "express";
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

// Stage 4: this module is the single source of truth for the Express
// application -- both the local dev entry point (src/index.ts, via
// app.listen()) and the Vercel serverless entry point (api/index.ts, which
// hands this same `app` to the platform's Node.js request bridge) import it
// from here. Route definitions must never be duplicated between entry points.
//
// CORS: CLIENT_ORIGIN is comma-split into an explicit allow-list, same as
// before Stage 4. On Vercel, the frontend and API are served from the same
// origin (see vercel.json's /api rewrite), so browser requests from the
// dashboard itself don't go through CORS at all -- this setting only matters
// for a frontend deployed to a *different* origin (e.g. the existing Netlify
// site during the migration window, or a future external integration) and
// must stay configurable via CLIENT_ORIGIN rather than hard-coded. Provider
// webhooks (Petpooja/GoSelfServe) are server-to-server calls with no Origin
// header semantics that browsers enforce, so CORS policy never affects them.
const allowedOrigins = process.env.CLIENT_ORIGIN?.split(",").map((o) => o.trim());

const app: Express = express();
app.use(cors({ origin: allowedOrigins ?? true }));
app.use(express.json());

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

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

export default app;
