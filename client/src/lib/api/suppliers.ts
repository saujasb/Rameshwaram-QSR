import { createEntityHooks } from "../createEntityHooks";
import type { Supplier } from "@shared/entities";

export const supplierHooks = createEntityHooks<Supplier>("suppliers");
