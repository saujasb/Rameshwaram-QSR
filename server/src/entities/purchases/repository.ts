import { createRepository } from "../../shared/repository.js";
import type { Purchase } from "../../../../shared-types/entities.js";

export const purchaseRepository = createRepository<Purchase>("purchases");
