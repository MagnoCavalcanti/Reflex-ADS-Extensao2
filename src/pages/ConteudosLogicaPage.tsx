import Navbar from "../components/Navbar";

const modulos = [
  {
    titulo: "Introdução a Algoritmos",
    href: "https://www.youtube.com/watch?v=8mei6uVttho&list=PLHz_AreHm4dmSj0MHol_aoNYCSGFqvfXV",
    thumb: "https://img.youtube.com/vi/8mei6uVttho/mqdefault.jpg",
  },
  {
    titulo: "Estrutura de Dados",
    href: "https://www.youtube.com/watch?v=-twvgnfOnVQ&list=PLrOyM49ctTx_AMgNGQaic10qQJpTpXfn_",
    thumb: "https://img.youtube.com/vi/-twvgnfOnVQ/mqdefault.jpg",
  },
  ...Array.from({ length: 5 }).map(() => ({
    titulo: "Estrutura de Dados",
    href: "https://www.youtube.com/watch?v=-twvgnfOnVQ&list=PLrOyM49ctTx_AMgNGQaic10qQJpTpXfn_",
    thumb: "https://img.youtube.com/vi/-twvgnfOnVQ/mqdefault.jpg",
  })),
];

export default function ConteudosLogicaPage() {
  return (
    <main className="min-h-screen min-w-screen bg-gray-50 text-gray-800">
      <Navbar />

      <section className="bg-linear-to-r from-blue-700 via-indigo-800 to-purple-600 px-6 py-20 text-center text-white">
        <div className="mx-auto mb-6 inline-flex rounded-lg bg-white/20 p-6 text-5xl">💻</div>
        <h1 className="mb-6 text-4xl font-bold">Lógica de programação</h1>
        <p className="mx-auto max-w-2xl text-lg text-white/95">
          Lógica de programação é o raciocínio por trás da criação de instruções para um computador. É a organização
          sequencial de passos para resolver um problema de forma clara e eficiente.
        </p>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <article className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-6 shadow-md">
          <div>
            <h3 className="text-lg font-semibold">Seu progresso</h3>
            <p className="mt-2 text-sm text-gray-600">1 de 3 módulos concluídos</p>
            <div className="mt-4 h-2 max-w-[200px] rounded-full bg-gray-200">
              <div className="h-full w-[33%] rounded-full bg-indigo-600" />
            </div>
          </div>
          <span className="text-4xl">🏆</span>
        </article>

        <section className="mb-12 text-center">
          <h2 className="mb-4 text-2xl font-bold">Buscar módulo</h2>
          <input
            type="search"
            placeholder="Assunto (ex.: Números decimais)"
            className="mx-auto block w-full max-w-xl rounded-full border border-gray-300 px-6 py-3 outline-none focus:border-indigo-600"
          />
        </section>

        <section>
          <h2 className="mb-8 text-center text-3xl font-bold">Conteúdos</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {modulos.map((modulo, i) => (
              <a
                key={`${modulo.href}-${i}`}
                href={modulo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition hover:shadow-lg"
              >
                <img src={modulo.thumb} alt="" className="aspect-video w-full object-cover" />
                <div className="p-4">
                  <h3 className="text-center font-semibold text-gray-900">{modulo.titulo}</h3>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>

      <footer className="mt-14 bg-gray-900 px-6 py-10 text-gray-400">
        <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-3">
          <div>
            <h3 className="mb-3 font-semibold text-white">Reflex ADS</h3>
            <p className="text-sm">Democratizando o ensino de tecnologia para escolas públicas.</p>
          </div>
          <div>
            <h3 className="mb-3 font-semibold text-white">Contato</h3>
            <p className="mb-2 text-sm">contato@reflex.edu.br</p>
            <p className="text-sm">(88) 9999-9999</p>
          </div>
          <div>
            <h3 className="mb-3 font-semibold text-white">Parceiros</h3>
            <p className="mb-2 text-sm">Secretaria da Educação</p>
            <p className="text-sm">Universidades parceiras</p>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-6xl border-t border-gray-700 pt-8 text-center text-sm">
          © 2025 Reflex ADS - Todos os direitos reservados.
        </div>
      </footer>
    </main>
  );
}
