import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../contexts/AuthContext";
import { fetchCourseMetrics } from "../../services/courseService";
import type { CourseMetrics } from "../../types/course.types";
import { getApiErrorMessage } from "../../utils/apiError";
import { isForbidden } from "../../utils/httpError";
import { clampPercent } from "../../utils/user";

export default function CursoMetricasPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const id = Number(courseId);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [metrics, setMetrics] = useState<CourseMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || authLoading) return;

    if (!courseId || Number.isNaN(id)) {
      setError("Curso inválido.");
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      setForbidden(false);

      try {
        const data = await fetchCourseMetrics(id);
        if (!cancelled) setMetrics(data);
      } catch (err: unknown) {
        if (!cancelled) {
          if (isForbidden(err)) {
            setForbidden(true);
          } else {
            setError(
              getApiErrorMessage(err, "Não foi possível carregar as métricas."),
            );
          }
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [courseId, id, isAuthenticated, authLoading]);

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Carregando...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const averageProgress = clampPercent(metrics?.average_progress_percent ?? 0);

  return (
    <main className="flex min-h-screen flex-col bg-linear-to-b from-slate-50 to-gray-100 text-gray-900">
      <Navbar />

      <div className="mx-auto w-full max-w-4xl px-6 py-12">
        <div className="mb-8">
          <Link
            to={courseId ? `/cursos/${courseId}` : "/professor/dashboard"}
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            ← Voltar ao curso
          </Link>
          <h1 className="mt-4 text-2xl font-bold">Métricas do curso</h1>
          <p className="text-gray-600">
            Visão privada do engajamento da turma (apenas professor dono).
          </p>
        </div>

        {isLoading ? (
          <p className="text-gray-500">Carregando métricas...</p>
        ) : forbidden ? (
          <article className="rounded-xl border border-amber-200 bg-amber-50 p-8 text-center">
            <p className="text-lg font-semibold text-amber-900">
              403 — Acesso negado
            </p>
            <p className="mt-2 text-sm text-amber-800">
              Apenas o professor responsável por este curso pode visualizar as
              métricas.
            </p>
          </article>
        ) : error ? (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        ) : metrics ? (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">{metrics.course_title}</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-md">
                <p className="text-sm font-medium text-gray-500">
                  Alunos matriculados
                </p>
                <p className="mt-2 text-3xl font-bold text-indigo-600">
                  {metrics.enrolled_count}
                </p>
              </article>
              <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-md">
                <p className="text-sm font-medium text-gray-500">
                  Progresso médio da turma
                </p>
                <p className="mt-2 text-3xl font-bold text-indigo-600">
                  {averageProgress}%
                </p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all"
                    style={{ width: `${averageProgress}%` }}
                  />
                </div>
              </article>
              <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-md">
                <p className="text-sm font-medium text-gray-500">
                  Concluíram o curso
                </p>
                <p className="mt-2 text-3xl font-bold text-green-600">
                  {metrics.completed_count}
                </p>
              </article>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
