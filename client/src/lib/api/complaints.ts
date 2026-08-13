import { createEntityHooks } from "../createEntityHooks";
import type { ComplaintRecord } from "@shared/entities";

export const complaintHooks = createEntityHooks<ComplaintRecord>("complaints");
