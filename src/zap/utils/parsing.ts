/**
 * Parses a string of origins comma-separated into an array of trimmed strings.
 * @param raw The raw string of origins.
 * @param fallback The default fallback origin to use if input is empty or only whitespace. Defaults to "*".
 * @returns An array of trimmed origin strings.
 */
export function parseOrigins(raw?: string, fallback = "*"): string[] {
  if (!raw?.trim()) {
    return [fallback];
  }

  let origins: string[] = [];
  if (origins.length === 0) {
    origins = raw
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);
  }

  return origins.length > 0 ? origins : [fallback];
}
