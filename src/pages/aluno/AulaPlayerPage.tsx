import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import Navbar from "../../components/Navbar";
import {
  completeLesson,
  fetchCompletedLessonsByCourse,
  fetchCourseDetail,
  fetchCourseModules,
  fetchLesson,
  fetchLessonQuiz,
  fetchLessons,
  submitLessonQuizAnswers,
} from "../../services/courseService";
import type {
  CourseDetail,
  CourseLesson,
  CourseModule,
  LessonDetail,
  LessonQuiz,
} from "../../types/course.types";
import { getApiErrorMessage } from "../../utils/apiError";
import { trackRecentCourse } from "../../utils/studentStorage";

function isYoutubeUrl(url: string): boolean {
  return /youtube\.com|youtu\.be/i.test(url);
}

function toEmbedUrl(url: string): string {
  if (url.includes("embed")) return url;
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  return url;
}

function getOptionLabel(index: number): string {
  return String.fromCharCode(65 + (index % 26));
}

export default function AulaPlayerPage() {
  const { id: courseIdParam, aulaId: lessonIdParam } = useParams<{
    id: string;
    aulaId: string;
  }>();
  const courseId = Number(courseIdParam);
  const lessonId = Number(lessonIdParam);

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completeLoading, setCompleteLoading] = useState(false);
  const [completeMessage, setCompleteMessage] = useState<string | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([]);
  const [lessonQuiz, setLessonQuiz] = useState<LessonQuiz | null>(null);
  const [selectedOptionsByQuestion, setSelectedOptionsByQuestion] = useState<Record<number, number>>({});
  const [quizChecked, setQuizChecked] = useState(false);
  const [quizAlreadyAnswered, setQuizAlreadyAnswered] = useState(false);
  const [quizPersistLoading, setQuizPersistLoading] = useState(false);
  const [quizSummary, setQuizSummary] = useState<{ correct: number; total: number } | null>(null);
  const [quizMessage, setQuizMessage] = useState<string | null>(null);

  const lessonsByModule = useMemo(() => {
    const map = new Map<number, CourseLesson[]>();
    for (const item of lessons) {
      const list = map.get(item.module_id) ?? [];
      list.push(item);
      map.set(item.module_id, list);
    }
    return map;
  }, [lessons]);

  const completedLessonIdSet = useMemo(
    () => new Set(completedLessonIds),
    [completedLessonIds],
  );
  const isLessonCompleted = completedLessonIdSet.has(lessonId);

  useEffect(() => {
    if (!courseIdParam || !lessonIdParam || Number.isNaN(courseId) || Number.isNaN(lessonId)) {
      setError("Aula ou curso inválido.");
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      setQuizMessage(null);
      setQuizChecked(false);
      setQuizSummary(null);
      setSelectedOptionsByQuestion({});

      try {
        const [courseData, lessonData, modulesData, allLessons, quizData] = await Promise.all([
          fetchCourseDetail(courseId),
          fetchLesson(lessonId),
          fetchCourseModules(courseId),
          fetchLessons(),
          fetchLessonQuiz(lessonId).catch(() => ({ lesson_id: lessonId, quiz_id: null, questions: [] })),
        ]);

        if (cancelled) return;

        const courseLessons = allLessons.filter((l) =>
          modulesData.some((m) => m.module_id === l.module_id),
        );

        setCourse(courseData);
        setLesson(lessonData);
        setModules(modulesData);
        setLessons(courseLessons);
        setLessonQuiz(quizData);
        const completedIds = await fetchCompletedLessonsByCourse(courseId).catch(() => []);
        if (!cancelled) {
          setCompletedLessonIds(completedIds);
        }
        const existingAttempt = quizData.attempt;
        if (existingAttempt) {
          setSelectedOptionsByQuestion(existingAttempt.selected_options_by_question_id ?? {});
          setQuizAlreadyAnswered(true);
          setQuizChecked(true);
          const totalQuestions = (quizData.questions ?? []).length;
          const scorePercent = Number(existingAttempt.score ?? 0);
          const correctApprox = Math.round((scorePercent / 100) * totalQuestions);
          setQuizSummary({ correct: correctApprox, total: totalQuestions });
          setQuizMessage("Este quiz já foi respondido. Você não pode alterar as respostas.");
        } else {
          setQuizAlreadyAnswered(false);
        }
        trackRecentCourse(courseId, courseData.title);
      } catch (err: unknown) {
        if (!cancelled) {
          setError(getApiErrorMessage(err, "Não foi possível carregar a aula."));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [courseId, courseIdParam, lessonId, lessonIdParam]);

  const handleComplete = async () => {
    if (isLessonCompleted) {
      setCompleteMessage("Esta aula já está concluída.");
      return;
    }

    setCompleteLoading(true);
    setCompleteMessage(null);

    try {
      await completeLesson(lessonId);
      setCompleteMessage("Aula marcada como concluída.");
      setCompletedLessonIds((prev) => (prev.includes(lessonId) ? prev : [...prev, lessonId]));
    } catch (err: unknown) {
      setCompleteMessage(getApiErrorMessage(err, "Não foi possível registrar a conclusão."));
    } finally {
      setCompleteLoading(false);
    }
  };

  const handleSelectOption = (questionId: number, optionId: number) => {
    if (quizAlreadyAnswered) return;
    setSelectedOptionsByQuestion((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
    if (quizChecked) {
      setQuizChecked(false);
      setQuizSummary(null);
      setQuizMessage(null);
    }
  };

  const handleSubmitQuiz = async () => {
    if (quizAlreadyAnswered) return;
    if (!lessonQuiz?.questions?.length) return;
    if (!lessonQuiz.quiz_id) return;

    const questions = lessonQuiz.questions ?? [];
    const allAnswered = questions.every((question) => {
      if (!question.id) return false;
      return Boolean(selectedOptionsByQuestion[question.id]);
    });

    if (!allAnswered) {
      setQuizMessage("Responda todas as questões antes de enviar.");
      return;
    }

    const correctAnswers = questions.reduce((acc, question) => {
      if (!question.id) return acc;
      const selectedOptionId = selectedOptionsByQuestion[question.id];
      const correctOption = question.options.find((option) => option.is_correct);
      if (correctOption?.id === selectedOptionId) {
        return acc + 1;
      }
      return acc;
    }, 0);

    const totalQuestions = questions.length;
    const answerOptionIds = questions
      .map((question) => (question.id ? selectedOptionsByQuestion[question.id] : undefined))
      .filter((value): value is number => typeof value === "number");

    setQuizPersistLoading(true);
    try {
      await submitLessonQuizAnswers(lessonId, lessonQuiz.quiz_id, answerOptionIds);
      setQuizChecked(true);
      setQuizAlreadyAnswered(true);
      setQuizSummary({ correct: correctAnswers, total: totalQuestions });
      setQuizMessage(`Você acertou ${correctAnswers} de ${totalQuestions} questão(ões). Respostas salvas.`);
    } catch (err: unknown) {
      setQuizMessage(getApiErrorMessage(err, "Não foi possível salvar as respostas."));
    } finally {
      setQuizPersistLoading(false);
    }
  };

  const videoUrl = lesson?.video_url?.trim() ?? "";

  return (
    <main className="flex min-h-screen flex-col bg-gray-900 text-gray-100">
      <Navbar />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 lg:flex-row">
        <div className="flex-1">
          <Link
            to={`/curso/${courseId}`}
            className="text-sm font-medium text-indigo-300 hover:underline"
          >
            ← Voltar ao curso
          </Link>

          {isLoading ? (
            <p className="mt-8 text-gray-400">Carregando aula...</p>
          ) : error ? (
            <p className="mt-8 rounded-lg bg-red-900/40 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          ) : lesson && course ? (
            <>
              <h1 className="mt-4 text-2xl font-bold">{lesson.title}</h1>
              <p className="mt-1 text-sm text-gray-400">{course.title}</p>

              <div className="mt-6 aspect-video w-full overflow-hidden rounded-xl bg-black">
                {videoUrl ? (
                  isYoutubeUrl(videoUrl) ? (
                    <iframe
                      title={lesson.title}
                      src={toEmbedUrl(videoUrl)}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video src={videoUrl} controls className="h-full w-full">
                      <track kind="captions" />
                    </video>
                  )
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    Vídeo não disponível para esta aula.
                  </div>
                )}
              </div>

              <section className="mt-8 space-y-6 rounded-xl border border-gray-700 bg-gray-800/50 p-6">
                <div>
                  <h2 className="text-lg font-semibold">Materiais complementares</h2>
                  <p className="mt-2 text-sm text-gray-400">
                    Materiais em PDF e links extras serão exibidos aqui quando disponíveis na API.
                  </p>
                </div>

                <div>
                  <label htmlFor="notes" className="mb-2 block text-lg font-semibold">
                    Anotações
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="Suas anotações sobre esta aula (salvas localmente nesta sessão)..."
                    className="w-full rounded-lg border border-gray-600 bg-gray-900 px-4 py-3 text-sm text-gray-100 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <h2 className="text-lg font-semibold">Exercícios da aula</h2>
                  {!lessonQuiz || (lessonQuiz.questions ?? []).length === 0 ? (
                    <p className="mt-2 text-sm text-gray-400">Esta aula ainda não possui quiz publicado.</p>
                  ) : (
                    <div className="mt-4 space-y-5">
                      <div className="rounded-xl border border-gray-700 bg-gray-900/40 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-300">
                          Questionário da aula
                        </p>
                        <p className="mt-1 text-sm text-gray-300">
                          Responda todas as perguntas e clique em corrigir para ver o resultado na hora.
                        </p>
                      </div>

                      {quizSummary ? (
                        <div className="rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-4 py-3">
                          <p className="text-sm font-medium text-indigo-100">
                            Resultado: {quizSummary.correct}/{quizSummary.total} acertos
                          </p>
                        </div>
                      ) : null}

                      {(lessonQuiz.questions ?? []).map((question, questionIndex) => (
                        <div
                          key={question.id ?? `question-${questionIndex}`}
                          className="rounded-xl border border-gray-700 bg-gray-900/50 p-5"
                        >
                          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-300">
                            Questão {questionIndex + 1} de {lessonQuiz.questions.length}
                          </p>
                          <p className="mt-2 text-sm font-medium text-gray-100">
                            {question.question_text}
                          </p>

                          <div className="mt-4 space-y-2.5">
                            {question.options.map((option, optionIndex) => {
                              const questionId = question.id;
                              const selectedOptionId =
                                questionId != null ? selectedOptionsByQuestion[questionId] : undefined;
                              const isSelected = selectedOptionId === option.id;
                              const isCorrectOption = option.is_correct === true;
                              const isWrongSelected = quizChecked && isSelected && !isCorrectOption;
                              const isCorrectHighlighted = quizChecked && isCorrectOption;
                              return (
                                <label
                                  key={option.id ?? `option-${optionIndex}`}
                                  className={[
                                    "group flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors",
                                    isCorrectHighlighted
                                      ? "border-green-500 bg-green-500/15"
                                      : isWrongSelected
                                        ? "border-red-500 bg-red-500/10"
                                        : isSelected
                                      ? "border-indigo-500 bg-indigo-500/10"
                                      : "border-gray-700 bg-gray-900/30 hover:border-gray-500",
                                  ].join(" ")}
                                >
                                  <input
                                    type="radio"
                                    name={`question-${question.id ?? questionIndex}`}
                                    value={option.id}
                                    checked={selectedOptionId === option.id}
                                    disabled={option.id == null || questionId == null || quizAlreadyAnswered}
                                    onChange={() => {
                                      if (questionId != null && option.id != null) {
                                        handleSelectOption(questionId, option.id);
                                      }
                                    }}
                                    className="sr-only"
                                  />
                                  <span
                                    className={[
                                      "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                                      isCorrectHighlighted
                                        ? "border-green-400 bg-green-500 text-white"
                                        : isWrongSelected
                                          ? "border-red-400 bg-red-500 text-white"
                                          : isSelected
                                        ? "border-indigo-400 bg-indigo-500 text-white"
                                        : "border-gray-500 text-gray-300",
                                    ].join(" ")}
                                  >
                                    {getOptionLabel(optionIndex)}
                                  </span>
                                  <span
                                    className={
                                      isCorrectHighlighted
                                        ? "text-green-100"
                                        : isWrongSelected
                                          ? "text-red-100"
                                          : isSelected
                                            ? "text-indigo-100"
                                            : "text-gray-200"
                                    }
                                  >
                                    {option.option_text}
                                  </span>
                                </label>
                              );
                            })}
                          </div>

                          {quizChecked && question.id != null ? (
                            (() => {
                              const selectedOptionId = selectedOptionsByQuestion[question.id];
                              const correctOption = question.options.find((option) => option.is_correct);
                              const isCorrect = correctOption?.id === selectedOptionId;
                              return (
                                <p
                                  className={[
                                    "mt-3 text-xs font-medium",
                                    isCorrect ? "text-green-300" : "text-amber-300",
                                  ].join(" ")}
                                >
                                  {isCorrect
                                    ? "Resposta correta."
                                    : `Resposta incorreta. Correta: ${correctOption?.option_text ?? "não identificada"}.`}
                                </p>
                              );
                            })()
                          ) : null}
                        </div>
                      ))}

                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={handleSubmitQuiz}
                          disabled={quizAlreadyAnswered || quizPersistLoading}
                          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
                        >
                          {quizPersistLoading
                            ? "Salvando respostas..."
                            : quizAlreadyAnswered
                              ? "Quiz já respondido"
                              : "Enviar e corrigir"}
                        </button>
                        {quizMessage ? (
                          <p className="text-sm text-green-300">{quizMessage}</p>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleComplete}
                    disabled={completeLoading || isLessonCompleted}
                    className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
                  >
                    {completeLoading
                      ? "Salvando..."
                      : isLessonCompleted
                        ? "Aula já concluída"
                        : "Marcar aula como concluída"}
                  </button>
                  {completeMessage ? (
                    <p className="self-center text-sm text-green-300">{completeMessage}</p>
                  ) : null}
                </div>
              </section>
            </>
          ) : null}
        </div>

        <aside className="w-full shrink-0 rounded-xl border border-gray-700 bg-gray-800/80 p-4 lg:w-80">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Aulas do curso
          </h2>
          <div className="max-h-[32rem] space-y-4 overflow-y-auto pr-1">
            {modules.map((module) => (
              <div key={module.module_id}>
                <p className="mb-2 text-xs font-semibold text-gray-500">{module.title}</p>
                <ul className="space-y-1">
                  {(lessonsByModule.get(module.module_id) ?? []).map((item) => (
                    <li key={item.lesson_id}>
                      <Link
                        to={`/curso/${courseId}/aula/${item.lesson_id}`}
                        className={[
                          "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                          item.lesson_id === lessonId
                            ? "bg-indigo-600 font-medium text-white"
                            : completedLessonIdSet.has(item.lesson_id)
                              ? "bg-emerald-900/40 text-emerald-200 hover:bg-emerald-900/60"
                              : "text-gray-300 hover:bg-gray-700",
                        ].join(" ")}
                      >
                        <span className="truncate">{item.title}</span>
                        {completedLessonIdSet.has(item.lesson_id) ? (
                          <span
                            className={[
                              "ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                              item.lesson_id === lessonId
                                ? "bg-white/20 text-white"
                                : "bg-emerald-700/50 text-emerald-100",
                            ].join(" ")}
                          >
                            Concluída
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-500">
            Progresso detalhado será exibido quando a API de progresso estiver disponível.
          </p>
        </aside>
      </div>
    </main>
  );
}
