---
type: community
members: 10
---

# Deployment & Integration Docs

**Members:** 10 nodes

## Members
- [[Client HTML Entry Point (ViteReact root)]] - code - client/index.html
- [[GOSELFSERVE_WEBHOOK_TOKEN (inbound order-push webhook secret)]] - code - render.yaml
- [[Global API Documentation.pdf]] - document - render.yaml
- [[GoSelfServe (external ordering platform)]] - concept - render.yaml
- [[GoSelfServe outbound order-status sync (BASE_URLAPI_TOKENAPI_KEY)]] - code - render.yaml
- [[PETPOOJA_WEBHOOK_TOKEN (optional inbound webhook auth)]] - code - render.yaml
- [[Petpooja (external POS platform)]] - concept - render.yaml
- [[Rameshwaram — Master Tracking Command Centre]] - concept - client/index.html
- [[qsr-data persistent disk (ephemeral-filesystem workaround for SQLite)]] - code - render.yaml
- [[rameshwaram-qsr-server (Render web service)]] - code - render.yaml

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Deployment__Integration_Docs
SORT file.name ASC
```
