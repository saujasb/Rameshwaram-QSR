import { Router } from "express";
import type { BaseRecord } from "../../../shared-types/entities.js";
import type { Repository } from "./repository.js";

export function createCrudRouter<T extends BaseRecord>(repo: Repository<T>): Router {
  const router = Router();

  router.get("/", async (_req, res) => {
    try {
      res.json(await repo.list());
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Failed to list records." });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const record = await repo.get(req.params.id);
      if (!record) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(record);
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Failed to get record." });
    }
  });

  router.post("/", async (req, res) => {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      res.status(400).json({ error: "Request body must be an object" });
      return;
    }
    try {
      const record = await repo.create(req.body);
      res.status(201).json(record);
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Failed to create record." });
    }
  });

  router.put("/:id", async (req, res) => {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      res.status(400).json({ error: "Request body must be an object" });
      return;
    }
    try {
      const record = await repo.update(req.params.id, req.body);
      if (!record) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(record);
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Failed to update record." });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      const removed = await repo.remove(req.params.id);
      if (!removed) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Failed to delete record." });
    }
  });

  return router;
}
