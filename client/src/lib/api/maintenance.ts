import { createEntityHooks } from "../createEntityHooks";
import type { MaintenanceIssue } from "@shared/entities";

export const maintenanceHooks = createEntityHooks<MaintenanceIssue>("maintenance");
