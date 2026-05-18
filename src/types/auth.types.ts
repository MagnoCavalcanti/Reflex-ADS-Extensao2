import type {
  ChangePasswordData,
  UpdateProfileData,
  UserProfile,
} from "./profile.types";

export type TypeUser = "A" | "P";

export interface User {
  user_id: number;
  username: string;
  type_user: TypeUser;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  email: string;
  fullname: string;
  telephone: string;
  type_user: TypeUser;
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<UserProfile>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
}