import { useState } from "react";
import type { CourseProgress, Enrollment } from "../types/enrollment.types";
import { getApiErrorMessage } from "../utils/apiError";

// Criando uma função provisória para o componente não quebrar
const downloadCertificate = async (...args: any[]) => {
  console.log("Download de certificado provisório acionado", args);
};

type CourseProgressCardProps = {
  enrollment: Enrollment;
  progress: CourseProgress | null;
  isLoading: boolean;
  error: string | null;
};

export default function CourseProgressCard({
  enrollment,
  progress,
  isLoading,
  error,
}: CourseProgressCardProps) {
  const [certLoading, setCertLoading] = useState(false);
  const [certError, setCertError] = useState<string | null>(null);

  const percent = progress?.progress_percent ?? 0;
  const isComplete = percent === 100;

  const handleCertificate = async () => {
    if (!isComplete) return;

    setCertError(null);
    setCertLoading(true);

    try {
      if (progress?.certificate_url) {
        window.open(progress.certificate_url, "_blank", "noopener,noreferrer");
        return;
      }
      await downloadCertificate(enrollment.course_id);
    } catch (err: unknown) {
      setCertError(
        getApiErrorMessage(err, "Não foi possível emitir o certificado."),
      );
    } finally {
      setCertLoading(false);
    }
  };

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-md">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {enrollment.course_title}
          </h3>
          {enrollment.course_description ? (
            <p className="mt-1 text-sm text-gray-600">
              {enrollment.course_description}
            </p>
          ) : null}
        </div>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
          {isLoading ? "..." : `${percent}%`}
        </span>
      </div>

      <div className="mb-6 h-3 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${isLoading ? 0 : percent}%` }}
        />
      </div>

      {error ? (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      {isLoading ? (
        <p className="text-sm text-gray-500">Carregando módulos...</p>
      ) : progress && progress.modules.length > 0 ? (
        <ul className="space-y-2">
          {progress.modules.map((mod) => (
            <li
              key={mod.module_id}
              className={[
                "flex items-center gap-3 rounded-lg border px-4 py-3 text-sm",
                mod.completed
                  ? "border-green-200 bg-green-50 text-green-900"
                  : "border-gray-200 bg-gray-50 text-gray-700",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  mod.completed
                    ? "bg-green-600 text-white"
                    : "border-2 border-gray-300 bg-white text-gray-400",
                ].join(" ")}
                aria-hidden
              >
                {mod.completed ? "✓" : "·"}
              </span>
              <span className={mod.completed ? "font-medium" : ""}>
                {mod.module_title}
              </span>
              <span
                className={[
                  "ml-auto text-xs font-medium uppercase tracking-wide",
                  mod.completed ? "text-green-700" : "text-gray-500",
                ].join(" ")}
              >
                {mod.completed ? "Concluído" : "Pendente"}
              </span>
            </li>
          ))}
        </ul>
      ) : !error ? (
        <p className="text-sm text-gray-500">Nenhum módulo registrado.</p>
      ) : null}

      {isComplete ? (
        <div className="mt-6">
          <button
            type="button"
            onClick={handleCertificate}
            disabled={certLoading}
            className="rounded-lg bg-linear-to-r from-purple-700 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {certLoading ? "Gerando..." : "Emitir certificado"}
          </button>
          {certError ? (
            <p className="mt-2 text-sm text-red-600">{certError}</p>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}