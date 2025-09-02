import { CORS_DEFAULT_ORIGIN } from "../middlewares/custom-cors";

/**
 * Parses a comma-separated string of origins into an array of trimmed strings.
 * @param raw The raw string of origins.
 * @returns An array of trimmed origin strings.
 */
export function parseOrigins(raw?: string): string[] {
  if (!raw) {
    return [CORS_DEFAULT_ORIGIN];
  }

  return raw
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
}
