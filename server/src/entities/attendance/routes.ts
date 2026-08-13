import { createCrudRouter } from "../../shared/createCrudRouter.js";
import { attendanceRepository } from "./repository.js";

export const attendanceRouter = createCrudRouter(attendanceRepository);
