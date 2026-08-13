import { createRepository } from "../../shared/repository.js";
import type { WastageEntry } from "../../../../shared-types/entities.js";

export const wastageRepository = createRepository<WastageEntry>("wastage");
