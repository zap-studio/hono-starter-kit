import { describe, expect, test } from "vitest";
import { app } from "@/index";
import { HttpStatus } from "@/zap/utils/http";
import { mockEnv } from "./utils";

const MOCK_ENV = mockEnv();

describe("Example", () => {
  test("GET /api/v1/health", async () => {
    const res = await app.request("/api/v1/health", {}, MOCK_ENV);
    expect(res.status).toBe(HttpStatus.OK);

    const body = (await res.json()) as {
      ok: boolean;
      data: {
        status: string;
        version: string;
        timestamp: number;
      };
    };

    expect(body).toMatchObject({
      ok: true,
      data: {
        status: "ok",
        version: "1.0.0",
      },
    });
    expect(typeof body.data.timestamp).toBe("number");
  });
});
