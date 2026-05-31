import { isMockApiEnabled } from "../config/env";
import { mockFetchPublicProfessor } from "../mocks/professor.mock";
import type { PublicProfessorProfile } from "../types/professor.types";
import api from "./api";

export async function fetchPublicProfessor(
  professorId: number,
): Promise<PublicProfessorProfile> {
  if (isMockApiEnabled()) {
    return mockFetchPublicProfessor(professorId);
  }

  const { data } = await api.get<PublicProfessorProfile>(
    `/public/professors/${professorId}`,
  );
  return data;
}
