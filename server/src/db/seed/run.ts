import { wastageRepository } from "../../entities/wastage/repository.js";
import { taskRepository } from "../../entities/tasks/repository.js";
import { inventoryRepository } from "../../entities/inventory/repository.js";
import { analyticsSnapshot } from "../../entities/analytics/data.js";

// Idempotent: only seeds a table the first time it's empty, so re-running
// `npm run seed` after a manager has added real records never overwrites them.

async function seedWastage() {
  if ((await wastageRepository.list()).length > 0) return;
  for (const item of analyticsSnapshot.wastage) {
    await wastageRepository.create({
      itemName: item.name,
      quantityKg: item.wastageKg,
      reasonCode: null, // not recorded in the source report
      employeeName: null,
      shift: null,
      date: analyticsSnapshot.reportDate,
      estimatedCostRupees: null,
      notes: item.topContributor ? "Top-4 wastage contributor on the source report." : "",
      source: "seed",
    });
  }
  console.log(`[seed] wastage: ${analyticsSnapshot.wastage.length} rows (07-Aug-2026 report)`);
}

// The 6 real SOPs from the source playbook, converted to task templates.
// assignedEmployee/dueTime/status are left genuinely empty for a manager to fill in.
const SOP_TASKS = [
  {
    name: "Batter count & carry-over logging",
    sopReference: "SOP 5.1",
    department: "Kitchen",
  },
  {
    name: "Demand-led production planning (par levels)",
    sopReference: "SOP 5.2",
    department: "Kitchen",
  },
  {
    name: "Portion & recipe control",
    sopReference: "SOP 5.3",
    department: "Kitchen",
  },
  {
    name: "Wastage logging discipline",
    sopReference: "SOP 5.4",
    department: "Kitchen",
  },
  {
    name: "Countable-stock & shrinkage control",
    sopReference: "SOP 5.5",
    department: "Front Counter",
  },
  {
    name: "Daily close & reconciliation cadence",
    sopReference: "SOP 5.6",
    department: "Management",
  },
];

async function seedTasks() {
  if ((await taskRepository.list()).length > 0) return;
  for (const sop of SOP_TASKS) {
    await taskRepository.create({
      name: sop.name,
      category: "spo",
      department: sop.department,
      shift: "any",
      frequency: "daily",
      assignedEmployee: null,
      dueTime: null,
      priority: "high",
      status: "not_started",
      completionTime: null,
      notes: "",
      issue: null,
      verifiedBy: null,
      sopReference: sop.sopReference,
      history: [],
      source: "seed",
    });
  }
  console.log(`[seed] tasks: ${SOP_TASKS.length} SOP templates`);
}

async function seedInventory() {
  if ((await inventoryRepository.list()).length > 0) return;
  let count = 0;
  for (const veg of analyticsSnapshot.vegIndent) {
    await inventoryRepository.create({
      name: veg.name,
      category: "Vegetable / Produce",
      unit: veg.unit ?? "",
      parLevel: null,
      minLevel: null,
      reorderLevel: null,
      supplierId: null,
      onHandQty: null,
      lastCountedAt: null,
      source: "seed",
    });
    count++;
  }
  console.log(`[seed] inventory: ${count} item-master rows (names/units from the veg indent; no quantities — awaiting first stock count)`);
}

await seedWastage();
await seedTasks();
await seedInventory();
console.log("[seed] done");
