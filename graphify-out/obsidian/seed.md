---
source_file: "package.json"
type: "code"
community: "Monorepo Root Config"
location: "L10"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Monorepo_Root_Config
---

# seed

## Connections
- [[scripts_1]] - `contains` [EXTRACTED]

## Source
**From** `package.json` **(starting line 10):**
```json
    "dev": "concurrently -n server,client -c blue,magenta \"npm:dev --workspace=server\" \"npm:dev --workspace=client\"",
    "seed": "npm run seed --workspace=server"
  },
```

#graphify/code #graphify/EXTRACTED #community/Monorepo_Root_Config