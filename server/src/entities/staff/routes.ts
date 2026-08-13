import { createCrudRouter } from "../../shared/createCrudRouter.js";
import { staffRepository } from "./repository.js";

export const staffRouter = createCrudRouter(staffRepository);
