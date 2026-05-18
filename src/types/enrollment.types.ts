export interface Enrollment {
  course_id: number;
  course_title: string;
  course_description?: string;
  enrolled_at?: string;
}

export interface ModuleProgress {
  module_id: number;
  module_title: string;
  completed: boolean;
}

export interface CourseProgress {
  course_id: number;
  course_title: string;
  progress_percent: number;
  modules: ModuleProgress[];
  certificate_url?: string | null;
}
