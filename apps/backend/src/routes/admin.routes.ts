import { Router } from "express";
import { z } from "zod";
import { createAnnouncement, getAnnouncements } from "../data/announcementData";
import {
  createFaculty,
  createStudent,
  getAdminDashboard,
  getAttendanceAnalytics,
  getDepartments,
  getFacultyAttendance,
  getFacultyProductivity,
  getStudentOverview,
  removeFaculty,
  removeStudent
} from "../data/adminData";
import { getLeaveRequests, updateLeaveRequest } from "../data/facultyData";
import { ok } from "../utils/http";

const leaveUpdateSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  adminNote: z.string().optional()
});

const facultySchema = z.object({
  name: z.string().min(2),
  department: z.string().min(2),
  employeeId: z.string().min(2),
  subjectCode: z.string().min(2)
});

const studentSchema = z.object({
  name: z.string().min(2),
  rollNumber: z.string().min(2),
  department: z.string().min(2),
  semester: z.number().int().min(1).max(8),
  overall: z.number().int().min(0).max(100).optional()
});

const announcementSchema = z.object({
  title: z.string().min(4),
  body: z.string().min(8),
  audience: z.enum(["STUDENT", "FACULTY", "ALL"]),
  category: z.enum(["ACADEMIC", "EXAM", "EVENT", "GENERAL"]).default("GENERAL")
});

export const adminRouter = Router();

adminRouter.get("/dashboard", (_req, res) => ok(res, getAdminDashboard()));
adminRouter.get("/attendance/analytics", (_req, res) => ok(res, getAttendanceAnalytics()));
adminRouter.get("/faculty/attendance", (_req, res) => ok(res, getFacultyAttendance()));
adminRouter.get("/faculty", (_req, res) => ok(res, getFacultyProductivity()));
adminRouter.post("/faculty", (req, res) => {
  const input = facultySchema.parse(req.body);
  return ok(res, createFaculty(input), 201);
});
adminRouter.delete("/faculty/:id", (req, res) => {
  const removed = removeFaculty(req.params.id);
  return removed
    ? ok(res, { removed: true })
    : res.status(404).json({ success: false, error: "Faculty not found" });
});
adminRouter.get("/students", (_req, res) => ok(res, getStudentOverview()));
adminRouter.post("/students", (req, res) => {
  const input = studentSchema.parse(req.body);
  return ok(res, createStudent(input), 201);
});
adminRouter.delete("/students/:id", (req, res) => {
  const removed = removeStudent(req.params.id);
  return removed
    ? ok(res, { removed: true })
    : res.status(404).json({ success: false, error: "Student not found" });
});
adminRouter.get("/leave", (_req, res) => ok(res, getLeaveRequests()));
adminRouter.get("/announcements", (_req, res) => ok(res, getAnnouncements()));
adminRouter.post("/announcements", (req, res) => {
  const input = announcementSchema.parse(req.body);
  return ok(
    res,
    createAnnouncement({
      ...input,
      author: "Admin Office"
    }),
    201
  );
});
adminRouter.patch("/leave/:id", (req, res) => {
  const input = leaveUpdateSchema.parse(req.body);
  const updated = updateLeaveRequest(req.params.id, input.status, input.adminNote);

  if (!updated) {
    return res.status(404).json({ success: false, error: "Leave request not found" });
  }

  return ok(res, updated);
});

adminRouter.get("/departments", (_req, res) => ok(res, getDepartments()));
