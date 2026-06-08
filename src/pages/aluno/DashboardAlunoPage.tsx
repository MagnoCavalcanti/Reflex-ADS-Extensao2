import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../contexts/AuthContext";
import { fetchCourses, fetchStudentCourseProgress } from "../../services/courseService";
import type { Course, StudentCourseProgress } from "../../types/course.types";
import { getApiErrorMessage } from "../../utils/apiError";
import { getEnrolledCourseIds, getRecentCourses } from "../../utils/studentStorage";

export default function DashboardAlunoPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [progressByCourse, setProgressByCourse] = useState<Map<number, StudentCourseProgress>>(
    new Map(),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const displayName = user?.username ?? "Aluno";
  const enrolledIds = useMemo(() => new Set(getEnrolledCourseIds()), []);
  const recentEntries = useMemo(() => getRecentCourses(), []);

  const inProgressCourses = useMemo(
    () => courses.filter((c) => enrolledIds.has(c.course_id)),
    [courses, enrolledIds],
  );

  const completedCoursesCount = useMemo(
    () => Array.from(progressByCourse.values()).filter((item) => item.is_completed).length,
    [progressByCourse],
  );

  const recentCourses = useMemo(() => {
    return recentEntries
      .map((entry) => courses.find((c) => c.course_id === entry.courseId))
      .filter((c): c is Course => c != null)
      .slice(0, 4);
  }, [recentEntries, courses]);

  const recommendedCourses = useMemo(() => {
    const areaFrequency = new Map<string, number>();
    const levelFrequency = new Map<string, number>();
    inProgressCourses.forEach((course) => {
      if (course.area) areaFrequency.set(course.area, (areaFrequency.get(course.area) ?? 0) + 1);
      if (course.level)
        levelFrequency.set(course.level, (levelFrequency.get(course.level) ?? 0) + 1);
    });

    const nonEnrolled = courses.filter((course) => !enrolledIds.has(course.course_id));
    const scored = nonEnrolled.map((course) => {
      let score = 0;
      if (course.area && areaFrequency.has(course.area)) {
        score += 5 + (areaFrequency.get(course.area) ?? 0);
      }
      if (course.level && levelFrequency.has(course.level)) {
        score += 3 + (levelFrequency.get(course.level) ?? 0);
      }
      if (course.status === "publicado") score += 2;
      return { course, score };
    });

    return scored
      .sort((a, b) => b.score - a.score || a.course.title.localeCompare(b.course.title))
      .slice(0, 4)
      .map((item) => item.course);
  }, [courses, enrolledIds, inProgressCourses]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchCourses();
        let progressData: StudentCourseProgress[] = [];
        try {
          progressData = await fetchStudentCourseProgress();
        } catch {
          progressData = [];
        }
        if (!cancelled) {
          setCourses(data);
          setProgressByCourse(new Map(progressData.map((item) => [item.course_id, item])));
        }
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
                <p className="text-sm text-gray-500">Cursos em andamento</p>
                <p className="mt-2 text-3xl font-bold text-indigo-700">
                  {inProgressCourses.length}
                </p>
              </article>
              <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Cursos completados</p>
                <p className="mt-2 text-3xl font-bold text-indigo-700">{completedCoursesCount}</p>
                <p className="mt-2 text-xs text-gray-500">Com 100% das aulas concluídas.</p>
              </article>
              <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Últimos cursos visitados</p>
                <p className="mt-2 text-3xl font-bold text-indigo-700">{recentCourses.length}</p>
                <p className="mt-2 text-xs text-gray-500">limitado aos últimos 4 acessos</p>
              </article>
              <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Recomendações</p>
                <p className="mt-2 text-3xl font-bold text-indigo-700">{recommendedCourses.length}</p>
                <p className="mt-2 text-xs text-gray-500">baseadas em área e nível dos seus cursos</p>
              </article>
            </section>

            <CourseSection
              title="Cursos em andamento"
              emptyMessage="Você ainda não está matriculado em nenhum curso."
              emptyAction={{ label: "Ver catálogo", to: "/cursos" }}
              items={inProgressCourses}
              progressByCourse={progressByCourse}
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
  progressByCourse?: Map<number, StudentCourseProgress>;
};

function CourseSection({
  title,
  emptyMessage,
  emptyAction,
  items,
  progressByCourse,
}: CourseSectionProps) {
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
              {progressByCourse?.has(course.course_id) ? (
                <div className="mt-3">
                  <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
                    <span>Progresso no curso</span>
                    <span>
                      {progressByCourse.get(course.course_id)?.progress_percent.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all"
                      style={{
                        width: `${progressByCourse.get(course.course_id)?.progress_percent ?? 0}%`,
                      }}
                    />
                  </div>
                </div>
              ) : null}
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
