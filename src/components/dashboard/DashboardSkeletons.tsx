export function DashboardHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-2">
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-8 w-56 animate-pulse rounded-lg bg-gray-200" />
      </div>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
        <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200" />
      </div>
    </div>
  );
}

export function MetricsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-3 h-4 w-24 animate-pulse rounded bg-gray-200" />
          <div className="h-9 w-16 animate-pulse rounded-lg bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

export function EnrollmentsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-3 h-5 w-48 animate-pulse rounded bg-gray-200" />
          <div className="mb-4 h-4 w-64 animate-pulse rounded bg-gray-200" />
          <div className="mb-4 h-2 w-full animate-pulse rounded-full bg-gray-200" />
          <div className="h-10 w-28 animate-pulse rounded-lg bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

export function CertificatesSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div className="space-y-2">
            <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200" />
        </div>
      ))}
    </div>
  );
}
