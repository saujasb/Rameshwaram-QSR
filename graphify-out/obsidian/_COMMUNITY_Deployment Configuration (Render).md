---
type: community
members: 6
---

# Deployment Configuration (Render)

**Members:** 6 nodes

## Members
- [[Client HTML Entry Point]] - code - client/index.html
- [[Ephemeral Filesystem Persistence Trade-off]] - rationale - render.yaml
- [[GoSelfServe order-status sync adapter config]] - code - render.yaml
- [[PETPOOJA_WEBHOOK_TOKEN config]] - code - render.yaml
- [[qsr-data persistent disk]] - code - render.yaml
- [[rameshwaram-qsr-server (Render web service)]] - code - render.yaml

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Deployment_Configuration_Render
SORT file.name ASC
```
