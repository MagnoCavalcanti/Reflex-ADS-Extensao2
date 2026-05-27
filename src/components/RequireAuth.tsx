import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import type { ReactNode } from "react";

type RequireAuthProps = {
  children: ReactNode;
};

export default function RequireAuth({ children }: RequireAuthProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-linear-to-b from-slate-50 to-gray-100">
        <p className="text-sm text-gray-500">Carregando...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
