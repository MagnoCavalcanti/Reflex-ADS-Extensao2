import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import PublicPageHeader from "../components/PublicPageHeader";
import { useAuth } from "../contexts/AuthContext";
import { fetchCourseDetail } from "../services/courseService";
import type { CourseDetail } from "../types/course.types";
import { getApiErrorMessage } from "../utils/apiError";

export default function CursoDetalhePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const id = Number(courseId);
  const { isAuthenticated, user } = useAuth();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isOwnerProfessor =
    isAuthenticated &&
    user?.type_user === "P" &&
    user.user_id === course?.professor_id;

  useEffect(() => {
    if (!courseId || Number.isNaN(id)) {
      setError("Curso inválido.");
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchCourseDetail(id);
        if (!cancelled) setCourse(data);
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            getApiErrorMessage(err, "Não foi possível carregar o curso."),
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [courseId, id]);

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 to-gray-100 text-gray-900">
      <PublicPageHeader title="Detalhe do curso" />

      <div className="mx-auto max-w-3xl px-6 py-12">
        {isLoading ? (
          <p className="text-center text-gray-500">Carregando curso...</p>
        ) : error ? (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-600">
            {error}
          </p>
        ) : course ? (
          <article className="rounded-xl border border-gray-200 bg-white p-8 shadow-md">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              {course.title}
            </h2>
            <p className="mb-8 leading-relaxed text-gray-700">
              {course.description}
            </p>

            <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-5">
              <p className="mb-2 text-sm font-medium uppercase tracking-wide text-indigo-800">
                Professor responsável
              </p>
              <p className="mb-3 text-lg font-semibold text-gray-900">
                {course.professor_name}
              </p>
              <Link
                to={`/professores/${course.professor_id}`}
                className="inline-flex items-center text-sm font-semibold text-indigo-700 hover:text-indigo-900"
              >
                Ver perfil público do professor →
              </Link>
            </div>

            {isOwnerProfessor ? (
              <div className="mt-8 border-t border-gray-200 pt-6">
                <Link
                  to={`/professor/cursos/${course.course_id}/metricas`}
                  className="inline-block rounded-lg bg-linear-to-r from-purple-700 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                >
                  Ver métricas da turma
                </Link>
              </div>
            ) : null}
          </article>
        ) : null}

        <p className="mt-8 text-center text-sm text-gray-500">
          <Link to="/" className="text-indigo-600 hover:underline">
            ← Voltar ao início
          </Link>
        </p>
      </div>
    </main>
  );
}
