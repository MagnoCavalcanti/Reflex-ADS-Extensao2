import Navbar from "../components/Navbar";

export default function PerfilPage() {
  return (
    <main className="flex min-h-screen min-w-screen flex-col bg-linear-to-b from-slate-50 to-gray-100 text-gray-900">
      <Navbar showProfile={false} />
      <div className="mx-auto w-full max-w-4xl px-6 py-12">
        <article className="rounded-xl border border-gray-200 bg-white p-8 shadow-md">
          <h2 className="mb-6 text-2xl font-semibold">Meu perfil</h2>
          <p className="mb-2"><strong>Usuário:</strong> Aluno</p>
          <p className="mb-8"><strong>Tipo:</strong> Aluno / Professor</p>

          <h3 className="mb-4 text-xl font-semibold">Progresso geral</h3>
          <div className="mb-4 h-3 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-[45%] rounded-full bg-blue-600" />
          </div>
          <p className="text-gray-700">45% completo • 2 módulos + 5 aulas concluídas</p>
        </article>
      </div>
    </main>
  );
}
