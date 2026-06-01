import api from "./api";
import {
  mapCourse,
  mapCourseModule,
  type Course,
  type CourseDetail,
  type CourseModule,
} from "../types/course.types";

export type ListCoursesParams = {
  search?: string;
  area?: string;
  level?: string;
  page?: number;
  page_size?: number;
};

function normalizeCourseList(data: unknown): Course[] {
  if (Array.isArray(data)) {
    return data.map((item) => mapCourse(item as Parameters<typeof mapCourse>[0]));
  }

  if (
    data &&
    typeof data === "object" &&
    "items" in data &&
    Array.isArray((data as { items: unknown }).items)
  ) {
    return (data as { items: unknown[] }).items.map((item) =>
      mapCourse(item as Parameters<typeof mapCourse>[0]),
    );
  }

  return [];
}

function normalizeModuleList(data: unknown, courseId: number): CourseModule[] {
  if (Array.isArray(data)) {
    return data.map((item) =>
      mapCourseModule(item as Parameters<typeof mapCourseModule>[0], courseId),
    );
  }

  if (
    data &&
    typeof data === "object" &&
    "items" in data &&
    Array.isArray((data as { items: unknown }).items)
  ) {
    return (data as { items: unknown[] }).items.map((item) =>
      mapCourseModule(item as Parameters<typeof mapCourseModule>[0], courseId),
    );
  }

  return [];
}

export async function fetchCourses(
  params?: ListCoursesParams,
): Promise<Course[]> {
  const { data } = await api.get<unknown>("/courses/", { params });
  return normalizeCourseList(data);
}

export async function fetchCourseDetail(
  courseId: number,
): Promise<CourseDetail> {
  const { data } = await api.get<unknown>(`/courses/${courseId}`);
  return mapCourse(data as Parameters<typeof mapCourse>[0]);
}

export async function fetchCourseModules(
  courseId: number,
): Promise<CourseModule[]> {
  const { data } = await api.get<unknown>(`/courses/${courseId}/modules`);
  return normalizeModuleList(data, courseId);
}

export async function enrollInCourse(courseId: number): Promise<void> {
  await api.post("/courses/enrollments", null, {
    params: { course_id: courseId },
  });
}
