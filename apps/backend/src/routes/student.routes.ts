import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import {
  getStudentAttendanceRecords,
  getStudentAttendanceSummary,
  getStudentDashboard,
  getStudentSchedule
} from "../data/studentData";
import {
  createNocApplication,
  createProjectUpload,
  createStudentLeave,
  getOnlineTestSession,
  getStudentProfile,
  getStudentPortal
} from "../data/studentPortalData";
import { ok } from "../utils/http";

export const studentRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const nocSchema = z.object({
  type: z.enum(["Campus Placed", "Direct-Placement", "Direct only Internship"])
});

const leaveSchema = z.object({
  fromDate: z.string().min(8),
  toDate: z.string().min(8),
  reason: z.string().min(8)
});

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

studentRouter.get("/profile", (_req, res) => {
  return ok(res, getStudentProfile());
});

studentRouter.get("/services", (_req, res) => {
  return ok(res, getStudentPortal());
});

studentRouter.get("/online-test", (_req, res) => {
  return ok(res, getOnlineTestSession());
});

studentRouter.post("/project/upload", upload.single("file"), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ success: false, error: "Project file is required" });
  }

  return ok(
    res,
    createProjectUpload({
      title: String(req.body.title ?? file.originalname),
      type: String(req.body.type ?? "Project File"),
      fileName: file.originalname
    }),
    201
  );
});

studentRouter.post("/noc", (req, res) => {
  const input = nocSchema.parse(req.body);
  return ok(res, createNocApplication(input), 201);
});

studentRouter.post("/leave", upload.single("document"), (req, res) => {
  const input = leaveSchema.parse(req.body);
  return ok(
    res,
    createStudentLeave({
      ...input,
      documentName: req.file?.originalname
    }),
    201
  );
});
