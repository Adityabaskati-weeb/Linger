import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { AuthResponse, Role, User } from "@campusiq/shared";
import { demoUsers, publicUser } from "../data/demoData";

const refreshTokens = new Map<string, string>();

const accessSecret =
  process.env.JWT_ACCESS_SECRET ?? "campusiq-dev-access-secret-change-before-production";
const refreshSecret =
  process.env.JWT_REFRESH_SECRET ?? "campusiq-dev-refresh-secret-change-before-production";

interface TokenPayload {
  userId: string;
  role: Role;
  name: string;
}

function signAccessToken(user: User) {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
      name: user.name
    } satisfies TokenPayload,
    accessSecret,
    { expiresIn: "15m" }
  );
}

function signRefreshToken(user: User) {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
      name: user.name
    } satisfies TokenPayload,
    refreshSecret,
    { expiresIn: "7d" }
  );
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const record = demoUsers.find((user) => user.email.toLowerCase() === email.toLowerCase());

  if (!record) {
    throw new Error("Invalid email or password");
  }

  const matches = await bcrypt.compare(password, record.passwordHash);

  if (!matches) {
    throw new Error("Invalid email or password");
  }

  const user = publicUser(record);
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  refreshTokens.set(refreshToken, user.id);

  return {
    accessToken,
    refreshToken,
    user
  };
}

export function refreshAccessToken(refreshToken: string): AuthResponse {
  const userId = refreshTokens.get(refreshToken);

  if (!userId) {
    throw new Error("Refresh token is invalid or expired");
  }

  jwt.verify(refreshToken, refreshSecret);
  const record = demoUsers.find((user) => user.id === userId);

  if (!record) {
    throw new Error("User not found");
  }

  const user = publicUser(record);
  const nextRefreshToken = signRefreshToken(user);
  refreshTokens.delete(refreshToken);
  refreshTokens.set(nextRefreshToken, user.id);

  return {
    accessToken: signAccessToken(user),
    refreshToken: nextRefreshToken,
    user
  };
}

export function logoutUser(refreshToken: string) {
  refreshTokens.delete(refreshToken);
}

export function getUserById(userId: string) {
  const record = demoUsers.find((user) => user.id === userId);
  return record ? publicUser(record) : null;
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, accessSecret) as TokenPayload;
}
