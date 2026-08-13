import { createCrudRouter } from "../../shared/createCrudRouter.js";
import { orderRepository } from "./repository.js";

export const orderRouter = createCrudRouter(orderRepository);
