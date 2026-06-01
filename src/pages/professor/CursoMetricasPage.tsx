import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../contexts/AuthContext";
import { fetchCourseDetail, fetchCourseModules } from "../../services/courseService";
import type { CourseDetail, CourseModule } from "../../types/course.types";
import { getApiErrorMessage } from "../../utils/apiError";

export default function CursoModulosPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const id = Number(courseId);
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      try {
        const [courseData, modulesData] = await Promise.all([
          fetchCourseDetail(id),
          fetchCourseModules(id),
        ]);

        if (!cancelled) {
          setCourse(courseData);
          setModules(modulesData);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(getApiErrorMessage(err, "Não foi possível carregar os módulos."));
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

  const isOwner = user?.user_id === course?.professor_id;

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
          <h1 className="mt-4 text-2xl font-bold">Módulos do curso</h1>
          <p className="text-gray-600">
            Estrutura do curso conforme retornado pela API.
          </p>
        </div>

        {isLoading ? (
          <p className="text-gray-500">Carregando módulos...</p>
        ) : error ? (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        ) : (
          <div className="space-y-6">
            {course ? (
              <h2 className="text-xl font-semibold">{course.title}</h2>
            ) : null}

            {!isOwner ? (
              <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                Você está visualizando este curso, mas não é o professor responsável.
              </p>
            ) : null}

            {modules.length === 0 ? (
              <p className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center text-gray-500">
                Nenhum módulo cadastrado para este curso.
              </p>
            ) : (
              <ul className="space-y-3">
                {modules.map((module) => (
                  <li
                    key={module.module_id}
                    className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                  >
                    <p className="font-semibold text-gray-900">{module.title}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Módulo #{module.module_id}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
