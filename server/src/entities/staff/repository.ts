import { createRepository } from "../../shared/repository.js";
import type { StaffMember } from "../../../../shared-types/entities.js";

export const staffRepository = createRepository<StaffMember>("staff");
