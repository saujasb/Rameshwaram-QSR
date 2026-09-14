import { Router } from "express";
import { analyticsSnapshot } from "./data.js";
import { prioritizedActions } from "./actions-data.js";

export const analyticsRouter: Router = Router();

analyticsRouter.get("/snapshot", (_req, res) => {
  res.json(analyticsSnapshot);
});

analyticsRouter.get("/actions", (_req, res) => {
  res.json(prioritizedActions);
});
