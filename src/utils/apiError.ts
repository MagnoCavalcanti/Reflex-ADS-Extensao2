export function getApiErrorMessage(
  err: unknown,
  fallback: string,
): string {
  if (
    typeof err === "object" &&
    err !== null &&
    "response" in err &&
    typeof (err as { response?: { data?: { detail?: string } } }).response
      ?.data?.detail === "string"
  ) {
    return (err as { response: { data: { detail: string } } }).response.data
      .detail;
  }
  return fallback;
}
