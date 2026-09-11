import { createEntityHooks } from "../createEntityHooks";
import type { WastageEntry } from "@shared/entities";

export const wastageHooks = createEntityHooks<WastageEntry>("wastage");
