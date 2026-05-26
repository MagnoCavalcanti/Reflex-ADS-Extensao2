import { Navigate } from "react-router";
import type { ReactNode } from "react";
import { useAuth } from "../contexts/AuthContext";

type RedirectIfAuthenticatedProps = {
  children: ReactNode;
};

export default function RedirectIfAuthenticated({ children }: RedirectIfAuthenticatedProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-linear-to-b from-slate-50 to-gray-100">
        <p className="text-sm text-gray-500">Carregando...</p>
      </main>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
