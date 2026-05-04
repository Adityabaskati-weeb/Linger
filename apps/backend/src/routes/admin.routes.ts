import { Router } from "express";
import { z } from "zod";
import {
  getAdminDashboard,
  getAttendanceAnalytics,
  getFacultyProductivity,
  getStudentOverview
} from "../data/adminData";
import { getLeaveRequests, updateLeaveRequest } from "../data/facultyData";
import { ok } from "../utils/http";

const leaveUpdateSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  adminNote: z.string().optional()
});

export const adminRouter = Router();

adminRouter.get("/dashboard", (_req, res) => ok(res, getAdminDashboard()));
adminRouter.get("/attendance/analytics", (_req, res) => ok(res, getAttendanceAnalytics()));
adminRouter.get("/faculty", (_req, res) => ok(res, getFacultyProductivity()));
adminRouter.get("/students", (_req, res) => ok(res, getStudentOverview()));
adminRouter.get("/leave", (_req, res) => ok(res, getLeaveRequests()));
adminRouter.patch("/leave/:id", (req, res) => {
  const input = leaveUpdateSchema.parse(req.body);
  const updated = updateLeaveRequest(req.params.id, input.status, input.adminNote);

  if (!updated) {
    return res.status(404).json({ success: false, error: "Leave request not found" });
  }

  return ok(res, updated);
});

adminRouter.get("/departments", (_req, res) =>
  ok(res, [
    { id: "dept-cs", name: "Computer Science", code: "CS", courses: 4 },
    { id: "dept-ece", name: "Electronics", code: "ECE", courses: 3 },
    { id: "dept-me", name: "Mechanical", code: "ME", courses: 3 },
    { id: "dept-ce", name: "Civil", code: "CE", courses: 3 }
  ])
);
