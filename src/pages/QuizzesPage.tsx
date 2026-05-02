import ideasImg from "../assets/ideas.png";
import Navbar from "../components/Navbar";

const cards = [
  {
    icon: "💻",
    title: "Lógica de Programação",
    text: "Algoritmos, estruturas de controle, funções e introdução à resolução de problemas através da programação.",
    items: ["Fundamentos Algoritmos", "Estruturas de Dados", "Resolução de Problemas"],
  },
  {
    icon: "📊",
    title: "Matemática",
    text: "Conceitos matemáticos aplicados à computação, com visualizações gráficas e exercícios interativos.",
    items: ["Álgebra Linear", "Matemática Discreta", "Estatística"],
  },
  {
    icon: "🖥️",
    title: "Ciências da Computação",
    text: "Fundamentos teóricos e práticos da computação, estruturas de dados e análise de algoritmos.",
    items: ["Estruturas de Dados", "Redes de Computadores", "Banco de Dados"],
  },
];

export default function QuizzesPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />
      <section className="bg-linear-to-r from-blue-700 via-indigo-800 to-purple-600 px-6 py-24 text-center text-white">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-5xl font-bold">
            Explorar <span className="text-amber-300">Conteúdos</span>
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-lg leading-8">
            Na página de Quizzes, os alunos terão acesso a desafios interativos de Lógica de Programação, Matemática e Ciências da Computação.
          </p>
          <button className="rounded-full bg-white px-8 py-3 font-semibold text-blue-700">Voltar ao Início</button>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-2 text-center text-3xl font-bold">Áreas de Conhecimento</h2>
          <p className="mb-10 text-center text-gray-500">
            Conteúdos desenvolvidos por estudantes, para estudantes, com foco na aprendizagem prática e interativa.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {cards.map((card) => (
              <article key={card.title} className="rounded-xl bg-white p-6 shadow">
                <div className="mb-4 text-4xl">{card.icon}</div>
                <h3 className="mb-3 text-xl font-bold">{card.title}</h3>
                <p className="mb-4 text-sm text-gray-500">{card.text}</p>
                <ul className="mb-6 space-y-1 text-sm text-gray-500">
                  {card.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
                <button className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white">Explorar Conteúdos</button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-center text-3xl font-bold">Buscar Conteúdos</h2>
          <input
            type="text"
            placeholder="Digite para buscar..."
            className="w-full rounded-full border-2 border-gray-200 px-6 py-4 outline-none focus:border-violet-500"
          />
        </div>
      </section>

      <section className="bg-white px-6 py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-3xl font-bold">Quizzes Mais Vistos</h2>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <article key={i} className="flex items-center gap-4 rounded-lg border-2 border-gray-200 bg-white px-6 py-4">
                <img src={ideasImg} alt="Ícone quiz" className="h-12 w-12" />
                <span className="font-medium">Quizz</span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
