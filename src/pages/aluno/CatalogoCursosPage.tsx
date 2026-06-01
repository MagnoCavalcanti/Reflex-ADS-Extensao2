import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import Navbar from "../../components/Navbar";
import { fetchCourses } from "../../services/courseService";
import type { Course } from "../../types/course.types";
import { getApiErrorMessage } from "../../utils/apiError";
import { getEnrolledCourseIds } from "../../utils/studentStorage";

const AREA_OPTIONS = [
  { value: "", label: "Todas as categorias" },
  { value: "Lógica de Programação", label: "Lógica de Programação" },
  { value: "Matemática", label: "Matemática" },
  { value: "Ciências da Computação", label: "Ciências da Computação" },
] as const;

export default function CatalogoCursosPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [area, setArea] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const enrolledIds = useMemo(() => new Set(getEnrolledCourseIds()), []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params: { search?: string; area?: string } = {};
        if (search.trim()) params.search = search.trim();
        if (area) params.area = area;

        const data = await fetchCourses(Object.keys(params).length > 0 ? params : undefined);
        if (!cancelled) setCourses(data);
      } catch (err: unknown) {
        if (!cancelled) {
          setError(getApiErrorMessage(err, "Não foi possível carregar o catálogo."));
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
  }, [search, area]);

  return (
    <main className="flex min-h-screen flex-col bg-gray-50 text-gray-800">
      <Navbar />

      <section className="bg-linear-to-r from-blue-700 via-indigo-800 to-purple-600 px-6 py-14 text-center text-white">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-3 text-3xl font-bold md:text-4xl">Catálogo de cursos</h1>
          <p className="text-lg text-white/90">
            Busque, filtre por categoria e matricule-se nos cursos disponíveis.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="search" className="mb-2 block text-sm font-medium text-gray-600">
              Buscar cursos
            </label>
            <input
              id="search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Título ou palavra-chave..."
              className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="area" className="mb-2 block text-sm font-medium text-gray-600">
              Categoria
            </label>
            <select
              id="area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
            >
              {AREA_OPTIONS.map((opt) => (
                <option key={opt.value || "all"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500">Carregando catálogo...</p>
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
                className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-2 flex flex-wrap gap-2">
                  {course.area ? (
                    <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                      {course.area}
                    </span>
                  ) : null}
                  {enrolledIds.has(course.course_id) ? (
                    <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                      Matriculado
                    </span>
                  ) : null}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                <p className="mt-2 flex-1 text-sm text-gray-600 line-clamp-3">
                  {course.description}
                </p>
                <Link
                  to={`/curso/${course.course_id}`}
                  className="mt-4 inline-flex justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Ver detalhes
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
