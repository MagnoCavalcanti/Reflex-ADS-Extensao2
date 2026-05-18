import type { TypeUser } from "./auth.types";

export interface UserProfile {
  user_id: number;
  username: string;
  fullname: string;
  email: string;
  telephone: string;
  type_user: TypeUser;
}

export interface UpdateProfileData {
  fullname: string;
  username: string;
  email: string;
  telephone: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}
