import { createCrudRouter } from "../../shared/createCrudRouter.js";
import { wastageRepository } from "./repository.js";

export const wastageRouter = createCrudRouter(wastageRepository);
