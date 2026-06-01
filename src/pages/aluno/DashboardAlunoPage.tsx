import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../contexts/AuthContext";
import { fetchCourses } from "../../services/courseService";
import type { Course } from "../../types/course.types";
import { getApiErrorMessage } from "../../utils/apiError";
import { getEnrolledCourseIds, getRecentCourses } from "../../utils/studentStorage";

export default function DashboardAlunoPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const displayName = user?.username ?? "Aluno";
  const enrolledIds = useMemo(() => new Set(getEnrolledCourseIds()), []);
  const recentEntries = useMemo(() => getRecentCourses(), []);

  const inProgressCourses = useMemo(
    () => courses.filter((c) => enrolledIds.has(c.course_id)),
    [courses, enrolledIds],
  );

  const recommendedCourses = useMemo(
    () => courses.filter((c) => !enrolledIds.has(c.course_id)).slice(0, 4),
    [courses, enrolledIds],
  );

  const recentCourses = useMemo(() => {
    return recentEntries
      .map((entry) => courses.find((c) => c.course_id === entry.courseId))
      .filter((c): c is Course => c != null)
      .slice(0, 4);
  }, [recentEntries, courses]);

  const progressPercent = inProgressCourses.length > 0 ? 12 : 0;

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
          setError(getApiErrorMessage(err, "Não foi possível carregar o dashboard."));
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

      <div className="mx-auto w-full max-w-6xl flex-1 space-y-10 px-6 py-10">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Bem-vindo de volta</p>
          <h1 className="text-2xl font-bold md:text-3xl">
            Olá, <span className="text-indigo-700">{displayName}</span>!
          </h1>
          <p className="mt-2 text-gray-600">
            Continue de onde parou ou explore novos cursos no catálogo.
          </p>
          <Link
            to="/cursos"
            className="mt-4 inline-flex rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Explorar catálogo
          </Link>
        </section>

        {isLoading ? (
          <p className="text-gray-500">Carregando dashboard...</p>
        ) : error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Progresso geral</p>
                <p className="mt-2 text-3xl font-bold text-indigo-700">{progressPercent}%</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Cálculo completo quando a API de progresso estiver disponível.
                </p>
              </article>
              <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Cursos em andamento</p>
                <p className="mt-2 text-3xl font-bold text-indigo-700">
                  {inProgressCourses.length}
                </p>
              </article>
              <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Certificados</p>
                <p className="mt-2 text-3xl font-bold text-indigo-700">0</p>
                <p className="mt-2 text-xs text-gray-500">Em breve na plataforma.</p>
              </article>
              <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Catálogo</p>
                <p className="mt-2 text-3xl font-bold text-indigo-700">{courses.length}</p>
                <p className="mt-2 text-xs text-gray-500">cursos disponíveis</p>
              </article>
            </section>

            <CourseSection
              title="Cursos em andamento"
              emptyMessage="Você ainda não está matriculado em nenhum curso."
              emptyAction={{ label: "Ver catálogo", to: "/cursos" }}
              items={inProgressCourses}
            />

            <CourseSection
              title="Últimos cursos acessados"
              emptyMessage="Acesse um curso para vê-lo aqui."
              emptyAction={{ label: "Explorar catálogo", to: "/cursos" }}
              items={recentCourses}
            />

            <CourseSection
              title="Recomendações para você"
              emptyMessage="Nenhuma recomendação no momento."
              emptyAction={{ label: "Ver todos os cursos", to: "/cursos" }}
              items={recommendedCourses}
            />

            <section className="rounded-xl border border-dashed border-amber-200 bg-amber-50/80 p-5">
              <h2 className="font-semibold text-amber-900">Certificados obtidos</h2>
              <p className="mt-2 text-sm text-amber-800/90">
                Seus certificados aparecerão aqui após a conclusão dos cursos. A integração com a API
                de certificados será adicionada em uma próxima etapa.
              </p>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

type CourseSectionProps = {
  title: string;
  emptyMessage: string;
  emptyAction: { label: string; to: string };
  items: Course[];
};

function CourseSection({ title, emptyMessage, emptyAction, items }: CourseSectionProps) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-8 text-center">
          <p className="text-gray-500">{emptyMessage}</p>
          <Link
            to={emptyAction.to}
            className="mt-3 inline-block text-sm font-semibold text-indigo-600 hover:underline"
          >
            {emptyAction.label}
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((course) => (
            <article
              key={course.course_id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <h3 className="font-semibold text-gray-900">{course.title}</h3>
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">{course.description}</p>
              <Link
                to={`/curso/${course.course_id}`}
                className="mt-4 inline-flex text-sm font-semibold text-indigo-600 hover:underline"
              >
                Abrir curso →
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
