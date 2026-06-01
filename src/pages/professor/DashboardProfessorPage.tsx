import { useEffect, useState } from "react";
import { Link } from "react-router";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../contexts/AuthContext";
import { fetchCourses } from "../../services/courseService";
import type { Course } from "../../types/course.types";
import { getApiErrorMessage } from "../../utils/apiError";

export default function DashboardProfessorPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const username = user?.username ?? "Professor";
  const myCourses = courses.filter((course) => course.professor_id === user?.user_id);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchCourses();
        if (!cancelled) setCourses(data);
      } catch (err: unknown) {
        if (!cancelled) {
          setError(getApiErrorMessage(err, "Não foi possível carregar o resumo."));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-linear-to-b from-slate-50 to-gray-100 text-gray-900">
      <Navbar />

      <section className="bg-linear-to-r from-emerald-700 via-teal-700 to-blue-700 px-6 py-14 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold md:text-4xl">
            Olá, <span>{username}</span>!
          </h1>
          <p className="mt-2 text-lg text-white/90">
            Visão geral da sua área de ensino.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        {isLoading ? (
          <p className="text-gray-500">Carregando resumo...</p>
        ) : error ? (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Meus cursos</p>
                <p className="mt-2 text-4xl font-bold text-emerald-700">{myCourses.length}</p>
              </article>
              <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">No catálogo</p>
                <p className="mt-2 text-4xl font-bold text-emerald-700">{courses.length}</p>
              </article>
              <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:col-span-2 lg:col-span-1">
                <p className="text-sm text-gray-500">Alunos matriculados</p>
                <p className="mt-2 text-4xl font-bold text-gray-400">—</p>
                <p className="mt-1 text-xs text-gray-500">Métricas em breve na API.</p>
              </article>
            </div>

            <section className="mt-10 grid gap-4 md:grid-cols-2">
              <Link
                to="/professor/cursos"
                className="rounded-xl border border-emerald-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h2 className="text-lg font-semibold text-emerald-800">Meus cursos</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Ver lista completa, editar ou criar novos cursos.
                </p>
              </Link>
              <Link
                to="/professor/cursos/novo"
                className="rounded-xl border border-dashed border-emerald-300 bg-emerald-50/50 p-6 transition-colors hover:bg-emerald-50"
              >
                <h2 className="text-lg font-semibold text-emerald-800">Novo curso</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Abrir o editor com informações, conteúdo e estrutura de aulas.
                </p>
              </Link>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
