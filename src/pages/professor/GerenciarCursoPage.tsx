import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../contexts/AuthContext";
import {
  createCourse,
  createLesson,
  createLessonVideo,
  createModule,
  fetchCourseDetail,
  fetchCourseModules,
  fetchLessons,
  updateCourse,
} from "../../services/courseService";
import type { CourseStatus } from "../../types/course.types";
import { getApiErrorMessage } from "../../utils/apiError";

const fieldClass =
  "w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-emerald-500";

const labelClass = "mb-2 block text-sm font-medium text-gray-600";

const CATEGORY_OPTIONS = [
  { value: "", label: "Selecione uma categoria" },
  { value: "Lógica de Programação", label: "Lógica de Programação" },
  { value: "Matemática", label: "Matemática" },
  { value: "Ciências da Computação", label: "Ciências da Computação" },
] as const;

const EDITOR_TABS = [
  { id: "informacoes", label: "Informações" },
  { id: "conteudo", label: "Conteúdo" },
  { id: "exercicios", label: "Exercícios" },
  { id: "alunos", label: "Alunos" },
] as const;

type EditorTab = (typeof EDITOR_TABS)[number]["id"];
type LessonFormItem = {
  clientId: string;
  title: string;
  description: string;
  videoUrl: string;
};

type ModuleFormItem = {
  clientId: string;
  title: string;
  lessons: LessonFormItem[];
};

type CourseFormState = {
  title: string;
  description: string;
  area: string;
  coverImageUrl: string;
  status: CourseStatus;
};

function createClientId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createEmptyLesson(): LessonFormItem {
  return {
    clientId: createClientId(),
    title: "",
    description: "",
    videoUrl: "",
  };
}

function createEmptyModule(): ModuleFormItem {
  return {
    clientId: createClientId(),
    title: "",
    lessons: [createEmptyLesson()],
  };
}

const initialCourseForm: CourseFormState = {
  title: "",
  description: "",
  area: "",
  coverImageUrl: "",
  status: "rascunho",
};

function isEditorTab(value: string | null): value is EditorTab {
  return EDITOR_TABS.some((tab) => tab.id === value);
}

function validateForm(
  courseForm: CourseFormState,
  modules: ModuleFormItem[],
): string | null {
  if (!courseForm.title.trim()) return "Informe o título do curso.";
  if (!courseForm.description.trim()) return "Informe a descrição do curso.";
  if (!courseForm.area) return "Selecione uma categoria.";

  const modulesWithContent = modules.filter((module) => {
    const hasModuleTitle = module.title.trim().length > 0;
    const hasLessonData = module.lessons.some(
      (lesson) =>
        lesson.title.trim().length > 0 ||
        lesson.videoUrl.trim().length > 0 ||
        lesson.description.trim().length > 0,
    );
    return hasModuleTitle || hasLessonData;
  });

  if (courseForm.status === "publicado") {
    if (modulesWithContent.length === 0) {
      return "Adicione pelo menos um módulo para publicar o curso.";
    }

    for (let i = 0; i < modulesWithContent.length; i += 1) {
      const module = modulesWithContent[i];
      if (!module.title.trim()) return `Informe o título do módulo ${i + 1}.`;

      const lessonsWithContent = module.lessons.filter(
        (lesson) =>
          lesson.title.trim().length > 0 ||
          lesson.videoUrl.trim().length > 0 ||
          lesson.description.trim().length > 0,
      );

      if (lessonsWithContent.length === 0) {
        return `Adicione pelo menos uma aula no módulo ${i + 1}.`;
      }

      for (let j = 0; j < lessonsWithContent.length; j += 1) {
        if (!lessonsWithContent[j].title.trim()) {
          return `Informe o título da aula ${j + 1} do módulo ${i + 1}.`;
        }
      }
    }
  }

  return null;
}

function normalizeModulesForSubmit(modules: ModuleFormItem[]): ModuleFormItem[] {
  return modules
    .filter((module) => {
      const hasModuleTitle = module.title.trim().length > 0;
      const hasLessonData = module.lessons.some(
        (lesson) =>
          lesson.title.trim().length > 0 ||
          lesson.videoUrl.trim().length > 0 ||
          lesson.description.trim().length > 0,
      );
      return hasModuleTitle || hasLessonData;
    })
    .map((module) => ({
      ...module,
      lessons: module.lessons.filter(
        (lesson) =>
          lesson.title.trim().length > 0 ||
          lesson.videoUrl.trim().length > 0 ||
          lesson.description.trim().length > 0,
      ),
    }));
}

export default function GerenciarCursoPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { courseId } = useParams<{ courseId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const isEditMode = useMemo(() => {
    if (!courseId || courseId === "novo") return false;
    const parsed = Number(courseId);
    return !Number.isNaN(parsed) && parsed > 0;
  }, [courseId]);

  const parsedCourseId = isEditMode ? Number(courseId) : null;
  const tabParam = searchParams.get("aba");
  const activeTab: EditorTab = isEditorTab(tabParam) ? tabParam : "informacoes";

  const [courseForm, setCourseForm] = useState<CourseFormState>(initialCourseForm);
  const [modules, setModules] = useState<ModuleFormItem[]>([createEmptyModule()]);
  const [isLoadingCourse, setIsLoadingCourse] = useState(isEditMode);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const pageTitle = isEditMode
    ? courseForm.title.trim() || "Editar curso"
    : "Novo curso";

  const setActiveTab = (tab: EditorTab) => {
    setSearchParams({ aba: tab }, { replace: true });
  };

  useEffect(() => {
    if (!isEditMode || parsedCourseId == null) return;

    let cancelled = false;

    const load = async () => {
      setIsLoadingCourse(true);
      setLoadError(null);

      try {
        const [course, courseModules, allLessons] = await Promise.all([
          fetchCourseDetail(parsedCourseId),
          fetchCourseModules(parsedCourseId),
          fetchLessons(),
        ]);

        if (cancelled) return;

        const moduleIds = new Set(courseModules.map((m) => m.module_id));
        const courseLessons = allLessons.filter((l) => moduleIds.has(l.module_id));

        setCourseForm({
          title: course.title,
          description: course.description,
          area: course.area ?? "",
          coverImageUrl: course.cover_image_url ?? "",
          status: course.status ?? "rascunho",
        });

        if (courseModules.length === 0) {
          setModules([createEmptyModule()]);
        } else {
          setModules(
            courseModules.map((module) => {
              const moduleLessons = courseLessons
                .filter((l) => l.module_id === module.module_id)
                .map((lesson) => ({
                  clientId: createClientId(),
                  title: lesson.title,
                  description: "",
                  videoUrl: "",
                }));

              return {
                clientId: createClientId(),
                title: module.title,
                lessons: moduleLessons.length > 0 ? moduleLessons : [createEmptyLesson()],
              };
            }),
          );
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setLoadError(getApiErrorMessage(err, "Não foi possível carregar o curso."));
        }
      } finally {
        if (!cancelled) setIsLoadingCourse(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [isEditMode, parsedCourseId]);

  const updateCourseField = <K extends keyof CourseFormState>(
    field: K,
    value: CourseFormState[K],
  ) => {
    setCourseForm((prev) => ({ ...prev, [field]: value }));
  };

  const addModule = () => setModules((prev) => [...prev, createEmptyModule()]);

  const removeModule = (moduleClientId: string) => {
    setModules((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((module) => module.clientId !== moduleClientId);
    });
  };

  const updateModuleTitle = (moduleClientId: string, title: string) => {
    setModules((prev) =>
      prev.map((module) =>
        module.clientId === moduleClientId ? { ...module, title } : module,
      ),
    );
  };

  const addLesson = (moduleClientId: string) => {
    setModules((prev) =>
      prev.map((module) =>
        module.clientId === moduleClientId
          ? { ...module, lessons: [...module.lessons, createEmptyLesson()] }
          : module,
      ),
    );
  };

  const removeLesson = (moduleClientId: string, lessonClientId: string) => {
    setModules((prev) =>
      prev.map((module) => {
        if (module.clientId !== moduleClientId) return module;
        if (module.lessons.length <= 1) return module;
        return {
          ...module,
          lessons: module.lessons.filter((lesson) => lesson.clientId !== lessonClientId),
        };
      }),
    );
  };

  const updateLessonField = (
    moduleClientId: string,
    lessonClientId: string,
    field: keyof Omit<LessonFormItem, "clientId">,
    value: string,
  ) => {
    setModules((prev) =>
      prev.map((module) => {
        if (module.clientId !== moduleClientId) return module;
        return {
          ...module,
          lessons: module.lessons.map((lesson) =>
            lesson.clientId === lessonClientId ? { ...lesson, [field]: value } : lesson,
          ),
        };
      }),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    const validationError = validateForm(courseForm, modules);
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    const modulesToSubmit = normalizeModulesForSubmit(modules);

    if (!import.meta.env.VITE_API_URL) {
      setSubmitError(
        "VITE_API_URL não está configurada. Crie o arquivo .env.local com a URL da API.",
      );
      return;
    }

    if (!user?.user_id) {
      setSubmitError("Sessão inválida. Saia e entre novamente.");
      return;
    }

    if (user.type_user !== "P") {
      setSubmitError("Apenas professores podem salvar cursos.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode && parsedCourseId != null) {
        const updatedCourse = await updateCourse(parsedCourseId, {
          title: courseForm.title.trim(),
          description: courseForm.description.trim(),
          area: courseForm.area,
          status: courseForm.status,
          cover_image_url: courseForm.coverImageUrl.trim() || null,
          professor_id: user.user_id,
        });

        const existingModules = await fetchCourseModules(updatedCourse.course_id);
        const normalizedExisting = [...existingModules].sort(
          (a, b) => (a.order_index ?? 0) - (b.order_index ?? 0),
        );

        for (let index = 0; index < modulesToSubmit.length; index += 1) {
          const module = modulesToSubmit[index];
          const currentOrder = index + 1;
          const existing = normalizedExisting[index];

          if (existing && existing.title.trim() === module.title.trim()) {
            continue;
          }

          const createdModule = await createModule({
            title: module.title.trim(),
            course_id: updatedCourse.course_id,
            order_index: currentOrder,
          });

          for (const lesson of module.lessons) {
            const createdLesson = await createLesson({
              title: lesson.title.trim(),
              content_type: "V",
              module_id: createdModule.module_id,
            });

            if (lesson.videoUrl.trim()) {
              await createLessonVideo({
                lesson_id: createdLesson.lesson_id,
                video_url: lesson.videoUrl.trim(),
              });
            }
          }
        }

        setSubmitSuccess("Curso atualizado com sucesso!");
        return;
      }

      const createdCourse = await createCourse({
        title: courseForm.title.trim(),
        description: courseForm.description.trim(),
        area: courseForm.area,
        status: courseForm.status,
        cover_image_url: courseForm.coverImageUrl.trim() || null,
        professor_id: user.user_id,
      });

      for (let moduleIndex = 0; moduleIndex < modulesToSubmit.length; moduleIndex += 1) {
        const module = modulesToSubmit[moduleIndex];
        const createdModule = await createModule({
          title: module.title.trim(),
          course_id: createdCourse.course_id,
          order_index: moduleIndex + 1,
        });

        for (const lesson of module.lessons) {
          const createdLesson = await createLesson({
            title: lesson.title.trim(),
            content_type: "V",
            module_id: createdModule.module_id,
          });

          if (lesson.videoUrl.trim()) {
            await createLessonVideo({
              lesson_id: createdLesson.lesson_id,
              video_url: lesson.videoUrl.trim(),
            });
          }
        }
      }

      setSubmitSuccess("Curso criado com sucesso!");
      window.setTimeout(() => {
        navigate(`/professor/cursos/${createdCourse.course_id}?aba=conteudo`, {
          replace: true,
        });
      }, 900);
    } catch (err: unknown) {
      setSubmitError(getApiErrorMessage(err, "Não foi possível salvar o curso."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const showSaveActions = activeTab === "informacoes" || activeTab === "conteudo";

  return (
    <main className="flex min-h-screen flex-col bg-slate-50 text-gray-900">
      <Navbar />

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <Link
            to="/professor/cursos"
            className="text-sm font-medium text-emerald-700 hover:underline"
          >
            ← Meus cursos
          </Link>
          <h1 className="mt-3 text-2xl font-bold md:text-3xl">{pageTitle}</h1>
          {!isEditMode ? (
            <p className="mt-1 text-sm text-gray-600">
              Preencha as abas abaixo e publique quando estiver pronto.
            </p>
          ) : null}
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        <nav className="mb-6 flex flex-wrap gap-2 border-b border-gray-200">
          {EDITOR_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={[
                "rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "border-b-2 border-emerald-600 text-emerald-800"
                  : "text-gray-600 hover:text-gray-900",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {isLoadingCourse ? (
          <p className="text-gray-500">Carregando curso...</p>
        ) : loadError ? (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{loadError}</p>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {activeTab === "informacoes" ? (
              <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-lg font-semibold">Informações gerais</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className={labelClass}>
                      Título
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={courseForm.title}
                      onChange={(e) => updateCourseField("title", e.target.value)}
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className={labelClass}>
                      Descrição
                    </label>
                    <textarea
                      id="description"
                      value={courseForm.description}
                      onChange={(e) => updateCourseField("description", e.target.value)}
                      className={`${fieldClass} min-h-[120px] resize-y`}
                    />
                  </div>
                  <div>
                    <label htmlFor="area" className={labelClass}>
                      Categoria
                    </label>
                    <select
                      id="area"
                      value={courseForm.area}
                      onChange={(e) => updateCourseField("area", e.target.value)}
                      className={fieldClass}
                    >
                      {CATEGORY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="coverImageUrl" className={labelClass}>
                      URL da capa
                    </label>
                    <input
                      id="coverImageUrl"
                      type="url"
                      value={courseForm.coverImageUrl}
                      onChange={(e) => updateCourseField("coverImageUrl", e.target.value)}
                      className={fieldClass}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label htmlFor="status" className={labelClass}>
                      Status
                    </label>
                    <select
                      id="status"
                      value={courseForm.status}
                      onChange={(e) =>
                        updateCourseField("status", e.target.value as CourseStatus)
                      }
                      className={fieldClass}
                    >
                      <option value="rascunho">Rascunho</option>
                      <option value="publicado">Publicado</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      O status será persistido na API quando o endpoint de atualização estiver
                      disponível.
                    </p>
                  </div>
                </div>
              </article>
            ) : null}

            {activeTab === "conteudo" ? (
              <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">Conteúdo do curso</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Módulos, aulas e links de vídeo (upload de arquivo em breve).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addModule}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-50"
                  >
                    + Módulo
                  </button>
                </div>

                <div className="space-y-6">
                  {modules.map((module, moduleIndex) => (
                    <section
                      key={module.clientId}
                      className="rounded-lg border border-gray-200 bg-gray-50/80 p-5"
                    >
                      <div className="mb-4 flex justify-between gap-3">
                        <span className="text-sm font-semibold text-gray-500">
                          Módulo {moduleIndex + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeModule(module.clientId)}
                          disabled={modules.length <= 1}
                          className="text-sm text-red-600 disabled:opacity-40"
                        >
                          Remover
                        </button>
                      </div>
                      <input
                        type="text"
                        value={module.title}
                        onChange={(e) => updateModuleTitle(module.clientId, e.target.value)}
                        className={`${fieldClass} mb-4`}
                        placeholder="Título do módulo"
                      />
                      <div className="space-y-3">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lesson.clientId}
                            className="rounded-lg border border-gray-200 bg-white p-4"
                          >
                            <div className="mb-2 flex justify-between">
                              <span className="text-xs text-gray-500">
                                Aula {lessonIndex + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  removeLesson(module.clientId, lesson.clientId)
                                }
                                disabled={module.lessons.length <= 1}
                                className="text-xs text-red-600 disabled:opacity-40"
                              >
                                Remover
                              </button>
                            </div>
                            <input
                              type="text"
                              value={lesson.title}
                              onChange={(e) =>
                                updateLessonField(
                                  module.clientId,
                                  lesson.clientId,
                                  "title",
                                  e.target.value,
                                )
                              }
                              className={`${fieldClass} mb-2`}
                              placeholder="Título da aula"
                            />
                            <input
                              type="url"
                              value={lesson.videoUrl}
                              onChange={(e) =>
                                updateLessonField(
                                  module.clientId,
                                  lesson.clientId,
                                  "videoUrl",
                                  e.target.value,
                                )
                              }
                              className={fieldClass}
                              placeholder="Link do vídeo (YouTube, etc.)"
                            />
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addLesson(module.clientId)}
                          className="text-sm font-semibold text-emerald-700 hover:underline"
                        >
                          + Adicionar aula
                        </button>
                      </div>
                    </section>
                  ))}
                </div>
              </article>
            ) : null}

            {activeTab === "exercicios" ? (
              <article className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
                <h2 className="text-lg font-semibold">Exercícios e avaliações</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Quizzes e provas serão configurados aqui com os endpoints{" "}
                  <code className="text-xs">/lessons/create/quiz</code> e perguntas da API.
                </p>
              </article>
            ) : null}

            {activeTab === "alunos" ? (
              <article className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
                <h2 className="text-lg font-semibold">Alunos matriculados</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Matrículas, progresso e notas aparecerão quando a API expuser relatórios por
                  curso.
                </p>
              </article>
            ) : null}

            {submitError ? (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{submitError}</p>
            ) : null}
            {submitSuccess ? (
              <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                {submitSuccess}
              </p>
            ) : null}

            {showSaveActions ? (
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
                >
                  {isSubmitting
                    ? "Salvando..."
                    : isEditMode
                      ? "Salvar alterações"
                      : "Criar curso"}
                </button>
                <Link
                  to="/professor/cursos"
                  className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold hover:bg-gray-50"
                >
                  Cancelar
                </Link>
              </div>
            ) : null}
          </form>
        )}
      </div>
    </main>
  );
}
