import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { isValidUserRole } from "../utils/auth";

export default function PerfilRedirect() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-gray-500">Carregando...</p>
      </main>
    );
  }

  if (!isAuthenticated || !user || !isValidUserRole(user.type_user)) {
    return <Navigate to="/login" replace />;
  }

  const settingsPath =
    user.type_user === "P" ? "/professor/configuracoes" : "/aluno/configuracoes";

  return <Navigate to={settingsPath} replace />;
}
