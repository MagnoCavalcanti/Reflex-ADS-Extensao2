import { useEffect, useState } from "react";
import { Link } from "react-router";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../contexts/AuthContext";
import { fetchCourses } from "../../services/courseService";
import type { Course } from "../../types/course.types";
import { getApiErrorMessage } from "../../utils/apiError";

export default function DashboardAlunoPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const displayName = user?.username ?? "Aluno";

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
          setError(getApiErrorMessage(err, "Não foi possível carregar os cursos."));
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
    <main className="flex min-h-screen min-w-screen flex-col bg-linear-to-b from-slate-50 to-gray-100 text-gray-900">
      <Navbar />

      <div className="mx-auto w-full max-w-6xl flex-1 space-y-10 px-6 py-10">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Bem-vindo de volta</p>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Olá, <span className="text-indigo-700">{displayName}</span>!
          </h1>
          <p className="mt-2 text-gray-600">
            Explore o catálogo e matricule-se nos cursos disponíveis.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Catálogo de cursos</h2>

          {isLoading ? (
            <p className="text-gray-500">Carregando cursos...</p>
          ) : error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          ) : courses.length === 0 ? (
            <p className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center text-gray-500">
              Nenhum curso disponível no momento.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <article
                  key={course.course_id}
                  className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-gray-600 line-clamp-3">
                    {course.description}
                  </p>
                  <Link
                    to={`/cursos/${course.course_id}`}
                    className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Ver curso
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
