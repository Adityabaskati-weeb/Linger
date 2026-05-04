import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: error.issues.map((issue) => issue.message).join(", ")
    });
  }

  const message = error instanceof Error ? error.message : "Unexpected server error";
  const status = message.includes("Invalid email") ? 401 : 500;

  return res.status(status).json({
    success: false,
    error: message
  });
}
