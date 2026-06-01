import Navbar from "../../components/Navbar";
import ConfiguracoesConta from "../../components/ConfiguracoesConta";

export default function ConfiguracoesAlunoPage() {
  return (
    <main className="flex min-h-screen flex-col bg-linear-to-b from-slate-50 to-gray-100 text-gray-900">
      <Navbar />

      <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="mt-2 text-gray-600">Sua conta e preferências na plataforma.</p>

        <article className="mt-8 space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <ConfiguracoesConta
            roleLabel="Aluno"
            subtitle="Gerencie os dados da sua conta de estudante. As informações exibidas vêm da sessão autenticada."
          />
        </article>
      </div>
    </main>
  );
}
