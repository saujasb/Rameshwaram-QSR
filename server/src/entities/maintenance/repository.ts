import { createRepository } from "../../shared/repository.js";
import type { MaintenanceIssue } from "../../../../shared-types/entities.js";

export const maintenanceRepository = createRepository<MaintenanceIssue>("maintenance_issues");
