import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import Navbar from "../../components/Navbar";
import {
  completeLesson,
  fetchCourseDetail,
  fetchCourseModules,
  fetchLesson,
  fetchLessons,
} from "../../services/courseService";
import type { CourseDetail, CourseLesson, CourseModule, LessonDetail } from "../../types/course.types";
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

  const lessonsByModule = useMemo(() => {
    const map = new Map<number, CourseLesson[]>();
    for (const item of lessons) {
      const list = map.get(item.module_id) ?? [];
      list.push(item);
      map.set(item.module_id, list);
    }
    return map;
  }, [lessons]);

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

      try {
        const [courseData, lessonData, modulesData, allLessons] = await Promise.all([
          fetchCourseDetail(courseId),
          fetchLesson(lessonId),
          fetchCourseModules(courseId),
          fetchLessons(),
        ]);

        if (cancelled) return;

        const courseLessons = allLessons.filter((l) =>
          modulesData.some((m) => m.module_id === l.module_id),
        );

        setCourse(courseData);
        setLesson(lessonData);
        setModules(modulesData);
        setLessons(courseLessons);
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
    setCompleteLoading(true);
    setCompleteMessage(null);

    try {
      await completeLesson(lessonId);
      setCompleteMessage("Aula marcada como concluída.");
    } catch (err: unknown) {
      setCompleteMessage(getApiErrorMessage(err, "Não foi possível registrar a conclusão."));
    } finally {
      setCompleteLoading(false);
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
                  <p className="mt-2 text-sm text-gray-400">
                    Exercícios e quizzes da aula serão integrados na aba Avaliações do curso.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleComplete}
                    disabled={completeLoading}
                    className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
                  >
                    {completeLoading ? "Salvando..." : "Marcar aula como concluída"}
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
                          "block rounded-lg px-3 py-2 text-sm transition-colors",
                          item.lesson_id === lessonId
                            ? "bg-indigo-600 font-medium text-white"
                            : "text-gray-300 hover:bg-gray-700",
                        ].join(" ")}
                      >
                        {item.title}
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
