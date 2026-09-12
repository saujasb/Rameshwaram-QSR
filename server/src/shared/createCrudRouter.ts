import { Router } from "express";
import type { BaseRecord } from "../../../shared-types/entities.js";
import type { Repository } from "./repository.js";
import { asyncHandler } from "./asyncHandler.js";

export function createCrudRouter<T extends BaseRecord>(repo: Repository<T>): Router {
  const router = Router();

  router.get(
    "/",
    asyncHandler(async (_req, res) => {
      res.json(await repo.list());
    })
  );

  router.get(
    "/:id",
    asyncHandler(async (req, res) => {
      const record = await repo.get(req.params.id);
      if (!record) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(record);
    })
  );

  router.post(
    "/",
    asyncHandler(async (req, res) => {
      if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
        res.status(400).json({ error: "Request body must be an object" });
        return;
      }
      const record = await repo.create(req.body);
      res.status(201).json(record);
    })
  );

  router.put(
    "/:id",
    asyncHandler(async (req, res) => {
      if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
        res.status(400).json({ error: "Request body must be an object" });
        return;
      }
      const record = await repo.update(req.params.id, req.body);
      if (!record) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(record);
    })
  );

  router.delete(
    "/:id",
    asyncHandler(async (req, res) => {
      const removed = await repo.remove(req.params.id);
      if (!removed) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.status(204).end();
    })
  );

  return router;
}
