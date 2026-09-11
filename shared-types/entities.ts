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
