export default function RecuperarSenhaPage() {
  return (
    <main className="min-h-screen  bg-linear-to-b from-blue-700 to-purple-700 text-white">
      <h1 className="py-5 text-center text-5xl font-bold">
        Reflex <span className="text-yellow-300">ADS</span>
      </h1>

      <section className="mx-auto my-5 w-full max-w-xl rounded-2xl bg-white p-8 text-gray-900 shadow-xl">
        <h2 className="mb-6 text-center text-3xl font-semibold">Recuperar senha</h2>
        <p className="mb-6 text-sm text-gray-600">
          Informe o e-mail cadastrado para enviarmos um link de redefinição de senha.
        </p>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-600">Email</label>
          <input id="email" type="email" className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3" />
        </div>
        <button className="mt-8 w-full rounded-lg bg-linear-to-r from-purple-700 to-blue-500 px-4 py-3 font-semibold text-white">Enviar link</button>
      </section>
    </main>
  );
}
