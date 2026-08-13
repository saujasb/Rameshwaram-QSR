import { createEntityHooks } from "../createEntityHooks";
import type { Task } from "@shared/entities";

export const taskHooks = createEntityHooks<Task>("tasks");
