import Navbar from "../../components/Navbar";
import ConfiguracoesConta from "../../components/ConfiguracoesConta";

export default function ConfiguracoesProfessorPage() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-50 text-gray-900">
      <Navbar />

      <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="mt-2 text-gray-600">Sua conta e preferências de professor.</p>

        <article className="mt-8 space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <ConfiguracoesConta
            roleLabel="Professor"
            subtitle="Gerencie os dados da sua conta de ensino. As informações exibidas vêm da sessão autenticada."
          />
        </article>
      </div>
    </main>
  );
}
