import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { enrollInCourse, fetchCourseDetail } from "../services/courseService";
import type { CourseDetail } from "../types/course.types";
import { getApiErrorMessage } from "../utils/apiError";

export default function CursoDetalhePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const id = Number(courseId);
  const { user } = useAuth();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollMessage, setEnrollMessage] = useState<string | null>(null);
  const [enrollLoading, setEnrollLoading] = useState(false);

  const isOwnerProfessor =
    user?.type_user === "P" && user.user_id === course?.professor_id;

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
          setError(getApiErrorMessage(err, "Não foi possível carregar o curso."));
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

  const handleEnroll = async () => {
    if (!course) return;

    setEnrollLoading(true);
    setEnrollMessage(null);

    try {
      await enrollInCourse(course.course_id);
      setEnrollMessage("Matrícula realizada com sucesso.");
    } catch (err: unknown) {
      setEnrollMessage(getApiErrorMessage(err, "Não foi possível realizar a matrícula."));
    } finally {
      setEnrollLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-linear-to-b from-slate-50 to-gray-100 text-gray-900">
      <Navbar />

      <div className="mx-auto max-w-3xl flex-1 px-6 py-12">
        {isLoading ? (
          <p className="text-center text-gray-500">Carregando curso...</p>
        ) : error ? (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-600">
            {error}
          </p>
        ) : course ? (
          <article className="rounded-xl border border-gray-200 bg-white p-8 shadow-md">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">{course.title}</h2>
            <p className="mb-6 leading-relaxed text-gray-700">{course.description}</p>

            <div className="mb-6 flex flex-wrap gap-2 text-sm text-gray-600">
              {course.area ? (
                <span className="rounded-full bg-gray-100 px-3 py-1">Área: {course.area}</span>
              ) : null}
              {course.level ? (
                <span className="rounded-full bg-gray-100 px-3 py-1">
                  Nível: {course.level}
                </span>
              ) : null}
              <span className="rounded-full bg-gray-100 px-3 py-1">
                Professor ID: {course.professor_id}
              </span>
            </div>

            {user?.type_user === "A" ? (
              <button
                type="button"
                onClick={handleEnroll}
                disabled={enrollLoading}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {enrollLoading ? "Matriculando..." : "Matricular-se no curso"}
              </button>
            ) : null}

            {enrollMessage ? (
              <p className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                {enrollMessage}
              </p>
            ) : null}

            {isOwnerProfessor ? (
              <div className="mt-8 border-t border-gray-200 pt-6">
                <Link
                  to={`/professor/cursos/${course.course_id}/modulos`}
                  className="inline-block rounded-lg bg-linear-to-r from-purple-700 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                >
                  Ver módulos do curso
                </Link>
              </div>
            ) : null}

            <div className="mt-6">
              <Link
                to="/conteudos"
                className="text-sm font-semibold text-indigo-600 hover:underline"
              >
                ← Voltar ao catálogo
              </Link>
            </div>
          </article>
        ) : null}
      </div>
    </main>
  );
}
