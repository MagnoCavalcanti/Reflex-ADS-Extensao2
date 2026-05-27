import { Navigate } from "react-router";
import type { ReactNode } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { TypeUser } from "../types/auth.types";
import { getDashboardPathByRole, isValidUserRole } from "../utils/auth";

type RequireRoleProps = {
  allowedRole: TypeUser;
  children: ReactNode;
};

export default function RequireRole({ allowedRole, children }: RequireRoleProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-linear-to-b from-slate-50 to-gray-100">
        <p className="text-sm text-gray-500">Carregando...</p>
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!isValidUserRole(user.type_user)) {
    return <Navigate to="/login" replace />;
  }

  if (user.type_user !== allowedRole) {
    return <Navigate to={getDashboardPathByRole(user.type_user)} replace />;
  }

  return children;
}
