const ENROLLED_KEY = "@app:enrolledCourses";
const RECENT_KEY = "@app:recentCourses";

export type RecentCourseEntry = {
  courseId: number;
  title: string;
  accessedAt: number;
};

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getEnrolledCourseIds(): number[] {
  const ids = readJson<number[]>(ENROLLED_KEY, []);
  return [...new Set(ids.filter((id) => Number.isInteger(id) && id > 0))];
}

export function addEnrolledCourseId(courseId: number): void {
  const ids = getEnrolledCourseIds();
  if (!ids.includes(courseId)) {
    writeJson(ENROLLED_KEY, [...ids, courseId]);
  }
}

export function getRecentCourses(): RecentCourseEntry[] {
  const entries = readJson<RecentCourseEntry[]>(RECENT_KEY, []);
  return entries
    .filter((e) => e.courseId > 0 && e.title)
    .sort((a, b) => b.accessedAt - a.accessedAt)
    .slice(0, 6);
}

export function trackRecentCourse(courseId: number, title: string): void {
  const now = Date.now();
  const entries = getRecentCourses().filter((e) => e.courseId !== courseId);
  writeJson(RECENT_KEY, [{ courseId, title, accessedAt: now }, ...entries].slice(0, 10));
}
