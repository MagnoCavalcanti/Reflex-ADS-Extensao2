import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../contexts/AuthContext";
import {
  createCourse,
  createLesson,
  createLessonVideo,
  createModule,
} from "../../services/courseService";
import { getApiErrorMessage } from "../../utils/apiError";

const fieldClass =
  "w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-blue-500";

const labelClass = "mb-2 block text-sm font-medium text-gray-600";

const CATEGORY_OPTIONS = [
  { value: "", label: "Selecione uma categoria" },
  { value: "Lógica de Programação", label: "Lógica de Programação" },
  { value: "Matemática", label: "Matemática" },
  { value: "Ciências da Computação", label: "Ciências da Computação" },
] as const;

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
};

function validateForm(
  courseForm: CourseFormState,
  modules: ModuleFormItem[],
): string | null {
  if (!courseForm.title.trim()) {
    return "Informe o título do curso.";
  }
  if (!courseForm.description.trim()) {
    return "Informe a descrição do curso.";
  }
  if (!courseForm.area) {
    return "Selecione uma categoria.";
  }

  for (let i = 0; i < modules.length; i += 1) {
    const module = modules[i];
    if (!module.title.trim()) {
      return `Informe o título do módulo ${i + 1}.`;
    }
    for (let j = 0; j < module.lessons.length; j += 1) {
      if (!module.lessons[j].title.trim()) {
        return `Informe o título da aula ${j + 1} do módulo ${i + 1}.`;
      }
    }
  }

  return null;
}

export default function GerenciarCursoPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { courseId } = useParams<{ courseId: string }>();

  const isEditMode = useMemo(() => {
    if (!courseId || courseId === "novo") return false;
    const parsed = Number(courseId);
    return !Number.isNaN(parsed) && parsed > 0;
  }, [courseId]);

  const parsedCourseId = isEditMode ? Number(courseId) : null;

  const [courseForm, setCourseForm] = useState<CourseFormState>(initialCourseForm);
  const [modules, setModules] = useState<ModuleFormItem[]>([createEmptyModule()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const pageTitle = isEditMode ? "Editar curso" : "Criar novo curso";
  const pageSubtitle = isEditMode
    ? "Atualize as informações e a estrutura de módulos e aulas."
    : "Preencha os dados do curso e organize módulos e aulas.";

  const updateCourseField = <K extends keyof CourseFormState>(
    field: K,
    value: CourseFormState[K],
  ) => {
    setCourseForm((prev) => ({ ...prev, [field]: value }));
  };

  const addModule = () => {
    setModules((prev) => [...prev, createEmptyModule()]);
  };

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
          lessons: module.lessons.filter(
            (lesson) => lesson.clientId !== lessonClientId,
          ),
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
            lesson.clientId === lessonClientId
              ? { ...lesson, [field]: value }
              : lesson,
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

    if (!import.meta.env.VITE_API_URL) {
      setSubmitError(
        "VITE_API_URL não está configurada. Crie o arquivo .env.local com a URL da API (veja README.md).",
      );
      return;
    }

    if (!user?.user_id) {
      setSubmitError(
        "Sessão inválida: o ID do professor não foi encontrado no token. Saia e entre novamente.",
      );
      return;
    }

    if (user.type_user !== "P") {
      setSubmitError("Apenas usuários do tipo professor podem publicar cursos.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      mode: isEditMode ? "update" : "create",
      courseId: parsedCourseId,
      course: {
        title: courseForm.title.trim(),
        description: courseForm.description.trim(),
        area: courseForm.area,
        cover_image_url: courseForm.coverImageUrl.trim() || null,
        professor_id: user.user_id,
      },
      modules: modules.map((module, moduleIndex) => ({
        order: moduleIndex + 1,
        title: module.title.trim(),
        lessons: module.lessons.map((lesson, lessonIndex) => ({
          order: lessonIndex + 1,
          title: lesson.title.trim(),
          description: lesson.description.trim(),
          video_url: lesson.videoUrl.trim(),
        })),
      })),
    };

    try {
      if (isEditMode) {
        console.log(
          `[GerenciarCurso] PUT /courses/${parsedCourseId} — conectar API:`,
          payload,
        );
        setSubmitSuccess(
          "Dados validados. A integração de edição (PUT) será conectada em breve.",
        );
        return;
      }

      const createdCourse = await createCourse({
        title: payload.course.title,
        description: payload.course.description,
        area: payload.course.area,
        professor_id: payload.course.professor_id,
      });

      for (const module of payload.modules) {
        const createdModule = await createModule({
          title: module.title,
          course_id: createdCourse.course_id,
        });

        for (const lesson of module.lessons) {
          const createdLesson = await createLesson({
            title: lesson.title,
            content_type: "video",
            module_id: createdModule.module_id,
          });

          if (lesson.video_url) {
            await createLessonVideo({
              lesson_id: createdLesson.lesson_id,
              video_url: lesson.video_url,
            });
          }
        }
      }

      setSubmitSuccess("Curso publicado com sucesso!");
      window.setTimeout(() => {
        navigate("/professor/dashboard", { replace: true });
      }, 1200);
    } catch (err: unknown) {
      setSubmitError(
        getApiErrorMessage(err, "Não foi possível publicar o curso. Tente novamente."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen min-w-screen flex-col bg-linear-to-b from-slate-50 to-gray-100 text-gray-900">
      <Navbar />

      <section className="bg-linear-to-r from-emerald-700 via-teal-700 to-blue-700 px-6 py-12 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">{pageTitle}</h1>
          <p className="text-lg text-white/90">{pageSubtitle}</p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
        <p className="mb-8">
          <Link
            to="/professor/dashboard"
            className="text-sm font-medium text-blue-700 hover:underline"
          >
            ← Voltar ao dashboard
          </Link>
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-8">
          <article className="rounded-xl border border-gray-200 bg-white p-8 shadow-md">
            <h2 className="mb-6 text-xl font-semibold">Informações básicas</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="title" className={labelClass}>
                  Título do curso
                </label>
                <input
                  id="title"
                  type="text"
                  value={courseForm.title}
                  onChange={(e) => updateCourseField("title", e.target.value)}
                  className={fieldClass}
                  placeholder="Ex.: Lógica de Programação"
                />
              </div>

              <div>
                <label htmlFor="description" className={labelClass}>
                  Descrição
                </label>
                <textarea
                  id="description"
                  value={courseForm.description}
                  onChange={(e) =>
                    updateCourseField("description", e.target.value)
                  }
                  className={`${fieldClass} min-h-[120px] resize-y`}
                  placeholder="Descreva o objetivo e o conteúdo do curso."
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
                  URL da imagem de capa
                </label>
                <input
                  id="coverImageUrl"
                  type="text"
                  value={courseForm.coverImageUrl}
                  onChange={(e) =>
                    updateCourseField("coverImageUrl", e.target.value)
                  }
                  className={fieldClass}
                  placeholder="https://exemplo.com/capa.jpg"
                />
              </div>

              {courseForm.coverImageUrl.trim() ? (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <img
                    src={courseForm.coverImageUrl.trim()}
                    alt="Pré-visualização da capa"
                    className="h-40 w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              ) : null}
            </div>
          </article>

          <article className="rounded-xl border border-gray-200 bg-white p-8 shadow-md">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Módulos e aulas</h2>
              <button
                type="button"
                onClick={addModule}
                className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100"
              >
                + Adicionar módulo
              </button>
            </div>

            <div className="space-y-6">
              {modules.map((module, moduleIndex) => (
                <section
                  key={module.clientId}
                  className="rounded-lg border border-gray-200 bg-gray-50/80 p-5"
                >
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                      Módulo {moduleIndex + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeModule(module.clientId)}
                      disabled={modules.length <= 1}
                      className="text-sm font-medium text-red-600 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Remover módulo
                    </button>
                  </div>

                  <div className="mb-5">
                    <label
                      htmlFor={`module-title-${module.clientId}`}
                      className={labelClass}
                    >
                      Título do módulo
                    </label>
                    <input
                      id={`module-title-${module.clientId}`}
                      type="text"
                      value={module.title}
                      onChange={(e) =>
                        updateModuleTitle(module.clientId, e.target.value)
                      }
                      className={fieldClass}
                      placeholder="Ex.: Introdução"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold text-gray-700">Aulas</h3>
                      <button
                        type="button"
                        onClick={() => addLesson(module.clientId)}
                        className="rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-800"
                      >
                        + Adicionar aula
                      </button>
                    </div>

                    {module.lessons.map((lesson, lessonIndex) => (
                      <div
                        key={lesson.clientId}
                        className="rounded-lg border border-gray-200 bg-white p-4"
                      >
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <span className="text-xs font-medium text-gray-500">
                            Aula {lessonIndex + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              removeLesson(module.clientId, lesson.clientId)
                            }
                            disabled={module.lessons.length <= 1}
                            className="text-xs font-medium text-red-600 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Remover aula
                          </button>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label
                              htmlFor={`lesson-title-${lesson.clientId}`}
                              className={labelClass}
                            >
                              Título da aula
                            </label>
                            <input
                              id={`lesson-title-${lesson.clientId}`}
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
                              className={fieldClass}
                            />
                          </div>

                          <div>
                            <label
                              htmlFor={`lesson-description-${lesson.clientId}`}
                              className={labelClass}
                            >
                              Descrição da aula
                            </label>
                            <textarea
                              id={`lesson-description-${lesson.clientId}`}
                              value={lesson.description}
                              onChange={(e) =>
                                updateLessonField(
                                  module.clientId,
                                  lesson.clientId,
                                  "description",
                                  e.target.value,
                                )
                              }
                              className={`${fieldClass} min-h-[80px] resize-y`}
                            />
                          </div>

                          <div>
                            <label
                              htmlFor={`lesson-video-${lesson.clientId}`}
                              className={labelClass}
                            >
                              Link do vídeo
                            </label>
                            <input
                              id={`lesson-video-${lesson.clientId}`}
                              type="text"
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
                              placeholder="https://..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </article>

          {submitError ? (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {submitError}
            </p>
          ) : null}
          {submitSuccess ? (
            <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
              {submitSuccess}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-linear-to-r from-purple-700 to-blue-600 px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isSubmitting
                ? "Salvando..."
                : isEditMode
                  ? "Salvar alterações"
                  : "Publicar curso"}
            </button>
            <Link
              to="/professor/dashboard"
              className="rounded-lg border-2 border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
