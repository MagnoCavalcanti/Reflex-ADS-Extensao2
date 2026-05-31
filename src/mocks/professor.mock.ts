import type { PublicProfessorProfile } from "../types/professor.types";
import { mockDelay } from "./dashboard.mock";

export const MOCK_PROFESSOR_ID = 10;

export const mockPublicProfessor: PublicProfessorProfile = {
  professor_id: MOCK_PROFESSOR_ID,
  fullname: "Prof. Carlos Mendes",
  username: "prof.carlos",
  bio: "Professor de ADS com foco em lógica de programação e fundamentos de computação. Apaixonado por tornar conceitos complexos acessíveis e práticos para iniciantes.",
  courses: [
    {
      course_id: 1,
      title: "Lógica de Programação",
      description: "Algoritmos, pseudocódigo e estruturas básicas.",
    },
    {
      course_id: 2,
      title: "Matemática aplicada",
      description: "Fundamentos matemáticos para computação.",
    },
    {
      course_id: 3,
      title: "Ciências da computação",
      description: "Introdução à área e conceitos essenciais.",
    },
  ],
};

function createMockHttpError(status: number, detail: string): Error {
  return Object.assign(new Error(detail), {
    response: { status, data: { detail } },
  });
}

export async function mockFetchPublicProfessor(
  professorId: number,
): Promise<PublicProfessorProfile> {
  await mockDelay();

  if (professorId !== mockPublicProfessor.professor_id) {
    throw createMockHttpError(404, "Professor não encontrado.");
  }

  return structuredClone(mockPublicProfessor);
}
