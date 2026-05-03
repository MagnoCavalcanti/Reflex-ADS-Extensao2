import { NavLink, useNavigate } from "react-router";

const demoCursos = [
  { id: 1, titulo: "Lógica de Programação", descricao: "Algoritmos e estruturas básicas." },
  { id: 2, titulo: "Matemática aplicada", descricao: "Fundamentos para computação." },
  { id: 3, titulo: "Ciências da computação", descricao: "Teoria e prática complementares." },
];

export default function DashboardPage() {
  const navigate = useNavigate();

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
            <span className="font-semibold text-gray-800">Aluno</span>
            <button
              type="button"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => {
                navigate("/login");
              }}
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <section className="bg-linear-to-r from-blue-700 via-indigo-800 to-purple-600 px-6 py-16 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-3 text-3xl font-bold md:text-4xl">
            Bem-vindo de volta, <span>Aluno</span>!
          </h1>
          <p className="text-lg text-white/90">Continue seu progresso na plataforma.</p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        <article className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-8 shadow-md">
          <h2 className="mb-6 text-2xl font-semibold">Seu Progresso</h2>
          <div className="mb-8 h-3 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-[35%] rounded-full bg-blue-600" />
          </div>
          <p><strong>1 de 4 módulos concluídos</strong></p>
        </article>

        <h2 className="mb-8 mt-12 text-center text-2xl font-bold">Cursos disponíveis</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {demoCursos.map((c) => (
            <article key={c.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-md">
              <h3 className="mb-2 text-lg font-semibold">{c.titulo}</h3>
              <p className="mb-4 text-sm text-gray-600">{c.descricao}</p>
              <button type="button" className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                Matricular
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
