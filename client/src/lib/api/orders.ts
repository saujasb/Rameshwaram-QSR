import { createEntityHooks } from "../createEntityHooks";
import type { ManualOrderEntry } from "@shared/entities";

export const orderHooks = createEntityHooks<ManualOrderEntry>("orders");
