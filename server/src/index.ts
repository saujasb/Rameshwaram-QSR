import cors from "cors";
import express from "express";
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

const allowedOrigins = process.env.CLIENT_ORIGIN?.split(",").map((o) => o.trim());

const app = express();
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

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

const PORT = Number(process.env.PORT ?? 4300);
app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});
