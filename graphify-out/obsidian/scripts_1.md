---
source_file: "package.json"
type: "code"
community: "Monorepo Root Config"
location: "L8"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Monorepo_Root_Config
---

# scripts

## Connections
- [[dev_1]] - `contains` [EXTRACTED]
- [[package.json]] - `contains` [EXTRACTED]
- [[seed]] - `contains` [EXTRACTED]

## Source
**From** `package.json` **(starting line 8):**
```json
  ],
  "scripts": {
    "dev": "concurrently -n server,client -c blue,magenta \"npm:dev --workspace=server\" \"npm:dev --workspace=client\"",
```

#graphify/code #graphify/EXTRACTED #community/Monorepo_Root_Config