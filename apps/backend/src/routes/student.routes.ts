import { Router } from "express";
import {
  getStudentAttendanceRecords,
  getStudentAttendanceSummary,
  getStudentDashboard,
  getStudentSchedule
} from "../data/studentData";
import { ok } from "../utils/http";

export const studentRouter = Router();

studentRouter.get("/dashboard", (_req, res) => {
  return ok(res, getStudentDashboard());
});

studentRouter.get("/attendance", (req, res) => {
  const subjectId = typeof req.query.subjectId === "string" ? req.query.subjectId : undefined;
  return ok(res, getStudentAttendanceRecords(subjectId));
});

studentRouter.get("/attendance/summary", (_req, res) => {
  return ok(res, getStudentAttendanceSummary());
});

studentRouter.get("/schedule", (_req, res) => {
  return ok(res, getStudentSchedule());
});
