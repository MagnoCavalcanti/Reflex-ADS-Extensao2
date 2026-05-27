import { isMockApiEnabled } from "../config/env";
import {
  mockCertificates,
  mockDelay,
  mockEnrollments,
  mockProgress,
} from "../mocks/dashboard.mock";
import api from "./api";
import type { Certificate, Enrollment, UserProgress } from "../types/dashboard.types";

export async function fetchMyProgress(): Promise<UserProgress> {
  if (isMockApiEnabled()) {
    await mockDelay();
    return mockProgress;
  }

  const { data } = await api.get<UserProgress>("/me/progress");
  return data;
}

export async function fetchMyEnrollments(): Promise<Enrollment[]> {
  if (isMockApiEnabled()) {
    await mockDelay();
    return mockEnrollments;
  }

  const { data } = await api.get<Enrollment[]>("/me/enrollments");
  return data;
}

export async function fetchMyCertificates(): Promise<Certificate[]> {
  if (isMockApiEnabled()) {
    await mockDelay();
    return mockCertificates;
  }

  const { data } = await api.get<Certificate[]>("/me/certificates");
  return data;
}
