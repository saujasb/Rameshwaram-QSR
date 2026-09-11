---
source_file: "package.json"
type: "code"
community: "Monorepo Root Config"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Monorepo_Root_Config
---

# package.json

## Connections
- [[devDependencies_1]] - `contains` [EXTRACTED]
- [[name_1]] - `contains` [EXTRACTED]
- [[private_1]] - `contains` [EXTRACTED]
- [[scripts_1]] - `contains` [EXTRACTED]
- [[workspaces]] - `contains` [EXTRACTED]

## Source
**Full file:** `package.json`
```json
{
  "name": "rameshwaram-qsr-dashboard",
  "private": true,
  "workspaces": [
    "client",
    "server"
  ],
  "scripts": {
    "dev": "concurrently -n server,client -c blue,magenta \"npm:dev --workspace=server\" \"npm:dev --workspace=client\"",
    "seed": "npm run seed --workspace=server"
  },
  "devDependencies": {
    "concurrently": "^9.1.0"
  }
}
```

#graphify/code #graphify/EXTRACTED #community/Monorepo_Root_Config