import cienciasComputImg from "../assets/cienciasComput.png";
import calculadoraImg from "../assets/fiveicon_calculadora.png";

export default function LoginPage() {
  return (
    <main className="min-h-screen min-w-screen bg-linear-to-b from-blue-700 to-purple-700 text-white">
      <h1 className="py-5 text-center text-5xl font-bold">
        Reflex <span className="text-yellow-300">ADS</span>
      </h1>

      <section className="mx-auto my-5 w-full max-w-xl rounded-2xl bg-white p-8 text-gray-900 shadow-xl">
        <h2 className="mb-8 text-center text-3xl font-semibold">Login</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-600">Email</label>
            <input id="email" type="email" className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3" />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-600">Senha</label>
            <input id="password" type="password" className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3" />
          </div>
        </div>
        <button className="mt-8 w-full rounded-lg bg-linear-to-r from-purple-700 to-blue-500 px-4 py-3 font-semibold text-white">Login</button>
      </section>

      <section className="mx-auto my-8 max-w-4xl px-4 text-center">
        <h2 className="text-2xl font-normal leading-relaxed">
          Um espaço para explorar tecnologia, matemática e ciência da computação de forma prática e interativa.
          Aqui você encontra materiais, exercícios e simuladores pensados para apoiar sua jornada.
        </h2>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-8 md:grid-cols-3">
        <article className="rounded-2xl bg-white p-8 text-center text-black">
          <h3 className="mb-2 text-3xl font-bold">&lt;/&gt;</h3>
          <h4 className="mb-4 text-xl font-semibold">Lógica de programação</h4>
          <p className="mb-4">Algoritmos, estruturas de controle, funções e resolução de problemas através da programação visual e interativa.</p>
          <ul className="list-disc space-y-1 pl-5 text-left">
            <li>Fluxogramas Interativos</li>
            <li>Pseudocódigo Visual</li>
            <li>Exercícios Práticos</li>
          </ul>
        </article>

        <article className="rounded-2xl bg-white p-8 text-center text-black">
          <img src={calculadoraImg} alt="Ícone de calculadora" className="mx-auto mb-4 h-14 w-14" />
          <h4 className="mb-4 text-xl font-semibold">Matemática</h4>
          <p className="mb-4">Conceitos matemáticos aplicados à computação, com visualizações gráficas e simuladores interativos.</p>
          <ul className="list-disc space-y-1 pl-5 text-left">
            <li>Álgebra Linear</li>
            <li>Estatística</li>
            <li>Matemática Discreta</li>
          </ul>
        </article>

        <article className="rounded-2xl bg-white p-8 text-center text-black">
          <img src={cienciasComputImg} alt="Ciência da computação" className="mx-auto mb-4 h-14 w-14" />
          <h4 className="mb-4 text-xl font-semibold">Ciências da Computação</h4>
          <p className="mb-4">Fundamentos teóricos e práticos da computação, estruturas de dados e análise de algoritmos.</p>
          <ul className="list-disc space-y-1 pl-5 text-left">
            <li>Estrutura de Dados</li>
            <li>Complexidade</li>
            <li>Teoria da Computação</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
