# Graph Report - rameshwaram-qsr-dashboard  (2026-09-05)

## Corpus Check
- 169 files · ~100,225 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1035 nodes · 2829 edges · 36 communities (30 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 31 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Business Intelligence Engine
- Ramesh AI Query Engine
- Generic CRUD Backend
- Dataset Import & Normalization Pipeline
- Provider Order Integration (Petpooja/GoSelfServe)
- Data Explorer & Import UI
- Sales Import Parsing Pipeline
- Server Package Dependencies
- Order Operations Pages
- Generic CRUD UI Components
- Client Package Dependencies
- Staff & Shift Operations UI
- Sales Import UI
- Veg Indent & Analytics Engine
- Dashboard & Sales Trend Visualization
- Complaints & Shared Entity Enums
- Client TypeScript Config
- Ramesh Intent Classification
- Maintenance & Suppliers UI
- App Shell & Bootstrap
- Sales Analytics Charts
- Inventory Management UI
- Ramesh Chat Widget
- Server TypeScript Config
- Action Center UI
- Monorepo Root Config
- Expenses UI
- Purchases UI
- Deployment Configuration (Render)
- KPI Scorecard & Analytics Snapshot
- Vite Env Types
- Brand Lockup Asset
- Brand Emblem Asset
- Favicon Brand Asset

## God Nodes (most connected - your core abstractions)
1. `apiGet()` - 39 edges
2. `formatBusinessDateLong()` - 36 edges
3. `totalsFor()` - 28 edges
4. `BaseRecord` - 28 edges
5. `answer()` - 27 edges
6. `DatasetType` - 27 edges
7. `dailyTotals()` - 21 edges
8. `buildInsights()` - 20 edges
9. `getCurrentBusinessDate()` - 19 edges
10. `ColumnConfig` - 18 edges

## Surprising Connections (you probably didn't know these)
- `buildActionCenter()` --calls--> `computeInventoryStatus()`  [EXTRACTED]
  server/src/shared/actionCenter.ts → shared-types/inventoryStatus.ts
- `rameshwaram-qsr-server (Render web service)` --conceptually_related_to--> `Client HTML Entry Point`  [INFERRED]
  render.yaml → client/index.html
- `CrudHooks` --references--> `BaseRecord`  [EXTRACTED]
  client/src/components/crud/CrudModulePage.tsx → shared-types/entities.ts
- `useLiveBusinessDate()` --calls--> `getCurrentBusinessDate()`  [EXTRACTED]
  client/src/components/layout/AppShell.tsx → shared-types/businessDate.ts
- `OpsStatusStrip()` --calls--> `formatBusinessDateLong()`  [EXTRACTED]
  client/src/components/layout/AppShell.tsx → shared-types/businessDate.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Order-integration environment configuration (Petpooja inbound + GoSelfServe outbound)** — render_rameshwaram_qsr_server, render_petpooja_webhook_token, render_goselfserve_sync [INFERRED 0.75]

## Communities (36 total, 4 thin omitted)

### Community 0 - "Business Intelligence Engine"
Cohesion: 0.05
Nodes (98): useAnomalies(), useReconciliation(), useTodaysIntelligence(), useTopInsights(), AnomalyCard(), fmtNum(), IntelligencePage(), SEVERITY_TONE (+90 more)

### Community 1 - "Ramesh AI Query Engine"
Cohesion: 0.07
Nodes (95): ensureDatasetTables(), migrateLegacySalesLineItems(), setBusinessDayStartHour(), tableExists(), buildWhere(), categoryTotals(), channelTotals(), dailyTotals() (+87 more)

### Community 2 - "Generic CRUD Backend"
Cohesion: 0.05
Nodes (40): db, __dirname, ensureTable(), SOP_TASKS, attendanceRepository, attendanceRouter, complaintRepository, complaintRouter (+32 more)

### Community 3 - "Dataset Import & Normalization Pipeline"
Cohesion: 0.06
Nodes (65): buildIso(), coerceDateKey(), coerceNumber(), coerceText(), coerceTime(), coerceTimestamp(), DATE_PATTERNS, EXCEL_EPOCH_MS (+57 more)

### Community 4 - "Provider Order Integration (Petpooja/GoSelfServe)"
Cohesion: 0.07
Nodes (53): filterToParams(), useProviderOrders(), columns, LiveOrdersPage(), SOURCE_OPTIONS, STATUS_OPTIONS, TYPE_OPTIONS, GSS_LABEL (+45 more)

### Community 5 - "Data Explorer & Import UI"
Cohesion: 0.06
Nodes (54): DatasetSummary, exportCsvUrl(), filterToParams(), ImportFileResult, useBusinessDaySettings(), useDatasetCoverage(), useDatasetFacets(), useDatasetRecords() (+46 more)

### Community 6 - "Sales Import Parsing Pipeline"
Cohesion: 0.08
Nodes (47): adaptPdf(), ensureSalesTables(), DetectedFormat, detectFormat(), ImportOptions, ImportOutcome, runSalesImport(), approxEqual() (+39 more)

### Community 7 - "Server Package Dependencies"
Cohesion: 0.05
Nodes (37): better-sqlite3, cors, express, multer, pdf-parse, dependencies, better-sqlite3, cors (+29 more)

### Community 8 - "Order Operations Pages"
Cohesion: 0.15
Nodes (24): CrudModulePage(), ColumnConfig, NotConnectedBanner(), StatusBadge(), orderHooks, columns, DeliveryPage(), formFields (+16 more)

### Community 9 - "Generic CRUD UI Components"
Cohesion: 0.16
Nodes (17): CrudHooks, RecordForm(), FormFieldConfig, SelectOption, Modal(), DataTable(), defaultSortValue(), taskHooks (+9 more)

### Community 10 - "Client Package Dependencies"
Cohesion: 0.07
Nodes (27): dependencies, react, react-dom, react-router-dom, @tanstack/react-query, devDependencies, @types/react, @types/react-dom (+19 more)

### Community 11 - "Staff & Shift Operations UI"
Cohesion: 0.11
Nodes (21): attendanceHooks, staffHooks, wastageHooks, AttendancePage(), OrdersPage(), ShiftPerformancePage(), SHIFTS, columns (+13 more)

### Community 12 - "Sales Import UI"
Cohesion: 0.12
Nodes (22): ImportError, summaryKey(), useDeleteImportBatch(), useImportBatches(), useImportSalesPdf(), useSalesSummary(), IMPORT_STEPS, ImportResultCard() (+14 more)

### Community 13 - "Veg Indent & Analytics Engine"
Cohesion: 0.11
Nodes (19): DivergingBar(), DivergingDatum, computeVegIndent(), VegIndentComputed, toneFor(), VegIndentPage(), prioritizedActions, analyticsSnapshot (+11 more)

### Community 14 - "Dashboard & Sales Trend Visualization"
Cohesion: 0.16
Nodes (17): BusinessDayTimeline(), SalesTrendChart(), TrendMarker, TrendPoint, useLatestImportBatch(), formatInrCompact(), formatTrendArrow(), DashboardPage() (+9 more)

### Community 15 - "Complaints & Shared Entity Enums"
Cohesion: 0.10
Nodes (21): complaintHooks, columns, ComplaintsPage(), formFields, AttendanceStatus, ComplaintRecord, ComplaintStatus, ExpenseCategory (+13 more)

### Community 16 - "Client TypeScript Config"
Cohesion: 0.09
Nodes (22): compilerOptions, baseUrl, esModuleInterop, isolatedModules, jsx, lib, module, moduleResolution (+14 more)

### Community 17 - "Ramesh Intent Classification"
Cohesion: 0.15
Nodes (22): classify(), ClassifyOptions, datasetWords(), explicitDates(), INJECTION_PATTERNS, makeKey(), matchDimension(), matchProduct() (+14 more)

### Community 18 - "Maintenance & Suppliers UI"
Cohesion: 0.12
Nodes (17): maintenanceHooks, supplierHooks, createEntityHooks(), useAction(), useCreate(), useList(), useOne(), useRemove() (+9 more)

### Community 19 - "App Shell & Bootstrap"
Cohesion: 0.16
Nodes (15): App(), AppShell(), OpsStatusStrip(), useLiveBusinessDate(), useTheme(), GlobalSearch(), SearchResult, Source (+7 more)

### Community 20 - "Sales Analytics Charts"
Cohesion: 0.14
Nodes (13): Donut(), DonutDatum, HBarChart(), HBarDatum, DataFreshnessBadge(), formatRelativeTime(), useSalesTarget(), useSetSalesTarget() (+5 more)

### Community 21 - "Inventory Management UI"
Cohesion: 0.26
Nodes (12): BadgeTone, inventoryHooks, inventoryMovementHooks, InventoryDetailModal(), InventoryPage(), STATUS_FILTER_OPTIONS, INVENTORY_STATUS_LABEL, INVENTORY_STATUS_TONE (+4 more)

### Community 22 - "Ramesh Chat Widget"
Cohesion: 0.22
Nodes (13): apiDelete(), apiPost(), apiPut(), handle(), useAskRamesh(), useRameshSuggestions(), AnswerBody(), drilldownPath() (+5 more)

### Community 23 - "Server TypeScript Config"
Cohesion: 0.12
Nodes (15): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, lib, module, moduleResolution, noEmit, outDir (+7 more)

### Community 24 - "Action Center UI"
Cohesion: 0.24
Nodes (8): useActionCenter(), ActionCenterPage(), SEVERITY_META, AttentionAlert, AttentionRequiredCard(), SEVERITY_META, SEVERITY_RANK, ActionCenterItem

### Community 25 - "Monorepo Root Config"
Cohesion: 0.17
Nodes (11): concurrently, devDependencies, concurrently, name, private, scripts, dev, seed (+3 more)

### Community 26 - "Expenses UI"
Cohesion: 0.32
Nodes (6): expenseHooks, CATEGORY_OPTIONS, columns, ExpensesPage(), formFields, ExpenseRecord

### Community 27 - "Purchases UI"
Cohesion: 0.38
Nodes (5): purchaseHooks, columns, formFields, PurchasesPage(), Purchase

### Community 28 - "Deployment Configuration (Render)"
Cohesion: 0.40
Nodes (6): Client HTML Entry Point, Ephemeral Filesystem Persistence Trade-off, GoSelfServe order-status sync adapter config, PETPOOJA_WEBHOOK_TOKEN config, qsr-data persistent disk, rameshwaram-qsr-server (Render web service)

### Community 29 - "KPI Scorecard & Analytics Snapshot"
Cohesion: 0.53
Nodes (4): useAnalyticsSnapshot(), usePrioritizedActions(), KpiScorecardPage(), SalesAnalyticsPage()

## Knowledge Gaps
- **239 isolated node(s):** `name`, `private`, `type`, `dev`, `build` (+234 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 279 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `formatBusinessDateLong()` connect `Ramesh AI Query Engine` to `Business Intelligence Engine`, `App Shell & Bootstrap`, `Data Explorer & Import UI`, `Dashboard & Sales Trend Visualization`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `apiGet()` connect `App Shell & Bootstrap` to `Business Intelligence Engine`, `Provider Order Integration (Petpooja/GoSelfServe)`, `Data Explorer & Import UI`, `Sales Import UI`, `Dashboard & Sales Trend Visualization`, `Maintenance & Suppliers UI`, `Sales Analytics Charts`, `Inventory Management UI`, `Ramesh Chat Widget`, `Action Center UI`, `KPI Scorecard & Analytics Snapshot`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `BaseRecord` connect `Generic CRUD UI Components` to `Generic CRUD Backend`, `Provider Order Integration (Petpooja/GoSelfServe)`, `Order Operations Pages`, `Staff & Shift Operations UI`, `Sales Import UI`, `Complaints & Shared Entity Enums`, `Maintenance & Suppliers UI`, `Inventory Management UI`, `Expenses UI`, `Purchases UI`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `name`, `private`, `type` to the rest of the system?**
  _239 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Business Intelligence Engine` be split into smaller, more focused modules?**
  _Cohesion score 0.05041087231352718 - nodes in this community are weakly interconnected._
- **Should `Ramesh AI Query Engine` be split into smaller, more focused modules?**
  _Cohesion score 0.06576819407008086 - nodes in this community are weakly interconnected._
- **Should `Generic CRUD Backend` be split into smaller, more focused modules?**
  _Cohesion score 0.05432098765432099 - nodes in this community are weakly interconnected._