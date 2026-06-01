import { Navigate } from "react-router";
import Navbar from "../components/Navbar";
import UserAvatar from "../components/UserAvatar";
import { useAuth } from "../contexts/AuthContext";

export default function PerfilPage() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Carregando...</p>
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="flex min-h-screen min-w-screen flex-col bg-linear-to-b from-slate-50 to-gray-100 text-gray-900">
      <Navbar showProfile={false} />

      <div className="mx-auto w-full max-w-2xl px-6 py-12">
        <article className="rounded-xl border border-gray-200 bg-white p-8 shadow-md">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <UserAvatar name={user.username} />
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-semibold">{user.username}</h2>
              <p className="mt-1 text-gray-600">
                {user.type_user === "P" ? "Professor" : "Aluno"}
              </p>
              <p className="mt-4 text-sm text-gray-500">ID: {user.user_id}</p>
            </div>
          </div>

          <p className="mt-8 text-sm text-gray-600">
            Os dados exibidos vêm da sessão autenticada. Atualização de perfil e senha
            dependerão dos endpoints correspondentes na API.
          </p>
        </article>
      </div>
    </main>
  );
}
