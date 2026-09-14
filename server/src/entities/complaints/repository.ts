import { createRepository } from "../../shared/repository.js";
import type { ComplaintRecord } from "../../../../shared-types/entities.js";

export const complaintRepository = createRepository<ComplaintRecord>("complaints");
