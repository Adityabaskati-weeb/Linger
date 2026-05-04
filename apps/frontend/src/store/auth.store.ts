import type { AuthResponse, User } from "@campusiq/shared";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../lib/axios";

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refreshAccess: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: async (email, password) => {
        const response = await api.post<{ success: true; data: AuthResponse }>("/auth/login", {
          email,
          password
        });
        const session = response.data.data;

        set({
          user: session.user,
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
          isAuthenticated: true
        });

        return session.user;
      },
      logout: async () => {
        const refreshToken = get().refreshToken;

        if (refreshToken) {
          await api.post("/auth/logout", { refreshToken }).catch(() => undefined);
        }

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false
        });
      },
      refreshAccess: async () => {
        const refreshToken = get().refreshToken;

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await api.post<{ success: true; data: AuthResponse }>("/auth/refresh", {
          refreshToken
        });
        const session = response.data.data;

        set({
          user: session.user,
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
          isAuthenticated: true
        });
      }
    }),
    {
      name: "campusiq-auth"
    }
  )
);
