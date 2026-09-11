import { Router } from "express";
import type { ActionCenterItem } from "../../../shared-types/entities.js";
import { computeInventoryStatus } from "../../../shared-types/inventoryStatus.js";
import { taskRepository } from "../entities/tasks/repository.js";
import { maintenanceRepository } from "../entities/maintenance/repository.js";
import { complaintRepository } from "../entities/complaints/repository.js";
import { inventoryRepository } from "../entities/inventory/repository.js";
import { purchaseRepository } from "../entities/purchases/repository.js";
import { wastageRepository } from "../entities/wastage/repository.js";

const WASTAGE_SINGLE_ENTRY_ATTENTION_KG = 3;

function buildActionCenter(): ActionCenterItem[] {
  const items: ActionCenterItem[] = [];
  const now = new Date().toISOString();
  const today = now.slice(0, 10);

  for (const task of taskRepository.list()) {
    const isOpen = task.status !== "completed" && task.status !== "failed";
    const isPastDue = task.dueTime ? new Date(task.dueTime).getTime() < Date.now() : false;
    if (isOpen && isPastDue) {
      items.push({
        id: `task-overdue-${task.id}`,
        severity: task.priority === "critical" || task.priority === "high" ? "critical" : "attention",
        title: `Overdue: ${task.name}`,
        detail: `${task.department} · due ${task.dueTime ?? "unspecified"} · assigned to ${task.assignedEmployee ?? "unassigned"}`,
        module: "tasks",
        linkPath: `/tasks?focus=${task.id}`,
        timestamp: task.dueTime ?? task.updatedAt,
      });
    }
    if (task.status === "failed" && task.issue) {
      items.push({
        id: `task-issue-${task.id}`,
        severity: "critical",
        title: `Issue reported: ${task.name}`,
        detail: task.issue,
        module: "tasks",
        linkPath: `/tasks?focus=${task.id}`,
        timestamp: task.updatedAt,
      });
    }
    if (task.status === "completed" && task.completionTime?.slice(0, 10) === today) {
      items.push({
        id: `task-completed-${task.id}`,
        severity: "completed",
        title: `Completed: ${task.name}`,
        detail: `Completed by ${task.assignedEmployee ?? "unassigned"}`,
        module: "tasks",
        linkPath: `/tasks?focus=${task.id}`,
        timestamp: task.completionTime,
      });
    }
  }

  for (const issue of maintenanceRepository.list()) {
    if (issue.status === "resolved") {
      if (issue.updatedAt.slice(0, 10) === today) {
        items.push({
          id: `maintenance-resolved-${issue.id}`,
          severity: "completed",
          title: `Maintenance resolved: ${issue.equipment}`,
          detail: issue.location,
          module: "maintenance",
          linkPath: `/maintenance?focus=${issue.id}`,
          timestamp: issue.updatedAt,
        });
      }
      continue;
    }
    items.push({
      id: `maintenance-open-${issue.id}`,
      severity: issue.priority === "critical" || issue.priority === "high" ? "critical" : "attention",
      title: `${issue.equipment} — ${issue.status.replace("_", " ")}`,
      detail: `${issue.location}: ${issue.issueDescription}`,
      module: "maintenance",
      linkPath: `/maintenance?focus=${issue.id}`,
      timestamp: issue.dateReported,
    });
  }

  for (const complaint of complaintRepository.list()) {
    if (complaint.status === "resolved") {
      if (complaint.updatedAt.slice(0, 10) === today) {
        items.push({
          id: `complaint-resolved-${complaint.id}`,
          severity: "completed",
          title: `Complaint resolved: ${complaint.issueType}`,
          detail: complaint.resolution || complaint.customerName,
          module: "complaints",
          linkPath: `/complaints?focus=${complaint.id}`,
          timestamp: complaint.updatedAt,
        });
      }
      continue;
    }
    items.push({
      id: `complaint-open-${complaint.id}`,
      severity: complaint.status === "escalated" ? "critical" : "attention",
      title: `Complaint: ${complaint.issueType}`,
      detail: `${complaint.customerName || "Guest"} · ${complaint.status}`,
      module: "complaints",
      linkPath: `/complaints?focus=${complaint.id}`,
      timestamp: complaint.date,
    });
  }

  for (const item of inventoryRepository.list()) {
    const status = computeInventoryStatus(item);
    if (status === "out_of_stock" || status === "critical") {
      items.push({
        id: `inventory-${status}-${item.id}`,
        severity: "critical",
        title: `${status === "out_of_stock" ? "Out of stock" : "Critical stock"}: ${item.name}`,
        detail: `On hand ${item.onHandQty ?? 0} ${item.unit}`,
        module: "inventory",
        linkPath: `/inventory?focus=${item.id}`,
        timestamp: item.lastCountedAt ?? item.updatedAt,
      });
    } else if (status === "low") {
      items.push({
        id: `inventory-low-${item.id}`,
        severity: "attention",
        title: `Low stock: ${item.name}`,
        detail: `On hand ${item.onHandQty ?? 0} ${item.unit}`,
        module: "inventory",
        linkPath: `/inventory?focus=${item.id}`,
        timestamp: item.lastCountedAt ?? item.updatedAt,
      });
    }
  }

  for (const purchase of purchaseRepository.list()) {
    if (purchase.status === "received") continue;
    const isOverdue = purchase.expectedDelivery ? new Date(purchase.expectedDelivery).getTime() < Date.now() : false;
    if (isOverdue) {
      items.push({
        id: `purchase-overdue-${purchase.id}`,
        severity: "attention",
        title: `Purchase overdue: ${purchase.item}`,
        detail: `From ${purchase.supplierName} · expected ${purchase.expectedDelivery}`,
        module: "purchases",
        linkPath: `/purchases?focus=${purchase.id}`,
        timestamp: purchase.expectedDelivery ?? purchase.updatedAt,
      });
    }
  }

  for (const entry of wastageRepository.list()) {
    if (entry.date === today && entry.quantityKg >= WASTAGE_SINGLE_ENTRY_ATTENTION_KG) {
      items.push({
        id: `wastage-high-${entry.id}`,
        severity: "attention",
        title: `High wastage logged: ${entry.itemName}`,
        detail: `${entry.quantityKg} kg · ${entry.reasonCode?.replace("_", " ") ?? "reason not recorded"} · ${entry.shift ?? "shift not recorded"}`,
        module: "wastage",
        linkPath: `/wastage?focus=${entry.id}`,
        timestamp: entry.createdAt,
      });
    }
  }

  return items.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
}

export const actionCenterRouter: Router = Router();

actionCenterRouter.get("/", (_req, res) => {
  res.json(buildActionCenter());
});
