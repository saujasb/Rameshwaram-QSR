import { createRepository } from "../../shared/repository.js";
import type { AttendanceRecord } from "../../../../shared-types/entities.js";

export const attendanceRepository = createRepository<AttendanceRecord>("attendance");
