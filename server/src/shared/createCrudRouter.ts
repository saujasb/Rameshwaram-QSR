import { Router } from "express";
import type { BaseRecord } from "../../../shared-types/entities.js";
import type { Repository } from "./repository.js";

export function createCrudRouter<T extends BaseRecord>(repo: Repository<T>): Router {
  const router = Router();

  router.get("/", (_req, res) => {
    res.json(repo.list());
  });

  router.get("/:id", (req, res) => {
    const record = repo.get(req.params.id);
    if (!record) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(record);
  });

  router.post("/", (req, res) => {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      res.status(400).json({ error: "Request body must be an object" });
      return;
    }
    const record = repo.create(req.body);
    res.status(201).json(record);
  });

  router.put("/:id", (req, res) => {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      res.status(400).json({ error: "Request body must be an object" });
      return;
    }
    const record = repo.update(req.params.id, req.body);
    if (!record) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(record);
  });

  router.delete("/:id", (req, res) => {
    const removed = repo.remove(req.params.id);
    if (!removed) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.status(204).end();
  });

  return router;
}
