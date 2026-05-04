import type { NextFunction, Response } from "express";
import type { Role } from "@campusiq/shared";
import type { AuthenticatedRequest } from "./auth";

export const requireRole =
  (...roles: Role[]) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: "Forbidden" });
    }

    return next();
  };
