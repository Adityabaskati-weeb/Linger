export const roles = ["STUDENT", "FACULTY", "ADMIN"] as const;

export type Role = (typeof roles)[number];

export interface User {
  id: string;
  email: string;
  role: Role;
  name: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
