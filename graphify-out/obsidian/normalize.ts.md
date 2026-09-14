---
source_file: "server/src/entities/datasets/normalize.ts"
type: "code"
community: "Dataset Import Pipeline"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import_Pipeline
---

# normalize.ts

## Connections
- [[BuildContext]] - `contains` [EXTRACTED]
- [[BuildOutcome]] - `contains` [EXTRACTED]
- [[DatasetRecord]] - `imports` [EXTRACTED]
- [[DatasetType]] - `imports` [EXTRACTED]
- [[FLAG_MESSAGES]] - `contains` [EXTRACTED]
- [[FLAG_SEVERITY]] - `contains` [EXTRACTED]
- [[ImportQuality]] - `imports` [EXTRACTED]
- [[QualityInput]] - `contains` [EXTRACTED]
- [[QualityIssue]] - `imports` [EXTRACTED]
- [[RawRowInput]] - `contains` [EXTRACTED]
- [[RecordFlag]] - `imports` [EXTRACTED]
- [[SourceType]] - `imports` [EXTRACTED]
- [[buildRecord()]] - `contains` [EXTRACTED]
- [[businessDate.ts]] - `imports_from` [EXTRACTED]
- [[coerce.ts]] - `imports_from` [EXTRACTED]
- [[datasetsimportPipeline.ts]] - `imports_from` [EXTRACTED]
- [[excel.ts]] - `imports_from` [EXTRACTED]
- [[fingerprintFor()]] - `contains` [EXTRACTED]
- [[getBusinessDate()]] - `imports` [EXTRACTED]
- [[pdfAdapter.ts]] - `imports_from` [EXTRACTED]
- [[productKeyOf()_1]] - `imports` [EXTRACTED]
- [[scoreQuality()]] - `contains` [EXTRACTED]
- [[severityRank()]] - `contains` [EXTRACTED]
- [[shared-typesdatasets.ts]] - `imports_from` [EXTRACTED]
- [[tallyFlags()]] - `contains` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/Dataset_Import_Pipeline