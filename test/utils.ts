import type { Bindings } from "@/lib/env";

/**
 * Mocks the environment variables for testing.
 * @param overrides Partial environment variable overrides.
 * @returns Mocked environment variables.
 */
export function mockEnv(overrides: Partial<Bindings> = {}) {
  return {
    CORS_ORIGINS: "http://localhost:3000",
    ...overrides,
  };
}
