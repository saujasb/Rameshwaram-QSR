import { createCrudRouter } from "../../shared/createCrudRouter.js";
import { expenseRepository } from "./repository.js";

export const expenseRouter = createCrudRouter(expenseRepository);
