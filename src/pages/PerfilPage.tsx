import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import CourseProgressCard from "../components/CourseProgressCard";
import Navbar from "../components/Navbar";
import UserAvatar from "../components/UserAvatar";
import { useAuth } from "../contexts/AuthContext";
import { fetchMyProgress as fetchCourseProgress } from "../services/meService";
import type { CourseProgress, Enrollment } from "../types/enrollment.types";
import { getApiErrorMessage } from "../utils/apiError";

const fieldClass =
  "w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3";

type ProgressState = {
  data: CourseProgress | null;
  isLoading: boolean;
  error: string | null;
};

export default function PerfilPage() {
  const {
    isAuthenticated,
    isLoading: authLoading,
    profile,
    updateProfile,
    changePassword,
  } = useAuth();

  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(true);
  const [enrollmentsError, setEnrollmentsError] = useState<string | null>(null);
  const [progressByCourse, setProgressByCourse] = useState<
    Record<number, ProgressState>
  >({});

  useEffect(() => {
    if (!profile) return;
    setFullname(profile.fullname);
    setUsername(profile.username);
    setEmail(profile.email);
    setTelephone(profile.telephone);
  }, [profile]);

  useEffect(() => {
    if (!isAuthenticated || authLoading) return;

    let cancelled = false;

    const loadEnrollments = async () => {
      setEnrollmentsLoading(true);
      setEnrollmentsError(null);

      try {
        const data = await fetchEnrollments();
        if (cancelled) return;

        setEnrollments(data);

        const initial: Record<number, ProgressState> = {};
        for (const e of data) {
          initial[e.course_id] = { data: null, isLoading: true, error: null };
        }
        setProgressByCourse(initial);

        await Promise.all(
          data.map(async (enrollment) => {
            try {
              const progress = await fetchCourseProgress(enrollment.course_id);
              if (cancelled) return;
              setProgressByCourse((prev) => ({
                ...prev,
                [enrollment.course_id]: {
                  data: progress,
                  isLoading: false,
                  error: null,
                },
              }));
            } catch (err: unknown) {
              if (cancelled) return;
              setProgressByCourse((prev) => ({
                ...prev,
                [enrollment.course_id]: {
                  data: null,
                  isLoading: false,
                  error: getApiErrorMessage(
                    err,
                    "Não foi possível carregar o progresso.",
                  ),
                },
              }));
            }
          }),
        );
      } catch (err: unknown) {
        if (!cancelled) {
          setEnrollmentsError(
            getApiErrorMessage(err, "Não foi possível carregar as matrículas."),
          );
        }
      } finally {
        if (!cancelled) setEnrollmentsLoading(false);
      }
    };

    void loadEnrollments();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, authLoading]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);
    setProfileSaving(true);

    try {
      const updated = await updateProfile({
        fullname,
        username,
        email,
        telephone,
      });
      setFullname(updated.fullname);
      setUsername(updated.username);
      setEmail(updated.email);
      setTelephone(updated.telephone);
      setProfileSuccess("Perfil atualizado com sucesso.");
    } catch (err: unknown) {
      setProfileError(
        getApiErrorMessage(err, "Não foi possível atualizar o perfil."),
      );
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("As senhas não coincidem.");
      return;
    }

    setPasswordSaving(true);

    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSuccess("Senha alterada com sucesso.");
    } catch (err: unknown) {
      setPasswordError(
        getApiErrorMessage(err, "Não foi possível alterar a senha."),
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Carregando...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

// Opção 1: Usando interrogação antes do ponto (mais limpo)
const displayName = fullname?.trim() || profile?.fullname || "Usuário";

  return (
    <main className="flex min-h-screen min-w-screen flex-col bg-linear-to-b from-slate-50 to-gray-100 text-gray-900">
      <Navbar showProfile={false} />

      <div className="mx-auto w-full max-w-4xl space-y-8 px-6 py-12">
        <article className="rounded-xl border border-gray-200 bg-white p-8 shadow-md">
          <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <UserAvatar name={displayName} />
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-semibold">{displayName}</h2>
              <p className="text-gray-600">@{username || profile?.username}</p>
              {profile?.type_user ? (
                <p className="mt-1 text-sm text-gray-500">
                  {profile.type_user === "A" ? "Aluno" : "Professor"}
                </p>
              ) : null}
            </div>
          </div>

          <h3 className="mb-4 text-lg font-semibold">Dados da conta</h3>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullname" className="mb-2 block text-sm font-medium text-gray-600">
                Nome completo
              </label>
              <input
                id="fullname"
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className={fieldClass}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="username" className="mb-2 block text-sm font-medium text-gray-600">
                  Nome de usuário
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={fieldClass}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={fieldClass}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="telephone" className="mb-2 block text-sm font-medium text-gray-600">
                Telefone
              </label>
              <input
                id="telephone"
                type="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className={fieldClass}
                required
              />
            </div>

            {profileError ? (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {profileError}
              </p>
            ) : null}
            {profileSuccess ? (
              <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                {profileSuccess}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={profileSaving || !profile}
              className="rounded-lg bg-linear-to-r from-purple-700 to-blue-600 px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {profileSaving ? "Salvando..." : "Salvar alterações"}
            </button>
          </form>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-8 shadow-md">
          <h3 className="mb-4 text-lg font-semibold">Alterar senha</h3>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="mb-2 block text-sm font-medium text-gray-600">
                Senha atual
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={fieldClass}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="newPassword" className="mb-2 block text-sm font-medium text-gray-600">
                  Nova senha
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={fieldClass}
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-600">
                  Confirmar nova senha
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={fieldClass}
                  required
                />
              </div>
            </div>

            {passwordError ? (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {passwordError}
              </p>
            ) : null}
            {passwordSuccess ? (
              <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                {passwordSuccess}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={passwordSaving}
              className="rounded-lg border-2 border-gray-200 bg-gray-50 px-6 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 disabled:opacity-60"
            >
              {passwordSaving ? "Alterando..." : "Alterar senha"}
            </button>
          </form>
        </article>

        <section>
          <h2 className="mb-2 text-2xl font-semibold">Progresso e histórico</h2>
          <p className="mb-6 text-gray-600">
            Acompanhe seu avanço em cada curso matriculado.
          </p>

          {enrollmentsLoading ? (
            <p className="text-gray-500">Carregando cursos...</p>
          ) : enrollmentsError ? (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {enrollmentsError}
            </p>
          ) : enrollments.length === 0 ? (
            <p className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center text-gray-500">
              Você ainda não está matriculado em nenhum curso.
            </p>
          ) : (
            <div className="space-y-6">
              {enrollments.map((enrollment) => {
                const state = progressByCourse[enrollment.course_id] ?? {
                  data: null,
                  isLoading: true,
                  error: null,
                };

                return (
                  <CourseProgressCard
                    key={enrollment.course_id}
                    enrollment={enrollment}
                    progress={state.data}
                    isLoading={state.isLoading}
                    error={state.error}
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
