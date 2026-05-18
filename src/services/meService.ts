import api from "./api";
import type { CourseProgress, Enrollment } from "../types/enrollment.types";
import type {
  ChangePasswordData,
  UpdateProfileData,
  UserProfile,
} from "../types/profile.types";

export async function fetchProfile(): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>("/me");
  return data;
}

export async function updateProfile(
  payload: UpdateProfileData,
): Promise<UserProfile> {
  const { data } = await api.put<UserProfile>("/me", payload);
  return data;
}

export async function changePassword(
  payload: ChangePasswordData,
): Promise<void> {
  await api.put("/me/password", payload);
}

export async function fetchEnrollments(): Promise<Enrollment[]> {
  const { data } = await api.get<Enrollment[]>("/me/enrollments");
  return data;
}

export async function fetchCourseProgress(
  courseId: number,
): Promise<CourseProgress> {
  const { data } = await api.get<CourseProgress>(`/me/progress/${courseId}`);
  return data;
}

export async function downloadCertificate(courseId: number): Promise<void> {
  const { data, headers } = await api.get<Blob>(
    `/me/certificates/${courseId}`,
    { responseType: "blob" },
  );

  const disposition = headers["content-disposition"] as string | undefined;
  const filenameMatch = disposition?.match(/filename="?([^"]+)"?/);
  const filename = filenameMatch?.[1] ?? `certificado-curso-${courseId}.pdf`;

  const url = URL.createObjectURL(data);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
