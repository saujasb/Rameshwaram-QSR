import { createCrudRouter } from "../../shared/createCrudRouter.js";
import { supplierRepository } from "./repository.js";

export const supplierRouter = createCrudRouter(supplierRepository);
