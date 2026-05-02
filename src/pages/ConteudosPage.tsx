import Navbar from "../components/Navbar";

export default function ConteudosPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />

      <section className="bg-linear-to-r from-blue-700 via-indigo-800 to-purple-600 px-6 py-24 text-center text-white">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-5xl font-bold">
            Explorar <span className="text-amber-300">Conteúdos</span>
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-lg leading-8">
            Descubra materiais educacionais criados pelos alunos de ADS para apoiar seu aprendizado em
            <strong> lógica de programação, matemática e ciências da computação</strong>.
          </p>
          <button className="rounded-full bg-white px-8 py-3 font-semibold text-blue-700">Voltar ao Início</button>
        </div>
      </section>

      <section className="bg-white px-6 py-12">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          <article className="rounded-2xl bg-blue-500 p-6 text-center text-white">
            <h3 className="mb-2 text-xl font-semibold">Lógica de Programação</h3>
          </article>
          <article className="rounded-2xl bg-green-500 p-6 text-center text-white">
            <h3 className="mb-2 text-xl font-semibold">Matemática</h3>
          </article>
          <article className="rounded-2xl bg-purple-500 p-6 text-center text-white">
            <h3 className="mb-2 text-xl font-semibold">Ciências da Computação</h3>
          </article>
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
          <h2 className="mb-8 text-center text-3xl font-bold">Videoaulas Mais Vistas</h2>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <article key={i} className="flex items-center gap-4 rounded-lg border-2 border-gray-200 bg-white px-6 py-4">
                <span className="text-blue-500">▶</span>
                <span className="font-medium">Videoaula</span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
