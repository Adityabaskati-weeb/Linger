import { Router } from "express";
import { loginSchema, logoutSchema, refreshSchema } from "@campusiq/shared";
import { authenticate, type AuthenticatedRequest } from "../middleware/auth";
import { loginUser, logoutUser, refreshAccessToken } from "../services/auth.service";
import { asyncHandler, ok } from "../utils/http";

export const authRouter = Router();

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const input = loginSchema.parse(req.body);
    const session = await loginUser(input.email, input.password);
    return ok(res, session);
  })
);

authRouter.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    const input = refreshSchema.parse(req.body);
    return ok(res, refreshAccessToken(input.refreshToken));
  })
);

authRouter.post(
  "/logout",
  asyncHandler(async (req, res) => {
    const input = logoutSchema.parse(req.body);
    logoutUser(input.refreshToken);
    return ok(res, { loggedOut: true });
  })
);

authRouter.get("/me", authenticate, (req: AuthenticatedRequest, res) => {
  return ok(res, req.user);
});
