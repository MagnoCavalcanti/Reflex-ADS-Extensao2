import { useEffect, useState } from "react";
import { useParams } from "react-router";
import PublicPageHeader from "../components/PublicPageHeader";
import PublishedCourseList from "../components/PublishedCourseList";
import UserAvatar from "../components/UserAvatar";
import { fetchPublicProfessor } from "../services/professorService";
import type { PublicProfessorProfile } from "../types/professor.types";
import { getApiErrorMessage } from "../utils/apiError";

export default function ProfessorPublicoPage() {
  const { professorId } = useParams<{ professorId: string }>();
  const id = Number(professorId);

  const [professor, setProfessor] = useState<PublicProfessorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!professorId || Number.isNaN(id)) {
      setError("Professor inválido.");
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchPublicProfessor(id);
        if (!cancelled) setProfessor(data);
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            getApiErrorMessage(err, "Não foi possível carregar o perfil."),
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [professorId, id]);

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 to-gray-100 text-gray-900">
      <PublicPageHeader
        title="Perfil do professor"
        subtitle="Conheça quem ministra os cursos"
      />

      <div className="mx-auto max-w-4xl px-6 py-12">
        {isLoading ? (
          <p className="text-center text-gray-500">Carregando perfil...</p>
        ) : error ? (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-600">
            {error}
          </p>
        ) : professor ? (
          <>
            <article className="mb-10 rounded-xl border border-gray-200 bg-white p-8 shadow-md">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                <UserAvatar name={professor.fullname} />
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-semibold">{professor.fullname}</h2>
                  <p className="text-gray-600">@{professor.username}</p>
                  <p className="mt-4 leading-relaxed text-gray-700">
                    {professor.bio}
                  </p>
                </div>
              </div>
            </article>

            <section>
              <h2 className="mb-6 text-xl font-semibold">Cursos publicados</h2>
              <PublishedCourseList courses={professor.courses} />
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
