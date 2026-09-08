---
source_file: "server/package.json"
type: "code"
community: "Server Package Dependencies"
location: "L10"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Server_Package_Dependencies
---

# start

## Connections
- [[scripts_2]] - `contains` [EXTRACTED]

## Source
**From** `server/package.json` **(starting line 10):**
```json
    "dev": "tsx watch --clear-screen=false src/index.ts",
    "start": "tsx src/index.ts",
    "seed": "tsx src/db/seed/run.ts"
```

#graphify/code #graphify/EXTRACTED #community/Server_Package_Dependencies