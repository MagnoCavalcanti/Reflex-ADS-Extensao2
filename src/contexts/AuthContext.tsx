import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { isMockApiEnabled } from "../config/env";
import {
  createMockAccessToken,
  MOCK_LOGIN,
  MOCK_USER,
} from "../mocks/auth.mock";
import api from "../services/api";
import type {
  AuthContextType,
  LoginCredentials,
  RegisterData,
  User,
} from "../types/auth.types";

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "@app:token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Recupera token do localStorage na inicialização
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);

    if (storedToken) {
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      setToken(storedToken);

      // Decodifica o payload do JWT para recuperar dados do usuário
      try {
        const payload = JSON.parse(atob(storedToken.split(".")[1]));
        setUser({
          user_id: payload.user_id,
          username: payload.sub ?? payload.username,
          type_user: payload.type_user,
        });
      } catch {
        // Token corrompido — limpa tudo
        localStorage.removeItem(TOKEN_KEY);
        delete api.defaults.headers.common["Authorization"];
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    if (isMockApiEnabled()) {
      const isValidMockLogin =
        credentials.username === MOCK_LOGIN.username &&
        credentials.password === MOCK_LOGIN.password;

      if (!isValidMockLogin) {
        throw { response: { data: { detail: "Usuário ou senha inválidos." } } };
      }

      const access_token = createMockAccessToken(MOCK_USER);
      localStorage.setItem(TOKEN_KEY, access_token);
      api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      setToken(access_token);
      setUser(MOCK_USER);
      return;
    }

    const formData = new FormData();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);

    // Lança o erro para o componente tratar e exibir mensagem ao usuário
    const { data } = await api.post("/auth/login", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const { access_token, user_id, username, type_user } = data;

    localStorage.setItem(TOKEN_KEY, access_token);
    api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

    setToken(access_token);
    setUser({ user_id, username, type_user });
  };

  const register = async (data: RegisterData): Promise<void> => {
    // Lança o erro para o componente tratar e exibir mensagem ao usuário
    await api.post("/auth/register", data, {
      headers: { "Content-Type": "application/json" },
    });
  };

  const logout = (): void => {
    localStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}

export default AuthContext;