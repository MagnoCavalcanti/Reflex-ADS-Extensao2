import type { CourseDetail, CourseMetrics } from "../types/course.types";
import { mockDelay } from "./dashboard.mock";
import { MOCK_PROFESSOR_ID } from "./professor.mock";

export const mockCourseDetails: Record<number, CourseDetail> = {
  1: {
    course_id: 1,
    title: "Lógica de Programação",
    description:
      "Curso introdutório sobre algoritmos, pseudocódigo, estruturas condicionais e laços. Ideal para o primeiro semestre de ADS.",
    professor_id: MOCK_PROFESSOR_ID,
    professor_name: "Prof. Carlos Mendes",
    professor_username: "prof.carlos",
  },
  2: {
    course_id: 2,
    title: "Matemática aplicada",
    description:
      "Conjuntos numéricos, funções e matrizes com aplicações em programação e ciência da computação.",
    professor_id: MOCK_PROFESSOR_ID,
    professor_name: "Prof. Carlos Mendes",
    professor_username: "prof.carlos",
  },
  3: {
    course_id: 3,
    title: "Ciências da computação",
    description:
      "Panorama da área: hardware, software, redes e impacto da computação na sociedade.",
    professor_id: MOCK_PROFESSOR_ID,
    professor_name: "Prof. Carlos Mendes",
    professor_username: "prof.carlos",
  },
};

export const mockCourseMetrics: Record<number, CourseMetrics> = {
  1: {
    course_id: 1,
    course_title: "Lógica de Programação",
    enrolled_count: 48,
    average_progress_percent: 62,
    completed_count: 12,
  },
  2: {
    course_id: 2,
    course_title: "Matemática aplicada",
    enrolled_count: 35,
    average_progress_percent: 78,
    completed_count: 18,
  },
  3: {
    course_id: 3,
    course_title: "Ciências da computação",
    enrolled_count: 22,
    average_progress_percent: 41,
    completed_count: 3,
  },
};

function createMockHttpError(status: number, detail: string): Error {
  return Object.assign(new Error(detail), {
    response: { status, data: { detail } },
  });
}

export async function mockFetchCourseDetail(
  courseId: number,
): Promise<CourseDetail> {
  await mockDelay();

  const course = mockCourseDetails[courseId];
  if (!course) {
    throw createMockHttpError(404, "Curso não encontrado.");
  }

  return structuredClone(course);
}

function getMockSessionUser(): { user_id: number; type_user: string } | null {
  const token = localStorage.getItem("@app:token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as {
      user_id?: number;
      type_user?: string;
    };
    if (
      typeof payload.user_id !== "number" ||
      typeof payload.type_user !== "string"
    ) {
      return null;
    }
    return { user_id: payload.user_id, type_user: payload.type_user };
  } catch {
    return null;
  }
}

export async function mockFetchCourseMetrics(
  courseId: number,
): Promise<CourseMetrics> {
  await mockDelay();

  const metrics = mockCourseMetrics[courseId];
  if (!metrics) {
    throw createMockHttpError(404, "Curso não encontrado.");
  }

  const session = getMockSessionUser();
  if (
    !session ||
    session.type_user !== "P" ||
    session.user_id !== MOCK_PROFESSOR_ID
  ) {
    throw createMockHttpError(
      403,
      "Apenas o professor dono do curso pode ver as métricas.",
    );
  }

  return structuredClone(metrics);
}
