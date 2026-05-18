import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

// dados mockados para simular cursos criados pelo professor e progresso dos alunos
type Course = {
  id: number;
  title: string;
  description: string;
  area: string;
  level: string;
  enrolled_count: number;
  avg_progress: number;
  modules: {
    id: number;
    title: string;
    lessons: {
      id: number;
      title: string;
    }[];
  }[];
};

const mockCourses: Course[] = [
  {
    id: 1,
    title: "React para Iniciantes",
    description: "Aprenda React do zero com componentes e hooks.",
    area: "programacao",
    level: "iniciante",
    enrolled_count: 32,
    avg_progress: 70,
    modules: [
      {
        id: 1,
        title: "Introdução",
        lessons: [
          {
            id: 1,
            title: "O que é React",
          },
          {
            id: 2,
            title: "Criando componentes",
          },
        ],
      },
    ],
  },

  {
    id: 2,
    title: "Estrutura de Dados",
    description: "Pilhas, filas e árvores aplicadas à computação.",
    area: "logica",
    level: "intermediario",
    enrolled_count: 18,
    avg_progress: 48,
    modules: [
      {
        id: 1,
        title: "Pilhas",
        lessons: [
          {
            id: 1,
            title: "Introdução às Pilhas",
          },
        ],
      },
    ],
  },
];

const AREA_LABELS: Record<string, string> = {
  programacao: "Programação",
  matematica: "Matemática",
  logica: "Lógica",
  "banco-de-dados": "Banco de Dados",
  redes: "Redes",
  ia: "IA",
};

const LEVEL_LABELS: Record<string, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

const LEVEL_COLOR: Record<string, string> = {
  iniciante: "bg-emerald-100 text-emerald-700",
  intermediario: "bg-amber-100 text-amber-700",
  avancado: "bg-red-100 text-red-700",
};

export default function ProfessorDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    setCourses(mockCourses);
  }, []);

  const totalAlunos = courses.reduce((s, c) => s + c.enrolled_count, 0);

  const avgGlobal =
    courses.length > 0
      ? Math.round(
          courses.reduce((s, c) => s + c.avg_progress, 0) / courses.length
        )
      : 0;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <NavLink to="/dashboard" className="text-xl font-bold">
            Reflex <span className="text-amber-500">ADS</span>
          </NavLink>

          <nav className="hidden gap-6 text-sm font-medium text-gray-600 sm:flex">
            <NavLink to="/dashboard" className="hover:text-gray-900">
              Painel do Aluno
            </NavLink>

            <NavLink
              to="/professor/dashboard"
              className="font-semibold text-blue-600"
            >
              Meus Cursos
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">
              {user?.username ?? "Professor"}
            </span>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-700 px-6 py-14 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">
            Olá,{" "}
            <span className="text-amber-300">
              {user?.username ?? "Professor"}
            </span>{" "}
            👋
          </h1>

          <p className="mb-8 text-white/80">
            Gerencie seus cursos e acompanhe o progresso dos alunos.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:w-2/3">
            <StatCard label="Cursos criados" value={courses.length} />

            <StatCard
              label="Alunos matriculados"
              value={totalAlunos}
            />

            <StatCard
              label="Progresso médio"
              value={`${avgGlobal}%`}
            />
          </div>
        </div>
      </section>

      {/* Courses */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            Meus cursos
          </h2>

          <button
            type="button"
            onClick={() => navigate("/professor/cursos/novo")}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition-all hover:bg-blue-700 active:scale-95"
          >
            <span className="text-lg leading-none">+</span>
            Novo curso
          </button>
        </div>

        {courses.length === 0 ? (
          <EmptyState
            onNew={() => navigate("/professor/cursos/novo")}
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEdit={() =>
                  navigate(`/professor/cursos/${course.id}/editar`)
                }
                onManage={() =>
                  navigate(`/professor/cursos/${course.id}/modulos`)
                }
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

/* ── Sub-components ── */

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl bg-white/15 px-5 py-4 backdrop-blur-sm">
      <p className="text-2xl font-bold">{value}</p>

      <p className="mt-0.5 text-sm text-white/70">{label}</p>
    </div>
  );
}

function CourseCard({
  course,
  onEdit,
  onManage,
}: {
  course: Course;
  onEdit: () => void;
  onManage: () => void;
}) {
  return (
    <article className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      {/* Tags */}
      <div className="mb-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
          {AREA_LABELS[course.area] ?? course.area}
        </span>

        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            LEVEL_COLOR[course.level]
          }`}
        >
          {LEVEL_LABELS[course.level] ?? course.level}
        </span>
      </div>

      <h3 className="mb-1.5 text-base font-semibold leading-snug text-gray-900">
        {course.title}
      </h3>

      <p className="mb-5 line-clamp-2 flex-1 text-sm text-gray-500">
        {course.description}
      </p>

      {/* Alunos + progresso */}
      <div className="mb-4 space-y-2 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <span>👥 {course.enrolled_count} alunos</span>

          <span className="font-medium text-gray-800">
            {course.avg_progress}%
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-blue-500 transition-all"
            style={{ width: `${course.avg_progress}%` }}
          />
        </div>

        <p className="text-xs text-gray-400">
          {course.modules.length} módulo
          {course.modules.length !== 1 ? "s" : ""} •{" "}
          {course.modules.reduce(
            (s, m) => s + m.lessons.length,
            0
          )}{" "}
          aulas
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onManage}
          className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Gerenciar
        </button>

        <button
          type="button"
          onClick={onEdit}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Editar
        </button>
      </div>
    </article>
  );
}

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white py-20 text-center">
      <div className="mb-4 text-5xl">📚</div>

      <h3 className="mb-2 text-lg font-semibold text-gray-700">
        Nenhum curso criado ainda
      </h3>

      <p className="mb-6 text-sm text-gray-500">
        Crie seu primeiro curso e comece a compartilhar conhecimento.
      </p>

      <button
        type="button"
        onClick={onNew}
        className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
      >
        + Criar primeiro curso
      </button>
    </div>
  );
}