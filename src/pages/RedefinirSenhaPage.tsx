export default function RedefinirSenhaPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-blue-700 to-purple-700 text-white">
      <h1 className="py-5 text-center text-5xl font-bold">
        Reflex <span className="text-yellow-300">ADS</span>
      </h1>

      <section className="mx-auto my-5 w-full max-w-xl rounded-2xl bg-white p-8 text-gray-900 shadow-xl">
        <h2 className="mb-8 text-center text-3xl font-semibold">Redefinir senha</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-600">Senha</label>
            <input id="password" type="password" className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-600">Confirme sua senha</label>
            <input id="confirmPassword" type="password" className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3" />
          </div>
        </div>
        <button className="mt-8 w-full rounded-lg bg-linear-to-r from-purple-700 to-blue-500 px-4 py-3 font-semibold text-white">Confirmar</button>
      </section>
    </main>
  );
}
