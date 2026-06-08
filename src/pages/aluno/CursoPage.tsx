import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import Navbar from "../../components/Navbar";
import {
  enrollInCourse,
  fetchCourseDetail,
  fetchCourseModules,
  fetchLessons,
} from "../../services/courseService";
import type { CourseDetail, CourseLesson, CourseModule } from "../../types/course.types";
import { getApiErrorMessage } from "../../utils/apiError";
import {
  addEnrolledCourseId,
  getEnrolledCourseIds,
  trackRecentCourse,
} from "../../utils/studentStorage";

type TabId = "visao" | "conteudo" | "avaliacoes" | "certificado";

const TABS: { id: TabId; label: string }[] = [
  { id: "visao", label: "Visão geral" },
  { id: "conteudo", label: "Conteúdo" },
  { id: "avaliacoes", label: "Avaliações" },
  { id: "certificado", label: "Certificado" },
];

export default function CursoPage() {
  const { id: courseIdParam } = useParams<{ id: string }>();
  const courseId = Number(courseIdParam);
  const [activeTab, setActiveTab] = useState<TabId>("visao");

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [enrollMessage, setEnrollMessage] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const lessonsByModule = useMemo(() => {
    const map = new Map<number, CourseLesson[]>();
    for (const lesson of lessons) {
      const list = map.get(lesson.module_id) ?? [];
      list.push(lesson);
      map.set(lesson.module_id, list);
    }
    return map;
  }, [lessons]);

  const firstLessonId = useMemo(() => {
    for (const module of modules) {
      const moduleLessons = lessonsByModule.get(module.module_id);
      if (moduleLessons?.[0]) return moduleLessons[0].lesson_id;
    }
    return null;
  }, [modules, lessonsByModule]);

  useEffect(() => {
    if (!courseIdParam || Number.isNaN(courseId)) {
      setError("Curso inválido.");
      setIsLoading(false);
      return;
    }

    setIsEnrolled(getEnrolledCourseIds().includes(courseId));

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [courseData, modulesData, lessonsData] = await Promise.all([
          fetchCourseDetail(courseId),
          fetchCourseModules(courseId),
          fetchLessons(),
        ]);

        if (cancelled) return;

        setCourse(courseData);
        setModules(modulesData);
        setLessons(lessonsData.filter((l) =>
          modulesData.some((m) => m.module_id === l.module_id),
        ));
        trackRecentCourse(courseId, courseData.title);
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
  }, [courseId, courseIdParam]);

  const handleEnroll = async () => {
    if (!course) return;

    setEnrollLoading(true);
    setEnrollMessage(null);

    try {
      await enrollInCourse(course.course_id);
      addEnrolledCourseId(course.course_id);
      setIsEnrolled(true);
      setEnrollMessage("Matrícula realizada com sucesso.");
    } catch (err: unknown) {
      setEnrollMessage(getApiErrorMessage(err, "Não foi possível realizar a matrícula."));
    } finally {
      setEnrollLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-slate-50 text-gray-900">
      <Navbar />

      <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        <Link to="/cursos" className="text-sm font-medium text-indigo-600 hover:underline">
          ← Voltar ao catálogo
        </Link>

        {isLoading ? (
          <p className="mt-8 text-gray-500">Carregando curso...</p>
        ) : error ? (
          <p className="mt-8 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        ) : course ? (
          <>
            <header className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              {course.cover_image_url ? (
                <img
                  src={course.cover_image_url}
                  alt={`Capa do curso ${course.title}`}
                  className="mb-5 h-56 w-full rounded-xl object-cover"
                />
              ) : null}
              <h1 className="text-2xl font-bold md:text-3xl">{course.title}</h1>
              <p className="mt-2 text-gray-600">{course.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {course.area ? (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">{course.area}</span>
                ) : null}
                {course.level ? (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                    Nível: {course.level}
                  </span>
                ) : null}
                <span
                  className={[
                    "rounded-full px-3 py-1 text-sm font-medium",
                    course.status === "publicado"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-amber-100 text-amber-800",
                  ].join(" ")}
                >
                  {course.status === "publicado" ? "Publicado" : "Rascunho"}
                </span>
              </div>
              {!isEnrolled ? (
                <button
                  type="button"
                  onClick={handleEnroll}
                  disabled={enrollLoading}
                  className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {enrollLoading ? "Matriculando..." : "Matricular-se"}
                </button>
              ) : (
                <p className="mt-5 text-sm font-medium text-green-700">Você está matriculado neste curso.</p>
              )}
              {enrollMessage ? (
                <p className="mt-3 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
                  {enrollMessage}
                </p>
              ) : null}
              {isEnrolled && firstLessonId ? (
                <Link
                  to={`/curso/${courseId}/aula/${firstLessonId}`}
                  className="mt-4 inline-flex rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Continuar estudando
                </Link>
              ) : null}
            </header>

            <nav className="mt-6 flex flex-wrap gap-2 border-b border-gray-200">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={[
                    "rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors",
                    activeTab === tab.id
                      ? "border-b-2 border-indigo-600 text-indigo-700"
                      : "text-gray-600 hover:text-gray-900",
                  ].join(" ")}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              {activeTab === "visao" ? (
                <div className="space-y-6">
                  <section>
                    <h2 className="text-lg font-semibold">Descrição</h2>
                    <p className="mt-2 leading-relaxed text-gray-700">{course.description}</p>
                  </section>
                  <section>
                    <h2 className="text-lg font-semibold">Professor</h2>
                    <p className="mt-2 text-gray-600">
                      {course.professor_name || "Professor não informado"}
                    </p>
                  </section>
                  <section>
                    <h2 className="text-lg font-semibold">Carga horária e objetivos</h2>
                    <p className="mt-2 text-gray-500 text-sm">
                      Informações detalhadas serão exibidas quando a API disponibilizar esses campos.
                    </p>
                  </section>
                </div>
              ) : null}

              {activeTab === "conteudo" ? (
                <div className="space-y-6">
                  {modules.length === 0 ? (
                    <p className="text-gray-500">Este curso ainda não possui módulos publicados.</p>
                  ) : (
                    modules.map((module) => (
                      <section key={module.module_id}>
                        <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                        <ul className="mt-3 space-y-2">
                          {(lessonsByModule.get(module.module_id) ?? []).map((lesson) => (
                            <li key={lesson.lesson_id}>
                              <Link
                                to={`/curso/${courseId}/aula/${lesson.lesson_id}`}
                                className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50"
                              >
                                <span className="font-medium">{lesson.title}</span>
                                <span className="text-xs uppercase text-gray-500">
                                  {lesson.content_type}
                                </span>
                              </Link>
                            </li>
                          ))}
                          {(lessonsByModule.get(module.module_id) ?? []).length === 0 ? (
                            <li className="text-sm text-gray-500">Nenhuma aula neste módulo.</li>
                          ) : null}
                        </ul>
                      </section>
                    ))
                  )}
                </div>
              ) : null}

              {activeTab === "avaliacoes" ? (
                <div className="space-y-4 text-gray-600">
                  <p>Quizzes, provas e resultados aparecerão aqui conforme forem integrados à API.</p>
                  <ul className="list-inside list-disc text-sm text-gray-500">
                    <li>Quizzes por módulo</li>
                    <li>Provas finais</li>
                    <li>Histórico de resultados</li>
                  </ul>
                </div>
              ) : null}

              {activeTab === "certificado" ? (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Conclua todas as aulas e avaliações para liberar o certificado.
                  </p>
                  <p className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
                    Download do certificado disponível em breve (endpoint ainda não integrado).
                  </p>
                </div>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}
