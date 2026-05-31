import { Link } from "react-router";
import type { PublishedCourse } from "../types/professor.types";

type PublishedCourseListProps = {
  courses: PublishedCourse[];
};

export default function PublishedCourseList({ courses }: PublishedCourseListProps) {
  if (courses.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center text-gray-500">
        Nenhum curso publicado ainda.
      </p>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {courses.map((course) => (
        <li key={course.course_id}>
          <Link
            to={`/cursos/${course.course_id}`}
            className="block rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-shadow hover:border-indigo-300 hover:shadow-lg"
          >
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              {course.title}
            </h3>
            {course.description ? (
              <p className="line-clamp-2 text-sm text-gray-600">
                {course.description}
              </p>
            ) : null}
            <span className="mt-4 inline-block text-sm font-medium text-indigo-600">
              Ver detalhes do curso →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
