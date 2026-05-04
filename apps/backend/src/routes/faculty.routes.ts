import { Router } from "express";
import multer from "multer";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";
import { z } from "zod";
import { createAnnouncement, getAnnouncements } from "../data/announcementData";
import {
  cancelLeaveRequest,
  createAttendanceSession,
  createLeaveRequest,
  createMaterial,
  deleteMaterial,
  getAttendanceSessions,
  getFacultyDashboard,
  getFacultyProfile,
  getFacultyRoster,
  getFacultySchedule,
  getFacultySubjects,
  getLeaveRequests,
  getMaterials
} from "../data/facultyData";
import { asyncHandler, ok } from "../utils/http";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

const attendanceSchema = z.object({
  subjectId: z.string(),
  date: z.string(),
  duration: z.number().int().positive(),
  marks: z.array(
    z.object({
      studentId: z.string(),
      status: z.enum(["PRESENT", "ABSENT"])
    })
  )
});

const leaveSchema = z.object({
  type: z.enum(["SICK", "CASUAL", "EARNED", "EMERGENCY"]),
  fromDate: z.string(),
  toDate: z.string(),
  reason: z.string().min(8)
});

const announcementSchema = z.object({
  title: z.string().min(4),
  body: z.string().min(8),
  category: z.enum(["ACADEMIC", "EXAM", "EVENT", "GENERAL"]).default("ACADEMIC")
});

export const facultyRouter = Router();

facultyRouter.get("/dashboard", (_req, res) => ok(res, getFacultyDashboard()));
facultyRouter.get("/announcements", (_req, res) => ok(res, getAnnouncements("STUDENT")));
facultyRouter.post("/announcements", (req, res) => {
  const input = announcementSchema.parse(req.body);
  return ok(
    res,
    createAnnouncement({
      ...input,
      audience: "STUDENT",
      author: "Faculty Desk"
    }),
    201
  );
});
facultyRouter.get("/profile", (_req, res) => ok(res, getFacultyProfile()));
facultyRouter.get("/schedule", (_req, res) => ok(res, getFacultySchedule()));
facultyRouter.get("/subjects", (_req, res) => ok(res, getFacultySubjects()));
facultyRouter.get("/subjects/:subjectId/roster", (req, res) =>
  ok(res, getFacultyRoster(req.params.subjectId))
);

facultyRouter.get("/attendance/sessions", (_req, res) => ok(res, getAttendanceSessions()));
facultyRouter.post("/attendance/sessions", (req, res) => {
  const input = attendanceSchema.parse(req.body);
  return ok(res, createAttendanceSession(input), 201);
});

facultyRouter.get("/leave", (_req, res) => ok(res, getLeaveRequests()));
facultyRouter.post("/leave", (req, res) => {
  const input = leaveSchema.parse(req.body);
  return ok(res, createLeaveRequest(input), 201);
});
facultyRouter.delete("/leave/:id", (req, res) => {
  const cancelled = cancelLeaveRequest(req.params.id);
  return cancelled
    ? ok(res, { cancelled: true })
    : res.status(409).json({ success: false, error: "Only pending leave requests can be cancelled" });
});

facultyRouter.get("/materials", (_req, res) => ok(res, getMaterials()));
facultyRouter.delete("/materials/:id", (req, res) => {
  const deleted = deleteMaterial(req.params.id);
  return deleted
    ? ok(res, { deleted: true })
    : res.status(404).json({ success: false, error: "Material not found" });
});
facultyRouter.post(
  "/materials/upload",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, error: "File is required" });
    }

    const subjectId = String(req.body.subjectId ?? "");
    const title = String(req.body.title ?? file.originalname);
    const content = await extractText(file);

    return ok(
      res,
      createMaterial({
        subjectId,
        title,
        fileName: file.originalname,
        fileSize: file.size,
        content
      }),
      201
    );
  })
);

async function extractText(file: Express.Multer.File) {
  if (file.mimetype === "application/pdf") {
    const parsed = await pdfParse(file.buffer);
    return parsed.text;
  }

  if (
    file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.originalname.toLowerCase().endsWith(".docx")
  ) {
    const parsed = await mammoth.extractRawText({ buffer: file.buffer });
    return parsed.value;
  }

  if (file.mimetype.startsWith("text/") || file.originalname.toLowerCase().endsWith(".txt")) {
    return file.buffer.toString("utf8");
  }

  throw new Error("Only PDF, DOCX, and TXT materials are supported");
}
