import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import Navbar from "../../components/Navbar";
import {
  downloadCourseCertificate,
  enrollInCourse,
  fetchCourseCertificate,
  fetchCourseDetail,
  fetchLessonQuiz,
  fetchCourseModules,
  fetchLessons,
} from "../../services/courseService";
import type {
  CourseDetail,
  CourseLesson,
  CourseModule,
  LessonQuiz,
  StudentCourseCertificate,
} from "../../types/course.types";
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
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizzesByLesson, setQuizzesByLesson] = useState<Record<number, LessonQuiz>>({});
  const [certificateLoading, setCertificateLoading] = useState(false);
  const [certificateDownloading, setCertificateDownloading] = useState(false);
  const [certificateInfo, setCertificateInfo] = useState<StudentCourseCertificate | null>(null);
  const [certificateError, setCertificateError] = useState<string | null>(null);

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

  const courseEvaluations = useMemo(() => {
    return modules.flatMap((module) => {
      const moduleLessons = lessonsByModule.get(module.module_id) ?? [];
      return moduleLessons
        .map((lesson) => {
          const quiz = quizzesByLesson[lesson.lesson_id];
          if (!quiz || quiz.questions.length === 0) return null;
          return {
            moduleId: module.module_id,
            moduleTitle: module.title,
            lessonId: lesson.lesson_id,
            lessonTitle: lesson.title,
            questions: quiz.questions,
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);
    });
  }, [lessonsByModule, modules, quizzesByLesson]);

  const isCourseCompleted = Boolean(certificateInfo?.eligible);

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
      setQuizzesByLesson({});

      try {
        const [courseData, modulesData, lessonsData] = await Promise.all([
          fetchCourseDetail(courseId),
          fetchCourseModules(courseId),
          fetchLessons(),
        ]);

        if (cancelled) return;

        const courseLessons = lessonsData.filter((l) =>
          modulesData.some((m) => m.module_id === l.module_id),
        );

        setCourse(courseData);
        setModules(modulesData);
        setLessons(courseLessons);
        trackRecentCourse(courseId, courseData.title);

        setQuizLoading(true);
        const quizResults = await Promise.all(
          courseLessons.map(async (lesson) => {
            try {
              const quiz = await fetchLessonQuiz(lesson.lesson_id);
              if ((quiz.questions ?? []).length === 0) return null;
              return [lesson.lesson_id, quiz] as const;
            } catch {
              return null;
            }
          }),
        );

        if (cancelled) return;

        const nextQuizMap: Record<number, LessonQuiz> = {};
        for (const item of quizResults) {
          if (!item) continue;
          const [lessonId, quiz] = item;
          nextQuizMap[lessonId] = quiz;
        }
        setQuizzesByLesson(nextQuizMap);
      } catch (err: unknown) {
        if (!cancelled) {
          setError(getApiErrorMessage(err, "Não foi possível carregar o curso."));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setQuizLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [courseId, courseIdParam]);

  useEffect(() => {
    if (!courseIdParam || Number.isNaN(courseId)) return;
    let cancelled = false;

    const loadCertificate = async () => {
      setCertificateLoading(true);
      setCertificateError(null);
      try {
        const cert = await fetchCourseCertificate(courseId);
        if (!cancelled) setCertificateInfo(cert);
      } catch (err: unknown) {
        if (!cancelled) {
          setCertificateError(getApiErrorMessage(err, "Não foi possível carregar dados do certificado."));
        }
      } finally {
        if (!cancelled) setCertificateLoading(false);
      }
    };

    void loadCertificate();
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

  const handleDownloadCertificate = async () => {
    if (!certificateInfo?.eligible) return;
    setCertificateDownloading(true);
    setCertificateError(null);
    try {
      await downloadCourseCertificate(courseId);
    } catch (err: unknown) {
      setCertificateError(getApiErrorMessage(err, "Não foi possível baixar o certificado."));
    } finally {
      setCertificateDownloading(false);
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
                isCourseCompleted ? (
                  <button
                    type="button"
                    disabled
                    className="mt-4 inline-flex cursor-not-allowed rounded-lg bg-emerald-600/70 px-5 py-2.5 text-sm font-semibold text-white opacity-90"
                  >
                    Concluído
                  </button>
                ) : (
                  <Link
                    to={`/curso/${courseId}/aula/${firstLessonId}`}
                    className="mt-4 inline-flex rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Continuar estudando
                  </Link>
                )
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
                  {quizLoading ? (
                    <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-5 text-sm text-indigo-700">
                      Carregando avaliações...
                    </div>
                  ) : courseEvaluations.length === 0 ? (
                    <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-5 text-sm text-gray-500">
                      Este curso ainda não possui avaliações publicadas.
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                          Plano de avaliações
                        </p>
                        <p className="mt-1 text-sm text-indigo-900">
                          {courseEvaluations.length} avaliação(ões) distribuídas em{" "}
                          {new Set(courseEvaluations.map((item) => item.moduleId)).size} módulo(s).
                        </p>
                      </div>

                      {courseEvaluations.map((evaluation) => (
                        <section
                          key={`${evaluation.moduleId}-${evaluation.lessonId}`}
                          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                                {evaluation.moduleTitle}
                              </p>
                              <h3 className="mt-1 text-base font-semibold text-gray-900">
                                {evaluation.lessonTitle}
                              </h3>
                            </div>
                            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                              {evaluation.questions.length}{" "}
                              {evaluation.questions.length === 1 ? "questão" : "questões"}
                            </span>
                          </div>

                          <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50/70 p-4">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Prévia das perguntas
                            </p>
                            <ul className="space-y-2 text-sm text-gray-700">
                              {evaluation.questions.slice(0, 3).map((question, index) => (
                                <li
                                  key={question.id ?? `${evaluation.lessonId}-q-${index}`}
                                  className="rounded-lg bg-white px-3 py-2"
                                >
                                  <span className="font-medium text-indigo-700">{index + 1}.</span>{" "}
                                  {question.question_text}
                                </li>
                              ))}
                              {evaluation.questions.length > 3 ? (
                                <li className="px-1 text-xs font-medium text-gray-500">
                                  + {evaluation.questions.length - 3} questão(ões) nesta avaliação
                                </li>
                              ) : null}
                            </ul>
                          </div>

                          <Link
                            to={`/curso/${courseId}/aula/${evaluation.lessonId}`}
                            className="mt-4 inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                          >
                            Resolver avaliação
                          </Link>
                        </section>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}

              {activeTab === "certificado" ? (
                <div className="space-y-4">
                  {certificateLoading ? (
                    <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-5 text-sm text-indigo-700">
                      Carregando status do certificado...
                    </div>
                  ) : certificateInfo ? (
                    <div className="space-y-4">
                      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                        <p className="text-sm text-gray-600">
                          Progresso do curso:{" "}
                          <span className="font-semibold text-gray-900">
                            {certificateInfo.completed_lessons}/{certificateInfo.total_lessons} aulas
                          </span>{" "}
                          ({certificateInfo.progress_percent}%)
                        </p>
                      </div>

                      {certificateInfo.eligible ? (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                          <h3 className="text-base font-semibold text-emerald-800">
                            Certificado disponível
                          </h3>
                          <p className="mt-1 text-sm text-emerald-700">
                            Emitido para {certificateInfo.student_name}
                            {certificateInfo.issued_at ? ` em ${certificateInfo.issued_at}` : ""}.
                          </p>
                          <button
                            type="button"
                            onClick={handleDownloadCertificate}
                            disabled={certificateDownloading}
                            className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                          >
                            {certificateDownloading ? "Baixando..." : "Baixar certificado"}
                          </button>
                          <div className="mt-4 rounded-lg border border-emerald-200 bg-white/70 p-3 text-xs text-emerald-800">
                            <p>
                              <span className="font-semibold">Código de verificação:</span>{" "}
                              {certificateInfo.verification_code ?? "—"}
                            </p>
                            <p className="mt-1 break-all">
                              <span className="font-semibold">Assinatura digital:</span>{" "}
                              {certificateInfo.digital_signature ?? "—"}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                          <h3 className="text-base font-semibold text-amber-800">
                            Certificado ainda bloqueado
                          </h3>
                          <p className="mt-1 text-sm text-amber-700">
                            Conclua todas as aulas do curso para liberar a emissão do certificado.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-5 text-sm text-gray-500">
                      Não foi possível carregar os dados do certificado.
                    </div>
                  )}

                  {certificateError ? (
                    <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                      {certificateError}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}
