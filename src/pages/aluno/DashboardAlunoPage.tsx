import { Link, useNavigate } from "react-router";
import {
  CertificatesSkeleton,
  EnrollmentsSkeleton,
  MetricsSkeleton,
} from "../../components/dashboard/DashboardSkeletons";
import { useAuth } from "../../contexts/AuthContext";
import { useStudentDashboard } from "../../hooks/useStudentDashboard";
import { clampPercent, formatDatePtBr, getUserInitials } from "../../utils/user";

function BellIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
      aria-hidden
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

const metricCards = [
  { key: "active_courses" as const, label: "Cursos ativos", accent: "text-blue-600" },
  { key: "completed_lessons" as const, label: "Aulas concluídas", accent: "text-indigo-600" },
  { key: "certificates_issued" as const, label: "Certificados emitidos", accent: "text-purple-600" },
];

export default function DashboardAlunoPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    progress,
    enrollments,
    certificates,
    progressLoading,
    enrollmentsLoading,
    certificatesLoading,
    progressError,
    enrollmentsError,
    certificatesError,
  } = useStudentDashboard();

  const displayName = user?.username ?? "Aluno";
  const initials = getUserInitials(displayName);
  const showCertificates =
    certificatesLoading || (certificates !== null && certificates.length > 0);

  return (
    <main className="flex min-h-screen min-w-screen flex-col bg-linear-to-b from-slate-50 to-gray-100 text-gray-900">
      <div className="border-b bg-white shadow-sm">
        <div className="mx-auto w-full max-w-6xl px-6 py-6">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Bem-vindo de volta</p>
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                Olá, <span className="text-indigo-700">{displayName}</span>!
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-600 transition-colors hover:bg-gray-100"
                aria-label="Notificações"
              >
                <BellIcon />
              </button>

              <Link
                to="/perfil"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-purple-600 text-sm font-bold text-white ring-2 ring-white shadow-md"
                title="Ir para o perfil"
              >
                {initials}
              </Link>

              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Sair
              </button>
            </div>
          </header>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl flex-1 space-y-10 px-6 py-10">
        <section aria-labelledby="metrics-heading">
          <h2 id="metrics-heading" className="sr-only">
            Resumo do progresso
          </h2>

          {progressLoading ? (
            <MetricsSkeleton />
          ) : progressError ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {progressError}
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              {metricCards.map((card) => (
                <article
                  key={card.key}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <p className="text-sm font-medium text-gray-500">{card.label}</p>
                  <p className={`mt-2 text-3xl font-bold ${card.accent}`}>
                    {progress?.[card.key] ?? 0}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section aria-labelledby="continue-heading">
          <h2 id="continue-heading" className="mb-4 text-xl font-semibold text-gray-900">
            Continue de onde parou
          </h2>

          {enrollmentsLoading ? (
            <EnrollmentsSkeleton />
          ) : enrollmentsError ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {enrollmentsError}
            </p>
          ) : enrollments && enrollments.length > 0 ? (
            <div className="space-y-4">
              {enrollments.map((enrollment) => {
                const percent = clampPercent(enrollment.progress_percent);

                return (
                  <article
                    key={enrollment.enrollment_id}
                    className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">
                      {enrollment.course_name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Última aula: <span className="font-medium">{enrollment.last_lesson_name}</span>
                    </p>

                    <div className="mt-4">
                      <div className="mb-1 flex justify-between text-xs text-gray-500">
                        <span>Progresso</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    <Link
                      to={enrollment.last_lesson_url}
                      className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Continuar
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center shadow-sm">
              <p className="mb-2 text-lg font-medium text-gray-800">
                Você ainda não está matriculado em nenhum curso
              </p>
              <p className="mb-6 text-sm text-gray-600">
                Explore o catálogo e comece sua jornada de aprendizado agora.
              </p>
              <Link
                to="/conteudos"
                className="inline-flex rounded-lg bg-linear-to-r from-purple-700 to-blue-600 px-6 py-3 text-sm font-semibold text-white hover:opacity-95"
              >
                Explorar cursos
              </Link>
            </div>
          )}
        </section>

        {showCertificates ? (
          <section aria-labelledby="certificates-heading">
            <h2 id="certificates-heading" className="mb-4 text-xl font-semibold text-gray-900">
              Seus certificados
            </h2>

            {certificatesLoading ? (
              <CertificatesSkeleton />
            ) : certificatesError ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {certificatesError}
              </p>
            ) : (
              <div className="space-y-3">
                {certificates?.map((certificate) => (
                  <article
                    key={certificate.certificate_id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">{certificate.course_title}</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Emitido em {formatDatePtBr(certificate.issued_at)}
                      </p>
                    </div>
                    <a
                      href={certificate.download_url}
                      download
                      className="inline-flex rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                    >
                      Baixar certificado
                    </a>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : null}
      </div>
    </main>
  );
}
