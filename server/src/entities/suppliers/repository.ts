import { createRepository } from "../../shared/repository.js";
import type { Supplier } from "../../../../shared-types/entities.js";

export const supplierRepository = createRepository<Supplier>("suppliers");
