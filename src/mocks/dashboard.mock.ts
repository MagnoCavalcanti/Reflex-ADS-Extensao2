import type { Certificate, Enrollment, UserProgress } from "../types/dashboard.types";

const MOCK_DELAY_MS = 700;

export const mockProgress: UserProgress = {
  active_courses: 2,
  completed_lessons: 14,
  certificates_issued: 1,
};

export const mockEnrollments: Enrollment[] = [
  {
    enrollment_id: 1,
    course_id: 1,
    course_name: "Lógica de Programação",
    last_lesson_name: "Estruturas condicionais (if/else)",
    last_lesson_url: "/conteudos/logica-de-programacao",
    progress_percent: 62,
  },
  {
    enrollment_id: 2,
    course_id: 2,
    course_name: "Matemática para Computação",
    last_lesson_name: "Conjuntos numéricos",
    last_lesson_url: "/quizzes/matematica/conjuntos-numericos",
    progress_percent: 28,
  },
];

export const mockCertificates: Certificate[] = [
  {
    certificate_id: 1,
    course_title: "Introdução à Computação",
    issued_at: "2026-03-10T14:00:00.000Z",
    download_url: "#",
  },
];

export function mockDelay(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, MOCK_DELAY_MS);
  });
}
