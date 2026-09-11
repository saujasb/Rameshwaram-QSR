---
source_file: "package.json"
type: "code"
community: "Monorepo Root Config"
location: "L9"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Monorepo_Root_Config
---

# dev

## Connections
- [[scripts_1]] - `contains` [EXTRACTED]

## Source
**From** `package.json` **(starting line 9):**
```json
  "scripts": {
    "dev": "concurrently -n server,client -c blue,magenta \"npm:dev --workspace=server\" \"npm:dev --workspace=client\"",
    "seed": "npm run seed --workspace=server"
```

#graphify/code #graphify/EXTRACTED #community/Monorepo_Root_Config