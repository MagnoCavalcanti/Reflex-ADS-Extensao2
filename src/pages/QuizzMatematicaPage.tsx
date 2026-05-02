import Navbar from "../components/Navbar";

const quizzes = [
  { title: "Conjuntos Numéricos", desc: "Aceite o desafio numérico!", time: "30 min", locked: false },
  { title: "Álgebra Básica", desc: "Resolva equações!", time: "25 min", locked: true },
  { title: "Geometria", desc: "Formas e ângulos!", time: "35 min", locked: true },
  { title: "Trigonometria", desc: "Seno, cosseno e tangente!", time: "40 min", locked: true },
  { title: "Estatística", desc: "Análise de dados!", time: "30 min", locked: true },
  { title: "Probabilidade", desc: "Chances e eventos!", time: "28 min", locked: true },
];

export default function QuizzMatematicaPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />
      <section className="bg-linear-to-r from-blue-700 via-indigo-800 to-purple-600 px-6 py-24 text-center text-white">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-5xl font-bold">
            Quizzes <span className="text-amber-300">Matemática</span>
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-lg leading-8">
            Desafie-se na matemática! Teste seus conhecimentos com quizzes interativos, do básico ao avançado, e evolua a cada fase.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button className="rounded-full bg-indigo-600 px-8 py-3 font-semibold text-white">Começar Agora</button>
            <button className="rounded-full bg-white px-8 py-3 font-semibold text-blue-700">Voltar ao Início</button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <article className="mb-8 flex items-center justify-between rounded-xl bg-white p-6 shadow">
          <div>
            <h3 className="text-lg font-semibold">Seu Progresso</h3>
            <p className="mb-3 text-sm text-gray-500">4 de 7 quizzes concluídos</p>
            <div className="h-2 w-52 rounded bg-gray-200">
              <div className="h-2 w-4/6 rounded bg-indigo-600" />
            </div>
          </div>
          <span className="text-4xl">🏆</span>
        </article>

        <section className="mb-8 text-center">
          <h2 className="mb-4 text-2xl font-bold">Buscar Quiz</h2>
          <input
            type="text"
            placeholder="Assunto (Ex: Números Decimais)"
            className="mx-auto w-full max-w-xl rounded-full border border-gray-300 px-6 py-3 outline-none focus:border-indigo-600"
          />
        </section>

        <section>
          <h2 className="mb-6 text-center text-3xl font-bold">Quizzes</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <article key={quiz.title} className={`relative rounded-xl bg-white p-6 shadow ${quiz.locked ? "opacity-70" : ""}`}>
                {quiz.locked ? <span className="absolute right-4 top-4 text-2xl">🔒</span> : null}
                <h3 className="mb-2 text-xl font-semibold">{quiz.title}</h3>
                <p className="mb-6 text-sm text-gray-500">{quiz.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">⏱ {quiz.time}</span>
                  <button className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white">Iniciar</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
