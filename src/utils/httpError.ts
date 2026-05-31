export function getHttpStatus(err: unknown): number | undefined {
  if (
    typeof err === "object" &&
    err !== null &&
    "response" in err &&
    typeof (err as { response?: { status?: number } }).response?.status ===
      "number"
  ) {
    return (err as { response: { status: number } }).response.status;
  }
  return undefined;
}

export function isForbidden(err: unknown): boolean {
  return getHttpStatus(err) === 403;
}
