/**
 * Parses a string of origins (comma-separated or JSON array) into an array of trimmed strings.
 * @param raw The raw string of origins.
 * @param fallback The default fallback origin to use if input is empty or only whitespace. Defaults to "*".
 * @returns An array of trimmed origin strings.
 */
export function parseOrigins(raw?: string, fallback = "*"): string[] {
  if (!raw?.trim()) {
    return [fallback];
  }

  let origins: string[] = [];
  const looksLikeJson =
    raw.trim().startsWith("[") || raw.trim().startsWith('"');
  if (looksLikeJson) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        origins = parsed
          .map((o) => (typeof o === "string" ? o.trim() : ""))
          .filter(Boolean);
      } else if (typeof parsed === "string") {
        origins = [parsed.trim()].filter(Boolean);
      }
    } catch {
      // Fallback to comma-split below
    }
  }
  if (origins.length === 0) {
    origins = raw
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);
  }
  return origins.length > 0 ? origins : [fallback];
}
