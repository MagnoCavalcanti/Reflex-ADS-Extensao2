export interface PublishedCourse {
  course_id: number;
  title: string;
  description?: string;
}

export interface PublicProfessorProfile {
  professor_id: number;
  fullname: string;
  username: string;
  bio: string;
  courses: PublishedCourse[];
}
