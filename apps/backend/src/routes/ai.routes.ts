import { Router } from "express";
import { z } from "zod";
import type { AiMessage } from "@campusiq/shared";
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

aiRouter.get("/subjects", (_req, res) => ok(res, getAiSubjects()));

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
