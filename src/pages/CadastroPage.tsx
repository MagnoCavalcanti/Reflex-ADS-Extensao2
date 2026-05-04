import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import type { TypeUser } from "../types/auth.types";

export default function CadastroPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [typeUser, setTypeUser] = useState<TypeUser>("A");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);

    try {
      await register({ fullname, email, telephone, username, password, type_user: typeUser });
      navigate("/login"); // redireciona para login após cadastro — ajuste se necessário
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { detail?: string } } }).response?.data?.detail === "string"
      ) {
        setError((err as { response: { data: { detail: string } } }).response.data.detail);
      } else {
        setError("Erro ao realizar cadastro. Verifique os dados e tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen min-w-screen bg-linear-to-b from-blue-700 to-purple-700 text-white">
      <h1 className="py-5 text-center text-5xl font-bold">
        Reflex <span className="text-yellow-300">ADS</span>
      </h1>

      <section className="mx-auto my-5 w-full max-w-xl rounded-2xl bg-white p-8 text-gray-900 shadow-xl">
        <h2 className="mb-8 text-center text-3xl font-semibold">Cadastro</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullname" className="mb-2 block text-sm font-medium text-gray-600">Nome completo</label>
            <input
              id="fullname"
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-600">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3"
              required
            />
          </div>

          <div>
            <label htmlFor="tel" className="mb-2 block text-sm font-medium text-gray-600">Telefone</label>
            <input
              id="tel"
              type="tel"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="(XX) XXXXX-XXXX"
              className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3"
              required
            />
          </div>

          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-medium text-gray-600">Nome de usuário</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-600">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-600">Confirme sua senha</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600">Tipo de usuário</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTypeUser("A")}
                className={`rounded-lg border-2 px-4 py-3 font-semibold transition-colors ${
                  typeUser === "A"
                    ? "border-purple-600 bg-purple-50 text-purple-700"
                    : "border-gray-200 bg-gray-50 text-gray-600"
                }`}
              >
                Aluno
              </button>
              <button
                type="button"
                onClick={() => setTypeUser("P")}
                className={`rounded-lg border-2 px-4 py-3 font-semibold transition-colors ${
                  typeUser === "P"
                    ? "border-purple-600 bg-purple-50 text-purple-700"
                    : "border-gray-200 bg-gray-50 text-gray-600"
                }`}
              >
                Professor
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-linear-to-r from-purple-700 to-blue-500 px-4 py-3 font-semibold text-white disabled:opacity-60"
            >
              {isLoading ? "Cadastrando..." : "Finalizar Cadastro"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="rounded-lg border-2 border-gray-200 bg-gray-100 px-4 py-3 font-semibold text-gray-600"
            >
              Login
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}