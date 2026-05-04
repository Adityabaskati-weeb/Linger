import { Router } from "express";
import multer from "multer";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";
import { z } from "zod";
import type { AiMessage } from "@campusiq/shared";
import { createMaterial } from "../data/facultyData";
import type { AuthenticatedRequest } from "../middleware/auth";
import {
  clearAiHistory,
  getAiHistory,
  getAiSubjects,
  saveAiExchange,
  streamStudyResponse
} from "../services/ai.service";
import { asyncHandler, ok } from "../utils/http";

const chatSchema = z.object({
  subjectId: z.string(),
  mode: z.enum(["text", "quiz", "summary"]).default("text"),
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string()
    })
  )
});

export const aiRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

aiRouter.get("/subjects", (_req, res) => ok(res, getAiSubjects()));

aiRouter.post(
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

aiRouter.get("/history/:subjectId", (req: AuthenticatedRequest, res) => {
  return ok(res, getAiHistory(req.user!.id, req.params.subjectId));
});

aiRouter.delete("/history/:subjectId", (req: AuthenticatedRequest, res) => {
  clearAiHistory(req.user!.id, req.params.subjectId);
  return ok(res, { cleared: true });
});

aiRouter.post(
  "/chat",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const input = chatSchema.parse(req.body);
    const latestUserMessage = [...input.messages].reverse().find((message) => message.role === "user");

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    let fullResponse = "";
    await streamStudyResponse(input, async (token) => {
      fullResponse += token;
      res.write(`data: ${JSON.stringify({ token })}\n\n`);
    });

    if (latestUserMessage) {
      saveAiExchange(req.user!.id, input.subjectId, latestUserMessage as AiMessage, {
        role: "assistant",
        content: fullResponse
      });
    }

    res.write("data: [DONE]\n\n");
    res.end();
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
