import { Router } from "express";
import { createCrudRouter } from "../../shared/createCrudRouter.js";
import { taskRepository } from "./repository.js";
import type { TaskHistoryEntry } from "../../../../shared-types/entities.js";

export const taskRouter: Router = createCrudRouter(taskRepository);

async function appendHistory(taskId: string, action: string, note: string) {
  const task = await taskRepository.get(taskId);
  if (!task) return undefined;
  const entry: TaskHistoryEntry = { timestamp: new Date().toISOString(), action, note };
  return { history: [...task.history, entry] };
}

taskRouter.post("/:id/complete", async (req, res) => {
  const historyPatch = await appendHistory(req.params.id, "completed", req.body?.note ?? "");
  if (!historyPatch) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const updated = await taskRepository.update(req.params.id, {
    status: "completed",
    completionTime: new Date().toISOString(),
    ...historyPatch,
  });
  res.json(updated);
});

taskRouter.post("/:id/reassign", async (req, res) => {
  const employee = req.body?.assignedEmployee ?? null;
  const historyPatch = await appendHistory(req.params.id, "reassigned", `Reassigned to ${employee ?? "unassigned"}`);
  if (!historyPatch) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const updated = await taskRepository.update(req.params.id, { assignedEmployee: employee, ...historyPatch });
  res.json(updated);
});

taskRouter.post("/:id/note", async (req, res) => {
  const note = req.body?.note ?? "";
  const historyPatch = await appendHistory(req.params.id, "note_added", note);
  if (!historyPatch) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const updated = await taskRepository.update(req.params.id, { notes: note, ...historyPatch });
  res.json(updated);
});

taskRouter.post("/:id/report-issue", async (req, res) => {
  const issue = req.body?.issue ?? "";
  const historyPatch = await appendHistory(req.params.id, "issue_reported", issue);
  if (!historyPatch) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const updated = await taskRepository.update(req.params.id, { issue, status: "failed", ...historyPatch });
  res.json(updated);
});

taskRouter.post("/:id/verify", async (req, res) => {
  const verifiedBy = req.body?.verifiedBy ?? "";
  const historyPatch = await appendHistory(req.params.id, "verified", `Verified by ${verifiedBy}`);
  if (!historyPatch) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const updated = await taskRepository.update(req.params.id, { verifiedBy, ...historyPatch });
  res.json(updated);
});
