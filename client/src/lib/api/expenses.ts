import { createEntityHooks } from "../createEntityHooks";
import type { ExpenseRecord } from "@shared/entities";

export const expenseHooks = createEntityHooks<ExpenseRecord>("expenses");
