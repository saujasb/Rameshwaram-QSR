import { createRepository } from "../../shared/repository.js";
import type { ExpenseRecord } from "../../../../shared-types/entities.js";

export const expenseRepository = createRepository<ExpenseRecord>("expenses");
