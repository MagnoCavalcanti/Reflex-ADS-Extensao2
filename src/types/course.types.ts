export interface CourseDetail {
  course_id: number;
  title: string;
  description: string;
  professor_id: number;
  professor_name: string;
  professor_username: string;
}

export interface CourseMetrics {
  course_id: number;
  course_title: string;
  enrolled_count: number;
  average_progress_percent: number;
  completed_count: number;
}
