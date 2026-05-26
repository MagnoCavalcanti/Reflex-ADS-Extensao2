import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

const demoMetricas = [
  { id: 1, titulo: "Alunos ativos", valor: "42" },
  { id: 2, titulo: "Conteúdos publicados", valor: "8" },
  { id: 3, titulo: "Quizzes criados", valor: "5" },
];

const demoAcoes = [
  {
    id: 1,
    titulo: "Gerenciar conteúdos",
    descricao: "Crie e organize materiais para apoiar os alunos.",
    acao: "Abrir conteúdos",
  },
  {
    id: 2,
    titulo: "Criar quizzes",
    descricao: "Monte exercícios para acompanhar a aprendizagem.",
    acao: "Abrir quizzes",
  },
  {
    id: 3,
    titulo: "Acompanhar turmas",
    descricao: "Visualize progresso, engajamento e principais dificuldades.",
    acao: "Ver turmas",
  },
];

export default function DashboardProfessorPage() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const username = user?.username ?? "Professor";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <main className="flex min-h-screen min-w-screen flex-col bg-linear-to-b from-slate-50 to-gray-100 text-gray-900">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <NavLink to="/dashboard" className="text-xl font-bold">
            Reflex <span className="text-amber-500">ADS</span>
          </NavLink>
          <nav>
            <ul className="flex flex-wrap gap-6 text-sm font-medium text-gray-700">
              <li>
                <NavLink to="/conteudos" className="hover:text-gray-900">Conteúdos</NavLink>
              </li>
              <li>
                <NavLink to="/quizzes" className="hover:text-gray-900">Quizzes</NavLink>
              </li>
              <li>
                <NavLink to="/dashboard" className="text-gray-900">Dashboard</NavLink>
              </li>
            </ul>
          </nav>
          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-800">Professor</span>
            <button
              type="button"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={handleLogout}
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <section className="bg-linear-to-r from-emerald-700 via-teal-700 to-blue-700 px-6 py-16 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-3 text-3xl font-bold md:text-4xl">
            Olá, <span>{username}</span>!
          </h1>
          <p className="text-lg text-white/90">Gerencie conteúdos, quizzes e o acompanhamento dos alunos.</p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {demoMetricas.map((metrica) => (
            <article key={metrica.id} className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-md">
              <p className="text-sm font-medium text-gray-500">{metrica.titulo}</p>
              <strong className="mt-3 block text-4xl text-blue-700">{metrica.valor}</strong>
            </article>
          ))}
        </div>

        <h2 className="mb-8 mt-12 text-center text-2xl font-bold">Ferramentas do professor</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {demoAcoes.map((item) => (
            <article key={item.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-md">
              <h3 className="mb-2 text-lg font-semibold">{item.titulo}</h3>
              <p className="mb-4 text-sm text-gray-600">{item.descricao}</p>
              <button type="button" className="w-full rounded-lg bg-blue-700 py-3 text-sm font-semibold text-white hover:bg-blue-800">
                {item.acao}
              </button>
            </article>
          ))}
        </div>
      </div>

      <footer className="border-t bg-gray-900 px-6 py-10 text-gray-300">
        <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 font-semibold text-white">Reflex ADS</h3>
            <p className="text-sm">Democratizando o ensino de tecnologia.</p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-white">Contato</h3>
            <p className="text-sm">contato@reflex.edu.br</p>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-6xl border-t border-gray-700 pt-8 text-center text-sm">
          © 2026 Reflex ADS - MVP Integrado
        </div>
      </footer>
    </main>
  );
}
