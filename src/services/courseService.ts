import api from "./api";
import {
  mapCourse,
  mapCourseLesson,
  mapCourseModule,
  mapLessonDetail,
  type Course,
  type CourseDetail,
  type CourseLesson,
  type CourseModule,
  type LessonDetail,
  type CreateCourseData,
  type CreateLessonData,
  type CreateLessonVideoData,
  type CreateModuleData,
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
    "results" in data &&
    Array.isArray((data as { results: unknown }).results)
  ) {
    return (data as { results: unknown[] }).results.map((item) =>
      mapCourse(item as Parameters<typeof mapCourse>[0]),
    );
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
    "results" in data &&
    Array.isArray((data as { results: unknown }).results)
  ) {
    return (data as { results: unknown[] }).results.map((item) =>
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

function normalizeLessonList(data: unknown): CourseLesson[] {
  if (Array.isArray(data)) {
    return data.map((item) =>
      mapCourseLesson(item as Parameters<typeof mapCourseLesson>[0]),
    );
  }

  if (
    data &&
    typeof data === "object" &&
    "results" in data &&
    Array.isArray((data as { results: unknown }).results)
  ) {
    return (data as { results: unknown[] }).results.map((item) =>
      mapCourseLesson(item as Parameters<typeof mapCourseLesson>[0]),
    );
  }

  if (
    data &&
    typeof data === "object" &&
    "items" in data &&
    Array.isArray((data as { items: unknown }).items)
  ) {
    return (data as { items: unknown[] }).items.map((item) =>
      mapCourseLesson(item as Parameters<typeof mapCourseLesson>[0]),
    );
  }

  return [];
}

export async function fetchLessons(): Promise<CourseLesson[]> {
  const { data } = await api.get<unknown>("/lessons/");
  return normalizeLessonList(data);
}

export async function fetchLesson(lessonId: number): Promise<LessonDetail> {
  const { data } = await api.get<unknown>(`/lessons/${lessonId}`);
  return mapLessonDetail(data as Parameters<typeof mapLessonDetail>[0]);
}

export async function completeLesson(lessonId: number): Promise<void> {
  await api.post(`/lessons/${lessonId}`);
}

export async function createCourse(payload: CreateCourseData): Promise<Course> {
  const { data } = await api.post<unknown>("/courses/", payload);
  return mapCourse(data as Parameters<typeof mapCourse>[0]);
}

export async function updateCourse(
  courseId: number,
  payload: CreateCourseData,
): Promise<Course> {
  const { data } = await api.put<unknown>(`/courses/${courseId}`, payload);
  return mapCourse(data as Parameters<typeof mapCourse>[0]);
}

export async function createModule(
  payload: CreateModuleData,
): Promise<CourseModule> {
  const { data } = await api.post<unknown>("/modules/", payload);
  return mapCourseModule(
    data as Parameters<typeof mapCourseModule>[0],
    payload.course_id,
  );
}

export async function createLesson(
  payload: CreateLessonData,
): Promise<CourseLesson> {
  const { data } = await api.post<unknown>("/lessons/", payload);
  return mapCourseLesson(data as Parameters<typeof mapCourseLesson>[0]);
}

export async function createLessonVideo(
  payload: CreateLessonVideoData,
): Promise<void> {
  await api.post("/lessons/create/video", payload);
}
