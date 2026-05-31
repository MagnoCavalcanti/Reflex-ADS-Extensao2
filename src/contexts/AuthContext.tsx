import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import api from "../services/api";
import type {
  AuthContextType,
  LoginCredentials,
  RegisterData,
  User,
  UserProfile,
  UpdateProfileData,
} from "../types/auth.types";
import { normalizeUserRole } from "../utils/auth";

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "@app:token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Função provisória para manter o Context funcionando sem as funções antigas do meService
  const refreshProfile = useCallback(async (): Promise<void> => {
    if (user) {
      setProfile({
        user_id: user.user_id,
        username: user.username,
        type_user: user.type_user,
      });
    }
  }, [user]);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);

    if (storedToken) {
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;

      const bootstrap = async () => {
        try {
          const payload = JSON.parse(atob(storedToken.split(".")[1]));
          const typeUser = normalizeUserRole(payload.type_user);

          if (!typeUser) {
            throw new Error("Invalid user role");
          }

          setToken(storedToken);
          const loggedUser = {
            user_id: payload.user_id,
            username: payload.sub ?? payload.username,
            type_user: typeUser,
          };
          setUser(loggedUser);
          setProfile(loggedUser);
        } catch {
          localStorage.removeItem(TOKEN_KEY);
          delete api.defaults.headers.common["Authorization"];
          setToken(null);
          setUser(null);
          setProfile(null);
        } finally {
          setIsLoading(false);
        }
      };

      void bootstrap();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    const formData = new URLSearchParams();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);

    const { data } = await api.post("/auth/login", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const { access_token, user_id, username, type_user } = data;
    const typeUser = normalizeUserRole(type_user);

    if (!typeUser) {
      throw new Error("Tipo de usuário inválido.");
    }

    localStorage.setItem(TOKEN_KEY, access_token);
    api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

    const loggedUser = { user_id, username, type_user: typeUser };
    setToken(access_token);
    setUser(loggedUser);
    setProfile(loggedUser);
  };

  const register = async (data: RegisterData): Promise<void> => {
    await api.post("/auth/register", data, {
      headers: { "Content-Type": "application/json" },
    });
  };

  const updateProfile = async (
    payload: UpdateProfileData,
  ): Promise<UserProfile> => {
    const updated = {
      user_id: user?.user_id ?? 0,
      username: payload.username ?? user?.username ?? "",
      type_user: user?.type_user ?? "student",
    };
    setUser(updated);
    setProfile(updated);
    return updated;
  };

  const logout = (): void => {
    localStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
        updateProfile,
        changePassword: async () => {}, // Mantido mockado para cumprir a tipagem antiga
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