import type { LucideIcon } from "lucide-react";
import type { Permission } from "@shared/auth";
import {
  Bike, Boxes, CalendarCheck, Carrot, ChefHat, ClipboardList, Clock, Database, Download, FileUp, Flag,
  IndianRupee, LayoutDashboard, ListChecks, MessageSquareWarning, Radio, Settings, ShoppingCart, Sparkles,
  Store, Target, Trash2, Truck, Upload, Users, Wallet, Wrench,
} from "lucide-react";
import { DashboardPage } from "./modules/dashboard/DashboardPage";
import { ActionCenterPage } from "./modules/dashboard/ActionCenterPage";
import { SalesRevenueLayout } from "./modules/sales-analytics/SalesRevenueLayout";
import { ExportPage } from "./modules/export/ExportPage";
import { SalesImportPage } from "./modules/sales-analytics/SalesImportPage";
import { ImportCenterPage } from "./modules/import/ImportCenterPage";
import { DataExplorerPage } from "./modules/explorer/DataExplorerPage";
import { IntelligencePage } from "./modules/intelligence/IntelligencePage";
import { SettingsPage } from "./modules/settings/SettingsPage";
import { VegIndentPage } from "./modules/sales-analytics/VegIndentPage";
import { KpiScorecardPage } from "./modules/sales-analytics/KpiScorecardPage";
import { OrdersPage } from "./modules/orders/OrdersPage";
import { LiveOrdersPage } from "./modules/live-orders/LiveOrdersPage";
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
  /**
   * Needed to see this page. Hides the nav link and shows "no access" on a
   * direct URL visit -- convenience only; the API enforces the same
   * permission on every data call regardless (server/src/auth/accessPolicy.ts).
   */
  permission: Permission;
  label: string;
  element: JSX.Element;
  icon: LucideIcon;
  /** Registered as a route but not shown in the main sidebar (still reachable by URL and in-app links). */
  hidden?: boolean;
  /** Also matches nested sub-paths (e.g. /sales-analytics/live-feed), for pages with their own sub-navigation. */
  hasSubRoutes?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { path: "/", permission: "dashboard.view", label: "Dashboard", element: <DashboardPage />, icon: LayoutDashboard },
      { path: "/intelligence", permission: "analytics.view", label: "Intelligence", element: <IntelligencePage />, icon: Sparkles },
      { path: "/action-center", permission: "dashboard.view", label: "Action Center", element: <ActionCenterPage />, icon: Flag },
    ],
  },
  {
    label: "Sales",
    items: [
      { path: "/sales-analytics", permission: "sales.view", label: "Sales & Revenue", element: <SalesRevenueLayout />, icon: IndianRupee, hasSubRoutes: true },
      { path: "/data-import", permission: "data.import", label: "Data Import", element: <ImportCenterPage />, icon: Upload, hidden: true },
      { path: "/data-explorer", permission: "sales.view", label: "Data Explorer", element: <DataExplorerPage />, icon: Database, hidden: true },
      { path: "/sales-import", permission: "data.import", label: "Sales PDF Import (legacy)", element: <SalesImportPage />, icon: FileUp, hidden: true },
      { path: "/kpi-scorecard", permission: "analytics.view", label: "KPI Scorecard", element: <KpiScorecardPage />, icon: Target },
      { path: "/veg-indent", permission: "analytics.view", label: "Vegetable Indent", element: <VegIndentPage />, icon: Carrot },
      { path: "/export", permission: "data.export", label: "Export", element: <ExportPage />, icon: Download },
    ],
  },
  {
    label: "Orders",
    items: [
      { path: "/live-orders", permission: "orders.view", label: "Live Orders", element: <LiveOrdersPage />, icon: Radio },
      { path: "/orders", permission: "orders.view", label: "Orders (manual)", element: <OrdersPage />, icon: ClipboardList },
      { path: "/kitchen", permission: "orders.view", label: "Kitchen", element: <KitchenPage />, icon: ChefHat },
      { path: "/delivery", permission: "orders.view", label: "Delivery", element: <DeliveryPage />, icon: Bike },
      { path: "/front-counter", permission: "orders.view", label: "Front Counter", element: <FrontCounterPage />, icon: Store },
    ],
  },
  {
    label: "Operations",
    items: [
      { path: "/tasks", permission: "operations.view", label: "Tasks / SPO", element: <TasksPage />, icon: ListChecks },
      { path: "/shift-performance", permission: "people.view", label: "Shift & Store Perf.", element: <ShiftPerformancePage />, icon: Clock },
    ],
  },
  {
    label: "People",
    items: [
      { path: "/staff", permission: "people.view", label: "Staff", element: <StaffPage />, icon: Users },
      { path: "/attendance", permission: "people.view", label: "Attendance", element: <AttendancePage />, icon: CalendarCheck },
    ],
  },
  {
    label: "Inventory & Supply",
    items: [
      { path: "/inventory", permission: "operations.view", label: "Inventory", element: <InventoryPage />, icon: Boxes },
      { path: "/purchases", permission: "operations.view", label: "Purchases", element: <PurchasesPage />, icon: ShoppingCart },
      { path: "/suppliers", permission: "operations.view", label: "Suppliers", element: <SuppliersPage />, icon: Truck },
    ],
  },
  {
    label: "Quality & Issues",
    items: [
      { path: "/wastage", permission: "operations.view", label: "Wastage", element: <WastagePage />, icon: Trash2 },
      { path: "/complaints", permission: "operations.view", label: "Complaints", element: <ComplaintsPage />, icon: MessageSquareWarning },
      { path: "/maintenance", permission: "operations.view", label: "Maintenance", element: <MaintenancePage />, icon: Wrench },
    ],
  },
  {
    label: "Finance",
    items: [
      { path: "/expenses", permission: "finance.view", label: "Expenses", element: <ExpensesPage />, icon: Wallet },
    ],
  },
  {
    label: "Admin",
    items: [
      { path: "/settings", permission: "settings.view", label: "Settings", element: <SettingsPage />, icon: Settings, hasSubRoutes: true },
    ],
  },
];

export const flatNavItems: NavItem[] = navGroups.flatMap((g) => g.items);
