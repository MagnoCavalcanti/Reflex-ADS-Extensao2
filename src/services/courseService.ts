import { isMockApiEnabled } from "../config/env";
import {
  mockFetchCourseDetail,
  mockFetchCourseMetrics,
} from "../mocks/course.mock";
import type { CourseDetail, CourseMetrics } from "../types/course.types";
import api from "./api";

export async function fetchCourseDetail(
  courseId: number,
): Promise<CourseDetail> {
  if (isMockApiEnabled()) {
    return mockFetchCourseDetail(courseId);
  }

  const { data } = await api.get<CourseDetail>(`/courses/${courseId}`);
  return data;
}

export async function fetchCourseMetrics(
  courseId: number,
): Promise<CourseMetrics> {
  if (isMockApiEnabled()) {
    return mockFetchCourseMetrics(courseId);
  }

  const { data } = await api.get<CourseMetrics>(
    `/courses/${courseId}/metrics`,
  );
  return data;
}
