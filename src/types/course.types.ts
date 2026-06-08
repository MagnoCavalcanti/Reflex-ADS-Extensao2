export type CourseStatus = "rascunho" | "publicado";

export interface Course {
  course_id: number;
  title: string;
  description: string;
  area?: string | null;
  level?: string | null;
  cover_image_url?: string | null;
  status?: CourseStatus;
  professor_id: number;
}

export interface CourseDetail extends Course {}

export interface CourseModule {
  module_id: number;
  title: string;
  course_id: number;
  order_index?: number;
}

export interface CourseLesson {
  lesson_id: number;
  title: string;
  content_type: string;
  module_id: number;
  video_url?: string | null;
}

export interface LessonDetail extends CourseLesson {
  description?: string | null;
  video_url?: string | null;
}

export interface QuizOption {
  id?: number;
  option_text: string;
  is_correct: boolean;
}

export interface QuizQuestion {
  id?: number;
  question_text: string;
  options: QuizOption[];
}

export interface LessonQuiz {
  lesson_id: number;
  quiz_id?: number | null;
  questions: QuizQuestion[];
}

export interface CourseStudent {
  id: number;
  registration_date?: string | null;
  student: {
    id: number;
    username?: string | null;
    fullname?: string | null;
    email?: string | null;
    telephone?: string | null;
  };
}

export type CreateCourseData = {
  title: string;
  description: string;
  professor_id: number;
  area?: string | null;
  level?: string | null;
  cover_image_url?: string | null;
  status?: CourseStatus;
};

export type CreateModuleData = {
  title: string;
  course_id: number;
  order_index?: number;
};

export type CreateLessonData = {
  title: string;
  content_type: string;
  module_id: number;
};

export type CreateLessonVideoData = {
  lesson_id: number;
  video_url: string;
};

export type CreateLessonQuizData = {
  lesson_id: number;
  questions: Array<{
    question_text: string;
    options: Array<{
      option_text: string;
      is_correct: boolean;
    }>;
  }>;
};

type ApiCoursePayload = {
  course_id?: number;
  id?: number;
  title: string;
  description: string;
  area?: string | null;
  level?: string | null;
  cover_image_url?: string | null;
  status?: CourseStatus;
  professor_id: number;
};

type ApiModulePayload = {
  module_id?: number;
  id?: number;
  title: string;
  course_id?: number;
  order_index?: number;
};

type ApiLessonPayload = {
  lesson_id?: number;
  id?: number;
  title: string;
  content_type: string;
  module_id: number;
  description?: string | null;
  video_url?: string | null;
};

type ApiQuizOptionPayload = {
  id?: number;
  option_text: string;
  is_correct?: boolean;
};

type ApiQuizQuestionPayload = {
  id?: number;
  question_text: string;
  options?: ApiQuizOptionPayload[];
};

type ApiLessonQuizPayload = {
  lesson_id: number;
  quiz_id?: number | null;
  questions?: ApiQuizQuestionPayload[];
};

type ApiCourseStudentPayload = {
  id: number;
  registration_date?: string | null;
  student: {
    id: number;
    username?: string | null;
    fullname?: string | null;
    email?: string | null;
    telephone?: string | null;
  };
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
    cover_image_url: payload.cover_image_url ?? null,
    status: payload.status ?? "rascunho",
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
    order_index: payload.order_index,
  };
}

export function mapCourseLesson(payload: ApiLessonPayload): CourseLesson {
  const lessonId = payload.lesson_id ?? payload.id;

  if (lessonId == null) {
    throw new Error("Resposta da API sem identificador da aula.");
  }

  return {
    lesson_id: lessonId,
    title: payload.title,
    content_type: payload.content_type,
    module_id: payload.module_id,
    video_url: payload.video_url ?? null,
  };
}

export function mapLessonDetail(payload: ApiLessonPayload): LessonDetail {
  return {
    ...mapCourseLesson(payload),
    description: payload.description ?? null,
    video_url: payload.video_url ?? null,
  };
}

export function mapLessonQuiz(payload: ApiLessonQuizPayload): LessonQuiz {
  return {
    lesson_id: payload.lesson_id,
    quiz_id: payload.quiz_id ?? null,
    questions: (payload.questions ?? []).map((question) => ({
      id: question.id,
      question_text: question.question_text,
      options: (question.options ?? []).map((option) => ({
        id: option.id,
        option_text: option.option_text,
        is_correct: option.is_correct ?? false,
      })),
    })),
  };
}

export function mapCourseStudent(payload: ApiCourseStudentPayload): CourseStudent {
  return {
    id: payload.id,
    registration_date: payload.registration_date ?? null,
    student: {
      id: payload.student.id,
      username: payload.student.username ?? null,
      fullname: payload.student.fullname ?? null,
      email: payload.student.email ?? null,
      telephone: payload.student.telephone ?? null,
    },
  };
}
