import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import api from "../services/api";
import {
  changePassword as changePasswordApi,
  fetchProfile,
  updateProfile as updateProfileApi,
} from "../services/meService";
import type {
  AuthContextType,
  LoginCredentials,
  RegisterData,
  User,
} from "../types/auth.types";
import { normalizeUserRole } from "../utils/auth";

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "@app:token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncUserFromProfile = useCallback((data: UserProfile) => {
    setUser({
      user_id: data.user_id,
      username: data.username,
      type_user: data.type_user,
    });
    setProfile(data);
  }, []);

  const refreshProfile = useCallback(async (): Promise<void> => {
    const data = await fetchProfile();
    syncUserFromProfile(data);
  }, [syncUserFromProfile]);

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
        setUser({
          user_id: payload.user_id,
          username: payload.sub ?? payload.username,
          type_user: typeUser,
        });
        await refreshProfile();
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
  }, [refreshProfile]);

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

    setToken(access_token);
    setUser({ user_id, username, type_user: typeUser });
  };

  const register = async (data: RegisterData): Promise<void> => {
    await api.post("/auth/register", data, {
      headers: { "Content-Type": "application/json" },
    });
  };

  const updateProfile = async (
    payload: UpdateProfileData,
  ): Promise<UserProfile> => {
    const data = await updateProfileApi(payload);
    syncUserFromProfile(data);
    return data;
  };

  const changePassword = async (
    payload: ChangePasswordData,
  ): Promise<void> => {
    await changePasswordApi(payload);
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
        changePassword,
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
