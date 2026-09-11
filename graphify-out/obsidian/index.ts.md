---
source_file: "server/src/index.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# index.ts

## Connections
- [[PORT]] - `contains` [EXTRACTED]
- [[actionCenterRouter]] - `imports` [EXTRACTED]
- [[allowedOrigins]] - `contains` [EXTRACTED]
- [[analyticsroutes.ts]] - `imports_from` [EXTRACTED]
- [[analyticsRouter]] - `imports` [EXTRACTED]
- [[app]] - `contains` [EXTRACTED]
- [[attendanceroutes.ts]] - `imports_from` [EXTRACTED]
- [[attendanceRouter]] - `imports` [EXTRACTED]
- [[complaintRouter]] - `imports` [EXTRACTED]
- [[complaintsroutes.ts]] - `imports_from` [EXTRACTED]
- [[datasetsroutes.ts]] - `imports_from` [EXTRACTED]
- [[datasetsRouter]] - `imports` [EXTRACTED]
- [[expenseRouter]] - `imports` [EXTRACTED]
- [[expensesroutes.ts]] - `imports_from` [EXTRACTED]
- [[intelligenceroutes.ts]] - `imports_from` [EXTRACTED]
- [[intelligenceRouter]] - `imports` [EXTRACTED]
- [[inventory-movementsroutes.ts]] - `imports_from` [EXTRACTED]
- [[inventoryroutes.ts]] - `imports_from` [EXTRACTED]
- [[inventoryMovementRouter]] - `imports` [EXTRACTED]
- [[inventoryRouter]] - `imports` [EXTRACTED]
- [[maintenanceroutes.ts]] - `imports_from` [EXTRACTED]
- [[maintenanceRouter]] - `imports` [EXTRACTED]
- [[orderRouter]] - `imports` [EXTRACTED]
- [[ordersroutes.ts]] - `imports_from` [EXTRACTED]
- [[provider-ordersroutes.ts]] - `imports_from` [EXTRACTED]
- [[providerOrdersRouter]] - `imports` [EXTRACTED]
- [[providerWebhookRouter]] - `imports` [EXTRACTED]
- [[purchaseRouter]] - `imports` [EXTRACTED]
- [[purchasesroutes.ts]] - `imports_from` [EXTRACTED]
- [[rameshroutes.ts]] - `imports_from` [EXTRACTED]
- [[rameshRouter]] - `imports` [EXTRACTED]
- [[salesroutes.ts]] - `imports_from` [EXTRACTED]
- [[salesRouter]] - `imports` [EXTRACTED]
- [[sharedactionCenter.ts]] - `imports_from` [EXTRACTED]
- [[staffroutes.ts]] - `imports_from` [EXTRACTED]
- [[staffRouter]] - `imports` [EXTRACTED]
- [[supplierRouter]] - `imports` [EXTRACTED]
- [[suppliersroutes.ts]] - `imports_from` [EXTRACTED]
- [[taskRouter]] - `imports` [EXTRACTED]
- [[tasksroutes.ts]] - `imports_from` [EXTRACTED]
- [[wastageroutes.ts]] - `imports_from` [EXTRACTED]
- [[wastageRouter]] - `imports` [EXTRACTED]
- [[webhook.ts]] - `imports_from` [EXTRACTED]

## Source
**Full file:** `server/src/index.ts`
```typescript
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
import { providerOrdersRouter } from "./entities/provider-orders/routes.js";
import { providerWebhookRouter } from "./entities/provider-orders/webhook.js";

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
app.use("/api/provider-orders", providerOrdersRouter);
app.use("/api/webhooks", providerWebhookRouter);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

const PORT = Number(process.env.PORT ?? 4300);
app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend