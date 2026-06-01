import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login({ username, password });
      navigate("/dashboard");
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { detail?: string } } }).response?.data
          ?.detail === "string"
      ) {
        setError((err as { response: { data: { detail: string } } }).response.data.detail);
      } else {
        setError("Usuário ou senha inválidos.");
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
        <h2 className="mb-8 text-center text-3xl font-semibold">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-medium text-gray-600">
              Usuário
            </label>
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
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-600">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3"
              required
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-8 w-full rounded-lg bg-linear-to-r from-purple-700 to-blue-500 px-4 py-3 font-semibold text-white disabled:opacity-60"
          >
            {isLoading ? "Entrando..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Ainda não tem conta?{" "}
          <Link to="/cadastro" className="font-semibold text-purple-700 hover:text-purple-900">
            Criar conta
          </Link>
        </p>
      </section>

      <section className="mx-auto my-8 max-w-4xl px-4 text-center">
        <h2 className="text-2xl font-normal leading-relaxed">
          Um espaço para explorar tecnologia, matemática e ciência da computação de forma prática e
          interativa. Aqui você encontra materiais, exercícios e simuladores pensados para apoiar sua
          jornada.
        </h2>
      </section>
    </main>
  );
}
