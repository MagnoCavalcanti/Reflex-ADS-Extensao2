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
  professor_name?: string | null;
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
  attempt?: {
    attempt_id: number;
    score?: number | null;
    selected_options_by_question_id: Record<number, number>;
  } | null;
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

export interface ProfessorCourseEnrollment {
  course_id: number;
  title: string;
  enrollments: number;
}

export interface ProfessorEnrollmentMetrics {
  professor_id: number;
  courses_total: number;
  total_enrollments: number;
  courses_by_enrollments: ProfessorCourseEnrollment[];
}

export interface CourseQuizQuestionMetric {
  question_id: number;
  question_text: string;
  module_id?: number | null;
  module_title?: string | null;
  lesson_id?: number | null;
  lesson_title?: string | null;
  total_answers: number;
  correct_answers: number;
  accuracy_percent: number;
}

export interface CourseQuizMetrics {
  course_id: number;
  questions_total: number;
  answers_total: number;
  correct_answers_total: number;
  questions: CourseQuizQuestionMetric[];
}

export interface StudentCourseProgress {
  course_id: number;
  course_title?: string | null;
  total_lessons: number;
  completed_lessons: number;
  progress_percent: number;
  is_completed: boolean;
}

export interface StudentCourseCertificate {
  course_id: number;
  course_title: string;
  student_name: string;
  professor_name?: string | null;
  total_lessons: number;
  completed_lessons: number;
  progress_percent: number;
  eligible: boolean;
  issued_at?: string | null;
  certificate_text?: string | null;
  verification_code?: string | null;
  digital_signature?: string | null;
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
  professor_name?: string | null;
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
  attempt?: {
    attempt_id: number;
    score?: number | null;
    selected_options_by_question_id?: Record<string, number>;
  } | null;
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

type ApiProfessorCourseEnrollmentPayload = {
  course_id: number;
  title: string;
  enrollments: number;
};

type ApiProfessorEnrollmentMetricsPayload = {
  professor_id: number;
  courses_total: number;
  total_enrollments: number;
  courses_by_enrollments?: ApiProfessorCourseEnrollmentPayload[];
};

type ApiCourseQuizQuestionMetricPayload = {
  question_id: number;
  question_text: string;
  module_id?: number | null;
  module_title?: string | null;
  lesson_id?: number | null;
  lesson_title?: string | null;
  total_answers: number;
  correct_answers: number;
  accuracy_percent: number;
};

type ApiCourseQuizMetricsPayload = {
  course_id: number;
  questions_total: number;
  answers_total: number;
  correct_answers_total: number;
  questions?: ApiCourseQuizQuestionMetricPayload[];
};

type ApiStudentCourseProgressPayload = {
  course_id: number;
  course_title?: string | null;
  total_lessons: number;
  completed_lessons: number;
  progress_percent: number;
  is_completed: boolean;
};

type ApiStudentCourseCertificatePayload = {
  course_id: number;
  course_title: string;
  student_name: string;
  professor_name?: string | null;
  total_lessons: number;
  completed_lessons: number;
  progress_percent: number;
  eligible: boolean;
  issued_at?: string | null;
  certificate_text?: string | null;
  verification_code?: string | null;
  digital_signature?: string | null;
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
    professor_name: payload.professor_name ?? null,
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
  const selectedOptions = Object.entries(
    payload.attempt?.selected_options_by_question_id ?? {},
  ).reduce<Record<number, number>>((acc, [questionId, selectedOptionId]) => {
    const parsedQuestionId = Number(questionId);
    if (!Number.isNaN(parsedQuestionId)) {
      acc[parsedQuestionId] = selectedOptionId;
    }
    return acc;
  }, {});

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
    attempt: payload.attempt
      ? {
          attempt_id: payload.attempt.attempt_id,
          score: payload.attempt.score ?? null,
          selected_options_by_question_id: selectedOptions,
        }
      : null,
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

export function mapProfessorEnrollmentMetrics(
  payload: ApiProfessorEnrollmentMetricsPayload,
): ProfessorEnrollmentMetrics {
  return {
    professor_id: payload.professor_id,
    courses_total: payload.courses_total,
    total_enrollments: payload.total_enrollments,
    courses_by_enrollments: (payload.courses_by_enrollments ?? []).map((course) => ({
      course_id: course.course_id,
      title: course.title,
      enrollments: course.enrollments,
    })),
  };
}

export function mapCourseQuizMetrics(payload: ApiCourseQuizMetricsPayload): CourseQuizMetrics {
  return {
    course_id: payload.course_id,
    questions_total: payload.questions_total,
    answers_total: payload.answers_total,
    correct_answers_total: payload.correct_answers_total,
    questions: (payload.questions ?? []).map((question) => ({
      question_id: question.question_id,
      question_text: question.question_text,
      module_id: question.module_id ?? null,
      module_title: question.module_title ?? null,
      lesson_id: question.lesson_id ?? null,
      lesson_title: question.lesson_title ?? null,
      total_answers: question.total_answers,
      correct_answers: question.correct_answers,
      accuracy_percent: question.accuracy_percent,
    })),
  };
}

export function mapStudentCourseProgress(
  payload: ApiStudentCourseProgressPayload,
): StudentCourseProgress {
  return {
    course_id: payload.course_id,
    course_title: payload.course_title ?? null,
    total_lessons: payload.total_lessons,
    completed_lessons: payload.completed_lessons,
    progress_percent: payload.progress_percent,
    is_completed: payload.is_completed,
  };
}

export function mapStudentCourseCertificate(
  payload: ApiStudentCourseCertificatePayload,
): StudentCourseCertificate {
  return {
    course_id: payload.course_id,
    course_title: payload.course_title,
    student_name: payload.student_name,
    professor_name: payload.professor_name ?? null,
    total_lessons: payload.total_lessons,
    completed_lessons: payload.completed_lessons,
    progress_percent: payload.progress_percent,
    eligible: payload.eligible,
    issued_at: payload.issued_at ?? null,
    certificate_text: payload.certificate_text ?? null,
    verification_code: payload.verification_code ?? null,
    digital_signature: payload.digital_signature ?? null,
  };
}
