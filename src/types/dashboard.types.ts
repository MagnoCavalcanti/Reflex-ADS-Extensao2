export interface UserProgress {
  active_courses: number;
  completed_lessons: number;
  certificates_issued: number;
}

export interface Enrollment {
  enrollment_id: number;
  course_id: number;
  course_name: string;
  last_lesson_name: string;
  last_lesson_url: string;
  progress_percent: number;
}

export interface Certificate {
  certificate_id: number;
  course_title: string;
  issued_at: string;
  download_url: string;
}
