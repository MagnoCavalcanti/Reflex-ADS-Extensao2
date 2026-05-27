import type { TypeUser } from "../types/auth.types";

export const dashboardPathByRole: Record<TypeUser, string> = {
  A: "/aluno/dashboard",
  P: "/professor/dashboard",
};

export function isValidUserRole(role: unknown): role is TypeUser {
  return role === "A" || role === "P";
}

export function normalizeUserRole(role: unknown): TypeUser | null {
  if (role === "A" || role === "aluno" || role === "student") {
    return "A";
  }

  if (role === "P" || role === "professor" || role === "teacher") {
    return "P";
  }

  return null;
}

export function getDashboardPathByRole(role: TypeUser): string {
  return dashboardPathByRole[role];
}
