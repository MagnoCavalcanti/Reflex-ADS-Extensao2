import Navbar from "../components/Navbar";

export default function SobrePage() {
  return (
    <main className="min-h-screen min-w-screen bg-gray-50 text-gray-800">
      <Navbar />

      <section className="bg-linear-to-r from-blue-700 via-indigo-800 to-purple-600 px-6 py-20 text-center text-white">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-4xl font-bold md:text-5xl">
            Sobre a <span className="text-amber-300">Reflex ADS</span>
          </h1>
          <p className="text-lg leading-relaxed text-white/95">
            Somos uma plataforma colaborativa criada por estudantes de ADS para democratizar o ensino de lógica de
            programação, matemática e ciências da computação em escolas públicas. Nosso objetivo é oferecer materiais
            práticos, interativos e acessíveis, desenvolvidos por alunos para alunos.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-4 text-center text-3xl font-bold">Nossa missão</h2>
        <p className="mx-auto mb-12 max-w-3xl text-center text-gray-600">
          Promover o aprendizado prático por meio de conteúdos criativos, exercícios interativos e avaliações que
          aproximem teoria e prática.
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          <article className="rounded-xl bg-white p-6 shadow-md">
            <h3 className="mb-3 text-xl font-semibold">Conteúdos criados por estudantes</h3>
            <p className="text-sm text-gray-600">
              Estimular a autoria estudantil e a colaboração entre escolas e comunidades.
            </p>
          </article>
          <article className="rounded-xl bg-white p-6 shadow-md">
            <h3 className="mb-3 text-xl font-semibold">Aprendizado ativo</h3>
            <p className="text-sm text-gray-600">
              Focar em atividades que resolvam problemas reais e desenvolvam habilidades.
            </p>
          </article>
          <article className="rounded-xl bg-white p-6 shadow-md">
            <h3 className="mb-3 text-xl font-semibold">Parcerias</h3>
            <p className="text-sm text-gray-600">
              Trabalhar com secretarias de educação e universidades para ampliar o alcance.
            </p>
          </article>
        </div>
      </section>

      <footer className="bg-gray-900 px-6 py-10 text-gray-400">
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
