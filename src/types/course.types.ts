export interface Course {
  course_id: number;
  title: string;
  description: string;
  area?: string | null;
  level?: string | null;
  professor_id: number;
}

export interface CourseDetail extends Course {}

export interface CourseModule {
  module_id: number;
  title: string;
  course_id: number;
}

type ApiCoursePayload = {
  course_id?: number;
  id?: number;
  title: string;
  description: string;
  area?: string | null;
  level?: string | null;
  professor_id: number;
};

type ApiModulePayload = {
  module_id?: number;
  id?: number;
  title: string;
  course_id?: number;
};

export function mapCourse(payload: ApiCoursePayload): Course {
  const courseId = payload.course_id ?? payload.id;

  if (courseId == null) {
    throw new Error("Resposta da API sem identificador do curso.");
  }

  return {
    course_id: courseId,
    title: payload.title,
    description: payload.description,
    area: payload.area,
    level: payload.level,
    professor_id: payload.professor_id,
  };
}

export function mapCourseModule(
  payload: ApiModulePayload,
  courseId: number,
): CourseModule {
  const moduleId = payload.module_id ?? payload.id;

  if (moduleId == null) {
    throw new Error("Resposta da API sem identificador do módulo.");
  }

  return {
    module_id: moduleId,
    title: payload.title,
    course_id: payload.course_id ?? courseId,
  };
}
