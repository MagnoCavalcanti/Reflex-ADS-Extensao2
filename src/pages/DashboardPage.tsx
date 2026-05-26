import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import DashboardAlunoPage from "./aluno/DashboardAlunoPage";
import DashboardProfessorPage from "./professor/DashboardProfessorPage";

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

  if (user.type_user === "P") {
    return <DashboardProfessorPage />;
  }

  return <DashboardAlunoPage />;
}
