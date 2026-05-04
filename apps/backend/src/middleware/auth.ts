import type { NextFunction, Request, Response } from "express";
import { getUserById, verifyAccessToken } from "../services/auth.service";

export interface AuthenticatedRequest extends Request {
  user?: NonNullable<ReturnType<typeof getUserById>>;
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;

  if (!token) {
    return res.status(401).json({ success: false, error: "Missing access token" });
  }

  try {
    const payload = verifyAccessToken(token);
    const user = getUserById(payload.userId);

    if (!user) {
      return res.status(401).json({ success: false, error: "User not found" });
    }

    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ success: false, error: "Invalid or expired access token" });
  }
}
