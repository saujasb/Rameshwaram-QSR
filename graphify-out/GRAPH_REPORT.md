# Graph Report - Rameshwaram-QSR-main  (2026-09-14)

## Corpus Check
- 2 files · ~106,283 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1051 nodes · 2875 edges · 47 communities (41 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 36 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Sales Analytics Core
- Provider Orders & Live Feed
- Database Client & Seeding
- Data Coercion Utilities
- Generic CRUD Module Framework
- PDF/Format Import Adapters
- Import Center Hooks
- Business Intelligence & Anomalies
- Sales Data Hooks
- KPI Scorecard & Analytics Charts
- Dataset Schema & Migrations
- App Shell & Navigation
- Staff & Wastage Tracking
- Business Day & Sales Trend Charts
- Dataset Import Pipeline
- Expense Tracking
- Query Intent Classification
- Sales Database Repository
- Shared Table/Modal UI
- Client TS Config
- API Client & Complaints
- Record Form & Status UI
- Datasets API & Export
- Formatting Utilities
- Chart Components (Donut/HBar)
- Server TS Config
- Server Dependencies
- Top Insights Panel
- Server Dev Dependencies
- Client Dev Dependencies
- Action Center
- Root Package Scripts
- Deployment & Integration Docs
- Server Package Manifest
- Client Runtime Dependencies
- Client Package Manifest
- CRUD Hook/Repository Pattern
- Maintenance Tracking
- Purchases Tracking
- Suppliers Tracking
- Import Result Types
- Vite Env Types
- Brand Identity
- Logo Motif Concepts
- Brand Assets

## God Nodes (most connected - your core abstractions)
1. `apiGet()` - 39 edges
2. `formatBusinessDateLong()` - 36 edges
3. `BaseRecord` - 28 edges
4. `totalsFor()` - 28 edges
5. `DatasetType` - 27 edges
6. `answer()` - 27 edges
7. `dailyTotals()` - 21 edges
8. `buildInsights()` - 20 edges
9. `getCurrentBusinessDate()` - 19 edges
10. `ColumnConfig` - 18 edges

## Surprising Connections (you probably didn't know these)
- `ImportRequest` --references--> `DatasetType`  [EXTRACTED]
  server/src/entities/datasets/importPipeline.ts → shared-types/datasets.ts
- `RameshClassification` --references--> `RameshIntent`  [EXTRACTED]
  server/src/entities/ramesh/intents.ts → shared-types/ramesh.ts
- `Rameshwaram — Master Tracking Command Centre` --conceptually_related_to--> `rameshwaram-qsr-server (Render web service)`  [INFERRED]
  client/index.html → render.yaml
- `RawRowInput` --references--> `DatasetType`  [EXTRACTED]
  server/src/entities/datasets/normalize.ts → shared-types/datasets.ts
- `UpsertOutcome` --references--> `ProviderOrder`  [EXTRACTED]
  server/src/entities/provider-orders/repository.ts → shared-types/providerOrders.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **GoSelfServe inbound/outbound order-sync integration** — render_goselfserve, render_goselfserve_webhook_token, render_goselfserve_order_sync [INFERRED 0.85]

## Communities (47 total, 4 thin omitted)

### Community 0 - "Sales Analytics Core"
Cohesion: 0.06
Nodes (132): getBusinessDayStartHour(), buildWhere(), dailyTotals(), datasetCoverage(), distinctValues(), hourlyBuckets(), latestBusinessDate(), outletPerformance() (+124 more)

### Community 1 - "Provider Orders & Live Feed"
Cohesion: 0.06
Nodes (63): filterToParams(), useProviderOrders(), columns, LiveOrdersPage(), SOURCE_OPTIONS, STATUS_OPTIONS, TYPE_OPTIONS, GSS_LABEL (+55 more)

### Community 2 - "Database Client & Seeding"
Cohesion: 0.06
Nodes (41): db, __dirname, ensureTable(), SOP_TASKS, attendanceRepository, attendanceRouter, complaintRepository, complaintRouter (+33 more)

### Community 3 - "Data Coercion Utilities"
Cohesion: 0.12
Nodes (33): buildIso(), coerceDateKey(), coerceNumber(), coerceText(), coerceTime(), coerceTimestamp(), DATE_PATTERNS, EXCEL_EPOCH_MS (+25 more)

### Community 4 - "Generic CRUD Module Framework"
Cohesion: 0.15
Nodes (25): CrudModulePage(), ColumnConfig, FormFieldConfig, SelectOption, NotConnectedBanner(), orderHooks, columns, DeliveryPage() (+17 more)

### Community 5 - "PDF/Format Import Adapters"
Cohesion: 0.15
Nodes (25): adaptPdf(), DetectedFormat, detectFormat(), ImportOptions, ImportOutcome, runSalesImport(), approxEqual(), parseNumber() (+17 more)

### Community 6 - "Import Center Hooks"
Cohesion: 0.10
Nodes (25): useDeleteImportBatch(), useImportFiles(), useInvalidateDataLayer(), useSetBusinessDayStartHour(), dateRange(), FailureCard(), fileIcon(), fileKindLabel() (+17 more)

### Community 7 - "Business Intelligence & Anomalies"
Cohesion: 0.12
Nodes (27): useAnomalies(), useReconciliation(), useTodaysIntelligence(), AnomalyCard(), fmtNum(), IntelligencePage(), SEVERITY_TONE, DATASET_LABELS_SAFE() (+19 more)

### Community 8 - "Sales Data Hooks"
Cohesion: 0.10
Nodes (24): ImportError, useDeleteImportBatch(), useImportBatches(), useImportSalesPdf(), useSalesTarget(), useSetSalesTarget(), useSalesTargetWithEditor(), IMPORT_STEPS (+16 more)

### Community 9 - "KPI Scorecard & Analytics Charts"
Cohesion: 0.11
Nodes (21): DivergingBar(), DivergingDatum, useAnalyticsSnapshot(), KpiScorecardPage(), computeVegIndent(), VegIndentComputed, toneFor(), VegIndentPage() (+13 more)

### Community 10 - "Dataset Schema & Migrations"
Cohesion: 0.11
Nodes (24): ensureDatasetTables(), migrateLegacySalesLineItems(), setBusinessDayStartHour(), tableExists(), categoryTotals(), channelTotals(), DatasetTotals, deleteImportBatch() (+16 more)

### Community 11 - "App Shell & Navigation"
Cohesion: 0.10
Nodes (22): App(), AppShell(), OpsStatusStrip(), useLiveBusinessDate(), useTheme(), GlobalSearch(), SearchResult, Source (+14 more)

### Community 12 - "Staff & Wastage Tracking"
Cohesion: 0.12
Nodes (20): attendanceHooks, staffHooks, wastageHooks, AttendancePage(), OrdersPage(), ShiftPerformancePage(), SHIFTS, columns (+12 more)

### Community 13 - "Business Day & Sales Trend Charts"
Cohesion: 0.14
Nodes (21): BusinessDayTimeline(), SalesTrendChart(), TrendMarker, TrendPoint, useBusinessDaySettings(), BusinessDayCard(), BusinessDayExamples(), hourLabel() (+13 more)

### Community 14 - "Dataset Import Pipeline"
Cohesion: 0.14
Nodes (24): productKeyOf(), looksLikeSpreadsheet(), ImportOutcome, ImportRequest, runImport(), BuildContext, BuildOutcome, buildRecord() (+16 more)

### Community 15 - "Expense Tracking"
Cohesion: 0.09
Nodes (22): expenseHooks, CATEGORY_OPTIONS, columns, ExpensesPage(), formFields, AttendanceStatus, ComplaintStatus, ExpenseCategory (+14 more)

### Community 16 - "Query Intent Classification"
Cohesion: 0.14
Nodes (23): classify(), ClassifyOptions, datasetWords(), explicitDates(), INJECTION_PATTERNS, makeKey(), matchDimension(), matchProduct() (+15 more)

### Community 17 - "Sales Database Repository"
Cohesion: 0.13
Nodes (21): ensureSalesTables(), deleteImportBatch(), findByFingerprint, fingerprintFor(), getDailyTarget(), getImportBatch(), getSalesSummary(), insertBatchStmt (+13 more)

### Community 18 - "Shared Table/Modal UI"
Cohesion: 0.19
Nodes (15): Modal(), DataTable(), defaultSortValue(), inventoryHooks, inventoryMovementHooks, InventoryDetailModal(), InventoryPage(), STATUS_FILTER_OPTIONS (+7 more)

### Community 19 - "Client TS Config"
Cohesion: 0.09
Nodes (22): compilerOptions, baseUrl, esModuleInterop, isolatedModules, jsx, lib, module, moduleResolution (+14 more)

### Community 20 - "API Client & Complaints"
Cohesion: 0.16
Nodes (17): apiDelete(), apiPost(), apiPut(), handle(), complaintHooks, useAskRamesh(), createEntityHooks(), useAction() (+9 more)

### Community 21 - "Record Form & Status UI"
Cohesion: 0.19
Nodes (12): RecordForm(), BadgeTone, StatusBadge(), taskHooks, TaskDetailModal(), CATEGORY_OPTIONS, FREQUENCY_OPTIONS, PRIORITY_OPTIONS (+4 more)

### Community 22 - "Datasets API & Export"
Cohesion: 0.19
Nodes (17): apiGet(), DatasetSummary, exportCsvUrl(), filterToParams(), ImportFileResult, useDatasetFacets(), useDatasetRecords(), useDatasetSummary() (+9 more)

### Community 23 - "Formatting Utilities"
Cohesion: 0.21
Nodes (12): summaryKey(), useSalesSummary(), formatInrCompact(), formatTrendArrow(), DashboardPage(), deriveStatus(), growthTone(), targetTone() (+4 more)

### Community 24 - "Chart Components (Donut/HBar)"
Cohesion: 0.17
Nodes (12): Donut(), DonutDatum, HBarChart(), HBarDatum, DataFreshnessBadge(), formatRelativeTime(), usePrioritizedActions(), useLatestImportBatch() (+4 more)

### Community 25 - "Server TS Config"
Cohesion: 0.12
Nodes (15): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, lib, module, moduleResolution, noEmit, outDir (+7 more)

### Community 26 - "Server Dependencies"
Cohesion: 0.15
Nodes (13): better-sqlite3, cors, express, multer, pdf-parse, dependencies, better-sqlite3, cors (+5 more)

### Community 27 - "Top Insights Panel"
Cohesion: 0.19
Nodes (11): useDatasetCoverage(), useTopInsights(), drilldownPath(), InsightRow(), MissingDataNote(), SEVERITY_LABEL, SEVERITY_TONE, Tone (+3 more)

### Community 28 - "Server Dev Dependencies"
Cohesion: 0.15
Nodes (13): devDependencies, tsx, @types/better-sqlite3, @types/cors, @types/express, @types/multer, @types/node, tsx (+5 more)

### Community 29 - "Client Dev Dependencies"
Cohesion: 0.17
Nodes (12): devDependencies, @types/react, @types/react-dom, typescript, vite, @vitejs/plugin-react, typescript, typescript (+4 more)

### Community 30 - "Action Center"
Cohesion: 0.24
Nodes (8): useActionCenter(), ActionCenterPage(), SEVERITY_META, AttentionAlert, AttentionRequiredCard(), SEVERITY_META, SEVERITY_RANK, ActionCenterItem

### Community 31 - "Root Package Scripts"
Cohesion: 0.17
Nodes (11): concurrently, devDependencies, concurrently, name, private, scripts, dev, seed (+3 more)

### Community 32 - "Deployment & Integration Docs"
Cohesion: 0.22
Nodes (10): Rameshwaram — Master Tracking Command Centre, Client HTML Entry Point (Vite/React root), Global API Documentation.pdf, GoSelfServe (external ordering platform), GoSelfServe outbound order-status sync (BASE_URL/API_TOKEN/API_KEY), GOSELFSERVE_WEBHOOK_TOKEN (inbound order-push webhook secret), Petpooja (external POS platform), PETPOOJA_WEBHOOK_TOKEN (optional inbound webhook auth) (+2 more)

### Community 33 - "Server Package Manifest"
Cohesion: 0.20
Nodes (9): engines, node, name, private, scripts, dev, seed, start (+1 more)

### Community 34 - "Client Runtime Dependencies"
Cohesion: 0.22
Nodes (9): dependencies, react, react-dom, react-router-dom, @tanstack/react-query, react, react-dom, react-router-dom (+1 more)

### Community 35 - "Client Package Manifest"
Cohesion: 0.25
Nodes (7): name, private, scripts, build, dev, preview, type

### Community 36 - "CRUD Hook/Repository Pattern"
Cohesion: 0.29
Nodes (3): CrudHooks, Repository, BaseRecord

### Community 37 - "Maintenance Tracking"
Cohesion: 0.38
Nodes (5): maintenanceHooks, columns, formFields, MaintenancePage(), MaintenanceIssue

### Community 38 - "Purchases Tracking"
Cohesion: 0.38
Nodes (5): purchaseHooks, columns, formFields, PurchasesPage(), Purchase

### Community 39 - "Suppliers Tracking"
Cohesion: 0.38
Nodes (5): supplierHooks, columns, formFields, SuppliersPage(), Supplier

### Community 40 - "Import Result Types"
Cohesion: 0.67
Nodes (4): ExcelSheetResult, RawRowInput, PdfAdaptResult, SheetImportSummary

## Knowledge Gaps
- **237 isolated node(s):** `Candidate`, `Window`, `FactsByType`, `TypeFacts`, `SourceRef` (+232 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 278 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `formatBusinessDateLong()` connect `Sales Analytics Core` to `Import Center Hooks`, `Business Intelligence & Anomalies`, `App Shell & Navigation`, `Business Day & Sales Trend Charts`, `Formatting Utilities`, `Top Insights Panel`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `apiGet()` connect `Datasets API & Export` to `Sales Analytics Core`, `Provider Orders & Live Feed`, `Business Intelligence & Anomalies`, `Sales Data Hooks`, `KPI Scorecard & Analytics Charts`, `App Shell & Navigation`, `Business Day & Sales Trend Charts`, `Shared Table/Modal UI`, `API Client & Complaints`, `Formatting Utilities`, `Chart Components (Donut/HBar)`, `Top Insights Panel`, `Action Center`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `getCurrentBusinessDate()` connect `Formatting Utilities` to `Sales Analytics Core`, `Import Center Hooks`, `Sales Data Hooks`, `App Shell & Navigation`, `Staff & Wastage Tracking`, `Business Day & Sales Trend Charts`, `Query Intent Classification`, `Chart Components (Donut/HBar)`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `Candidate`, `Window`, `FactsByType` to the rest of the system?**
  _237 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sales Analytics Core` be split into smaller, more focused modules?**
  _Cohesion score 0.05823754789272031 - nodes in this community are weakly interconnected._
- **Should `Provider Orders & Live Feed` be split into smaller, more focused modules?**
  _Cohesion score 0.06293706293706294 - nodes in this community are weakly interconnected._
- **Should `Database Client & Seeding` be split into smaller, more focused modules?**
  _Cohesion score 0.05844155844155844 - nodes in this community are weakly interconnected._