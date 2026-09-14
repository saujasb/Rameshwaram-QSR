---
type: community
members: 30
---

# Dataset Schema & Migrations

**Members:** 30 nodes

## Members
- [[DatasetRecord]] - code - shared-types/datasets.ts
- [[DatasetTotals]] - code - server/src/entities/datasets/repository.ts
- [[SegmentPerformanceRow]] - code - server/src/entities/datasets/repository.ts
- [[UpsertResult]] - code - server/src/entities/datasets/repository.ts
- [[categoryTotals()]] - code - server/src/entities/datasets/repository.ts
- [[channelTotals()]] - code - server/src/entities/datasets/repository.ts
- [[csvCell()]] - code - server/src/entities/datasets/routes.ts
- [[datasetsdb.ts]] - code - server/src/entities/datasets/db.ts
- [[datasetsrepository.ts]] - code - server/src/entities/datasets/repository.ts
- [[datasetsroutes.ts]] - code - server/src/entities/datasets/routes.ts
- [[datasetsRouter]] - code - server/src/entities/datasets/routes.ts
- [[deleteImportBatch()]] - code - server/src/entities/datasets/repository.ts
- [[ensureDatasetTables()]] - code - server/src/entities/datasets/db.ts
- [[exportRecords()]] - code - server/src/entities/datasets/repository.ts
- [[findByFingerprint]] - code - server/src/entities/datasets/repository.ts
- [[getImportBatch()]] - code - server/src/entities/datasets/repository.ts
- [[insertStmt]] - code - server/src/entities/datasets/repository.ts
- [[listImportBatches()]] - code - server/src/entities/datasets/repository.ts
- [[mapRecord()]] - code - server/src/entities/datasets/repository.ts
- [[migrateLegacySalesLineItems()]] - code - server/src/entities/datasets/db.ts
- [[parseFilter()_1]] - code - server/src/entities/datasets/routes.ts
- [[productKeyOf()]] - code - server/src/entities/datasets/repository.ts
- [[queryRecords()]] - code - server/src/entities/datasets/repository.ts
- [[rowToBatch()]] - code - server/src/entities/datasets/repository.ts
- [[setBusinessDayStartHour()]] - code - server/src/entities/datasets/db.ts
- [[tableExists()]] - code - server/src/entities/datasets/db.ts
- [[updateStmt]] - code - server/src/entities/datasets/repository.ts
- [[upload]] - code - server/src/entities/datasets/routes.ts
- [[uploadFiles()]] - code - server/src/entities/datasets/routes.ts
- [[upsertRecords()]] - code - server/src/entities/datasets/repository.ts

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Dataset_Schema__Migrations
SORT file.name ASC
```

## Connections to other communities
- 48 edges to [[_COMMUNITY_Sales Analytics Core]]
- 10 edges to [[_COMMUNITY_Dataset Import Pipeline]]
- 6 edges to [[_COMMUNITY_Database Client & Seeding]]
- 4 edges to [[_COMMUNITY_Datasets API & Export]]
- 2 edges to [[_COMMUNITY_Business Intelligence & Anomalies]]
- 2 edges to [[_COMMUNITY_Sales Database Repository]]
- 2 edges to [[_COMMUNITY_Business Day & Sales Trend Charts]]

## Top bridge nodes
- [[datasetsrepository.ts]] - degree 58, connects to 6 communities
- [[datasetsroutes.ts]] - degree 30, connects to 3 communities
- [[datasetsdb.ts]] - degree 11, connects to 3 communities
- [[DatasetRecord]] - degree 5, connects to 3 communities
- [[listImportBatches()]] - degree 5, connects to 1 community