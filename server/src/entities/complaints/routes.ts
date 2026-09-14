import { createCrudRouter } from "../../shared/createCrudRouter.js";
import { complaintRepository } from "./repository.js";

export const complaintRouter = createCrudRouter(complaintRepository);
