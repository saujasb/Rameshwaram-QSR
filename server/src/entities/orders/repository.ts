import { createRepository } from "../../shared/repository.js";
import type { ManualOrderEntry } from "../../../../shared-types/entities.js";

export const orderRepository = createRepository<ManualOrderEntry>("manual_orders");
