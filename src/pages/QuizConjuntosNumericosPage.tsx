import Navbar from "../components/Navbar";

const questions = [
  {
    title: "Qual conjunto numérico representa todos os números inteiros positivos, incluindo o zero?",
    options: ["Números Naturais (N)", "Números Inteiros (Z)", "Números Racionais (Q)", "Números Reais (R)"],
  },
  {
    title: "Qual dos seguintes números NÃO pertence ao conjunto dos números racionais?",
    options: ["0,5", "-3", "√2", "2/3"],
  },
  {
    title: "O conjunto dos números inteiros (Z) é formado por:",
    options: ["Apenas números positivos", "Números positivos, negativos e o zero", "Apenas números decimais", "Apenas frações"],
  },
  {
    title: "Qual é a principal característica dos números irracionais?",
    options: [
      "Podem ser expressos como fração de dois inteiros",
      "Possuem representação decimal finita",
      "Não podem ser expressos como fração e têm decimal infinita e não periódica",
      "São sempre números negativos",
    ],
  },
  {
    title: "Qual das seguintes afirmações sobre o número pi é verdadeira?",
    options: ["É um número racional", "É um número irracional", "É um número inteiro", "É um número natural"],
  },
  {
    title: "O conjunto dos números reais (R) é formado pela união de quais conjuntos?",
    options: ["Naturais e inteiros", "Racionais e irracionais", "Apenas números positivos", "Inteiros e racionais"],
  },
  {
    title: "Qual número abaixo pertence ao conjunto dos números naturais?",
    options: ["-5", "0,75", "8", "√3"],
  },
  {
    title: "A dízima periódica 0,333... pode ser representada como:",
    options: ["Número irracional", "Número racional (1/3)", "Número natural", "Número complexo"],
  },
  {
    title: "Qual das seguintes relações entre conjuntos numéricos está correta?",
    options: ["N ⊂ Z ⊂ Q ⊂ R", "R ⊂ Q ⊂ Z ⊂ N", "Z ⊂ N ⊂ Q ⊂ R", "Q ⊂ N ⊂ Z ⊂ R"],
  },
  {
    title: "Qual dos seguintes números é um exemplo de número irracional?",
    options: ["4/5", "-7", "√5", "0,25"],
  },
];

export default function QuizConjuntosNumericosPage() {
  return (
    <main className="min-h-screen min-w-screen bg-gray-100 text-gray-800">
      <Navbar />
      <section className="bg-linear-to-r from-blue-700 via-indigo-800 to-purple-600 px-6 py-20 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-4xl font-bold">Conjuntos Numéricos</h1>
          <p className="text-lg">
            Os conjuntos numéricos são categorias que ajudam a organizar os números usados no dia a dia e na matemática.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-8">
        <article className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-5 shadow">
          <span className="text-sm text-gray-600">📝 10 questões</span>
          <span className="text-sm text-gray-600">⏱ 30 minutos</span>
          <span className="text-sm text-gray-600">🎯 Nível: Intermediário</span>
        </article>

        <form className="rounded-xl bg-white p-6 shadow">
          {questions.map((question, index) => (
            <article key={question.title} className="mb-8 border-b border-gray-200 pb-6 last:mb-0 last:border-b-0">
              <div className="mb-4 flex gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <h3 className="pt-1 text-lg font-medium">{question.title}</h3>
              </div>
              <div className="space-y-3 md:ml-11">
                {question.options.map((option) => (
                  <label key={option} className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-gray-200 bg-white px-4 py-3 hover:border-indigo-600 hover:bg-indigo-50">
                    <input type="radio" name={`q${index + 1}`} />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </article>
          ))}

          <div className="mt-8 flex flex-col gap-3 border-t-2 border-gray-200 pt-6 sm:flex-row sm:justify-center">
            <button type="button" className="rounded-full bg-gray-200 px-8 py-3 font-semibold text-gray-700">Voltar</button>
            <button type="submit" className="rounded-full bg-indigo-600 px-8 py-3 font-semibold text-white">Enviar Respostas</button>
          </div>
        </form>
      </section>
    </main>
  );
}
