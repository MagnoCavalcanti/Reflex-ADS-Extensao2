import { useEffect, useState } from "react";
import { Link } from "react-router";
import Navbar from "../components/Navbar";
import { fetchCourses } from "../services/courseService";
import type { Course } from "../types/course.types";
import { getApiErrorMessage } from "../utils/apiError";

export default function ConteudosPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchCourses(search ? { search } : undefined);
        if (!cancelled) setCourses(data);
      } catch (err: unknown) {
        if (!cancelled) {
          setError(getApiErrorMessage(err, "Não foi possível carregar os conteúdos."));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    const timeout = window.setTimeout(() => {
      void load();
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [search]);

  return (
    <main className="flex min-h-screen min-w-screen flex-col bg-gray-50 text-gray-800">
      <Navbar />

      <section className="bg-linear-to-r from-blue-700 via-indigo-800 to-purple-600 px-6 py-16 text-center text-white">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Explorar <span className="text-amber-300">Conteúdos</span>
          </h1>
          <p className="text-lg leading-relaxed text-white/95">
            Catálogo de cursos disponíveis na plataforma.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-12">
        <label htmlFor="search" className="mb-2 block text-sm font-medium text-gray-600">
          Buscar cursos
        </label>
        <input
          id="search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Digite para buscar..."
          className="mb-8 w-full rounded-full border-2 border-gray-200 px-6 py-3 outline-none focus:border-violet-500"
        />

        {isLoading ? (
          <p className="text-center text-gray-500">Carregando...</p>
        ) : error ? (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-600">
            {error}
          </p>
        ) : courses.length === 0 ? (
          <p className="text-center text-gray-500">Nenhum curso encontrado.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <article
                key={course.course_id}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-md"
              >
                <h3 className="mb-2 text-lg font-semibold">{course.title}</h3>
                <p className="mb-4 text-sm text-gray-600 line-clamp-3">{course.description}</p>
                <Link
                  to={`/cursos/${course.course_id}`}
                  className="text-sm font-semibold text-indigo-600 hover:underline"
                >
                  Ver detalhes →
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
