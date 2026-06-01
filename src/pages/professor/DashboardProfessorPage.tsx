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
          setError(getApiErrorMessage(err, "Não foi possível carregar seus cursos."));
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

      <section className="bg-linear-to-r from-emerald-700 via-teal-700 to-blue-700 px-6 py-16 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-3 text-3xl font-bold md:text-4xl">
            Olá, <span>{username}</span>!
          </h1>
          <p className="text-lg text-white/90">
            Gerencie seus cursos publicados na plataforma.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <article className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-md">
            <p className="text-sm font-medium text-gray-500">Meus cursos</p>
            <strong className="mt-3 block text-4xl text-blue-700">{myCourses.length}</strong>
          </article>
          <article className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-md">
            <p className="text-sm font-medium text-gray-500">Cursos no catálogo</p>
            <strong className="mt-3 block text-4xl text-blue-700">{courses.length}</strong>
          </article>
        </div>

        <div
          id="seus-cursos"
          className="mb-6 flex scroll-mt-24 flex-wrap items-center justify-between gap-4"
        >
          <h2 className="text-2xl font-bold">Seus cursos</h2>
          <Link
            to="/professor/cursos/novo"
            className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Criar novo curso
          </Link>
        </div>

        {isLoading ? (
          <p className="text-gray-500">Carregando cursos...</p>
        ) : error ? (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        ) : myCourses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
            <p className="text-gray-500">Você ainda não possui cursos cadastrados.</p>
            <Link
              to="/professor/cursos/novo"
              className="mt-4 inline-block rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Criar primeiro curso
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {myCourses.map((course) => (
              <article
                key={course.course_id}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-md"
              >
                <h3 className="mb-2 text-lg font-semibold">{course.title}</h3>
                <p className="mb-4 text-sm text-gray-600 line-clamp-2">{course.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/professor/cursos/${course.course_id}`}
                    className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
                  >
                    Gerenciar curso
                  </Link>
                  <Link
                    to={`/professor/cursos/${course.course_id}/modulos`}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
                  >
                    Ver módulos
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
