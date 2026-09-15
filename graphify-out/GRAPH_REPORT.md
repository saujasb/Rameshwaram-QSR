# Graph Report - Rameshwaram-QSR-main  (2026-09-15)

## Corpus Check
- 174 files · ~124,930 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1053 nodes · 2912 edges · 44 communities (36 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 36 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Datasets & Intelligence Analytics (Postgres)
- Sales Import Pipeline, Parsers & UI
- Provider Orders Integration (GoSelfServe/PetPooja)
- Analytics Charts & Dashboard KPIs
- Dataset Import Parsing & Normalization
- Ramesh AI Assistant Engine
- Client & Server Dev Dependencies
- Order Channel Pages (Delivery/Kitchen/Front Counter)
- Business Date & Settings
- Intelligence Dashboard UI
- Import Center Page
- Shared Entity Enums & Wastage
- Generic CRUD UI Components & Staff/Attendance
- App Shell, Global Search & Client API Core
- Client TypeScript Config
- Dataset API Hooks & Data Explorer
- Inventory Management UI
- Task Management (CRUD Base Record)
- Server App Entry & Misc Routers
- Action Center
- Server TypeScript Config
- Action Center, Purchases & Tasks Routers
- Repository Base, Attendance/Expenses/Staff Routers
- Client Bootstrap & Core Dependencies (React/Router/Query)
- Today's Intelligence Panel
- Root Workspace Package Config
- Server npm Dependencies (Express/DB/File libs)
- DB Seeding & Wastage/Inventory Repositories
- Generic CRUD Router & Inventory Movement Routes
- Expenses Module
- File Uploads & Vercel Functions
- Vercel Deployment Config & Entry Point
- Complaints Module
- Maintenance Module
- Purchases Module
- Suppliers Module
- Generic Repository Base Class
- Complaints Repository & Routes
- Suppliers Repository & Routes
- Client Vite Env Types
- HTML Entrypoint
- Brand Lockup Image
- Emblem Image
- Favicon Image

## God Nodes (most connected - your core abstractions)
1. `apiGet()` - 39 edges
2. `totalsFor()` - 28 edges
3. `BaseRecord` - 26 edges
4. `answer()` - 26 edges
5. `DatasetType` - 25 edges
6. `react` - 25 edges
7. `dailyTotals()` - 21 edges
8. `query()` - 20 edges
9. `buildInsights()` - 20 edges
10. `ColumnConfig` - 18 edges

## Surprising Connections (you probably didn't know these)
- `DatasetType` --references--> `RawRowInput`  [EXTRACTED]
  shared-types/datasets.ts → server/src/entities/datasets/normalize.ts
- `CrudHooks` --references--> `BaseRecord`  [EXTRACTED]
  client/src/components/crud/CrudModulePage.tsx → shared-types/entities.ts
- `SalesImportPage()` --calls--> `getCurrentBusinessDate()`  [EXTRACTED]
  client/src/modules/sales-analytics/SalesImportPage.tsx → shared-types/businessDate.ts
- `dateRange()` --calls--> `formatBusinessDateLong()`  [EXTRACTED]
  client/src/modules/import/ImportCenterPage.tsx → shared-types/businessDate.ts
- `computeInventoryStatus()` --calls--> `DashboardPage()`  [EXTRACTED]
  shared-types/inventoryStatus.ts → client/src/modules/dashboard/DashboardPage.tsx

## Import Cycles
- None detected.

## Communities (44 total, 8 thin omitted)

### Community 0 - "Datasets & Intelligence Analytics (Postgres)"
Cohesion: 0.05
Nodes (140): getBusinessDayStartHour(), runImport(), buildWhere(), categoryTotals(), channelTotals(), dailyTotals(), datasetCoverage(), DatasetTotals (+132 more)

### Community 1 - "Sales Import Pipeline, Parsers & UI"
Cohesion: 0.05
Nodes (70): ImportError, uploadViaStorage(), useDeleteImportBatch(), useImportBatches(), useImportSalesPdf(), IMPORT_STEPS, ImportResultCard(), SalesImportPage() (+62 more)

### Community 2 - "Provider Orders Integration (GoSelfServe/PetPooja)"
Cohesion: 0.06
Nodes (63): filterToParams(), useProviderOrders(), columns, LiveOrdersPage(), SOURCE_OPTIONS, STATUS_OPTIONS, TYPE_OPTIONS, GSS_LABEL (+55 more)

### Community 3 - "Analytics Charts & Dashboard KPIs"
Cohesion: 0.05
Nodes (48): DivergingBar(), DivergingDatum, Donut(), DonutDatum, HBarChart(), HBarDatum, DataFreshnessBadge(), formatRelativeTime() (+40 more)

### Community 4 - "Dataset Import Parsing & Normalization"
Cohesion: 0.07
Nodes (56): buildIso(), coerceDateKey(), coerceNumber(), coerceText(), coerceTime(), coerceTimestamp(), DATE_PATTERNS, EXCEL_EPOCH_MS (+48 more)

### Community 5 - "Ramesh AI Assistant Engine"
Cohesion: 0.07
Nodes (46): apiPost(), useAskRamesh(), useRameshSuggestions(), useAction(), useCreate(), AnswerBody(), drilldownPath(), RameshWidget() (+38 more)

### Community 6 - "Client & Server Dev Dependencies"
Cohesion: 0.05
Nodes (41): devDependencies, @types/react, @types/react-dom, typescript, vite, @vitejs/plugin-react, name, private (+33 more)

### Community 7 - "Order Channel Pages (Delivery/Kitchen/Front Counter)"
Cohesion: 0.11
Nodes (29): NotConnectedBanner(), orderHooks, AttendancePage(), columns, DeliveryPage(), formFields, useDeliveryOrders(), columns (+21 more)

### Community 8 - "Business Date & Settings"
Cohesion: 0.11
Nodes (27): BusinessDayTimeline(), SalesTrendChart(), TrendMarker, TrendPoint, useBusinessDaySettings(), useDatasetCoverage(), MissingDataNote(), BusinessDayCard() (+19 more)

### Community 9 - "Intelligence Dashboard UI"
Cohesion: 0.13
Nodes (24): useAnomalies(), useReconciliation(), useTopInsights(), AnomalyCard(), fmtNum(), IntelligencePage(), SEVERITY_TONE, DATASET_LABELS_SAFE() (+16 more)

### Community 10 - "Import Center Page"
Cohesion: 0.11
Nodes (21): ImportFileResult, dateRange(), FailureCard(), fileIcon(), fileKindLabel(), fmtBytes(), Gauge(), IMPORT_STEPS (+13 more)

### Community 11 - "Shared Entity Enums & Wastage"
Cohesion: 0.10
Nodes (21): wastageHooks, SHIFTS, columns, formFields, WastagePage(), AttendanceStatus, ComplaintStatus, ExpenseCategory (+13 more)

### Community 12 - "Generic CRUD UI Components & Staff/Attendance"
Cohesion: 0.18
Nodes (14): react, CrudModulePage(), ColumnConfig, FormFieldConfig, SelectOption, DataTable(), defaultSortValue(), attendanceHooks (+6 more)

### Community 13 - "App Shell, Global Search & Client API Core"
Cohesion: 0.15
Nodes (19): AppShell(), OpsStatusStrip(), useLiveBusinessDate(), useTheme(), GlobalSearch(), SearchResult, Source, SOURCES (+11 more)

### Community 14 - "Client TypeScript Config"
Cohesion: 0.09
Nodes (22): compilerOptions, baseUrl, esModuleInterop, isolatedModules, jsx, lib, module, moduleResolution (+14 more)

### Community 15 - "Dataset API Hooks & Data Explorer"
Cohesion: 0.16
Nodes (19): apiPut(), DatasetSummary, exportCsvUrl(), filterToParams(), uploadFileViaStorage(), useDatasetFacets(), useDatasetRecords(), useDatasetSummary() (+11 more)

### Community 16 - "Inventory Management UI"
Cohesion: 0.23
Nodes (14): Modal(), BadgeTone, StatusBadge(), inventoryHooks, inventoryMovementHooks, InventoryDetailModal(), InventoryPage(), STATUS_FILTER_OPTIONS (+6 more)

### Community 17 - "Task Management (CRUD Base Record)"
Cohesion: 0.19
Nodes (13): CrudHooks, RecordForm(), taskHooks, createEntityHooks(), TaskDetailModal(), CATEGORY_OPTIONS, FREQUENCY_OPTIONS, PRIORITY_OPTIONS (+5 more)

### Community 18 - "Server App Entry & Misc Routers"
Cohesion: 0.16
Nodes (10): allowedOrigins, app, intelligenceRouter, maintenanceRepository, maintenanceRouter, orderRepository, orderRouter, providerOrdersRouter (+2 more)

### Community 19 - "Action Center"
Cohesion: 0.20
Nodes (9): useActionCenter(), ActionCenterPage(), SEVERITY_META, AttentionAlert, AttentionRequiredCard(), SEVERITY_META, SEVERITY_RANK, Tone (+1 more)

### Community 20 - "Server TypeScript Config"
Cohesion: 0.12
Nodes (15): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, lib, module, moduleResolution, noEmit, outDir (+7 more)

### Community 21 - "Action Center, Purchases & Tasks Routers"
Cohesion: 0.19
Nodes (8): express, express, purchaseRepository, purchaseRouter, taskRepository, taskRouter, actionCenterRouter, TaskHistoryEntry

### Community 22 - "Repository Base, Attendance/Expenses/Staff Routers"
Cohesion: 0.21
Nodes (7): supabase, attendanceRepository, expenseRepository, expenseRouter, staffRepository, staffRouter, createRepository()

### Community 23 - "Client Bootstrap & Core Dependencies (React/Router/Query)"
Cohesion: 0.21
Nodes (11): dependencies, react, react-dom, react-router-dom, @tanstack/react-query, App(), queryClient, flatNavItems (+3 more)

### Community 24 - "Today's Intelligence Panel"
Cohesion: 0.23
Nodes (11): useTodaysIntelligence(), BASIS_LABEL, fmtInr(), fmtPct(), fmtQty(), isUnavailable(), MetricRow(), MetricValue() (+3 more)

### Community 25 - "Root Workspace Package Config"
Cohesion: 0.15
Nodes (12): concurrently, devDependencies, concurrently, name, private, scripts, dev, seed (+4 more)

### Community 26 - "Server npm Dependencies (Express/DB/File libs)"
Cohesion: 0.15
Nodes (13): cors, multer, pdf-parse, pg, dependencies, cors, multer, pdf-parse (+5 more)

### Community 27 - "DB Seeding & Wastage/Inventory Repositories"
Cohesion: 0.24
Nodes (4): SOP_TASKS, inventoryRepository, wastageRepository, wastageRouter

### Community 28 - "Generic CRUD Router & Inventory Movement Routes"
Cohesion: 0.29
Nodes (5): attendanceRouter, inventoryMovementRepository, inventoryMovementRouter, inventoryRouter, createCrudRouter()

### Community 29 - "Expenses Module"
Cohesion: 0.32
Nodes (6): expenseHooks, CATEGORY_OPTIONS, columns, ExpensesPage(), formFields, ExpenseRecord

### Community 30 - "File Uploads & Vercel Functions"
Cohesion: 0.25
Nodes (6): @vercel/functions, @vercel/functions, ALLOWED_CONTENT_TYPES, downloadUpload(), IMPORT_BUCKET, uploadsRouter

### Community 31 - "Vercel Deployment Config & Entry Point"
Cohesion: 0.25
Nodes (7): maxDuration, buildCommand, api/index.ts, installCommand, functions, outputDirectory, rewrites

### Community 32 - "Complaints Module"
Cohesion: 0.38
Nodes (5): complaintHooks, columns, ComplaintsPage(), formFields, ComplaintRecord

### Community 33 - "Maintenance Module"
Cohesion: 0.38
Nodes (5): maintenanceHooks, columns, formFields, MaintenancePage(), MaintenanceIssue

### Community 34 - "Purchases Module"
Cohesion: 0.38
Nodes (5): purchaseHooks, columns, formFields, PurchasesPage(), Purchase

### Community 35 - "Suppliers Module"
Cohesion: 0.38
Nodes (5): supplierHooks, columns, formFields, SuppliersPage(), Supplier

## Knowledge Gaps
- **224 isolated node(s):** `DatasetTotals`, `UpsertResult`, `PendingFile`, `Candidate`, `Window` (+219 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 267 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Generic CRUD UI Components & Staff/Attendance` to `Sales Import Pipeline, Parsers & UI`, `Provider Orders Integration (GoSelfServe/PetPooja)`, `Analytics Charts & Dashboard KPIs`, `Ramesh AI Assistant Engine`, `Order Channel Pages (Delivery/Kitchen/Front Counter)`, `Business Date & Settings`, `Import Center Page`, `Shared Entity Enums & Wastage`, `App Shell, Global Search & Client API Core`, `Dataset API Hooks & Data Explorer`, `Inventory Management UI`, `Task Management (CRUD Base Record)`, `Action Center`, `Client Bootstrap & Core Dependencies (React/Router/Query)`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Why does `express` connect `Action Center, Purchases & Tasks Routers` to `Datasets & Intelligence Analytics (Postgres)`, `Sales Import Pipeline, Parsers & UI`, `Provider Orders Integration (GoSelfServe/PetPooja)`, `Analytics Charts & Dashboard KPIs`, `Ramesh AI Assistant Engine`, `Server App Entry & Misc Routers`, `Generic CRUD Router & Inventory Movement Routes`, `File Uploads & Vercel Functions`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Client Bootstrap & Core Dependencies (React/Router/Query)` to `Client & Server Dev Dependencies`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `DatasetTotals`, `UpsertResult`, `PendingFile` to the rest of the system?**
  _224 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Datasets & Intelligence Analytics (Postgres)` be split into smaller, more focused modules?**
  _Cohesion score 0.051567328918322296 - nodes in this community are weakly interconnected._
- **Should `Sales Import Pipeline, Parsers & UI` be split into smaller, more focused modules?**
  _Cohesion score 0.050140056022408966 - nodes in this community are weakly interconnected._
- **Should `Provider Orders Integration (GoSelfServe/PetPooja)` be split into smaller, more focused modules?**
  _Cohesion score 0.06139240506329114 - nodes in this community are weakly interconnected._