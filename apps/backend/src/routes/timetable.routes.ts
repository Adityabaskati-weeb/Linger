import { Router } from "express";
import { z } from "zod";
import {
  activateTimetable,
  generateTimetable,
  getActiveTimetable,
  getTimetables,
  saveTimetable
} from "../services/timetable.service";
import { ok } from "../utils/http";

const generationSchema = z.object({
  semester: z.number().int().min(1).max(8),
  days: z.array(z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"])).min(1),
  startTime: z.string(),
  endTime: z.string(),
  slotDuration: z.number().int().min(30).max(120),
  breakStart: z.string(),
  breakDuration: z.number().int().min(0).max(180),
  maxConsecutive: z.number().int().min(1).max(4)
});

export const timetableRouter = Router();

timetableRouter.get("/active", (_req, res) => ok(res, getActiveTimetable()));
timetableRouter.get("/", (_req, res) => ok(res, getTimetables()));
timetableRouter.post("/generate", (req, res) => {
  const input = generationSchema.parse(req.body);
  return ok(res, generateTimetable(input));
});
timetableRouter.post("/save", (req, res) => ok(res, saveTimetable(req.body), 201));
timetableRouter.patch("/:id/activate", (req, res) => {
  const active = activateTimetable(req.params.id);

  if (!active) {
    return res.status(404).json({ success: false, error: "Timetable not found" });
  }

  return ok(res, active);
});
