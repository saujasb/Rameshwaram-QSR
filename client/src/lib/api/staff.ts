import { createEntityHooks } from "../createEntityHooks";
import type { StaffMember, AttendanceRecord } from "@shared/entities";

export const staffHooks = createEntityHooks<StaffMember>("staff");
export const attendanceHooks = createEntityHooks<AttendanceRecord>("attendance");
