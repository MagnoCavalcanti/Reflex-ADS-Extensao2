import type { User } from "../types/auth.types";

export const MOCK_LOGIN = {
  username: "aluno",
  password: "123456",
} as const;

export const MOCK_USER: User = {
  user_id: 1,
  username: "Maria Silva",
  type_user: "A",
};

/** Token no formato JWT para o AuthContext decodificar o payload. */
export function createMockAccessToken(user: User): string {
  const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      user_id: user.user_id,
      sub: user.username,
      type_user: user.type_user,
    }),
  );
  return `${header}.${payload}.mock-dev`;
}
