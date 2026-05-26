import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { getDashboardPathByRole, isValidUserRole } from "../utils/auth";

export default function DashboardPage() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-gray-700">
        Carregando...
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!isValidUserRole(user.type_user)) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getDashboardPathByRole(user.type_user)} replace />;
}
