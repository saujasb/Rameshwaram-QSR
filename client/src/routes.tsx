import { DashboardPage } from "./modules/dashboard/DashboardPage";
import { ActionCenterPage } from "./modules/dashboard/ActionCenterPage";
import { SalesAnalyticsPage } from "./modules/sales-analytics/SalesAnalyticsPage";
import { SalesImportPage } from "./modules/sales-analytics/SalesImportPage";
import { VegIndentPage } from "./modules/sales-analytics/VegIndentPage";
import { KpiScorecardPage } from "./modules/sales-analytics/KpiScorecardPage";
import { OrdersPage } from "./modules/orders/OrdersPage";
import { KitchenPage } from "./modules/kitchen/KitchenPage";
import { DeliveryPage } from "./modules/delivery/DeliveryPage";
import { FrontCounterPage } from "./modules/front-counter/FrontCounterPage";
import { TasksPage } from "./modules/tasks/TasksPage";
import { ShiftPerformancePage } from "./modules/shift-performance/ShiftPerformancePage";
import { StaffPage } from "./modules/staff/StaffPage";
import { AttendancePage } from "./modules/attendance/AttendancePage";
import { InventoryPage } from "./modules/inventory/InventoryPage";
import { PurchasesPage } from "./modules/purchases/PurchasesPage";
import { SuppliersPage } from "./modules/purchases/SuppliersPage";
import { WastagePage } from "./modules/wastage/WastagePage";
import { ComplaintsPage } from "./modules/complaints/ComplaintsPage";
import { MaintenancePage } from "./modules/maintenance/MaintenancePage";
import { ExpensesPage } from "./modules/expenses/ExpensesPage";

export interface NavItem {
  path: string;
  label: string;
  element: JSX.Element;
  icon: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { path: "/", label: "Dashboard", element: <DashboardPage />, icon: "⌂" },
      { path: "/action-center", label: "Action Center", element: <ActionCenterPage />, icon: "⚑" },
    ],
  },
  {
    label: "Sales & Orders",
    items: [
      { path: "/sales-analytics", label: "Sales & Revenue", element: <SalesAnalyticsPage />, icon: "₹" },
      { path: "/sales-import", label: "Sales Data Import", element: <SalesImportPage />, icon: "⇧" },
      { path: "/veg-indent", label: "Vegetable Indent", element: <VegIndentPage />, icon: "🥕" },
      { path: "/kpi-scorecard", label: "KPI Scorecard", element: <KpiScorecardPage />, icon: "◎" },
      { path: "/orders", label: "Orders", element: <OrdersPage />, icon: "▤" },
      { path: "/kitchen", label: "Kitchen", element: <KitchenPage />, icon: "▲" },
      { path: "/delivery", label: "Delivery", element: <DeliveryPage />, icon: "→" },
      { path: "/front-counter", label: "Front Counter", element: <FrontCounterPage />, icon: "▭" },
    ],
  },
  {
    label: "Operations",
    items: [
      { path: "/tasks", label: "Tasks / SPO", element: <TasksPage />, icon: "✓" },
      { path: "/shift-performance", label: "Shift & Store Perf.", element: <ShiftPerformancePage />, icon: "◷" },
    ],
  },
  {
    label: "People",
    items: [
      { path: "/staff", label: "Staff", element: <StaffPage />, icon: "☺" },
      { path: "/attendance", label: "Attendance", element: <AttendancePage />, icon: "☑" },
    ],
  },
  {
    label: "Inventory & Supply",
    items: [
      { path: "/inventory", label: "Inventory", element: <InventoryPage />, icon: "▦" },
      { path: "/purchases", label: "Purchases", element: <PurchasesPage />, icon: "⇩" },
      { path: "/suppliers", label: "Suppliers", element: <SuppliersPage />, icon: "⚭" },
    ],
  },
  {
    label: "Quality & Issues",
    items: [
      { path: "/wastage", label: "Wastage", element: <WastagePage />, icon: "⚠" },
      { path: "/complaints", label: "Complaints", element: <ComplaintsPage />, icon: "!" },
      { path: "/maintenance", label: "Maintenance", element: <MaintenancePage />, icon: "⚙" },
    ],
  },
  {
    label: "Finance",
    items: [
      { path: "/expenses", label: "Expenses", element: <ExpensesPage />, icon: "¤" },
    ],
  },
];

export const flatNavItems: NavItem[] = navGroups.flatMap((g) => g.items);
