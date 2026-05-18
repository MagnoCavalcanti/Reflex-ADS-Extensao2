import { useEffect, useState } from "react";
import {
  fetchMyCertificates,
  fetchMyEnrollments,
  fetchMyProgress,
} from "../services/meService";
import type { Certificate, Enrollment, UserProgress } from "../types/dashboard.types";

export function useStudentDashboard() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[] | null>(null);
  const [certificates, setCertificates] = useState<Certificate[] | null>(null);

  const [progressLoading, setProgressLoading] = useState(true);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(true);
  const [certificatesLoading, setCertificatesLoading] = useState(true);

  const [progressError, setProgressError] = useState<string | null>(null);
  const [enrollmentsError, setEnrollmentsError] = useState<string | null>(null);
  const [certificatesError, setCertificatesError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchMyProgress()
      .then((data) => {
        if (!cancelled) setProgress(data);
      })
      .catch(() => {
        if (!cancelled) setProgressError("Não foi possível carregar suas métricas.");
      })
      .finally(() => {
        if (!cancelled) setProgressLoading(false);
      });

    fetchMyEnrollments()
      .then((data) => {
        if (!cancelled) setEnrollments(data);
      })
      .catch(() => {
        if (!cancelled) setEnrollmentsError("Não foi possível carregar seus cursos.");
      })
      .finally(() => {
        if (!cancelled) setEnrollmentsLoading(false);
      });

    fetchMyCertificates()
      .then((data) => {
        if (!cancelled) setCertificates(data);
      })
      .catch(() => {
        if (!cancelled) setCertificatesError("Não foi possível carregar seus certificados.");
      })
      .finally(() => {
        if (!cancelled) setCertificatesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    progress,
    enrollments,
    certificates,
    progressLoading,
    enrollmentsLoading,
    certificatesLoading,
    progressError,
    enrollmentsError,
    certificatesError,
  };
}
