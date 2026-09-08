---
source_file: "shared-types/entities.ts"
type: "code"
community: "Complaints & Shared Entity Enums"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Complaints__Shared_Entity_Enums
---

# entities.ts

## Connections
- [[ActionCenterItem]] - `contains` [EXTRACTED]
- [[ActionCenterPage.tsx]] - `imports_from` [EXTRACTED]
- [[AttendancePage.tsx]] - `imports_from` [EXTRACTED]
- [[AttendanceRecord]] - `contains` [EXTRACTED]
- [[AttendanceStatus]] - `contains` [EXTRACTED]
- [[BaseRecord]] - `contains` [EXTRACTED]
- [[ComplaintRecord]] - `contains` [EXTRACTED]
- [[ComplaintStatus]] - `contains` [EXTRACTED]
- [[ComplaintsPage.tsx]] - `imports_from` [EXTRACTED]
- [[CrudModulePage.tsx]] - `imports_from` [EXTRACTED]
- [[DeliveryPage.tsx]] - `imports_from` [EXTRACTED]
- [[ExpenseCategory]] - `contains` [EXTRACTED]
- [[ExpenseRecord]] - `contains` [EXTRACTED]
- [[ExpensesPage.tsx]] - `imports_from` [EXTRACTED]
- [[FrontCounterPage.tsx]] - `imports_from` [EXTRACTED]
- [[InventoryDetailModal.tsx]] - `imports_from` [EXTRACTED]
- [[InventoryItem]] - `contains` [EXTRACTED]
- [[InventoryMovement]] - `contains` [EXTRACTED]
- [[InventoryMovementType]] - `contains` [EXTRACTED]
- [[InventoryPage.tsx]] - `imports_from` [EXTRACTED]
- [[InventoryStatus]] - `contains` [EXTRACTED]
- [[KitchenPage.tsx]] - `imports_from` [EXTRACTED]
- [[MaintenanceIssue]] - `contains` [EXTRACTED]
- [[MaintenancePage.tsx]] - `imports_from` [EXTRACTED]
- [[MaintenancePriority]] - `contains` [EXTRACTED]
- [[MaintenanceStatus]] - `contains` [EXTRACTED]
- [[ManualOrderEntry]] - `contains` [EXTRACTED]
- [[OrderChannel]] - `contains` [EXTRACTED]
- [[OrderStatus]] - `contains` [EXTRACTED]
- [[OrdersPage.tsx]] - `imports_from` [EXTRACTED]
- [[Purchase]] - `contains` [EXTRACTED]
- [[PurchaseStatus]] - `contains` [EXTRACTED]
- [[PurchasesPage.tsx]] - `imports_from` [EXTRACTED]
- [[RecordSource]] - `contains` [EXTRACTED]
- [[Shift]] - `contains` [EXTRACTED]
- [[ShiftPerformancePage.tsx]] - `imports_from` [EXTRACTED]
- [[StaffMember]] - `contains` [EXTRACTED]
- [[StaffPage.tsx]] - `imports_from` [EXTRACTED]
- [[StaffRole]] - `contains` [EXTRACTED]
- [[Supplier]] - `contains` [EXTRACTED]
- [[SuppliersPage.tsx]] - `imports_from` [EXTRACTED]
- [[Task]] - `contains` [EXTRACTED]
- [[TaskCategory]] - `contains` [EXTRACTED]
- [[TaskDetailModal.tsx]] - `imports_from` [EXTRACTED]
- [[TaskFrequency]] - `contains` [EXTRACTED]
- [[TaskHistoryEntry]] - `contains` [EXTRACTED]
- [[TaskPriority]] - `contains` [EXTRACTED]
- [[TaskStatus]] - `contains` [EXTRACTED]
- [[TasksPage.tsx]] - `imports_from` [EXTRACTED]
- [[WastageEntry]] - `contains` [EXTRACTED]
- [[WastagePage.tsx]] - `imports_from` [EXTRACTED]
- [[WastageReasonCode]] - `contains` [EXTRACTED]
- [[apiactionCenter.ts]] - `imports_from` [EXTRACTED]
- [[attendancerepository.ts]] - `imports_from` [EXTRACTED]
- [[channelHelpers.ts]] - `imports_from` [EXTRACTED]
- [[complaints.ts]] - `imports_from` [EXTRACTED]
- [[complaintsrepository.ts]] - `imports_from` [EXTRACTED]
- [[createCrudRouter.ts]] - `imports_from` [EXTRACTED]
- [[createEntityHooks.ts]] - `imports_from` [EXTRACTED]
- [[expenses.ts]] - `imports_from` [EXTRACTED]
- [[expensesrepository.ts]] - `imports_from` [EXTRACTED]
- [[inventory-movementsrepository.ts]] - `imports_from` [EXTRACTED]
- [[inventory.ts]] - `imports_from` [EXTRACTED]
- [[inventoryrepository.ts]] - `imports_from` [EXTRACTED]
- [[inventoryStatus.ts]] - `imports_from` [EXTRACTED]
- [[inventoryStatusUi.ts]] - `imports_from` [EXTRACTED]
- [[maintenance.ts]] - `imports_from` [EXTRACTED]
- [[maintenancerepository.ts]] - `imports_from` [EXTRACTED]
- [[orders.ts]] - `imports_from` [EXTRACTED]
- [[ordersrepository.ts]] - `imports_from` [EXTRACTED]
- [[purchases.ts]] - `imports_from` [EXTRACTED]
- [[purchasesrepository.ts]] - `imports_from` [EXTRACTED]
- [[shared-typesproviderOrders.ts]] - `imports_from` [EXTRACTED]
- [[shared-typessales.ts]] - `imports_from` [EXTRACTED]
- [[sharedactionCenter.ts]] - `imports_from` [EXTRACTED]
- [[sharedrepository.ts]] - `imports_from` [EXTRACTED]
- [[staff.ts]] - `imports_from` [EXTRACTED]
- [[staffrepository.ts]] - `imports_from` [EXTRACTED]
- [[suppliers.ts]] - `imports_from` [EXTRACTED]
- [[suppliersrepository.ts]] - `imports_from` [EXTRACTED]
- [[tasks.ts]] - `imports_from` [EXTRACTED]
- [[tasksrepository.ts]] - `imports_from` [EXTRACTED]
- [[tasksroutes.ts]] - `imports_from` [EXTRACTED]
- [[wastage.ts]] - `imports_from` [EXTRACTED]
- [[wastagerepository.ts]] - `imports_from` [EXTRACTED]

## Source
**Full file:** `shared-types/entities.ts`
```typescript
export type RecordSource = "seed" | "manual";

export interface BaseRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type Shift = "opening" | "mid" | "closing";

export type WastageReasonCode =
  | "expired"
  | "overproduction"
  | "spillage"
  | "prep_error"
  | "customer_return"
  | "damaged"
  | "other";

export interface WastageEntry extends BaseRecord {
  itemName: string;
  quantityKg: number;
  reasonCode: WastageReasonCode | null;
  employeeName: string | null;
  shift: Shift | null;
  date: string;
  estimatedCostRupees: number | null;
  notes: string;
  source: RecordSource;
}

export type TaskCategory = "spo" | "hygiene" | "food_quality" | "general";
export type TaskFrequency = "daily" | "weekly" | "monthly" | "once";
export type TaskPriority = "low" | "medium" | "high" | "critical";
export type TaskStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "overdue"
  | "failed"
  | "requires_verification";

export interface TaskHistoryEntry {
  timestamp: string;
  action: string;
  note: string;
}

export interface Task extends BaseRecord {
  name: string;
  category: TaskCategory;
  department: string;
  shift: Shift | "any";
  frequency: TaskFrequency;
  assignedEmployee: string | null;
  dueTime: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  completionTime: string | null;
  notes: string;
  issue: string | null;
  verifiedBy: string | null;
  sopReference: string | null;
  history: TaskHistoryEntry[];
  source: RecordSource;
}

export type InventoryStatus = "not_counted" | "healthy" | "low" | "critical" | "out_of_stock";

export interface InventoryItem extends BaseRecord {
  name: string;
  category: string;
  unit: string;
  parLevel: number | null;
  minLevel: number | null;
  reorderLevel: number | null;
  supplierId: string | null;
  onHandQty: number | null;
  lastCountedAt: string | null;
  source: RecordSource;
}

export type InventoryMovementType = "receive" | "adjustment" | "count" | "wastage_deduction";

export interface InventoryMovement extends BaseRecord {
  itemId: string;
  type: InventoryMovementType;
  quantityDelta: number;
  resultingQty: number;
  note: string;
  employeeName: string;
}

export interface Supplier extends BaseRecord {
  name: string;
  contactPhone: string;
  contactEmail: string;
  notes: string;
}

export type PurchaseStatus = "pending" | "partially_received" | "received";

export interface Purchase extends BaseRecord {
  supplierId: string | null;
  supplierName: string;
  item: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  purchaseDate: string;
  expectedDelivery: string | null;
  receivedQuantity: number;
  invoiceRef: string;
  status: PurchaseStatus;
}

export type MaintenancePriority = "low" | "medium" | "high" | "critical";
export type MaintenanceStatus = "open" | "assigned" | "in_progress" | "waiting" | "resolved";

export interface MaintenanceIssue extends BaseRecord {
  equipment: string;
  location: string;
  issueDescription: string;
  priority: MaintenancePriority;
  reportedBy: string;
  assignedTo: string | null;
  dateReported: string;
  expectedResolution: string | null;
  cost: number | null;
  status: MaintenanceStatus;
}

export type ComplaintStatus = "new" | "investigating" | "resolved" | "escalated";

export interface ComplaintRecord extends BaseRecord {
  customerName: string;
  orderRef: string;
  issueType: string;
  description: string;
  ratingOutOf5: number | null;
  employeeInvolved: string;
  assignedManager: string;
  resolution: string;
  resolutionTime: string | null;
  status: ComplaintStatus;
  date: string;
}

export type StaffRole =
  | "store_manager"
  | "shift_manager"
  | "cashier"
  | "kitchen_staff"
  | "prep_staff"
  | "service_staff"
  | "cleaning_staff"
  | "delivery_staff";

export interface StaffMember extends BaseRecord {
  name: string;
  role: StaffRole;
  department: string;
  phone: string;
  active: boolean;
}

export type AttendanceStatus = "present" | "absent" | "late" | "on_break";

export interface AttendanceRecord extends BaseRecord {
  staffId: string;
  date: string;
  shift: Shift;
  scheduled: boolean;
  status: AttendanceStatus;
  shiftStart: string | null;
  shiftEnd: string | null;
  notes: string;
}

export type ExpenseCategory =
  | "food_cost"
  | "labour"
  | "utilities"
  | "rent"
  | "maintenance"
  | "marketing"
  | "other";

export interface ExpenseRecord extends BaseRecord {
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string;
  paymentMethod: string;
  notes: string;
}

export type OrderChannel = "dine_in" | "takeaway" | "delivery";
export type OrderStatus =
  | "received"
  | "accepted"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled"
  | "delayed";

export interface ManualOrderEntry extends BaseRecord {
  channel: OrderChannel;
  itemsSummary: string;
  totalAmount: number | null;
  status: OrderStatus;
  receivedAt: string;
  completedAt: string | null;
  notes: string;
  source: "manual";
}

export interface ActionCenterItem {
  id: string;
  severity: "critical" | "attention" | "completed";
  title: string;
  detail: string;
  module: string;
  linkPath: string;
  timestamp: string;
}
```

#graphify/code #graphify/EXTRACTED #community/Complaints__Shared_Entity_Enums