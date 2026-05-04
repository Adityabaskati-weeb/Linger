import type { ReactNode } from "react";
import type { Role } from "@campusiq/shared";
import { Navigate } from "react-router-dom";
import { roleToRoute } from "../../lib/utils";
import { useAuthStore } from "../../store/auth.store";

interface ProtectedRouteProps {
  allowedRole: Role;
  children: ReactNode;
}

export function ProtectedRoute({ allowedRole, children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    return <Navigate to={roleToRoute(user.role)} replace />;
  }

  return children;
}
