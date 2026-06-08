import { useEffect, useState } from "react";
import { Link } from "react-router";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../contexts/AuthContext";
import { fetchCourses } from "../../services/courseService";
import type { Course } from "../../types/course.types";
import { getApiErrorMessage } from "../../utils/apiError";

export default function MeusCursosPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <main className="flex min-h-screen flex-col bg-linear-to-b from-slate-50 to-gray-100 text-gray-900">
      <Navbar />

      <section className="bg-linear-to-r from-emerald-700 via-teal-700 to-blue-700 px-6 py-12 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold md:text-4xl">Meus cursos</h1>
          <p className="mt-2 text-lg text-white/90">
            Crie, edite e publique os cursos da sua área.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-gray-600">
            {myCourses.length} curso{myCourses.length === 1 ? "" : "s"} publicado
            {myCourses.length === 1 ? "" : "s"} por você
          </p>
          <Link
            to="/professor/cursos/novo"
            className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            + Novo curso
          </Link>
        </div>

        {isLoading ? (
          <p className="text-gray-500">Carregando cursos...</p>
        ) : error ? (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        ) : myCourses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
            <p className="text-gray-500">Você ainda não criou nenhum curso.</p>
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
                className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                {course.cover_image_url ? (
                  <img
                    src={course.cover_image_url}
                    alt={`Capa do curso ${course.title}`}
                    className="mb-4 h-36 w-full rounded-lg object-cover"
                  />
                ) : null}
                {course.area ? (
                  <span className="mb-2 w-fit rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                    {course.area}
                  </span>
                ) : null}
                <span
                  className={[
                    "mb-2 w-fit rounded-full px-2.5 py-0.5 text-xs font-medium",
                    course.status === "publicado"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-amber-50 text-amber-700",
                  ].join(" ")}
                >
                  {course.status === "publicado" ? "Publicado" : "Rascunho"}
                </span>
                <h3 className="text-lg font-semibold">{course.title}</h3>
                <p className="mt-2 flex-1 text-sm text-gray-600 line-clamp-3">
                  {course.description}
                </p>
                <Link
                  to={`/professor/cursos/${course.course_id}`}
                  className="mt-4 inline-flex justify-center rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
                >
                  Editar curso
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
