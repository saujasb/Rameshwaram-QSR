import { createCrudRouter } from "../../shared/createCrudRouter.js";
import { maintenanceRepository } from "./repository.js";

export const maintenanceRouter = createCrudRouter(maintenanceRepository);
