import { createRepository } from "../../shared/repository.js";
import type { Task } from "../../../../shared-types/entities.js";

export const taskRepository = createRepository<Task>("tasks");
