import { createEntityHooks } from "../createEntityHooks";
import type { Purchase } from "@shared/entities";

export const purchaseHooks = createEntityHooks<Purchase>("purchases");
